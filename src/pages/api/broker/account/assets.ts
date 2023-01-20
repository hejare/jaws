import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "../../ResponseDataMeta";
import { getAccountAssets } from "@jaws/services/alpacaService";

export interface BrokerAccountAssetsResponse extends ResponseDataType {
  assets: Record<string, any>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const responseData: Partial<BrokerAccountAssetsResponse> = {
      status: "INIT",
    };
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
