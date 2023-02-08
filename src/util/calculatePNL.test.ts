import { ExtendedTradesDataType } from "@jaws/db/tradesMeta";
import { ONE_DAY_IN_MS } from "@jaws/lib/helpers";
import { RawOrder } from "@master-chief/alpaca/@types/entities";
import { calculatePNL } from "./calculatePNL";

describe("calculatePNL", () => {
  it("calculates PNL for empty list", () => {
    const todayDate = new Date(2023, 1, 3, 17, 0, 0);
    const startDate = new Date(Number(todayDate) - ONE_DAY_IN_MS * 21);
    const endDate = todayDate;

    const pnl = calculatePNL({
      orders: [],
      dateStart: startDate,
      dateEnd: endDate,
      trades: [],
    });
    expect(pnl).toStrictEqual({ buyValue: 0, profit: 0, profitPercentage: 0 });
  });

  it.each(getTestData())(
    "calculates PNL correctly",
    (orders, trades, result) => {
      const todayDate = new Date(2023, 1, 3, 17, 0, 0);
      const startDate = new Date(Number(todayDate) - ONE_DAY_IN_MS * 21);
      const endDate = todayDate;

      const pnl = calculatePNL({
        orders: orders as RawOrder[],
        dateStart: startDate,
        dateEnd: endDate,
        trades: trades as ExtendedTradesDataType[],
      });

      expect(pnl).toStrictEqual(result);
    },
  );

  it("ignores orders outside the period", () => {});
});

function getTestData(): [
  Partial<RawOrder>[],
  Partial<ExtendedTradesDataType>[],
  { profit: number; profitPercentage: number; buyValue: number },
][] {
  return [
    [
      [
        {
          symbol: "AAPL",
          filled_qty: "2",
          side: "buy",
          filled_avg_price: "100",
          status: "filled",
          filled_at: new Date(2023, 1, 3, 17, 0, 0).toISOString(),
          id: "ID1",
        },
        {
          symbol: "AAPL",
          filled_qty: "2",
          side: "sell",
          filled_avg_price: "110",
          status: "filled",
          filled_at: new Date(2023, 1, 3, 17, 0, 0).toISOString(),
          id: "ID2",
        },
      ],
      [
        {
          alpacaOrderId: "ID1",
          alpacaStopLossOrderId: "ID2",
          //   alpacaTakeProfitOrderId: "b2e74a80-05ba-47d2-97ae-ab415921aace",
          ticker: "AAPL",
        },
      ],
      { profit: 20, profitPercentage: 0.1, buyValue: 200 },
    ],
  ];
}
