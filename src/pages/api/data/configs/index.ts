import type { NextApiRequest, NextApiResponse } from "next";
import { getAllConfigs } from "../../../../db/configsEntity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = await getAllConfigs();
  res.status(200).json(result);
}
