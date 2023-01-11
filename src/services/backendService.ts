import fetch from "node-fetch";
import { getToday } from "../lib/helpers";
import { BrokerAccountBalanceResponse } from "../pages/api/broker/account/balance";
import { convertResult } from "../util";

const baseHeaders = { "Content-Type": "application/json" };

export const setRating = async ({
  breakoutRef,
  userRef,
  value,
}: {
  breakoutRef: string;
  userRef: string;
  value: number;
}) => {
  const resp = await fetch(`/api/data/ratings/${breakoutRef}`, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({
      userRef,
      value,
    }),
  });

  return convertResult(resp);
};

export const getAccountCashBalance = async () => {
  const resp = await fetch("/api/broker/account/balance", {
    headers: baseHeaders,
  });
  const { balance } = await convertResult<BrokerAccountBalanceResponse>(resp);
  return balance;
};

export const getAccountOrderStatusByTicker = async (ticker: string) => {
  const date = getToday();
  const resp = await fetch(`/api/broker/orders/${date}/${ticker}`, {
    headers: baseHeaders,
  });
  return convertResult(resp);
};

export const getTradesDataByTicker = async (ticker: string) => {
  const resp = await fetch(`/api/data/trades/${ticker}`, {
    headers: baseHeaders,
  });
  return convertResult(resp);
};
