import styled from "styled-components";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { handleResult } from "@jaws/util";
import DailyRunsList from "@jaws/components/organisms/DailyRunsList";
import { DailyRunDataType } from "@jaws/db/dailyRunsMeta";
import PageContainer from "@jaws/components/atoms/PageContainer";
import { formatTimestampToUtc } from "@jaws/util/handleFormatDateString";
import { getServerSidePropsAllPages } from "@jaws/lib/getServerSidePropsAllPages";
import NavButton from "@jaws/components/atoms/buttons/NavButton";

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING,
  READY,
}

const DailyRuns: NextPage = () => {
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/data/daily-runs")
      .then(handleResult)
      .then((result) => {
        let newData = result.map(
          ({
            duration,
            runId,
            status,
            errors,
            timeEnded,
            timeInitiated,
            breakoutsCount,
          }: DailyRunDataType) => ({
            runId,
            status,
            errors,
            timeInitiated: timeInitiated
              ? formatTimestampToUtc(timeInitiated)
              : "n/a",
            timeEnded: timeEnded
              ? formatTimestampToUtc(timeEnded)
              : "(ongoing)",
            duration,
            breakoutsCount,
          }),
        );
        newData = newData.sort((a: DailyRunDataType, b: DailyRunDataType) =>
          b.runId < a.runId ? -1 : b.runId > a.runId ? 1 : 0,
        );
        setData(newData);
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, []);

  return (
    <PageContainer>
      <NavButton goBack href="">
        Go back
      </NavButton>
      {dataFetchStatus === STATUS.READY && <DailyRunsList data={data} />}
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default DailyRuns;
