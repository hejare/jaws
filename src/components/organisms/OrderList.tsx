import { useEffect, useState } from "react";
import { handleDeleteOrder, handleGetTrades } from "../../services/brokerService";


export type OrderType = 'buy' | 'sell';

const cancellableOrderStatus = ['new', 'partially_filled', 'done_for_day', 'accepted', 'pending_new', 'accepted_for_bidding'] as const;
type CancellableOrderStatus = (typeof cancellableOrderStatus)[number]
const nonCancellableOrderStatus = ['filled', 'canceled', 'expired', 'replaced', 'pending_cancel', 'pending_replace', 'stopped', 'rejected', 'suspended', 'calculated'] as const;
type NonCancellableOrderStatus = (typeof nonCancellableOrderStatus)[number]
export type OrderStatus = CancellableOrderStatus | NonCancellableOrderStatus;

export interface Order {
  symbol: string;
  id: string;
  status: OrderStatus;
  notional: string;
  created_at: string;
  filled_at?: string;
  side: OrderType;
}

const OrderList = () => {
  const [orders, setOrders] = useState(Array<Order>);

  useEffect(() => {
    const fetchData = async () => {
      const data = await handleGetTrades();
      setOrders(data);
    };
    fetchData();
  }, []);

  const convertDateString = (date: string) => {
    const createdAtConvertedArray = date.split("T");
    return createdAtConvertedArray[0];
  };

  return (
    orders && (
      <>
        {orders.map((order, i) => {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "7px",
                border: "0.5px solid black",
                padding: "1em",
              }}
            >
              <div>{order.symbol}</div>
              <div>{order.side.toLocaleUpperCase()}</div>
              <div> ${order.notional}</div>
              <div>Status: {order.status}</div>
              <div> Created: {convertDateString(order.created_at)}</div>
              <div>
                {"Filled: "}
                {order.filled_at ? convertDateString(order.filled_at) : ""}
              </div>
              <button disabled={(nonCancellableOrderStatus as unknown as string[]).includes(order.status)} onClick={() => handleDeleteOrder(order.id)}>Delete Order</button>

            </div>
          );
        })}
      </>
    )
  );
};

export default OrderList;
