import styled from "styled-components";
import type { NextPage } from "next";
import { brokerService } from "../../services/brokerService";
import { postSlackMessage } from "../../services/slackService";
import Button from "../../components/atoms/buttons/Button";
import { useRouter } from "next/router";
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

const DailyRun: NextPage = () => {
  const router = useRouter();
  const { date } = router.query;
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/data/daily-runs?date=${date as string}`)
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
  }, [date]);

  return (
    <PageContainer>
      <ButtonsContainer>
        <Button onClick={postSlackMessage}>Slack service test trigger</Button>
        <Button onClick={brokerService}>Broker service test trigger</Button>
      </ButtonsContainer>
      {dataFetchStatus === STATUS.READY && <DailyRunsList data={data} />}
    </PageContainer>
  );
};

export default DailyRun;
