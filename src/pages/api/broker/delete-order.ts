import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { Response } from "node-fetch";
import { handleResult } from "../../../util";

type Data = {
  data: Response;
};

const buff = Buffer.from(
  `${process.env.ALPACA_API_KEY_ID}:${process.env.ALPACA_API_KEY_VALUE}`,
  "utf-8",
);
const base64EncodedKeys = buff.toString("base64");

const account_id = "b75acdbc-3fb6-3fb3-b253-b0bf7d86b8bb"; // public info
const baseUrl = "https://broker-api.sandbox.alpaca.markets/v1";

const deleteOrder = async (order_id: string) => {
  try {
    const res = await fetch(
      `${baseUrl}/trading/accounts/${account_id}/orders/${order_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${base64EncodedKeys}`,
        },
      },
    );
    return handleResult(res);
  } catch (e) {
    throw Error(`Unable to delete order - ${e}`);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const ticker = req.query?.ticker;

  if (ticker && !(ticker instanceof Array)) {
    let data: Response = await deleteOrder(ticker);
    res.status(200).json({ data: data });
  }
}
