import type { NextApiRequest, NextApiResponse } from "next";
import { getBreakOutsForTicker } from "../../../../../db/breakoutsEntity";
import { ResponseDataType } from "../../../../../db/ResponseDataMeta";

interface ExtendedResponseDataType extends ResponseDataType {
  breakouts?: object;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query } = req;
  const { ticker } = query;

  const responseData: ExtendedResponseDataType = { status: "INIT" };

  try {
    if (typeof ticker !== "string") {
      return res.status(404).json({});
    }
    await getBreakOutsForTicker(ticker).then((breakouts) => {
      responseData.breakouts = breakouts;
      responseData.status = "OK got breakout(s) for ticker";
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
