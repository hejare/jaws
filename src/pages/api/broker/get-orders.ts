// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { BodyInit, Response } from "node-fetch";

type Data = {
  data: Response;
};

const buff = Buffer.from(
  `${process.env.ALPACA_API_KEY_ID}:${process.env.ALPACA_API_KEY_VALUE}`,
  "utf-8",
);
const base64EncodedKeys = buff.toString("base64");

const convertResult = async (result: Response) => {
  const text = await result.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

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

const account_id = "b75acdbc-3fb6-3fb3-b253-b0bf7d86b8bb";
const baseUrl = "https://broker-api.sandbox.alpaca.markets/v1";

const getOrders = async () => {
  console.log("getting getting getting");
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
    throw Error("An intuitive error msg");
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  let data: Response = await getOrders();
  res.status(200).json({ data: data });
}
