import type { NextApiRequest, NextApiResponse } from "next";
import { getDailyRun } from "../../../../db/dailyRunsEntity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  type RunId = string;
  const { query } = req;
  const { id } = query;

  if (typeof id !== "string") {
    return res.status(404);
  }
  const result = await getDailyRun(id);
  res.status(200).json(result);
}
