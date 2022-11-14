// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

interface Ticker {
  ticker: string;
  price: number;
}

type DailyRunBody = {
  breakouts: Ticker[];
  config: {};
};

const storeDailyRun = async (dailyRunBody: DailyRunBody) => {
  console.log("pretend to store dailyRunData:", dailyRunBody)
  console.log("...just the breakouts:", dailyRunBody.breakouts)
  // TODO: Store this data
  return;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req;
  try {
    switch (method) {
      case "POST":
        const jsonBody = JSON.parse(body.json);
        await storeDailyRun(jsonBody);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
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
