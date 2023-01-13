/**
 * These are also mapped all the way to lowercased and sent to alpacaca
 * (as prop "side")
 */
export enum TRADE_SIDE {
  BUY = "BUY",
  SELL = "SELL",
}

export enum TRADE_STATUS {
  /** not even sent to Alpaca yet */
  READY = "READY",
  /** not filled yet */
  ACTIVE = "ACTIVE",
  /** not totally filled yet */
  PARTIALLY_FILLED = "PARTIALLY_FILLED",
  /** "buy" or "sell" type process, should now be concidered done */
  FILLED = "FILLED",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
  /** order is filled and later resulted in a take-profit order. */
  TAKE_PROFIT = "TAKE PROFIT",
}

export interface TradesDataType {
  ticker: string;
  side: TRADE_SIDE;
  status: TRADE_STATUS;
  price: number;
  quantity: number;
  created: number;
  /** Important! Used as _ref */
  breakoutRef: string;
  alpacaOrderId?: string;
  userRef?: string;
}

export interface ExtendedTradesDataType extends TradesDataType {
  placed?: number;
  alpacaOrderId?: string;
}
