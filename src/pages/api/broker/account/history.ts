import { ResponseDataType } from "@jaws/pages/api/ResponseDataMeta";
import { getAccountHistory } from "@jaws/services/alpacaService";
import { GetPortfolioHistory, PortfolioHistory } from "@master-chief/alpaca";
import { NextApiRequest, NextApiResponse } from "next";

export interface PortfolioHistoryResponse extends ResponseDataType {
  history: Omit<PortfolioHistory, "timestamp"> & { timestamp: string[] };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const params = req.query as GetPortfolioHistory;

  const responseData: Partial<PortfolioHistoryResponse> = {
    status: "INIT",
  };
  try {
    await getAccountHistory(params)
      .then((result) => {
        responseData.status = "OK";
        responseData.history = result;
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
