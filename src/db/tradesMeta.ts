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

  /** For "buy" orders, should now be considered done */
  FILLED = "FILLED",

  CANCELLED = "CANCELLED",

  /**
   * For more information, see [docs/trading-logic.md](../../docs/trading-logic.md)
   */
  STOP_LOSS_1 = "STOP_LOSS_1",

  /**
   * For more information, see [docs/trading-logic.md](../../docs/trading-logic.md)
   */
  STOP_LOSS_2 = "STOP_LOSS_2",

  /**
   * For more information, see [docs/trading-logic.md](../../docs/trading-logic.md)
   */
  STOP_LOSS_3 = "STOP_LOSS_3",

  /**
   * For more information, see [docs/trading-logic.md](../../docs/trading-logic.md)
   */
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
  avgEntryPrice?: number;
  alpacaStopLossOrderId?: string;
}
