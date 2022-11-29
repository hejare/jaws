import type { NextPage } from "next";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import { handleResult } from "../../util";

// TODO on server side (given ticker):
// return our assets of given ticker
// //  return our orders of given ticker - DONE
// place calling this 👆 in same endpoint/handler (get assets, get orders)
// add logic for sell

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING,
  READY,
}

const TickerPage: NextPage = () => {
  const [data, setData] = useState([]);
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);

  const router = useRouter();
  const { ticker } = router.query;
  console.log(ticker);

  useEffect(() => {
    fetch(`/api/broker/tickers/${ticker as string}`)
      .then(handleResult)
      .then((result) => {
        console.log(result);
        setData(result.tickers);
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {dataFetchStatus === STATUS.READY &&
        data.map((tickerItem: any, i) => (
          <div key={i}>
            <div>All our (historical and current) orders of {ticker}</div>
            <div>All our positions/assets of {ticker}</div>
            <div>Qty {tickerItem.qty}</div>
            <div>Side {tickerItem.side}</div>
            <button>Sell</button>
          </div>
        ))}
    </>
  );
};

export default TickerPage;
