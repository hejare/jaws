import { useEffect, useState, useCallback } from "react";
import { handleGetTrades } from "../../services/brokerService";

export interface Order {
  symbol: string;
  status: string;
  notional: string;
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

  return (
    orders && (
      <>
        {orders.map((order) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "7px",
            }}
          >
            <div>{order.symbol}</div>
            <div>{order.status}</div>
            <div>{order.notional}</div>
          </div>
        ))}
      </>
    )
  );
};

export default OrderList;
