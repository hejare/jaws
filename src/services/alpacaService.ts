import { getISOStringForToday, isValidSymbol } from "@jaws/lib/helpers";
import { handleResult } from "@jaws/util";
import { handleLimitPrice } from "@jaws/util/handleLimitPrice";
import { GetPortfolioHistory } from "@master-chief/alpaca";
import {
  PortfolioHistory,
  RawAccount,
  RawBar,
  RawOrder,
  RawPosition,
} from "@master-chief/alpaca/@types/entities";
import {
  GetAccountActivities,
  GetOrders as AlpacaGetOrdersParams,
  PlaceOrder,
} from "@master-chief/alpaca/@types/params";
import fetch, { BodyInit, RequestInit } from "node-fetch";
import { RawActivity, Side } from "./alpacaMeta";

const {
  ALPACA_API_KEY_ID = "[NOT_DEFINED_IN_ENV]",
  ALPACA_API_KEY_VALUE = "[NOT_DEFINED_IN_ENV]",
  ALPACA_MARKET_API_KEY = "[NOT_DEFINED_IN_ENV]",
  ALPACA_MARKET_API_KEY_SECRET = "[NOT_DEFINED_IN_ENV]",
} = process.env;

const buff = Buffer.from(
  `${ALPACA_API_KEY_ID}:${ALPACA_API_KEY_VALUE}`,
  "utf-8",
);
const base64EncodedKeys = buff.toString("base64");

const base64EncodedMarketKeys = Buffer.from(
  `${ALPACA_MARKET_API_KEY}:${ALPACA_MARKET_API_KEY_SECRET}`,
  "utf-8",
).toString("base64");

const accountId = "b75acdbc-3fb6-3fb3-b253-b0bf7d86b8bb"; // public info
const brokerApiBaseUrl = "https://broker-api.sandbox.alpaca.markets/v1";
const marketDataApiBaseUrl = "https://data.alpaca.markets/v2";

const getHoldingInTicker = async (ticker: string) => {
  const assetInfo = await getAssetByTicker(ticker);
  return assetInfo.current_price;
};

/* Used for all orders (both with side "buy" and "sell") */
const postOrder = async (body: BodyInit): Promise<RawOrder> => {
  try {
    const res = await fetch(
      `${brokerApiBaseUrl}/trading/accounts/${accountId}/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${base64EncodedKeys}`,
        },
        body,
      },
    );
    return await handleResult(res);
  } catch (e) {
    console.log(e);
    throw Error(`Unable to post order - ${JSON.stringify(e)}`);
  }
};

export const getAssetByTicker = async (ticker: string) => {
  try {
    const res = await fetch(
      `${brokerApiBaseUrl}/trading/accounts/${accountId}/positions/${ticker.toUpperCase()}`,
      {
        headers: {
          Authorization: `Basic ${base64EncodedKeys}`,
        },
      },
    );
    return await handleResult<RawPosition>(res);
  } catch (e: any) {
    console.log(e);
    throw Error(`Unable to get asset for ${ticker} - ${e.message as string}`);
  }
};

export const closeOpenPosition = async (symbol: string, percentage: string) => {
  try {
    if (!percentage || !isValidSymbol(symbol)) {
      throw Error;
    }
    const res = await fetch(
      `${brokerApiBaseUrl}/trading/accounts/${accountId}/positions/${symbol}?percentage=${percentage}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${base64EncodedKeys}`,
        },
      },
    );
    return await handleResult(res);
  } catch (e) {
    console.log(e);
    throw Error(`Unable to close position - ${e as string}`);
  }
};

/* Closes the position (sells 100%). */
export const stopLossSellOrder = async (symbol: string, quantity: number) => {
  if (!isValidSymbol(symbol)) {
    throw Error;
  }

  console.log(`Stop loss on ${symbol}`);

  return postSellOrder({ symbol, quantity });
};

export const takePartialProfitSellOrder = (
  symbol: string,
  quantity: number,
  limitPrice: number,
) => {
  if (!isValidSymbol(symbol)) {
    throw Error;
  }

  console.log(`Take profit on ${symbol}`);

  const params: PlaceOrder = {
    side: Side.SELL,
    symbol: symbol,
    time_in_force: "day",
    qty: quantity,
    type: "limit",
    limit_price: handleLimitPrice(limitPrice),
  };

  const body: BodyInit = JSON.stringify(params);

  return postOrder(body);
};

const postSellOrder = ({
  symbol,
  quantity,
}: {
  symbol: string;
  quantity: number;
}) => {
  const params: PlaceOrder = {
    side: Side.SELL,
    symbol: symbol,
    time_in_force: "day",
    qty: quantity,
    type: "market",
  };

  const body: BodyInit = JSON.stringify(params);

  return postOrder(body);
};

export const postBuyBreakoutOrder = async ({
  ticker,
  price,
  quantity,
}: {
  ticker: string;
  price: number;
  quantity: number;
}) => {
  const bodyObject: PlaceOrder = {
    symbol: ticker,
    type: "stop",
    stop_price: handleLimitPrice(price),
    side: "buy",
    time_in_force: "day",
    qty: quantity,
  };

  return postOrder(JSON.stringify(bodyObject));
};

export const getOrders = async (
  opts: Omit<AlpacaGetOrdersParams, "until" | "after"> & {
    until?: string;
    after?: string;
  } = {},
): Promise<RawOrder[]> => {
  const defaultParams: AlpacaGetOrdersParams = { status: "all" };
  const params = new URLSearchParams({
    ...defaultParams,
    ...opts,
  } as Record<string, string>);

  try {
    const res = await sendAlpacaRequest(
      `trading/accounts/${accountId}/orders?${params.toString()}`,
    );

    return res;
  } catch (e) {
    throw Error(`Unable to get orders - ${JSON.stringify(e)}`);
  }
};

// TODO: Use generic getOrders()
export const getTodaysOrders = async (): Promise<RawOrder[]> => {
  try {
    const res = await fetch(
      `${brokerApiBaseUrl}/trading/accounts/${accountId}/orders?status=all&after=${getISOStringForToday()}`,
      {
        headers: {
          Authorization: `Basic ${base64EncodedKeys}`,
        },
      },
    );
    return await handleResult(res);
  } catch (e:
    | Error
    | { error: { error: { code: number; message: string } } }
    | any) {
    console.log(e);
    let message = "";
    if (e instanceof Error) {
      message = e.message;
    } else if (e.error.error) {
      message = e.error.error.message;
    }
    throw Error(`Unable to get orders - ${message}`);
  }
};

// TODO: Use generic getOrders()
export const getOrdersByTicker = async (ticker: string) => {
  try {
    const res = await fetch(
      `${brokerApiBaseUrl}/trading/accounts/${accountId}/orders?symbols=${ticker}&status=all`, // TODO how handle params?
      {
        headers: {
          Authorization: `Basic ${base64EncodedKeys}`,
        },
      },
    );

    return await handleResult(res);
  } catch (e) {
    throw Error(`Unable to get order - ${e as string}`);
  }
};

export const getAssetAndOrdersByTicker = async (ticker: string) => {
  // TODO: Refactor to usePromise.all
  const orders = await getOrdersByTicker(ticker);
  const asset = await getAssetByTicker(ticker);
  return { orders, asset };
};

export const deleteOrder = async (orderId: string) => {
  try {
    const res = await sendAlpacaRequest(
      `trading/accounts/${accountId}/orders/${orderId}`,
      {
        method: "DELETE",
      },
    );

    return res;
  } catch (e) {
    throw Error(`Unable to delete order - ${e as string}`);
  }
};

export const getAccountCashBalance = async () => {
  const result = await getAccount();
  return result.cash;
};

export const getAccountAssets = async () => {
  return sendAlpacaRequest<RawPosition[]>(
    `trading/accounts/${accountId}/positions`,
  );
};

/* The total balance (cash balance + assets value) */
export const getEquity = async () => {
  const result = await getAccount();
  return result.equity;
};

export async function getAccount() {
  return sendAlpacaRequest<RawAccount>(
    `/trading/accounts/${accountId}/account`,
  );
}

export async function getAccountHistory(opts?: GetPortfolioHistory) {
  const params = new URLSearchParams(opts as Record<string, string>);

  const res = await sendAlpacaRequest<PortfolioHistory>(
    `trading/accounts/${accountId}/account/portfolio/history?${params.toString()}`,
  );

  return {
    ...res,
    timestamp: res.timestamp.map((t) => new Date(t * 1000).toISOString()),
  };
}

export async function getAccountActivities({
  activity_type,
  ...params
}: GetAccountActivities = {}) {
  const searchParams = new URLSearchParams(params as Record<string, string>);

  return sendAlpacaRequest<RawActivity[]>(
    `accounts/activities/${activity_type || ""}?${searchParams.toString()}`,
  );
}

export async function getTickerBars(
  symbols: string[],
  dates: { startDate: string; endDate: string },
) {
  const params = new URLSearchParams({
    timeframe: "1Day",
    start: dates.startDate,
    end: dates.endDate,
  });

  const res = await fetch(
    `${marketDataApiBaseUrl}/stocks/bars?${params.toString()}&symbols=${symbols.join(
      ",",
    )}`,
    {
      headers: {
        "APCA-API-KEY-ID": ALPACA_MARKET_API_KEY,
        "APCA-API-SECRET-KEY": ALPACA_MARKET_API_KEY_SECRET,
        content: "application/json",
      },
    },
  );

  const data = await handleResult<{ bars: { [k: string]: RawBar[] } }>(res);

  if (!Object.keys(data.bars).length) {
    console.log({ data, dates, status: res.status, ok: res.ok });
  }

  return data;
}

async function sendAlpacaRequest<T = any>(path: string, options?: RequestInit) {
  const res = await fetch(`${brokerApiBaseUrl}/${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${base64EncodedKeys}`,
    },
  });

  return handleResult<T>(res);
}
