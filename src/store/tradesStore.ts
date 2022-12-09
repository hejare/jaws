import create from "zustand";
import { TRADE_STATUS, TRADE_TYPE } from "../db/tradesMeta";

export type TradesStoreType = {
  ticker: string;
  type: TRADE_TYPE;
  status: TRADE_STATUS;
  breakoutRef: string;
};

type PartialTradesStoreType = {
  status?: TRADE_STATUS;
};

interface TradesProps {
  trades: TradesStoreType[];
}

export interface TradesState extends TradesProps {
  setTrades: (trades: TradesStoreType[]) => void;
  upsertTrade: (ticker: string, newTrade: TradesStoreType) => void;
  updateTrade: (ticker: string, values: PartialTradesStoreType) => void;
  deleteTrade: (ticker: string) => void;
}

function upsertTrade(
  trades: TradesStoreType[],
  ticker: string,
  newTrade: TradesStoreType,
) {
  const existsingTradeIndex = trades.findIndex(
    (t: TradesStoreType) => t.ticker === ticker,
  );
  if (existsingTradeIndex > -1) {
    trades[existsingTradeIndex] = {
      ...trades[existsingTradeIndex],
      ...newTrade,
    };
  } else {
    trades.push(newTrade);
  }
  return trades;
}

function updateTrade(
  trades: TradesStoreType[],
  ticker: string,
  values: PartialTradesStoreType,
) {
  const existsingTradeIndex = trades.findIndex(
    (t: TradesStoreType) => t.ticker === ticker,
  );
  if (existsingTradeIndex > -1) {
    trades[existsingTradeIndex] = {
      ...trades[existsingTradeIndex],
      ...values,
    };
  }
  return trades;
}

function deleteTrade(trades: TradesStoreType[], ticker: string) {
  const existsingTradeIndex = trades.findIndex(
    (t: TradesStoreType) => t.ticker === ticker,
  );
  if (existsingTradeIndex > -1) {
    trades.splice(existsingTradeIndex, 1);
  }
  return trades;
}

export const useTradesStore = create<TradesState>((set) => ({
  trades: [],
  setTrades: (trades: TradesStoreType[]) =>
    set((state) => ({
      ...state,
      trades: [...trades],
    })),
  upsertTrade: (ticker: string, newTrade: TradesStoreType) =>
    set((state) => ({
      ...state,
      trades: [...upsertTrade(state.trades, ticker, newTrade)],
    })),
  updateTrade: (ticker: string, values: PartialTradesStoreType) =>
    set((state) => ({
      ...state,
      trades: [...updateTrade(state.trades, ticker, values)],
    })),
  deleteTrade: (ticker: string) =>
    set((state) => ({
      ...state,
      trades: [...deleteTrade(state.trades, ticker)],
    })),
}));
