import type { NextApiRequest, NextApiResponse } from "next";
import { storeDailyRunError } from "../../../lib/dailyRunHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req;
  try {
    switch (method) {
      case "POST":
        const jsonBody = JSON.parse(body.json);
        await storeDailyRunError(jsonBody);

        break;
      default:
        throw new Error(`Unsupported method: ${method as string}`);
    }

    res.status(200).json({});
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
