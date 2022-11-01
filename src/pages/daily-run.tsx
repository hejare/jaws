import type { NextPage } from "next";
import TickerCard from "../components/molecules/TickerCard";
import { brokerService } from "../services/brokerService";
import { postSlackMessage } from "../services/slackService";
import OrderList from "../components/organisms/OrderList";
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
      <button onClick={brokerService}>Broker service test trigger</button>
      {data.tickers.map((ticker, id) => {
        return <TickerCard key={id} {...ticker} />;
      })}
      <h1>Send message to slack</h1>
      <button onClick={postSlackMessage}>Slack service test trigger</button>
      <h1>Order list</h1>
      <OrderList />
    </>
  );
};

export default DailyRun;
