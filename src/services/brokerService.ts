import fetch from "node-fetch";
import { Order, OrderType } from "../components/organisms/OrderList";
import { convertResult } from "../util";

export const brokerService = async () => {
  const resp = await fetch(`/api/broker/place-order`);
  const data = await convertResult(resp);
};

const handlePostOrder = async (ticker: string, orderType: OrderType) => {
  const resp = await fetch(
    `/api/broker/place-order/?ticker=${ticker}&orderType=${orderType}`,
    { method: "POST" }
  );
  const data = await convertResult(resp);
};

export const handleBuyOrder = (ticker: string) =>
  handlePostOrder(ticker, "buy");
export const handleSellOrder = (ticker: string) =>
  handlePostOrder(ticker, "sell");

export const handleDeleteOrder = async (order_id: string) => {
  const resp = await fetch(`/api/broker/delete-order/?orderId=${order_id}`, {
    method: "DELETE",
  });
  const data = await convertResult(resp);
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
