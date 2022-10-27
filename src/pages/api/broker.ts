// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { Response } from "node-fetch";

type Data = {
  data: Response;
};

const buff = Buffer.from(
  `${process.env.ALPACA_API_KEY_ID}:${process.env.ALPACA_API_KEY_VALUE}`,
  "utf-8",
);
const base64EncodedKeys = buff.toString("base64");

console.log(base64EncodedKeys);

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

const getAlpacaAccounts = async () => {
  try {
    const res = await fetch(
      "https://broker-api.sandbox.alpaca.markets/v1/accounts",
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
  let data: Response = await getAlpacaAccounts();
  res.status(200).json({ data: data });
}
