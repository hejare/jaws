import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { Response } from "node-fetch";
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

const deleteOrder = async (orderId: string) => {
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
    throw Error("Unable to delete order");
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const orderId = req.query?.orderId;

  if (orderId && !(orderId instanceof Array)) {
    const data: Response = await deleteOrder(orderId);
    res.status(200).json({ data: data });
  }
}
