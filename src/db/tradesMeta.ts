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
}

export interface TradesDataType {
  ticker: string;
  type: TRADE_TYPE;
  status: TRADE_STATUS;
  price: number;
  quantity: number;
  created: number;
  alpacaOrderId?: string;
  breakoutRef?: string;
  userRef?: string;
}
