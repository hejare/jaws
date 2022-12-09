// These are also mapped all the way to lowercased and sent to alpacaca (as prop "side")
export enum TRADE_TYPE {
  BUY = "BUY",
  SELL = "SELL",
}

export enum TRADE_STATUS {
  READY = "READY",
  ACTIVE = "ACTIVE",
  FILLED = "FILLED",
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
