import fetch, { BodyInit } from "node-fetch";
import { Order } from "../components/organisms/OrdersList";
import { TRADE_STATUS, TRADE_SIDE } from "../db/tradesMeta";
import { convertResult } from "../util";

export const handleBuyOrder = async (
  ticker: string,
  price: number,
  quantity: number,
  breakoutRef: string,
) => {
  const body: BodyInit = JSON.stringify({
    ticker,
    side: TRADE_SIDE.BUY,
    status: TRADE_STATUS.READY,
    price,
    quantity,
    breakoutRef,
  });

  const resp = await fetch("/api/broker/orders", {
    method: "POST",
    body,
  });

  return convertResult(resp);
};

export const handleCancelOrder = async (ref: string) => {
  const resp = await fetch(`/api/data/trades/${ref}`, {
    method: "DELETE",
  });

  return convertResult(resp);
};

const sellOrder = async (symbol: string, percentage: number) => {
  if (
    !symbol ||
    typeof symbol !== "string" ||
    symbol.length < 2 ||
    symbol.length > 5
  ) {
    // TODO: Move to a kind of "validator" helper / handler
    console.log(
      "Did not sell. Symbol must be a defined string between 2-4 chars ",
    );
    return;
  }
  const resp = await fetch(
    `/api/broker/account/assets/${symbol}?percentage=${percentage}`,
    {
      method: "DELETE",
    },
  );

  return convertResult(resp);
};

export const handleSellOrderByTickerId = (
  ticker: string,
  percentage: number,
) => {
  return sellOrder(ticker, percentage);
};

export const handleDeleteOrder = async (order_id: string) => {
  const resp = await fetch(`/api/broker/orders/${order_id}`, {
    method: "DELETE",
  });
  const data = await convertResult(resp);
  console.log(data);
};

export const handleGetTrades = async () => {
  const resp = await fetch(`/api/broker/orders`);
  const data = await convertResult(resp);
  const response = data.orders.map((order: Order) => {
    const { symbol, id, status, notional, created_at, filled_at, side } = order;
    return { symbol, id, status, notional, created_at, filled_at, side };
  });
  return response;
};
