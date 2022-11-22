import type { NextApiRequest, NextApiResponse } from "next";
import { Response } from "node-fetch";
import { getOrders } from "../../../../services/alpacaService";

type Data = {
  orders: Response;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const data: Response = await getOrders();
  res.status(200).json({ orders: data });
}
