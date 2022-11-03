import Button from '@mui/material/Button';
import type { NextPage } from "next";
import TickerCard from "../components/molecules/TickerCard";
import { brokerService } from "../services/brokerService";
import { postSlackMessage } from "../services/slackService";
import OrderList from "../components/organisms/OrderList";
import {getSharks} from "../services/dbService";
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

const DailyRun: NextPage = () => {

  useEffect(() => {
    const fetchData = async () => {
      console.log(await getSharks())
    };
    fetchData();  
  }, []);
  
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
    <>
      <h1>TODAYS RUN</h1>
      <Button onClick={postSlackMessage}>Slack service test trigger</Button>
      <Button onClick={brokerService}>Broker service test trigger</Button>
      {data.tickers.map((ticker, id) => {
        return <TickerCard key={id} {...ticker} />;
      })}
      <h1>Order list</h1>
      <OrderList />
    </>
  );
};

export default DailyRun;
