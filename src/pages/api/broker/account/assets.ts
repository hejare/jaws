import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "../../../../db/ResponseDataMeta";
import { getAccountAssets } from "../../../../services/alpacaService";

interface ExtendedResponseDataType extends ResponseDataType {
  assets?: Record<string, any>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const responseData: ExtendedResponseDataType = { status: "INIT" };
    await getAccountAssets()
      .then((result) => {
        responseData.status = "OK";
        responseData.assets = result;
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
