import type { NextApiRequest, NextApiResponse } from "next";
import { getDailyRunByDate } from "@jaws/db/dailyRunsEntity";
import { DailyRunDataType } from "@jaws/db/dailyRunsMeta";
import { getSpecificErrors } from "@jaws/db/errorsEntity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query } = req;
  const { date } = query;

  if (typeof date !== "string") {
    return res.status(404).json({});
  }
  const dailyRuns: DailyRunDataType[] = await getDailyRunByDate(date);
  const runIds = dailyRuns.map(({ runId }: { runId: string }) => runId);

  if (runIds.length > 0) {
    const errors = await getSpecificErrors(runIds);
    errors.map(({ runId, message, misc, timestamp }) => {
      dailyRuns.find((dailyRun) => {
        if (dailyRun.runId == runId) {
          if (!dailyRun.errors) {
            dailyRun.errors = [];
          }
          dailyRun.errors.push({ message, misc, timestamp });
          return true;
        }
        return false;
      });
    });
  }

  res.status(200).json(dailyRuns);
}
