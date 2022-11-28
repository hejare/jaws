import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "../../../../../db/ResponseDataMeta";
import { getOrderByTicker } from "../../../../../services/alpacaService";

interface ExtendedResponseDataType extends ResponseDataType {
  tickers?: [];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req;
  const { ticker } = query;

  try {
    const responseData: ExtendedResponseDataType = { status: "INIT" };
    switch (method) {
      case "GET":
        if (ticker && !(ticker instanceof Array)) {
          await getOrderByTicker(ticker)
            .then((tickers) => {
              responseData.status = "OK got ticker(s)";
              responseData.tickers = tickers;
            })
            .catch((e) => {
              responseData.status = "NOK";
              responseData.message = e.message;
            });
        }

        break;
      default:
        throw new Error(`Unsupported method: ${method as string}`);
    }
    res.status(200).json(responseData);
  } catch (e) {
    let message;
    if (e instanceof Error) {
      message = e.message;
      if (typeof e.message !== "string") {
        message = e;
      }
    }
    console.error(message);
    return res.status(500).json({
      error: message,
    });
  }
}
