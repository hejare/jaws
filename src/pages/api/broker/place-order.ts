import type { NextApiRequest, NextApiResponse } from "next";
import { OrderType } from "../../../components/organisms/OrdersList";
import { postOrder } from "../../../services/alpacaService";

type Data = {
  data: Response;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const body = JSON.parse(req.body);
  const ticker: string = body.ticker as string;
  const orderType: OrderType = body.orderType as OrderType;
  const breakoutValue: string = body.breakoutValue as string;

  const data: Response = await postOrder(ticker, orderType, breakoutValue);
  res.status(200).json({ data: data });
}
