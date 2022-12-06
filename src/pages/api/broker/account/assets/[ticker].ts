import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "../../../../../db/ResponseDataMeta";
import { closeOpenPosition } from "../../../../../services/alpacaService";

interface ExtendedResponseDataType extends ResponseDataType {
  orders?: Record<string, any>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req;
  const { ticker, percentage } = query;

  try {
    const responseData: ExtendedResponseDataType = { status: "INIT" };
    switch (method) {
      case "DELETE":
        if (
          ticker &&
          !(ticker instanceof Array) &&
          percentage &&
          !(percentage instanceof Array)
        ) {
          await closeOpenPosition(ticker, percentage)
            .then(() => {
              responseData.status = "OK";
            })
            .catch((e) => {
              responseData.status = "NOK";
              responseData.message = e.message;
            });
        }
        // todo sell update DB
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
