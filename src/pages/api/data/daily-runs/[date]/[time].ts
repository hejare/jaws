import type { NextApiRequest, NextApiResponse } from "next";
import { getBreakoutsByDailyRun } from "@jaws/db/breakoutsEntity";
import { getDailyRun } from "@jaws/db/dailyRunsEntity";
import { getErrors } from "@jaws/db/errorsEntity";
import {
  getRatingsForDailyRunAndUser,
  extendBreakoutsWithRatings,
} from "../../../../../lib/ratingHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query } = req;
  const { date, time } = query;

  const runId = `${date as string}_${time as string}`;

  const dailyRun = await getDailyRun(runId);
  if (!dailyRun) {
    return res.status(404).json(null);
  }

  let extraData = {};

  const errors = await getErrors(runId);
  if (errors) {
    extraData = { errors: errors };
  }
  const breakouts = await getBreakoutsByDailyRun(runId);

  const userRef = "ludde@hejare.se";
  const ratingsForUser = await getRatingsForDailyRunAndUser(runId, userRef);

  const breakOutsWithRatings = extendBreakoutsWithRatings(
    breakouts,
    ratingsForUser,
  );
  extraData = {
    ...extraData,
    breakouts: breakOutsWithRatings,
  };

  res.status(200).json({
    ...dailyRun,
    ...extraData,
  });
}
