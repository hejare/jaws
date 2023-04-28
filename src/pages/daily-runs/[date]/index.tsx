import styled from "styled-components";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { handleResult } from "@jaws/util";
import DailyRunsList from "@jaws/components/organisms/DailyRunsList";
import { DailyRunDataType } from "@jaws/db/dailyRunsMeta";
import { useRouter } from "next/router";
import { isToday } from "@jaws/lib/helpers";
import TriggerDailyRunButton from "@jaws/components/molecules/TriggerDailyRunButton";
import {
  formatDateString,
  formatTimestampToUtc,
} from "../../../util/handleFormatDateString";
import PageContainer from "@jaws/components/atoms/PageContainer";
import NavButton from "@jaws/components/atoms/buttons/NavButton";
import { getServerSidePropsAllPages } from "@jaws/lib/getServerSidePropsAllPages";
import { ButtonsContainer } from "@jaws/components/atoms/ButtonsContainer";

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING,
  READY,
}

const DailyRunsDate: NextPage = () => {
  const router = useRouter();
  const { date } = router.query;
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!date || Array.isArray(date)) {
      return;
    }

    fetch(`/api/data/daily-runs/${date}`)
      .then(handleResult)
      .then((result) => {
        let newData = result.map(
          ({
            duration,
            runId,
            status,
            timeEnded,
            timeInitiated,
            breakoutsCount,
          }: DailyRunDataType) => ({
            runId,
            status,
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
  }, [date]);

  if (dataFetchStatus !== STATUS.READY || !date || Array.isArray(date)) {
    return <></>;
  }

  return (
    <PageContainer>
      <ButtonsContainer>
        <NavButton goBack href="">
          Go back
        </NavButton>
        <NavButton href="/daily-runs">List All Daily Runs</NavButton>
        <TriggerDailyRunButton />
      </ButtonsContainer>
      {dataFetchStatus === STATUS.READY && <DailyRunsList data={data} />}
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default DailyRunsDate;
