import { ExtendedTradesDataType } from "@jaws/db/tradesMeta";
import { ONE_DAY_IN_MS } from "@jaws/lib/helpers";
import { RawOrder } from "@master-chief/alpaca/@types/entities";
import { calculatePNL } from "./calculatePNL";

describe("calculatePNL", () => {
  it("calculates PNL for empty list", () => {
    const todayDate = new Date(2023, 1, 20, 17, 0, 0);
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
    "calculates PNL correctly (%#)",
    (orders, trades, result) => {
      const todayDate = new Date(2023, 1, 21, 17, 0, 0);
      const startDate = new Date(Number(todayDate) - ONE_DAY_IN_MS * 21);
      const endDate = todayDate;

      const pnl = calculatePNL({
        orders: orders as RawOrder[],
        dateStart: startDate,
        dateEnd: endDate,
        trades: trades as ExtendedTradesDataType[],
      });

      const { buyValue, profit, profitPercentage } = result;

      expect(pnl).toStrictEqual(expect.objectContaining({ buyValue, profit }));
      expect(pnl.profitPercentage).toBeCloseTo(profitPercentage, 4);
    },
  );
});

function getTestData(): [
  Partial<RawOrder>[],
  Partial<ExtendedTradesDataType>[],
  { profit: number; profitPercentage: number; buyValue: number },
][] {
  return [
    [[], [], { profit: 0, profitPercentage: 0, buyValue: 0 }],
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
          filled_qty: "1",
          side: "buy",
          filled_avg_price: "100",
          status: "filled",
          filled_at: new Date(2023, 1, 4, 17, 0, 0).toISOString(),
          id: "ID2",
        },
        {
          symbol: "AAPL",
          filled_qty: "2",
          side: "sell",
          filled_avg_price: "110",
          status: "filled",
          filled_at: new Date(2023, 1, 4, 17, 0, 0).toISOString(),
          id: "ID3",
        },
        {
          symbol: "AAPL",
          filled_qty: "1",
          side: "sell",
          filled_avg_price: "110",
          status: "filled",
          filled_at: new Date(2023, 1, 8, 17, 0, 0).toISOString(),
          id: "ID4",
        },
      ],
      [
        {
          alpacaOrderId: "ID1",
          alpacaStopLossOrderId: "ID3",
          //   alpacaTakeProfitOrderId: "b2e74a80-05ba-47d2-97ae-ab415921aace",
          ticker: "AAPL",
        },
        {
          alpacaOrderId: "ID2",
          alpacaStopLossOrderId: "ID4",
          //   alpacaTakeProfitOrderId: "b2e74a80-05ba-47d2-97ae-ab415921aace",
          ticker: "AAPL",
        },
      ],
      { profit: 30, profitPercentage: 0.1, buyValue: 300 },
    ],
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
          filled_qty: "1",
          side: "buy",
          filled_avg_price: "100",
          status: "filled",
          filled_at: new Date(2023, 1, 4, 17, 0, 0).toISOString(),
          id: "ID2",
        },
        {
          symbol: "AAPL",
          filled_qty: "1",
          side: "sell",
          filled_avg_price: "110",
          status: "filled",
          filled_at: new Date(2023, 1, 4, 17, 0, 0).toISOString(),
          id: "ID3",
        },
        {
          symbol: "AAPL",
          filled_qty: "1",
          side: "sell",
          filled_avg_price: "105",
          status: "filled",
          filled_at: new Date(2023, 1, 8, 17, 0, 0).toISOString(),
          id: "ID4",
        },
        {
          symbol: "AAPL",
          filled_qty: "1",
          side: "sell",
          filled_avg_price: "105",
          status: "filled",
          filled_at: new Date(2023, 1, 8, 17, 0, 0).toISOString(),
          id: "ID5",
        },
      ],
      [
        {
          alpacaOrderId: "ID2",
          alpacaStopLossOrderId: "ID4",
          //   alpacaTakeProfitOrderId: "b2e74a80-05ba-47d2-97ae-ab415921aace",
          ticker: "AAPL",
        },
        {
          alpacaOrderId: "ID1",
          alpacaTakeProfitOrderId: "ID3",
          alpacaStopLossOrderId: "ID5",
          ticker: "AAPL",
        },
      ],
      { profit: 20, profitPercentage: 0.0667, buyValue: 300 },
    ],
  ];
}
