import { useEffect, useState } from "react";
import {
  handleDeleteOrder,
  handleGetTrades,
} from "../../services/brokerService";
import { getDateTime } from "../../lib/helpers";
import Button from "../atoms/buttons/Button";
import Table from "../atoms/Table";

export type OrderType = "buy" | "sell";

const cancellableOrderStatus = [
  "new",
  "partially_filled",
  "done_for_day",
  "accepted",
  "pending_new",
  "accepted_for_bidding",
] as const;

type CancellableOrderStatus = typeof cancellableOrderStatus[number];

const nonCancellableOrderStatus = [
  "filled",
  "canceled",
  "expired",
  "replaced",
  "pending_cancel",
  "pending_replace",
  "stopped",
  "rejected",
  "suspended",
  "calculated",
] as const;

type NonCancellableOrderStatus = typeof nonCancellableOrderStatus[number];

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

const OrdersList = () => {
  const [orders, setOrders] = useState(Array<Order>);

  useEffect(() => {
    handleGetTrades()
      .then((data) => setOrders(data))
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const renderTitle = () => {
    return <h2>Order list</h2>;
  };

  const renderFooter = () => {
    return <hr />;
  };

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      width: 100,
    },
    {
      title: "Created at",
      dataIndex: "created",
      key: "created",
      width: 200,
    },
    {
      title: "Filled at",
      dataIndex: "filled",
      key: "filled",
      width: 200,
    },
    {
      title: "Notional",
      dataIndex: "notional",
      key: "notional",
      width: 50,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
    },
    {
      title: "Operations",
      dataIndex: "",
      key: "operations",
      render: (data: any) => {
        const disabled = (
          nonCancellableOrderStatus as unknown as string[]
        ).includes(data.status);
        return disabled ? (
          ""
        ) : (
          <Button onClick={() => handleDeleteOrder(data.orderId)}>
            Cancel
          </Button>
        );
      },
    },
  ];

  const data = orders.map((order: any) => {
    return {
      symbol: order.symbol,
      created: getDateTime(order.created_at),
      filled: order.filled_at
        ? getDateTime(order.filled_at)
        : nonCancellableOrderStatus.includes(order.status)
        ? "n/a"
        : "not yet",
      notional: order.notional,
      status: order.status,
      orderId: order.id,
    };
  });

  return (
    <Table
      columns={columns}
      data={data}
      rowKey={() => Math.random()}
      title={renderTitle}
      footer={renderFooter}
    />
  );
};

export default OrdersList;
