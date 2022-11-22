import type { NextApiRequest, NextApiResponse } from "next";
import { Response } from "node-fetch";
import { deleteOrder } from "../../../../services/alpacaService";

//  ta in id
// switch caase för annat än delete

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method } = req;
  const { id } = query;

  try {
    switch (method) {
      case "DELETE":
        if (id && !(id instanceof Array)) {
          const data: Response = await deleteOrder(id);
          res.status(200).json({ data: data });
        }
        break;
      default:
        throw new Error(`Unsupported method: ${method as string}`);
    }
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
