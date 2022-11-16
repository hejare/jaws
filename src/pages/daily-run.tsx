import Button from "@mui/material/Button";
import styled from "styled-components";
import type { NextPage } from "next";
import TickerCard from "../components/molecules/TickerCard";
import { brokerService } from "../services/brokerService";
import { postSlackMessage } from "../services/slackService";
import OrderList from "../components/organisms/OrderList";
import { useEffect } from "react";
interface Data {
  tickers: Ticker[];
  config: Config;
}

interface Ticker {
  ticker: string;
  price: number;
  name: string;
}

interface Config {
  a: string;
  b: string;
  c: string;
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Heading = styled.h1`
  display: block;
  width: 100%;
`;

const DailyRun: NextPage = () => {
  const data: Data = {
    tickers: [
      {
        ticker: "TSLA",
        price: 100,
        name: "Tesla Coorperation",
      },
      {
        ticker: "SPOT",
        price: 50,
        name: "Spotify Technology",
      },
      {
        ticker: "NFLX",
        price: 10,
        name: "Netflix Inc",
      },
    ],
    config: { a: "a", b: "b", c: "c" },
  };
  return (
    <PageContainer>
      <ButtonsContainer>
        <Button variant="outlined" onClick={postSlackMessage}>
          Slack service test trigger
        </Button>
        <Button variant="outlined" onClick={brokerService}>
          Broker service test trigger
        </Button>
      </ButtonsContainer>
      <h1>TODAYS RUN</h1>

      {data.tickers.map((ticker, id) => {
        return <TickerCard key={id} {...ticker} />;
      })}

      <Heading>Order list</Heading>
      <OrderList />
    </PageContainer>
  );
};

export default DailyRun;
