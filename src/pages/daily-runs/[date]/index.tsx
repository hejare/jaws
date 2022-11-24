import styled from "styled-components";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { handleResult } from "../../../util";
import DailyRunsList from "../../../components/organisms/DailyRunsList";
import { DailyRunDataType } from "../../../db/dailyRunsMeta";
import { useRouter } from "next/router";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

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
    fetch(`/api/data/daily-runs/${date as string}`)
      .then(handleResult)
      .then((result) => {
        let newData = result.map(
          ({
            duration,
            runId,
            status,
            timeEnded,
            timeInitiated,
          }: DailyRunDataType) => ({
            runId,
            status,
            timeInitiated: new Date(timeInitiated)
              .toUTCString()
              .replace(" GMT", ""),
            timeEnded: new Date(timeEnded).toUTCString().replace(" GMT", ""),
            duration,
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

  return (
    <PageContainer>
      Date: {date}
      {dataFetchStatus === STATUS.READY && <DailyRunsList data={data} />}
    </PageContainer>
  );
};

export default DailyRunsDate;
