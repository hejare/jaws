import { getDailyStats } from "@jaws/db/dailyStatsEntity";
import { getTodayWithDashes } from "@jaws/lib/helpers";
import { NextApiRequest, NextApiResponse } from "next";
import { ResponseDataType } from "../../ResponseDataMeta";

interface DailyStatsResponseData {
  nav: number;
  date: string;
}

export type DailyStatsResponse = ResponseDataType & {
  data?: DailyStatsResponseData | DailyStatsResponseData[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query } = req;

  const response: DailyStatsResponse = { status: "INIT" };

  // TODO: get from middleware
  const accountId = "hejare";

  try {
    if (req.method !== "GET") {
      throw new Error(`Method not supported: ${req.method || "none"}`);
    }

    let startDate: string, endDate: string;
    if (
      typeof query.startDate === "string" ||
      typeof query.endDate === "string"
    ) {
      if (
        typeof query.startDate !== "string" ||
        typeof query.endDate !== "string"
      ) {
        throw new Error("Need two dates for date range");
      }

      startDate = query.startDate;
      endDate = query.endDate;
      response.data = await getStats({ startDate, endDate, accountId });
    } else {
      startDate = endDate = getTodayWithDashes();
      response.data = await getStats({ startDate, endDate, accountId }, true);
    }

    response.status = "OK";
    return res.status(200).json(response);

    // const nav =
  } catch (error) {
    res.status(500).json({ status: "NOK", message: JSON.stringify(error) });
  }
}

async function getStats(
  params: {
    startDate: string;
    endDate: string;
    accountId: string;
  },
  justOne?: boolean,
) {
  const stats = (await getDailyStats(params)).map(({ nav, date }) => ({
    nav,
    date,
  }));
  return justOne ? stats[0] : stats;
}
