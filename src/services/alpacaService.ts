import fetch, { BodyInit } from "node-fetch";
import { getISOStringForToday } from "../lib/helpers";
import { convertResult, handleResult } from "../util";
import { Side } from "./alpacaMeta";

const {
  ALPACA_API_KEY_ID = "[NOT_DEFINED_IN_ENV]",
  ALPACA_API_KEY_VALUE = "[NOT_DEFINED_IN_ENV]",
} = process.env;

const buff = Buffer.from(
  `${ALPACA_API_KEY_ID}:${ALPACA_API_KEY_VALUE}`,
  "utf-8",
);
const base64EncodedKeys = buff.toString("base64");

const accountId = "b75acdbc-3fb6-3fb3-b253-b0bf7d86b8bb"; // public info
const brokerApiBaseUrl = "https://broker-api.sandbox.alpaca.markets/v1";

export const closeOpenPosition = async (symbol: string, percentage: string) => {
  try {
    if (
      !symbol ||
      typeof symbol !== "string" ||
      symbol.length < 2 ||
      symbol.length > 5 ||
      !percentage
    ) {
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

/* After 10% increase in value, sell 50% of the position */
const getHalfPositionValue = async (ticker: string) => {
  const assetInfo = await getAssetByTicker(ticker);
  const holdingInTicker = assetInfo.market_value; // ? question OR: assetInfo.current_price OR assetInfo.lastday_price?
  return holdingInTicker * 0.5;
};

export const stopLossSellOrder = () => {
  // TODO sell
};

// INFO: this is triggered when price has went up with 10% or more.
export const takeProfitSellOrder = async (symbol: string) => {
  if (
    !symbol ||
    typeof symbol !== "string" ||
    symbol.length < 2 ||
    symbol.length > 5
  ) {
    throw Error;
  }

  const value = await getHalfPositionValue(symbol);
  const body: BodyInit = JSON.stringify({
    side: "sell",
    symbol: symbol,
    time_in_force: "day",
    notional: value,
  });

  await postOrder(body);
};

export const postNewBuyOrder = async (
  ticker: string,
  type: Side,
  price: number,
  quantity: number,
) => {
  const body: BodyInit = JSON.stringify({
    symbol: ticker,
    qty: 1, // TODO: UNDO OVERRIDING OF QUANTITY: quantity,
    side: type,
    time_in_force: "day",
    type: "limit",
    limit_price: price,
  });

  await postOrder(body);
};

/* Used for all orders (both with side "buy" and "sell") */
const postOrder = async (body: BodyInit) => {
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
    throw Error(`Unable to post order - ${e as string}`);
  }
};

export const getOrders = async () => {
  try {
    const res = await fetch(
      `${brokerApiBaseUrl}/trading/accounts/${accountId}/orders?status=all`,
      {
        headers: {
          Authorization: `Basic ${base64EncodedKeys}`,
        },
      },
    );
    return await handleResult(res);
  } catch (e) {
    throw Error(`Unable to get orders - ${e as string}`);
  }
};

export const getTodaysOrders = async () => {
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

const getAssetByTicker = async (ticker: string) => {
  try {
    const res = await fetch(
      `${brokerApiBaseUrl}/trading/accounts/${accountId}/positions/${ticker.toUpperCase()}`,
      {
        headers: {
          Authorization: `Basic ${base64EncodedKeys}`,
        },
      },
    );
    return await handleResult(res);
  } catch (e: any) {
    console.log(e);
    throw Error(`Unable to get asset for ${ticker} - ${e.message as string}`);
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
    const res = await fetch(
      `${brokerApiBaseUrl}/trading/accounts/${accountId}/orders/${orderId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${base64EncodedKeys}`,
        },
      },
    );
    return await handleResult(res);
  } catch (e) {
    throw Error(`Unable to delete order - ${e as string}`);
  }
};

export const getAccountCashBalance = async () => {
  const res = await fetch(
    `${brokerApiBaseUrl}/trading/accounts/${accountId}/account`,
    {
      headers: {
        Authorization: `Basic ${base64EncodedKeys}`,
      },
    },
  );
  const result = await convertResult(res);
  return result.cash;
};

export const getAccountAssets = async () => {
  // NOTE: "Assets" as we think of it, is actually "positions" in Alpacas terminology
  const res = await fetch(
    `${brokerApiBaseUrl}/trading/accounts/${accountId}/positions`,
    {
      headers: {
        Authorization: `Basic ${base64EncodedKeys}`,
      },
    },
  );
  return convertResult(res);
};
