import type { NextApiRequest, NextApiResponse } from "next";
import { Response } from "node-fetch";
import { deleteOrder } from "../../../services/alpacaService";

type Data = {
  data: Response;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const orderId = req.query?.orderId;

  if (orderId && !(orderId instanceof Array)) {
    const data: Response = await deleteOrder(orderId);
    res.status(200).json({ data: data });
  }
}
