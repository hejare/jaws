import type { NextApiRequest, NextApiResponse } from "next";
import { getDailyRunByDate } from "../../../../../db/dailyRunsEntity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query } = req;
  const { date } = query;

  if (typeof date !== "string") {
    return res.status(404).json({});
  }
  const dailyRuns = await getDailyRunByDate(date);

  res.status(200).json(dailyRuns);
}
