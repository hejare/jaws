import fetch, { BodyInit } from "node-fetch";
import { Order, OrderType } from "../components/organisms/OrdersList";
import { convertResult } from "../util";

export const brokerService = async () => {
  const resp = await fetch(`/api/broker/place-order`);
  const data = await convertResult(resp);
  console.log(data);
};

const handlePostOrder = async (
  ticker: string,
  breakoutValue: number,
  orderType: OrderType,
) => {
  const body: BodyInit = JSON.stringify({
    ticker,
    orderType,
    breakoutValue,
  });

  const resp = await fetch("/api/broker/place-order/", {
    method: "POST",
    body,
  });

  const data = await convertResult(resp);
  console.log(data);
};

export const handleBuyOrder = (ticker: string, breakoutValue: number) =>
  handlePostOrder(ticker, breakoutValue, "buy");

export const handleSellOrder = (ticker: string) =>
  handlePostOrder(ticker, 1, "sell"); // ?refactor handlepostorder to not need breakout value here

export const handleDeleteOrder = async (order_id: string) => {
  const resp = await fetch(`/api/broker/delete-order/?orderId=${order_id}`, {
    method: "DELETE",
  });
  const data = await convertResult(resp);
  console.log(data);
};

export const handleGetTrades = async () => {
  const resp = await fetch(`/api/broker/get-orders`);
  const data = await convertResult(resp);
  const response = data.orders.map((order: Order) => {
    const { symbol, id, status, notional, created_at, filled_at, side } = order;
    return { symbol, id, status, notional, created_at, filled_at, side };
  });
  return response;
};
