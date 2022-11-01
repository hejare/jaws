import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { Response } from "node-fetch";
import { handleResult } from "../../../util";

type Data = {
  orders: Response;
};

const buff = Buffer.from(
  `${process.env.ALPACA_API_KEY_ID}:${process.env.ALPACA_API_KEY_VALUE}`,
  "utf-8",
);
const base64EncodedKeys = buff.toString("base64");

const account_id = "b75acdbc-3fb6-3fb3-b253-b0bf7d86b8bb"; // public info
const baseUrl = "https://broker-api.sandbox.alpaca.markets/v1";

const getOrders = async () => {
  try {
    const res = await fetch(
      `${baseUrl}/trading/accounts/${account_id}/orders?status=all`,
      {
        headers: {
          Authorization: `Basic ${base64EncodedKeys}`,
        },
      },
    );
    return handleResult(res);
  } catch (e) {
    throw Error(`Unable to get orders - ${e}`);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  let data: Response = await getOrders();
  res.status(200).json({ orders: data });
}
