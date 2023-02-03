import { getAllTrades, getTradesByStatus } from "@jaws/db/tradesEntity";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req;
  const { status } = query;

  const statusList = status && typeof status === "string" ? [status] : status;

  let results = {};

  try {
    switch (method) {
      case "GET":
        results = statusList
          ? await getTradesByStatus(...statusList)
          : await getAllTrades();
        break;
      default:
        throw new Error(`Unsupported method: ${method as string}`);
    }
  } catch (e) {
    let message;
    if (e instanceof Error) {
      message = e.message;
      if (typeof e.message !== "string") {
        message = e;
      }
    }
    res.status(500).json({ status: "NOK", message });
  }

  res.status(200).json(results);
}
