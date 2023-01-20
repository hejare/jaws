import type { NextApiRequest, NextApiResponse } from "next";
import { getLatestDailyRun } from "@jaws/db/dailyRunsEntity";
import { DailyRunDataType, DailyRunStatus } from "@jaws/db/dailyRunsMeta";
import { getErrors } from "@jaws/db/errorsEntity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const dailyRun: DailyRunDataType | null = await getLatestDailyRun();
  if (!dailyRun) {
    return res.status(500).json({
      status: DailyRunStatus.ERROR,
      error: {
        message: "Something is wrong - we got no daily-runs?",
      },
    });
  }
  const { runId } = dailyRun;

  const errors = await getErrors(runId);

  res.status(200).json({
    ...dailyRun,
    errors,
  });
}
