import fetch from "node-fetch";
import { Order } from "../components/organisms/OrderList";
import { convertResult, hostUrl } from "../util";

const baseUrl = hostUrl()

export const brokerService = async () => {
  const resp = await fetch(`${baseUrl}/api/broker/place-order`);
  const data = await convertResult(resp);
};

export const handlePostOrder = async (ticker: string) => {
  const resp = await fetch(
    `${baseUrl}/api/broker/place-order/?ticker=${ticker}`,
    { method: "POST" },
  );
  const data = await convertResult(resp);
};

export const handleGetTrades = async () => {
  const resp = await fetch(`${baseUrl}/api/broker/get-orders`);
  const data = await convertResult(resp);
  const response = data.orders.map((order: Order) => {
    const { symbol, status, notional, created_at, filled_at, side } = order;
    return { symbol, status, notional, created_at, filled_at, side };
  });
  return response;
};
