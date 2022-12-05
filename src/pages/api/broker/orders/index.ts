import type { NextApiRequest, NextApiResponse } from "next";
import { OrderType } from "../../../../components/organisms/OrdersList";
import { ResponseDataType } from "../../../../db/ResponseDataMeta";
import { handleSaveOrder } from "../../../../db/tradesEntity";
import { getOrders, postOrder } from "../../../../services/alpacaService";

interface ExtendedResponseDataType extends ResponseDataType {
  orders?: Record<string, any>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  try {
    const responseData: ExtendedResponseDataType = { status: "INIT" };
    switch (method) {
      case "GET":
        await getOrders()
          .then((result) => {
            responseData.status = "OK";
            responseData.orders = result;
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
          breakoutRef,
        }: {
          ticker: string;
          orderType: OrderType;
          price: number;
          quantity: number;
          breakoutRef: string;
        } = body;

        // await postOrder(ticker, orderType, price, quantity)
        //   .then((result) => {
        //     const alpacaOrderId = result.id; // '63a0399a-b62f-479d-9dbb-575e5dbe5f63'
        //     const created_at = result.created_at; // '2022-12-05T11:02:02.058370387Z'
        // TODO trades call handleSaveOrder here
        //     responseData.status = "OK";
        //   })
        //   .catch((e) => {
        //     console.log(e);
        //     responseData.status = "NOK";
        //     responseData.message = e.message;
        //   });

        // will get from result:
        const alpacaOrderId = "63a0399a-b62f-479d-9dbb-575e5dbe5f63";
        const created_at = "2022-12-05T11:02:02.058370387Z";

        await handleSaveOrder(
          ticker,
          orderType,
          price,
          quantity,
          alpacaOrderId,
          created_at,
          breakoutRef,
        );

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
