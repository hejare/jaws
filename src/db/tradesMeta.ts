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

  /** not filled yet; can be cancelled or dead for some other reason in Alpaca */
  ACTIVE = "ACTIVE",

  /** not totally filled yet */
  PARTIALLY_FILLED = "PARTIALLY_FILLED",

  /** "buy" or "sell" type process, should now be concidered done */
  FILLED = "FILLED",

  // OPEN = "OPEN",
  // CLOSED = "CLOSED",

  CANCELLED = "CANCELLED",

  /** order is filled and later resulted in a stop-loss (1) order. */
  STOP_LOSS_1 = "STOP_LOSS_1",

  /** order is filled and later resulted in a stop-loss (2) order. */
  STOP_LOSS_2 = "STOP_LOSS_2",

  /** order is filled and later resulted in a take-profit order. */
  STOP_LOSS_3 = "STOP_LOSS_3",

  /** order is filled and later resulted in a take partial profit order. */
  PARTIAL_PROFIT_TAKEN = "PARTIAL_PROFIT_TAKEN",
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
