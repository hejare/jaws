import { RawActivity } from "@jaws/services/alpacaMeta";
import * as alpacaService from "@jaws/services/alpacaService";
import { getTodayWithDashes } from "./helpers";

export const calculateTodaysNAV = async () => {
  const todayDate = getTodayWithDashes();

  const [equity, cashTransactions] = await Promise.all([
    alpacaService.getEquity(),
    alpacaService.getAccountActivities({
      activity_type: "TRANS",
      date: todayDate,
    }),
  ]);

  isNonTradeActivities(cashTransactions);

  const cashFlow = cashTransactions
    .filter((ct) => ct.status !== "canceled")
    .reduce((sum, ct) => sum + parseFloat(ct.net_amount), 0);

  return { equity, cashTransactions, cashFlow };
};

export const saveTodaysNAV = () => {};

function isNonTradeActivities(
  activities: RawActivity[],
): asserts activities is (RawActivity & { net_amount: string })[] {
  if (!activities.every((a) => "net_amount" in a)) {
    throw new TypeError("Found activity without net_amount");
  }
}
