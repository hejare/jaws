import type { NextApiRequest, NextApiResponse } from "next";
import { getDailyRun, postDailyRun, putDailyRun } from "../../../services/firestoreService";

interface Ticker {
  ticker: string;
  price: number;
}

type DailyRunBody = {
  runId: string;
  runTime: number;
  breakouts: Ticker[];
  config: {};
};

const storeDailyRun = async (dailyRunBody: DailyRunBody) => {
  console.log("pretend to store dailyRunData:", dailyRunBody)
  console.log("...just the breakouts:", dailyRunBody.breakouts)

  const { runId, runTime, config, breakouts } = dailyRunBody;

  // update DailyRun 
  let dailyRunRef = await getDailyRun(runId);

  if (!dailyRunRef) {
    dailyRunRef = await postDailyRun(runId);
  }

  await putDailyRun(dailyRunRef._ref, {
    ...dailyRunRef,
    status: "completed",
    duration: runTime,
    timeEnded: Date.now(),
  });

  // Get/Port config

  // Get/Post Ticker for each breakout item

  // Post Breakout for each breakout item

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
