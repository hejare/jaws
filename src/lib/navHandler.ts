import { getLastDocument, upsertDailyStats } from "@jaws/db/dailyStatsEntity";
import { RawActivity } from "@jaws/services/alpacaMeta";
import * as alpacaService from "@jaws/services/alpacaService";
import { calculateNAV } from "@jaws/util/calculateNAV";
import { firestore } from "firebase-admin";
import { ONE_DAY_IN_MS } from "./helpers";

export type DayDateString = ``;

export const calculateTodaysNAV = async (accountId: string) => {
  const todayDate = new Date();
  todayDate.setUTCHours(0, 0, 0, 0);
  const yesterdaysDate = new Date(todayDate.getTime() - ONE_DAY_IN_MS);

  const [equity, cashActivities, { debugInfo, ...yesterdayStats }] =
    await Promise.all([
      alpacaService.getEquity(),
      alpacaService.getAccountActivities({
        activity_type: "TRANS",
        date: todayDate.toISOString().split("T")[0],
      }),
      getLastDocument(accountId),
    ]);

  isNonTradeActivities(cashActivities);

  const netDeposits = cashActivities
    .filter((ct) => ct.status !== "canceled")
    .reduce((sum, ct) => sum + parseFloat(ct.net_amount), 0);

  const NAV = calculateNAV({
    numShares: yesterdayStats.shares,
    equity: parseFloat(equity),
    netDeposits,
  });

  return {
    equity,
    cashActivities,
    netDeposits,
    yesterdayStats,
    ...NAV,
    todayDate,
    yesterdaysDate,
  };
};

export const saveTodaysNAV = async () => {
  // TODO: Do for all accounts
  const {
    NAV: nav,
    todayDate: date,
    newNumShares: shares,
    ...debugInfo
  } = await calculateTodaysNAV("hejare");

  await upsertDailyStats({
    nav,
    accountId: "hejare",
    date: new firestore.Timestamp(date.getTime() / 1000, 0),
    shares,
    /** TODO: Remove when not needed anymore :) */
    debugInfo,
  });

  return { nav, date, shares, ...debugInfo };
};

function isNonTradeActivities(
  activities: RawActivity[],
): asserts activities is (RawActivity & { net_amount: string })[] {
  if (!activities.every((a) => "net_amount" in a)) {
    throw new TypeError("Found activity without net_amount");
  }
}
