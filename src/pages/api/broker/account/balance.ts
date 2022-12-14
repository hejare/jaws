import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "../../../../db/ResponseDataMeta";
import { getAccountCashBalance } from "../../../../services/alpacaService";

interface ExtendedResponseDataType extends ResponseDataType {
  balance?: Record<string, any>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const responseData: ExtendedResponseDataType = { status: "INIT" };
    await getAccountCashBalance()
      .then((result) => {
        responseData.status = "OK";
        responseData.balance = result;
      })
      .catch((e) => {
        responseData.status = "NOK";
        responseData.message = e.message;
      });
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
