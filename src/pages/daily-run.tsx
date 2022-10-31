import type { NextPage } from "next";
import TickerCard from "../components/molecules/TickerCard";
import { brokerService } from "../services/brokerService";
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
      <button onClick={brokerService}>Broker service trigger</button>
      {data.tickers.map((ticker, id) => {
        return <TickerCard  key={id} {...ticker} />;
      })}
    </>
  );
};

export default DailyRun;



