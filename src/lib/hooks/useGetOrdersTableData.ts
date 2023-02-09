import { ExtendedTradesDataType } from "@jaws/db/tradesMeta";
import { getOrders, getTrades } from "@jaws/services/backendService";
import { RawOrder } from "@master-chief/alpaca/@types/entities";
import { useEffect, useState } from "react";

export type TableDataRow = RawOrder & {
  profit?: number;
  profitPercentage?: number;
  tradeStatus?: string;
};

export const useGetOrdersTableData = (): {
  status: "loading" | "ok";
  orders: TableDataRow[];
} => {
  const [dataFetchStatus, setDataFetchStatus] = useState<"loading" | "ok">(
    "loading",
  );
  const [data, setData] = useState<TableDataRow[]>([]);

  useEffect(() => {
    Promise.all([getOrders(), getTrades()])
      .then(([{ orders }, trades]) => {
        const extendedOrders = orders.map((order) => {
          if (order.side === "buy") {
            return order;
          }

          const trade = trades.find(
            (t) =>
              order.id ===
              (t.alpacaStopLossOrderId || t.alpacaTakeProfitOrderId),
          ) as Required<ExtendedTradesDataType>;

          if (!trade) {
            return order;
          }

          const profit =
            (trade.avgStopLossSellPrice || trade.avgTakeProfitSellPrice) *
              parseFloat(order.filled_qty) -
            trade.avgEntryPrice * parseFloat(order.filled_qty);

          return {
            ...order,
            tradeStatus: trade.status
              .split("_")
              .reduce((acc, w) => acc + w[0], ""),
            profit,
            profitPercentage:
              (profit / (trade.avgEntryPrice * parseFloat(order.filled_qty))) *
              100,
          };
        });

        setData(extendedOrders);
        setDataFetchStatus("ok");
      })
      .catch(console.error);
  }, []);

  return { status: dataFetchStatus, orders: data };
};
