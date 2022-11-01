// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { Response } from "node-fetch";
import { handleResult } from "../../util";

type Data = {
  data: Response;
};

const buff = Buffer.from(
  `${process.env.ALPACA_API_KEY_ID}:${process.env.ALPACA_API_KEY_VALUE}`,
  "utf-8",
);
const base64EncodedKeys = buff.toString("base64");

const baseUrl = "https://broker-api.sandbox.alpaca.markets/v1";
const accountsEndpoint = "/accounts";
const calendarEndpoint = "/calendar"; //  full list of market days from 1970 to 2029
const clockEndpoint = "/clock"; // the current market timestamp, whether or not the market is currently open, as well as the times of the next market open and close.

const getAlpacaAccounts = async () => {
  try {
    const res = await fetch(`${baseUrl}${clockEndpoint}`, {
      headers: {
        Authorization: `Basic ${base64EncodedKeys}`,
      },
    });
    return handleResult(res);
  } catch (e) {
    throw Error(`Unable to get info - ${e}`);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  let data: Response = await getAlpacaAccounts();
  res.status(200).json({ data: data });
}
