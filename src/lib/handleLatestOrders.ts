import { convertResult } from "../util";
import fetch from "node-fetch";

/* TODO Once we have a state management system, 
  use "all orders" stored there. Do not
   request all orders from here. */
export const handleGetOrders = async () => {
  const result = await fetch(`/api/broker/orders`);
  const data = await convertResult(result);
  return data.orders;
};

export const getLatestOrders = async () => {
  const orders = await handleGetOrders();
  return orders.splice(0, 3);
};
