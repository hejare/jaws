import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "../../../../db/ResponseDataMeta";
import { postTrade } from "../../../../db/tradesEntity";
import { TRADE_STATUS, TRADE_SIDE } from "../../../../db/tradesMeta";
import * as alpacaService from "../../../../services/alpacaService";

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
        await alpacaService
          .getOrders()
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
          side,
          status,
          price,
          quantity,
          breakoutRef,
        }: {
          ticker: string;
          side: TRADE_SIDE;
          status: TRADE_STATUS;
          price: number;
          quantity: number;
          breakoutRef: string;
        } = body;

        responseData.status = "OK";
        await postTrade({
          ticker,
          side,
          status,
          price,
          quantity,
          created: Date.now(),
          breakoutRef,
          userRef: "ludde@hejare.se", // TODO: Extract from auth cookie/token
        }).catch((e) => {
          console.log(e);
          responseData.status = "NOK";
          responseData.message = e.message;
        });

        // const created_at = Date.parse(result.created_at).toString(); // result.created_at: '2022-12-05T11:02:02.058370387Z'
        // await alpacaService
        //   .postNewBuyOrder(ticker, price, quantity)
        //   .then(async (result) => {
        //     const alpacaOrderId = result.id;
        //     const created_at = Date.parse(result.created_at).toString(); // result.created_at: '2022-12-05T11:02:02.058370387Z'
        //     await handleSaveOrder(
        //       ticker,
        //       type,
        //       status,
        //       price,
        //       quantity,
        //       alpacaOrderId,
        //       created_at,
        //       breakoutRef,
        //     );
        //     responseData.status = "OK";
        //   })
        //   .catch((e) => {
        //     console.log(e);
        //     responseData.status = "NOK";
        //     responseData.message = e.message;
        //   });
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
