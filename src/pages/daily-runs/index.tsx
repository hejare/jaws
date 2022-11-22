import styled from "styled-components";
import type { NextPage } from "next";
import { postSlackMessage } from "../../services/slackService";
import Button from "../../components/atoms/buttons/Button";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { handleResult } from "../../util";
import DailyRunsList from "../../components/organisms/DailyRunsList";
import { DailyRunDataType } from "../../db/dailyRunsMeta";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

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
        const newData = result.map(
          ({
            duration,
            runId,
            status,
            timeEnded,
            timeInitiated,
          }: DailyRunDataType) => ({
            runId,
            status,
            initiated: new Date(timeInitiated)
              .toUTCString()
              .replace(" GMT", ""),
            ended: new Date(timeEnded).toUTCString().replace(" GMT", ""),
            duration,
          }),
        );
        setData(newData);
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, []);

  return (
    <PageContainer>
      <ButtonsContainer>
        <Button onClick={postSlackMessage}>Slack service test trigger</Button>
      </ButtonsContainer>
      {dataFetchStatus === STATUS.READY && <DailyRunsList data={data} />}
    </PageContainer>
  );
};

export default DailyRuns;
