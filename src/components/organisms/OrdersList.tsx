import { useEffect, useState } from "react";
import { handleDeleteOrder, handleGetTrades } from "../../lib/brokerHandler";
import { getDateTime } from "../../lib/helpers";
import Button from "../atoms/buttons/Button";
import Table from "../atoms/Table";
import PriceDisplay from "../molecules/PriceDisplay";

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

type OrdersListData = {
  symbol: string;
};
interface Props {
  data: OrdersListData[];
}

const OrdersList = ({ data }: Props) => {
  // const [orders, setOrders] = useState(Array<Order>);

  // useEffect(() => {
  //   handleGetTrades()
  //     .then((data) => setOrders(data))
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // }, []);

  console.log(data);

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
      title: "Type",
      dataIndex: "side",
      key: "side",
      width: 100,
    },
    {
      title: "Quantity",
      dataIndex: "",
      key: "qty",
      width: 100,
      render: ({ notional, qty }: { notional?: string; qty: string }) =>
        notional ? notional : qty,
    },
    {
      title: "Price",
      dataIndex: "",
      key: "price",
      width: 200,
      render: ({
        filled_avg_price,
        limit_price,
      }: {
        filled_avg_price?: string;
        limit_price: string;
      }) => {
        console.log("price ", filled_avg_price);
        if (filled_avg_price) {
          return <PriceDisplay value={parseFloat(filled_avg_price)} />;
        } else {
          return <PriceDisplay value={parseFloat(limit_price)} />;
        }
      },
    },
    {
      title: "Value",
      dataIndex: "",
      key: "value",
      width: 200,
      render: ({
        filled_avg_price: price,
        notional,
        qty,
      }: {
        filled_avg_price: string;
        notional?: string;
        qty: string;
      }) => {
        // console.log(qty);
        // console.log(notional);

        return (
          data && (
            <PriceDisplay
              value={parseFloat(price) * parseFloat(notional ? notional : qty)}
            />
          )
        );
      },
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created",
      width: 200,
      render: (createAt: string) => getDateTime(createAt),
    },
    {
      title: "Filled at",
      dataIndex: "filled_at",
      key: "filled",
      width: 200,
      render: (filledAt: string) => getDateTime(filledAt),
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

  // const data = orders.map((order: any) => {
  //   return {
  //     symbol: order.symbol,
  //     created: getDateTime(order.created_at),
  //     filled: order.filled_at
  //       ? getDateTime(order.filled_at)
  //       : nonCancellableOrderStatus.includes(order.status)
  //       ? "n/a"
  //       : "not yet",
  //     notional: order.notional,
  //     status: order.status,
  //     orderId: order.id,
  //   };
  // });

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
