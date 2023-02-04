import { RawOrder } from "@master-chief/alpaca/@types/entities";
import { uuid4 } from "@sentry/utils";
import { pnlClosedPositions } from "./useGetTableData";

interface NeededFields {
  symbol: string;
  qty: string;
  side: string;
  filled_avg_price: string;
  status: string;
  filled_at: string;
}

const orderFiller = ({ symbol, qty, side, filled_avg_price, status, filled_at }: NeededFields): RawOrder => ({
  symbol,
  qty,
  side,
  filled_avg_price,
  status,
  id: uuid4(),
  client_order_id: uuid4(),
  created_at: (new Date()).toISOString(),
  updated_at: "string",
  submitted_at: "string",
  filled_at: "string",
  expired_at: "string",
  canceled_at: "string",
  failed_at: "string",
  replaced_at: "string",
  replaced_by: "string",
  replaces: "string",
  asset_id: "string",
  asset_class: "string",
  filled_qty: "string",
  type: "string",
  time_in_force: "string",
  limit_price: "string",
  stop_price: "string",
  extended_hours: false,
  legs: [],
  trail_price: "string",
  trail_percent: "string",
  hwm: "string",
  order_class: undefined,
});


describe('pnlClosedPositions', () => {

  it.each([
    [
      [],
      0
    ],
    [
      [
        { symbol: "AAPL", qty: "1", side: "buy", filled_avg_price: "100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "AAPL", qty: "1", side: "sell", filled_avg_price: "110", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
      ],
      10
    ],
    [
      [
        { symbol: "AAPL", qty: "1", side: "buy", filled_avg_price: "100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "AAPL", qty: "1", side: "sell", filled_avg_price: "110", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
      ],
      10
    ],
    [
      [
          { symbol: "AAPL", qty: "1", side: "buy", filled_avg_price: "100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
          { symbol: "AAPL", qty: "1", side: "buy", filled_avg_price: "100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
          { symbol: "AAPL", qty: "2", side: "sell", filled_avg_price: "110", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
      ],
      20
    ],
    [
      [
        { symbol: "AAPL", qty: "1", side: "buy", filled_avg_price: "100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "AAPL", qty: "1", side: "sell", filled_avg_price: "100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "GOOG", qty: "1", side: "sell", filled_avg_price: "110", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
      ],
      0
    ],
    [
      [
        { symbol: "AAPL", qty: "1", side: "buy", filled_avg_price: "100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "AAPL", qty: "1", side: "sell", filled_avg_price: "100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "GOOG", qty: "1", side: "buy", filled_avg_price: "1100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "GOOG", qty: "1", side: "sell", filled_avg_price: "1105", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
      ],
      5
    ],
    [
      [
        { symbol: "AAPL", qty: "1", side: "buy", filled_avg_price: "100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "AAPL", qty: "1", side: "sell", filled_avg_price: "150", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "GOOG", qty: "1", side: "buy", filled_avg_price: "1100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "GOOG", qty: "1", side: "sell", filled_avg_price: "1105", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
      ],
      55
    ],
    [
      [
        { symbol: "AAPL", qty: "1", side: "buy", filled_avg_price: "100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "AAPL", qty: "1", side: "sell", filled_avg_price: "150", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "GOOG", qty: "1", side: "buy", filled_avg_price: "1100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "GOOG", qty: "1", side: "sell", filled_avg_price: "1105", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "AAPL", qty: "1", side: "buy", filled_avg_price: "160", status: "filled", filled_at: (new Date(2023, 1, 15, 18, 0, 0)).toISOString() },
      ],
      55
    ],
    [
      [
        { symbol: "AAPL", qty: "1", side: "buy", filled_avg_price: "100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "AAPL", qty: "1", side: "sell", filled_avg_price: "150", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "GOOG", qty: "1", side: "buy", filled_avg_price: "1100", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "GOOG", qty: "1", side: "sell", filled_avg_price: "1105", status: "filled", filled_at: (new Date(2023, 1, 3, 17, 0, 0)).toISOString() },
        { symbol: "AAPL", qty: "1", side: "buy", filled_avg_price: "160", status: "filled", filled_at: (new Date(2023, 1, 15, 18, 0, 0)).toISOString() },
        { symbol: "GOOG", qty: "1", side: "buy", filled_avg_price: "1200", status: "filled", filled_at: (new Date(2023, 1, 15, 17, 30, 0)).toISOString() },
      ],
      55
    ]
  ])
  ('for trades should calculate correct profit $expectedProfit', (trades, expectedProfit) => {
    const res = pnlClosedPositions(trades.map(orderFiller));
    expect(res).toEqual(expectedProfit);
  });

});