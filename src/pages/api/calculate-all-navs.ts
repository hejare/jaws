import { ExtendedTradesDataType } from "@jaws/db/tradesMeta";
import { ONE_DAY_IN_MS } from "@jaws/lib/helpers";
import * as alpacaService from "@jaws/services/alpacaService";
import { calculateNAV } from "@jaws/util/calculateNAV";
import { RawOrder } from "@master-chief/alpaca/@types/entities";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const orders = await alpacaService.getOrders({
    limit: 9999,
  });

  const activities = await alpacaService.getAllaciafaifgneif();

  const startCash = 50000;
  const lastDate = "2023-02-16";

  const days: {
    assets: {
      [symbol: string]: { symbol: string; qty: number; marketValue: number };
    };
    cash: number;
    marketValue: number;
    equity: number;
    date: string;
    orders: any[];
    numShares: number;
    NAV: number;
    assetChange: any[];
  }[] = [
    {
      assets: {},
      cash: startCash,
      marketValue: 0,
      equity: startCash,
      date: "2022-10-30",
      orders: [],
      numShares: 531.2,
      NAV: 0,
      assetChange: [],
    },
  ];

  orders.forEach((o: any) => {
    if (o.commission && o.commission !== "0") {
      console.log(o);
      throw new Error("COMMIOSSION");
    }
  });

  const ordersBuy = orders
    .filter(
      (o) =>
        o.side === "buy" &&
        (o.status === "filled" || o.status === "partially_filled"),
    )
    .reduce(
      (acc, o) =>
        acc + parseFloat(o.filled_avg_price) * parseFloat(o.filled_qty),
      0,
    );

  const ordersSell = orders
    .filter(
      (o) =>
        o.side === "sell" &&
        (o.status === "filled" || o.status === "partially_filled"),
    )
    .reduce(
      (acc, o) =>
        acc + parseFloat(o.filled_avg_price) * parseFloat(o.filled_qty),
      0,
    );

  const cashDiff = ordersSell - ordersBuy;

  const activitiesBuy = activities
    .filter((a: any) => a.side === "buy" && a.activity_type === "FILL")
    .reduce((acc, a: any) => acc + parseFloat(a.price) * parseFloat(a.qty), 0);

  const activitiesSell = activities
    .filter((a: any) => a.side === "sell" && a.activity_type === "FILL")
    .reduce((acc, a: any) => acc + parseFloat(a.price) * parseFloat(a.qty), 0);

  const activitiesDiff = activitiesSell - activitiesBuy;

  // CASH DIFF DOES NOT CORRELATE WITH CURRENT CASH !!!!!!!

  res.status(200).json({
    ordersBuy,
    ordersSell,
    cashDiff,
    orders,
    activities,
    activitiesDiff,
  });
  return;

  const ordersByDate = groupBy(
    orders
      .filter((o) => o.status === "filled" || o.status === "partially_filled")
      .map((o) => ({ ...o, date: o.filled_at.split("T")[0] })),
    "date",
  );

  for (
    let date = days[0].date, i = 0;
    date <= lastDate;
    date = new Date(Number(new Date(date)) + ONE_DAY_IN_MS)
      .toISOString()
      .split("T")[0],
      i++
  ) {
    console.group(date);

    if (i === 0) {
      days[0].NAV = calculateNAV({
        numShares: days[0].numShares,
        equity: days[0].equity,
        netDeposits: 0,
      }).NAV;
      continue;
    }

    const prevDay = days[i - 1];
    const ordersToday = ordersByDate[date] || [];

    const newDay: (typeof days)[0] = {
      date,
      assets: structuredClone(prevDay.assets),
      cash: prevDay.cash,
      equity: prevDay.equity,
      marketValue: prevDay.marketValue,
      orders: ordersToday.map(
        ({ filled_at, filled_qty, filled_avg_price, symbol, side }) => ({
          filled_at,
          filled_qty,
          filled_avg_price,
          symbol,
          side,
        }),
      ),
      NAV: prevDay.NAV,
      numShares: prevDay.numShares,
      assetChange: [],
    };

    const assetChange: any[] = [];

    for (let index = 0; index < ordersToday.length; index++) {
      const o = ordersToday[index];
      const position = (newDay.assets[o.symbol] = newDay.assets[o.symbol] || {
        symbol: o.symbol,
        qty: 0,
        marketValue: 0,
      });

      if (o.side === "buy") {
        position.qty += parseFloat(o.filled_qty);
        newDay.cash -=
          parseFloat(o.filled_avg_price) * parseFloat(o.filled_qty);
        console.log(
          "Buy ",
          o.filled_qty,
          " for ",
          o.filled_avg_price,
          " costing ",
          parseFloat(o.filled_avg_price) * parseFloat(o.filled_qty),
        );
      } else {
        position.qty -= parseFloat(o.filled_qty);
        newDay.cash +=
          parseFloat(o.filled_avg_price) * parseFloat(o.filled_qty);
        console.log(
          "Sell ",
          o.filled_qty,
          " for ",
          o.filled_avg_price,
          " earning ",
          parseFloat(o.filled_avg_price) * parseFloat(o.filled_qty),
        );
      }

      assetChange.push({
        symbol: o.symbol,
        side: o.side,
        qty: o.filled_qty,
        price: o.filled_avg_price,
        value: parseFloat(o.filled_avg_price) * parseFloat(o.filled_qty),
        newPos: position,
      });

      if (position.qty === 0) {
        delete newDay.assets[o.symbol];
      }

      if (position.marketValue === 0 && o.side === "buy") {
        position.marketValue =
          parseFloat(o.filled_qty) * parseFloat(o.filled_avg_price);
      }
    }

    newDay.assetChange = assetChange;

    const symbolAssetsToday = Array.from(new Set(Object.keys(newDay.assets)));

    const barsToday = symbolAssetsToday.length
      ? await alpacaService.getTickerBars(symbolAssetsToday, {
          startDate: date,
          endDate: date,
        })
      : { bars: {} };

    if (symbolAssetsToday) {
      if (Object.keys(barsToday.bars).length !== symbolAssetsToday.length) {
        console.error(
          "No bars! For: ",
          symbolAssetsToday,
          "we got",
          Object.keys(barsToday.bars).length,
          " should get ",
          symbolAssetsToday.length,
        );
      } else {
        console.log("Got bars for ", symbolAssetsToday);
      }
    } else {
      console.log("No orders today mon");
    }

    Object.entries(barsToday.bars).forEach(([symbol, bar]) => {
      const position = newDay.assets[symbol];
      if (!position) {
        throw new Error("missing asset????" + symbol);
      }

      const thisBar = bar[0];

      position.marketValue = thisBar.c * position.qty;
    });

    newDay.marketValue = Object.values(newDay.assets).reduce(
      (acc, ass) => acc + ass.marketValue,
      0,
    );

    newDay.equity = newDay.cash + newDay.marketValue;

    newDay.NAV = calculateNAV({
      numShares: newDay.numShares,
      equity: newDay.equity,
      netDeposits: 0,
    }).NAV;

    days.push(newDay);

    console.groupEnd();
  }

  res.status(200).json({ orders, days });

  return;
}

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
    (trade) => trade.alpacaOrderId && trade.alpacaStopLossOrderId,
  );
}

function tradeHasAlpacaIds(
  trade: ExtendedTradesDataType,
): asserts trade is RequireSome<
  ExtendedTradesDataType,
  "alpacaOrderId" | "alpacaStopLossOrderId" | "alpacaTakeProfitOrderId"
> {
  if (!(trade.alpacaOrderId && trade.alpacaStopLossOrderId)) {
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
