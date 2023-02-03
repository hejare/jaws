import { ResponseDataType } from "@jaws/pages/api/ResponseDataMeta";
import { getAccount } from "@jaws/services/alpacaService";
import { NextApiRequest, NextApiResponse } from "next";

export interface BrokerAccountEquityResponse extends ResponseDataType {
  /** Cash + long_market_value + short_market_value */
  equity: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const responseData: Partial<BrokerAccountEquityResponse> = {
    status: "INIT",
  };
  try {
    await getAccount()
      .then((result) => {
        responseData.status = "OK";
        responseData.equity = result.equity;
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
