import { ResponseDataType } from "@jaws/pages/api/ResponseDataMeta";
import { getAccountHistory } from "@jaws/services/alpacaService";
import { PortfolioHistory } from "@master-chief/alpaca/@types/entities";
import { NextApiRequest, NextApiResponse } from "next";

export interface PortfolioHistoryResponse extends ResponseDataType {
  history: PortfolioHistory;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const responseData: Partial<PortfolioHistoryResponse> = {
    status: "INIT",
  };
  try {
    await getAccountHistory()
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
