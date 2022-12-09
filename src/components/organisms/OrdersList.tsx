import { handleDeleteOrder } from "../../lib/brokerHandler";
import { getDateTime } from "../../lib/helpers";
import { Side } from "../../services/alpacaMeta";
import Button from "../atoms/buttons/Button";
import Table from "../atoms/Table";
import PriceDisplay from "../molecules/PriceDisplay";

// statuses from apaca:
const cancellableOrderStatus = [
  "new",
  "partially_filled",
  "done_for_day",
  "accepted",
  "pending_new",
  "accepted_for_bidding",
] as const;

type CancellableOrderStatus = typeof cancellableOrderStatus[number];

// statuses from alpaca:
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
  side: Side;
}

type OrdersListData = {
  symbol: string;
};
interface Props {
  data: OrdersListData[];
}

const OrdersList = ({ data }: Props) => {
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
        filled_avg_price: avgPrice,
        limit_price: limitPrice,
      }: {
        filled_avg_price?: string;
        limit_price: string;
      }) => {
        if (avgPrice) {
          return <PriceDisplay value={parseFloat(avgPrice)} />;
        } else {
          return <PriceDisplay value={parseFloat(limitPrice)} />;
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
        limit_price: limitPrice,
        notional,
        qty,
      }: {
        filled_avg_price: string;
        notional?: string;
        limit_price: string;
        qty: string;
      }) => {
        if (price) {
          return (
            data && (
              <PriceDisplay
                value={
                  parseFloat(price) * parseFloat(notional ? notional : qty)
                }
              />
            )
          );
        } else {
          return (
            data && (
              <PriceDisplay
                value={
                  parseFloat(limitPrice) * parseFloat(notional ? notional : qty)
                }
              />
            )
          );
        }
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
          <Button onClick={() => handleDeleteOrder(data.id)}>Cancel</Button>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      rowKey={({ id }: { id: string }) => id}
      title={renderTitle}
      footer={renderFooter}
    />
  );
};

export default OrdersList;
