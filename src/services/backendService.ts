import { BrokerAccountAssetsResponse } from "@jaws/api/broker/account/assets";
import { BrokerAccountBalanceResponse } from "@jaws/api/broker/account/balance";
import { BrokerAccountEquityResponse } from "@jaws/api/broker/account/equity";
import { PortfolioHistoryResponse } from "@jaws/api/broker/account/history";
import { DailyStatsResponse } from "@jaws/api/data/daily-stats";
import { ExtendedTradesDataType, TRADE_STATUS } from "@jaws/db/tradesMeta";
import { getToday } from "@jaws/lib/helpers";
import { BarsResponse } from "@jaws/pages/api/market/bars";
import { convertResult, handleResult } from "@jaws/util";
import { GetPortfolioHistory } from "@master-chief/alpaca";
import { RawOrder } from "@master-chief/alpaca/@types/entities";
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

  return handleResult<ExtendedTradesDataType[]>(resp);
};

export const getTrades = async () => {
  const resp = await fetch(`/api/data/trades`, {
    headers: baseHeaders,
  });

  return handleResult<ExtendedTradesDataType[]>(resp);
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

export const getPortfolioHistory = async (opts?: GetPortfolioHistory) => {
  const params = new URLSearchParams(opts as Record<string, string>);

  const resp = await fetch(`/api/broker/account/history?${params.toString()}`);
  const res = await handleResult<PortfolioHistoryResponse>(resp);

  return res.history;
};

export const getOrders = () => {
  return fetch("/api/broker/orders").then((res) =>
    handleResult<{ orders: RawOrder[] }>(res),
  );
};

export const getDailyStats = async (dates: {
  startDate: string;
  endDate: string;
}): Promise<DailyStatsResponse["data"]> => {
  const response = await fetch(
    "api/data/daily-stats?" + new URLSearchParams(dates).toString(),
  ).then((res) => handleResult<DailyStatsResponse>(res));

  return response.data;
};

export const getTickerBars = async (opts: {
  symbols: string[];
  startDate: string;
  endDate: string;
}) => {
  const params = new URLSearchParams([
    ...opts.symbols.map((s) => ["symbols", s]),
    ["startDate", opts.startDate],
    ["endDate", opts.endDate],
  ]);

  const response = await fetch(`api/market/bars?${params.toString()}`).then(
    (res) => handleResult<BarsResponse>(res),
  );

  return response.bars;
};
