import styled from "styled-components";
import type { NextPage } from "next";
import TickerCard from "../components/molecules/TickerCard";
import { brokerService } from "../services/brokerService";
import { postSlackMessage } from "../services/slackService";
import OrderList from "../components/organisms/OrderList";
import Button from "../components/atoms/buttons/Button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { handleResult } from "../util";

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
  const [status, setStatus] = useState(STATUS.LOADING);
  const [dailyRuns, setDailyRuns] = useState([]);

  useEffect(() => {
    fetch(`/api/data/daily-runs?date=${date as string}`)
      .then(handleResult)
      .then((result) => {
        setDailyRuns(result);
        setStatus(STATUS.READY);
      })
      .catch(console.error);
  }, [date]);
  console.log({ dailyRuns });
  return (
    <PageContainer>
      <ButtonsContainer>
        <Button onClick={postSlackMessage}>Slack service test trigger</Button>
        <Button onClick={brokerService}>Broker service test trigger</Button>
      </ButtonsContainer>
      <h1>DAILY RUN</h1>
      <h3>Date: {date}</h3>
      {status === STATUS.READY && (
        <div>
          {dailyRuns.map(
            ({ duration, runId, status, timeEnded, timeInitiated }) => (
              <span key={runId}>{runId}</span>
            ),
          )}
        </div>
      )}

      {/* {data.tickers.map((ticker, id) => {
        return <TickerCard key={id} {...ticker} />;
      })} */}

      <OrderList />
    </PageContainer>
  );
};

export default DailyRun;
