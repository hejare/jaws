// These are also mapped all the way to lowercased and sent to alpacaca (as prop "side")
export enum TRADE_TYPE {
  BUY = "BUY",
  SELL = "SELL",
}

export enum TRADE_STATUS {
  READY = "READY", // not even sent to Alpaca yet
  ACTIVE = "ACTIVE", // not filled yet
  PARTIALLY_FILLED = "PARTIALLY_FILLED", // not totally filled yet
  FILLED = "FILLED", // "buy" or "sell" type process, should now be concidered done
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

export interface TradesDataType {
  ticker: string;
  type: TRADE_TYPE;
  status: TRADE_STATUS;
  price: number;
  quantity: number;
  created: number;
  breakoutRef: string; // Important! Used as _ref
  alpacaOrderId?: string;
  userRef?: string;
}

export interface ExtendedTradesDataType extends TradesDataType {
  placed?: number;
  alpacaOrderId?: string;
}
