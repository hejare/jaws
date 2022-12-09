export enum SUMMED_ORDER_STATUS {
  FILLED = "FILLED",
  IN_PROGRESS = "IN_PROGRESS",
  OPEN_FOR_PLACEMENT = "OPEN_FOR_PLACEMENT",
}

export enum Side {
  BUY = "buy",
  SELL = "sell",
}

export type AlpacaOrderType = {
  id: string;
  client_order_id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  filled_at: string;
  expired_at: null | string;
  canceled_at: null | string;
  failed_at: null | string;
  replaced_at: null | string;
  replaced_by: null | string;
  replaces: null | string;
  asset_id: string;
  symbol: string;
  asset_class: "us_equity";
  notional: null | string;
  qty: string;
  filled_qty: null | string;
  filled_avg_price: null | string;
  order_class: "";
  order_type: "limit"; // TODO
  type: "limit"; // TODO
  side: Side;
  time_in_force: "day";
  limit_price: string;
  stop_price: null; // TODO
  status: AlpacaOrderStatusType;
  extended_hours: false;
  legs: null;
  trail_percent: null;
  trail_price: null;
  hwm: null;
  commission: "0";
  subtag: null;
  source: "correspondent";
};

export enum AlpacaOrderStatusType {
  NEW = "new", // The order has been received by Alpaca, and routed to exchanges for execution. This is the usual initial state of an order.
  PARTIALLY_FILLED = "partially_filled", //	The order has been partially filled.
  FILLED = "filled", //	The order has been filled, and no further updates will occur for the order.
  DONE_FOR_DAY = "done_for_day", //	The order is done executing for the day, and will not receive further updates until the next trading day
  CANCELED = "canceled", //	The order has been canceled, and no further updates will occur for the order. This can be either due to a cancel request by the user, or the order has been canceled by the exchanges due to its time-in-force.
  EXPIRED = "expired", //	The order has expired, and no further updates will occur for the order.
  REPLACED = "replaced", //	The order was replaced by another order, or was updated due to a market event such as corporate action.
  PENDING_CANCEL = "pending_cancel", //	The order is waiting to be canceled.
  PENDING_REPLACE = "pending_replace", //	The order is waiting to be replaced by another order. The order will reject cancel request while in this state.
}

export const orderStatusesCompletedOk = [
  AlpacaOrderStatusType.FILLED,
  AlpacaOrderStatusType.DONE_FOR_DAY,
];

export const orderStatusesNotCompletedOk = [
  AlpacaOrderStatusType.CANCELED,
  AlpacaOrderStatusType.EXPIRED,
  AlpacaOrderStatusType.REPLACED,
];

export const orderStatusesCancelable = [
  AlpacaOrderStatusType.NEW,
  AlpacaOrderStatusType.PARTIALLY_FILLED,
];

export const orderStatusesInProgress = [
  AlpacaOrderStatusType.NEW,
  AlpacaOrderStatusType.PARTIALLY_FILLED,
  AlpacaOrderStatusType.PENDING_CANCEL,
  AlpacaOrderStatusType.PENDING_REPLACE,
];
