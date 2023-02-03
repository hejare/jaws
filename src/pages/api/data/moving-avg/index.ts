import { getBuySellHelpers } from "@jaws/lib/buySellHelper/buySellHelper";
import { getSimpleMovingAverage } from "@jaws/services/polygonService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req;
  let { symbols } = query;

  symbols = symbols && typeof symbols === "string" ? [symbols] : symbols;

  if (undefined === symbols) {
    return res
      .status(400)
      .json({ status: "NOK", message: "Specify at least one symbol" });
  }

  let results: { symbol: string; ma: number }[] = [];
  const helpers = getBuySellHelpers();

  try {
    switch (method) {
      case "GET":
        results = await Promise.all(
          (symbols as string[]).map((symbol) =>
            getSimpleMovingAverage(
              symbol,
              helpers.config.MOVING_AVERAGE_DAY_RANGE,
            ).then((ma) => ({ symbol, ma })),
          ),
        );
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
    return res.status(500).json({ status: "NOK", message });
  }

  return res.status(200).json(results);
}
