import { BrokerAccountAssetsResponse } from "@jaws/api/broker/account/assets";
import { BrokerAccountBalanceResponse } from "@jaws/api/broker/account/balance";
import { TradesDataType, TRADE_STATUS } from "@jaws/db/tradesMeta";
import { getToday } from "@jaws/lib/helpers";
import { BrokerAccountEquityResponse } from "@jaws/pages/api/broker/account/equity";
import { convertResult, handleResult } from "@jaws/util";
import fetch from "node-fetch";

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
  return parseFloat(balance);
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

export const getAccountAssets = async () => {
  const resp = await fetch("/api/broker/account/assets", {
    headers: baseHeaders,
  });

  return handleResult<BrokerAccountAssetsResponse>(resp);
};

/**
 * gets trades for current positions
 */
export const getJawsPortfolio = async () => {
  const resp = await fetch(
    `/api/data/trades?status=${TRADE_STATUS.FILLED}&status=${TRADE_STATUS.PARTIAL_PROFIT_TAKEN}`,
    {
      headers: baseHeaders,
    },
  );

  return handleResult<TradesDataType[]>(resp);
};

export const getMovingAverages = async (symbols: string[]) => {
  const symbolsParam = new URLSearchParams(symbols.map((s) => ["symbols", s]));

  const resp = await fetch(`api/data/moving-avg?${symbolsParam.toString()}`, {
    headers: baseHeaders,
  });

  return handleResult<{ ma: number; symbol: string }[]>(resp);
};

export const getAccountEquity = async () => {
  const resp = await fetch("/api/broker/account/equity", {
    headers: baseHeaders,
  });

  const res = await handleResult<BrokerAccountEquityResponse>(resp);
  return parseFloat(res.equity);
};
