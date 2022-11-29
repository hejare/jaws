import type { NextPage } from "next";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import { handleResult } from "../../util";

// add logic for sell
// todo place asset, breakouts, and orders in separate components

interface Asset {
  avg_entry_price?: string;
  change_today?: string;
  market_value?: string;
}

export type PartialOrderDataType = {
  created_at?: string;
  filled_at?: string;
  notional?: string;
  symbol?: string;
};

export type PartialBreakoutDataType = {
  image?: string;
  tickerRef?: string;
  relativeStrength?: number;
  breakoutValue?: number;
  configRef?: string;
};

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING,
  READY,
}

const TickerPage: NextPage = () => {
  const [asset, setAsset] = useState<Asset>();
  const [orders, setOrders] = useState([]);
  const [breakouts, setBreakouts] = useState([]);
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);

  const router = useRouter();
  const { ticker } = router.query;

  useEffect(() => {
    if (ticker) {
      fetch(`/api/broker/tickers/${ticker as string}`)
        .then(handleResult)
        .then((result) => {
          setAsset(result.asset);
          setOrders(result.orders);
        })
        .catch(console.error);
    }
    fetch(`/api/data/tickers/breakouts/${ticker as string}`)
      .then(handleResult)
      .then((result) => {
        setBreakouts(result.breakouts);
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, [ticker]);

  return (
    <>
      <h1>{`${(ticker as string).toUpperCase()}`}</h1>
      {dataFetchStatus === STATUS.READY && (
        <>
          <h2>Orders</h2>
          {orders ? (
            orders.map((order: PartialOrderDataType, i) => (
              <div key={i}>
                <div>Created at: {order.created_at}</div>
                <div>Filled at: {order.filled_at}</div>
                <div>Quantity: {order.notional}</div>
              </div>
            ))
          ) : (
            <div>No orders for this ticker</div>
          )}
          <h2>Breakouts</h2>
          {breakouts && breakouts.length > 0 ? (
            breakouts.map((breakout: PartialBreakoutDataType, i) => (
              <div key={i}>
                <h4>Breakout</h4>
                <div>Breakout value:{breakout.breakoutValue}</div>
                <div>Relative strength: {breakout.relativeStrength}</div>
              </div>
            ))
          ) : (
            <div>No breakouts for this ticker</div>
          )}
          <h2>Asset</h2>
          {asset ? (
            <div>
              <div>Entry price: {asset.avg_entry_price}</div>
            </div>
          ) : (
            <div>No asset for this ticker</div>
          )}
        </>
      )}
    </>
  );
};

export default TickerPage;
