import { Order, RawOrder } from "@master-chief/alpaca/@types/entities";
import { PlaceOrder } from "@master-chief/alpaca/@types/params";
import fetch, { BodyInit } from "node-fetch";
import { getISOStringForToday, isValidSymbol } from "../lib/helpers";
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
    throw Error(`Unable to post order - ${e as string}`);
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

  await postSellOrder({ symbol, quantity });
};

/** Should sell 50% of position */
export const takeProfitSellOrder = (symbol: string, totalQuantity: number) => {
  if (!isValidSymbol(symbol)) {
    throw Error;
  }

  // sell ~50%, ceiled value to prevent fractional trades.
  const quantity = Math.ceil(totalQuantity * 0.5);

  console.log(`Take profit on ${symbol}`);

  return postSellOrder({ symbol, quantity });
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
    stop_price: price,
    side: "buy",
    time_in_force: "day",
    qty: quantity,
  };

  return postOrder(JSON.stringify(bodyObject));
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

export const getTodaysOrders = async (): Promise<Order[]> => {
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

/* The total balance (cash balance + assets value) */
export const getPortfolioValue = async () => {
  const res = await fetch(
    `${brokerApiBaseUrl}/trading/accounts/${accountId}/account`,
    {
      headers: {
        Authorization: `Basic ${base64EncodedKeys}`,
      },
    },
  );
  const result = await convertResult(res);
  return result.portfolio_value;
};
