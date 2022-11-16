import type { NextApiRequest, NextApiResponse } from "next";
import { getAllDailyRuns } from "../../../../db/dailyRunsEntity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = await getAllDailyRuns();
  res.status(200).json(result);
}
