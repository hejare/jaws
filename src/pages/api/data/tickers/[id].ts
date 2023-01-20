import type { NextApiRequest, NextApiResponse } from "next";
import { getTicker } from "@jaws/db/tickersEntity";

// TODO get all breakouts for this ticker

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query } = req;
  const { id } = query;

  if (typeof id !== "string") {
    return res.status(404).json({});
  }
  const result = await getTicker(id);
  if (!result) {
    return res.status(404).json(null);
  }

  res.status(200).json(result);
}
