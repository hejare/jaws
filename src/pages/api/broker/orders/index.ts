import { auth } from "@jaws/auth/firebaseAdmin";
import { postTrade } from "@jaws/db/tradesEntity";
import { TRADE_SIDE, TRADE_STATUS } from "@jaws/db/tradesMeta";
import * as alpacaService from "@jaws/services/alpacaService";
import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "../../ResponseDataMeta";

interface ExtendedResponseDataType extends ResponseDataType {
  orders?: Record<string, any>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  try {
    let responseData: ExtendedResponseDataType;
    switch (method) {
      case "GET":
        responseData = await getOrders();
        break;
      case "POST":
        const { email } = await auth.verifyIdToken(
          req.cookies.idToken as string,
        );
        responseData = await createNewTrade(req, email);
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

async function createNewTrade(req: NextApiRequest, email?: string) {
  const responseData: ExtendedResponseDataType = { status: "INIT" };
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
    price: string;
    quantity: number;
    breakoutRef: string;
  } = body;

  responseData.status = "OK";

  await postTrade({
    ticker,
    side,
    status,
    price: parseFloat(price),
    quantity,
    created: Date.now(),
    breakoutRef,
    userRef: email,
  }).catch((e) => {
    console.log(e);
    responseData.status = "NOK";
    responseData.message = e.message;
  });

  return responseData;
}

async function getOrders() {
  const responseData: ExtendedResponseDataType = { status: "INIT" };
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
  return responseData;
}
