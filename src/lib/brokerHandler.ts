import fetch, { BodyInit } from "node-fetch";
import { Order, OrderType } from "../components/organisms/OrdersList";
import { convertResult } from "../util";

const handlePostOrder = async (
  ticker: string,
  price: number,
  orderType: OrderType,
  quantity: number,
) => {
  const body: BodyInit = JSON.stringify({
    ticker,
    orderType,
    price,
    quantity,
  });

  const resp = await fetch("/api/broker/orders/", {
    method: "POST",
    body,
  });

  const data = await convertResult(resp);
  console.log(data);
};

export const handleBuyOrder = (
  ticker: string,
  price: number,
  quantity: number,
) => handlePostOrder(ticker, price, "buy", quantity);

export const handleSellOrder = (ticker: string) =>
  handlePostOrder(ticker, 1, "sell", 1); // ?refactor handlepostorder to not need breakout value here

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
