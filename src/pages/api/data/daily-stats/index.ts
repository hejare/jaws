import { getDailyStats } from "@jaws/db/dailyStatsEntity";
import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "../../ResponseDataMeta";

interface DailyStatsResponseData {
  nav: number;
  date: string;
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

    // const nav =
  } catch (error: any) {
    res.status(500).json({ status: "NOK", message: error.message || error });
  }
}

async function getStats(params: {
  startDate: string;
  endDate: string;
  accountId: string;
}) {
  const stats = (await getDailyStats(params)).map(({ nav, date }) => ({
    nav,
    date,
  }));
  return stats;
}

function getValidDateRange(dates: { startDate?: string; endDate?: string }): {
  startDate: string;
  endDate: string;
} {
  if (
    !(typeof dates.startDate === "string" && typeof dates.endDate === "string")
  ) {
    throw new Error("Need two dates for date range");
  } else {
    return { ...dates } as { startDate: string; endDate: string };
  }
}
