import { saveTodaysNAV } from "@jaws/lib/navHandler";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    res.status(400).json({ error: "Unsupported method" });
    return;
  }

  try {
    const data = await saveTodaysNAV();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: JSON.stringify(e) });
  }
}
