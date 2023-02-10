import { ExtendedTradesDataType } from "@jaws/db/tradesMeta";
import { RawOrder } from "@master-chief/alpaca/@types/entities";

export const calculatePNL = ({
  orders,
  dateStart,
  dateEnd,
  trades,
}: {
  orders: RawOrder[];
  dateStart: Date;
  dateEnd: Date;
  trades: ExtendedTradesDataType[];
}): {
  buyValue: number;
  profit: number;
  profitPercentage: number;
} => {
  const ordersById = groupBy(orders, "id");

  const tradesPNL = getClosedPositionTrades(trades).map((trade) => {
    tradeHasAlpacaIds(trade);

    const buyOrder = parseAlpacaOrder(ordersById[trade.alpacaOrderId][0]);

    const takeProfitOrder = trade.alpacaTakeProfitOrderId
      ? parseAlpacaOrder(ordersById[trade.alpacaTakeProfitOrderId][0])
      : { filled_qty: 0, filled_avg_price: 0 };
    const stopLossOrder = trade.alpacaStopLossOrderId
      ? parseAlpacaOrder(ordersById[trade.alpacaStopLossOrderId][0])
      : { filled_qty: 0, filled_avg_price: 0 };

    const buyValue = buyOrder.filled_avg_price * buyOrder.filled_qty;
    const profit =
      takeProfitOrder.filled_avg_price * takeProfitOrder.filled_qty +
      stopLossOrder.filled_avg_price * stopLossOrder.filled_qty -
      buyValue;

    return {
      profit,
      buyValue,
      profitPercentage: profit / buyValue,
    };
  });

  const summedTradesPNL = tradesPNL.reduce(
    (acc, { profit, buyValue }) => {
      acc.profit += profit;
      acc.buyValue += buyValue;
      acc.profitPercentage = acc.profit / acc.buyValue;
      return acc;
    },
    {
      profit: 0,
      buyValue: 0,
      profitPercentage: 0,
    },
  );

  return summedTradesPNL;
};

function groupBy<T extends Record<string, any>, K extends keyof T>(
  list: T[],
  key: K,
): { [k: string]: T[] } {
  return list.reduce(
    (r, v, i, a, k = v[key]) => ((r[k] || (r[k] = [])).push(v), r),
    {} as { [k: string]: T[] },
  );
}

function getClosedPositionTrades(trades: ExtendedTradesDataType[]) {
  return trades.filter(
    (trade) =>
      trade.alpacaOrderId &&
      (trade.alpacaTakeProfitOrderId || trade.alpacaStopLossOrderId),
  );
}

function tradeHasAlpacaIds(
  trade: ExtendedTradesDataType,
): asserts trade is RequireSome<
  ExtendedTradesDataType,
  "alpacaOrderId" | "alpacaStopLossOrderId" | "alpacaTakeProfitOrderId"
> {
  if (
    !(
      trade.alpacaOrderId &&
      (trade.alpacaTakeProfitOrderId || trade.alpacaStopLossOrderId)
    )
  ) {
    throw new TypeError("Trade missing data: " + JSON.stringify(trade));
  }
}

function parseAlpacaOrder(order: RawOrder) {
  return {
    ...order,
    filled_avg_price: parseFloat(order.filled_avg_price),
    filled_qty: parseInt(order.filled_qty),
  };
}
