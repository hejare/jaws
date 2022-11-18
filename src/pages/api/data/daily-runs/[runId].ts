import type { NextApiRequest, NextApiResponse } from "next";
import { getBreakoutsByDailyRun } from "../../../../db/breakoutsEntity";
import { getDailyRun } from "../../../../db/dailyRunsEntity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query } = req;
  const { runId } = query;

  if (typeof runId !== "string") {
    return res.status(404).json({});
  }
  const dailyRun = await getDailyRun(runId);
  if (!dailyRun) {
    return res.status(404).json(null);
  }

  const breakouts = await getBreakoutsByDailyRun(runId);

  res.status(200).json({
    ...dailyRun,
    breakouts,
  });
}
