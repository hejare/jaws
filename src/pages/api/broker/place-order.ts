import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { BodyInit, Response } from "node-fetch";
import { convertResult } from "../../../util/convertResult";

type Data = {
  data: Response;
};

const buff = Buffer.from(
  `${process.env.ALPACA_API_KEY_ID}:${process.env.ALPACA_API_KEY_VALUE}`,
  "utf-8",
);
const base64EncodedKeys = buff.toString("base64");

const handleResult = async (result: Response) => {
  try {
    const data = await convertResult(result);
    const reason = { error: data };
    return result.ok ? Promise.resolve(data) : Promise.reject(reason);
  } catch (error) {
    const reason = { error };
    return Promise.reject(reason);
  }
};

const account_id = "b75acdbc-3fb6-3fb3-b253-b0bf7d86b8bb"; // public info
const baseUrl = "https://broker-api.sandbox.alpaca.markets/v1";

const postOrder = async (ticker: string) => {
  const body: BodyInit = JSON.stringify({
    symbol: ticker,
    notional: "1",
    side: "buy",
    type: "market",
    time_in_force: "day",
  });

  try {
    const res = await fetch(
      `${baseUrl}/trading/accounts/${account_id}/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${base64EncodedKeys}`,
        },
        body,
      },
    );
    return handleResult(res);
  } catch (e) {
    throw Error(`Unable to post order - ${e}`);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const ticker = req.query?.ticker;

  if (ticker && !(ticker instanceof Array)) {
    let data: Response = await postOrder(ticker);
    res.status(200).json({ data: data });
  }
}
