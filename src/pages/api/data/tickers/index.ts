import type { NextApiRequest, NextApiResponse } from "next";
import { getAllTickers } from "@jaws/db/tickersEntity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = await getAllTickers();
  res.status(200).json(result);
}
