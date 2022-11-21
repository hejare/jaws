import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { BodyInit, Response } from "node-fetch";
import { OrderType } from "../../../components/organisms/OrdersList";
import { handleResult } from "../../../util";

type Data = {
  data: Response;
};

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

const postOrder = async (
  ticker: string,
  orderType: string,
  breakoutValue: string,
) => {
  const body: BodyInit = JSON.stringify({
    symbol: ticker,
    notional: "1",
    side: orderType,
    type: "market",
    time_in_force: "day",
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
    throw Error(`Unable to post order - ${e as string}`);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const ticker: string = req.query?.ticker as string;
  const orderType: OrderType = req.query?.orderType as OrderType;
  const breakoutValue: string = req.query?.breakoutValue as string;
  const data: Response = await postOrder(ticker, orderType, breakoutValue);
  res.status(200).json({ data: data });
}
