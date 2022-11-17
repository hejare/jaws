import type { NextApiRequest, NextApiResponse } from "next";
import { getAllBreakouts } from "../../../../db/breakoutsEntity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = await getAllBreakouts();
  res.status(200).json(result);
}
