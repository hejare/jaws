import fetch from "node-fetch";
import { Response } from "node-fetch";
import { Order } from "../components/organisms/OrderList";

const convertResult = async (result: Response) => {
  const text = await result.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const brokerService = async () => {
  const resp = await fetch(`http://localhost:3000/api/broker/place-order`);
  const data = await convertResult(resp);
};

export const handlePostOrder = async (ticker: string) => {
  const resp = await fetch(
    `http://localhost:3000/api/broker/place-order/?ticker=${ticker}`,
    { method: "POST" },
  );
  const data = await convertResult(resp);
};

export const handleGetTrades = async () => {
  const resp = await fetch(`http://localhost:3000/api/broker/get-orders`);
  const data = await convertResult(resp);
  const response = data.orders.map((order: Order) => {
    const { symbol, status, notional, created_at, filled_at, side } = order;
    return { symbol, status, notional, created_at, filled_at, side };
  });
  return response;
};
