import { useEffect, useState, useCallback } from "react";
import { handleGetTrades } from "../../services/brokerService";

export interface Order {
  symbol: string;
  status: string;
  notional: string;
  created_at: string;
  filled_at?: string;
  side: string;
  order_id: string;
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
              <div>{order.status}</div>
              <div>{order.notional}</div>
              <div> Created: {convertDateString(order.created_at)}</div>
              <div>
                {"Filled: "}
                {order.filled_at ? convertDateString(order.filled_at) : ""}
              </div>
              <div>{order.side}</div>
            </div>
          );
        })}
      </>
    )
  );
};

export default OrderList;
