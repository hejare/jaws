import { ExtendedTradesDataType, TRADE_STATUS } from "@jaws/db/tradesMeta";
import { getOrders, getTrades } from "@jaws/services/backendService";
import { RawOrder } from "@master-chief/alpaca/@types/entities";
import { useEffect, useState } from "react";
import { getDaysDifference } from "../helpers";

export type TableDataRow = RawOrder & {
  profit?: number;
  profitPercentage?: number;
  tradeStatus?: string;
  daysInTrade?: number;
};

export type TableFilter = { [k in keyof TableDataRow]?: string };

export const useGetOrdersTableData = (): {
  status: "loading" | "ok";
  orders: TableDataRow[];
  symbols: string[];
  filter: TableFilter;
  setFilter: (filter: TableFilter) => void;
} => {
  const [dataFetchStatus, setDataFetchStatus] = useState<"loading" | "ok">(
    "loading",
  );
  const [allData, setAllData] = useState<TableDataRow[]>([]);
  const [filteredData, setFilteredData] = useState<TableDataRow[]>([]);
  const [filter, setFilter] = useState<TableFilter>({});
  const [symbols, setSymbols] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([getOrders(), getTrades()])
      .then(([{ orders }, trades]) => {
        const extendedOrders = orders.map<TableDataRow>((order) => {
          if (order.side === "buy") {
            return order;
          }

          const trade = trades.find(
            (t) =>
              order.id === t.alpacaStopLossOrderId ||
              order.id === t.alpacaTakeProfitOrderId,
          ) as Required<ExtendedTradesDataType>;

          if (!trade) {
            return order;
          }

          const orderTradeType =
            order.id === trade.alpacaStopLossOrderId
              ? "STOP_LOSS"
              : "TAKE_PROFIT";

          const profit =
            parseFloat(order.filled_avg_price) * parseFloat(order.filled_qty) -
            trade.avgEntryPrice * parseFloat(order.filled_qty);

          return {
            ...order,
            tradeStatus: (orderTradeType === "STOP_LOSS"
              ? trade.status
              : TRADE_STATUS.PARTIAL_PROFIT_TAKEN
            )
              .split("_")
              .reduce((acc, w) => acc + w[0], ""),
            profit,
            profitPercentage:
              (profit / (trade.avgEntryPrice * parseFloat(order.filled_qty))) *
              100,
            daysInTrade: getDaysDifference(
              new Date(order.filled_at),
              new Date(trade.created),
            ),
          };
        });

        setAllData(extendedOrders);
        setDataFetchStatus("ok");
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setFilteredData(
      allData.filter(
        (order) =>
          !Object.entries(filter).some(([prop, value]) =>
            value ? order[prop as keyof TableFilter] !== value : false,
          ),
      ),
    );

    setSymbols(
      Array.from(new Set(allData.map((o) => o.symbol))).sort((a, b) =>
        a.localeCompare(b),
      ),
    );
  }, [allData, filter]);

  return {
    status: dataFetchStatus,
    orders: filteredData,
    setFilter,
    filter,
    symbols,
  };
};
