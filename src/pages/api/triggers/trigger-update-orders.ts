import type { NextApiRequest, NextApiResponse } from "next";
import { triggerUpdateBuyOrders } from "../../../lib/tradesHandler";

type ResponseDataType = {
  status: string;
  message?: string;
  meta?: Record<string, any>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  try {
    const responseData: ResponseDataType = { status: "INIT" };
    switch (method) {
      case "GET":
        await triggerUpdateBuyOrders()
          .then((results) => {
            responseData.status = "OK";
            responseData.meta = results;
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
