import fetch, { BodyInit } from "node-fetch";
import { handleResult } from "../util";
import { handleLimitPrice } from "../util/handleLimitPrice";

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
const baseUrl = "https://broker-api.sandbox.alpaca.markets/v1";

export const postOrder = async (
  ticker: string,
  orderType: string,
  breakoutValue: string,
) => {
  const body: BodyInit = JSON.stringify({
    symbol: ticker,
    qty: 1, // todo qty: wallet balance * 0.1 * limit_price => rounded to nearest integer
    side: orderType,
    time_in_force: "day",
    type: "limit",
    limit_price: handleLimitPrice(breakoutValue),
  });

  try {
    const res = await fetch(`${baseUrl}/trading/accounts/${accountId}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64EncodedKeys}`,
      },
      body,
    });
    return await handleResult(res);
  } catch (e) {
    console.log(e);
    throw Error(`Unable to post order - ${e as string}`);
  }
};

export const getOrders = async () => {
  try {
    const res = await fetch(
      `${baseUrl}/trading/accounts/${accountId}/orders?status=all`,
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

export const deleteOrder = async (orderId: string) => {
  try {
    const res = await fetch(
      `${baseUrl}/trading/accounts/${accountId}/orders/${orderId}`,
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
    throw Error(`Unable to delete order`);
  }
};
