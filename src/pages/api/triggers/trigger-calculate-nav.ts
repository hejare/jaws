import { calculateTodaysNAV } from "@jaws/lib/navHandler";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const data = await calculateTodaysNAV();

  res.status(200).json(data);
}
