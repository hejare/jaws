import type { NextApiRequest, NextApiResponse } from "next";
import { OrderType } from "../../../../components/organisms/OrdersList";
import { ResponseDataType } from "../../../../db/ResponseDataMeta";
import { getOrders, postOrder } from "../../../../services/alpacaService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  try {
    const responseData: ResponseDataType = { status: "INIT" };
    console.log(responseData);
    switch (method) {
      case "GET":
        await getOrders()
          .then((result) => {
            responseData.status = "OK";
            responseData.meta = {
              orders: result,
            };
          })
          .catch((e) => {
            responseData.status = "NOK";
            responseData.message = e.message;
          });
        break;
      case "POST":
        const body = JSON.parse(req.body);
        const {
          ticker,
          orderType,
          price,
          quantity,
        }: {
          ticker: string;
          orderType: OrderType;
          price: number;
          quantity: number;
        } = body;

        await postOrder(ticker, orderType, price, quantity)
          .then(() => {
            responseData.status = "OK";
          })
          .catch((e) => {
            responseData.status = "NOK";
            responseData.message = e.message;
          });
        break;
      default:
        throw new Error(`Unsupported method: ${method as string}`);
    }
    res.status(200).json(responseData);
  } catch (e) {
    let message;
    if (e instanceof Error) {
      message = e.message;
      if (typeof e.message !== "string") {
        message = e;
      }
    }
    console.error(message);
    return res.status(500).json({
      error: message,
    });
  }
}
