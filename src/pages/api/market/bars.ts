import { getTickerBars } from "@jaws/services/alpacaService";
import { RawBar } from "@master-chief/alpaca/@types/entities";
import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "../ResponseDataMeta";

export type BarsResponse = ResponseDataType & {
  bars: { [k: string]: RawBar[] };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const dates = getValidDateRange(req.query);
    const symbols = req.query.symbols as string[];

    const bars = await getTickerBars(symbols, dates);

    const response: BarsResponse = {
      ...bars,
      status: "OK",
    };

    res.status(200).json(response);
  } catch (e: any) {
    const response: ResponseDataType = {
      status: "NOK",
      message: e?.message || e,
    };
    res.status(500).json(response);
  }
}

function getValidDateRange({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
}): {
  startDate: string;
  endDate: string;
} {
  if (!(typeof startDate === "string" && typeof endDate === "string")) {
    throw new Error("Need two dates for date range");
  } else {
    return { startDate, endDate } as { startDate: string; endDate: string };
  }
}
