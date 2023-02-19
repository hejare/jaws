import { getDailyStats } from "@jaws/db/dailyStatsEntity";
import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "../../ResponseDataMeta";

interface DailyStatsResponseData {
  nav: number;
  date: Date;
}

export interface DailyStatsResponse extends ResponseDataType {
  data: DailyStatsResponseData[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const response: DailyStatsResponse = { status: "INIT", data: [] };

  // TODO: get from middleware
  const accountId = "hejare";

  try {
    if (req.method !== "GET") {
      throw new Error(`Method not supported: ${req.method || "none"}`);
    }

    const dates = getValidDateRange(req.query);
    response.data = await getStats({ ...dates, accountId });

    response.status = "OK";
    return res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ status: "NOK", message: error.message || error });
  }
}

async function getStats(params: {
  startDate: Date;
  endDate: Date;
  accountId: string;
}) {
  const stats = (await getDailyStats(params)).map(({ nav, date }) => ({
    nav,
    date: date.toDate(),
  }));
  return stats;
}

function getValidDateRange(dates: { startDate?: string; endDate?: string }): {
  startDate: Date;
  endDate: Date;
} {
  if (
    typeof dates.startDate === "string" &&
    typeof dates.endDate === "string"
  ) {
    return {
      startDate: new Date(Date.parse(dates.startDate)),
      endDate: new Date(Date.parse(dates.endDate)),
    };
  } else {
    throw new Error("Need two dates for date range");
  }
}
