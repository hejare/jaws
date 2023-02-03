import type { NextApiRequest, NextApiResponse } from "next";
import { deleteTrade, getLatestTrade } from "@jaws/db/tradesEntity";
import { TradesDataType } from "@jaws/db/tradesMeta";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req;
  const { ref } = query;

  if (typeof ref !== "string") {
    return res.status(404).json({});
  }

  let results: null | TradesDataType = null;
  try {
    switch (method) {
      case "GET":
        // In this case, "ref" is "ticker"
        results = await getLatestTrade(ref);
        break;
      case "DELETE":
        // In this case, "ref" is "breakoutRef"
        await deleteTrade(ref);
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
