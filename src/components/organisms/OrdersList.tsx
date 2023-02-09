import { handleDeleteOrder } from "@jaws/lib/brokerHandler";
import { getDateTime } from "@jaws/lib/helpers";
import { TableDataRow } from "@jaws/lib/hooks/useGetOrdersTableData";
import { Side } from "@jaws/services/alpacaMeta";
import { RawOrder } from "@master-chief/alpaca/@types/entities";
import { ColumnsType } from "rc-table/lib/interface";
import Button from "../atoms/buttons/Button";
import Table from "../atoms/Table";
import PercentageDisplay from "../molecules/PercentageDisplay";
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

type CancellableOrderStatus = (typeof cancellableOrderStatus)[number];

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

type NonCancellableOrderStatus = (typeof nonCancellableOrderStatus)[number];

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

interface Props {
  data: RawOrder[];
}

const OrdersList = ({ data }: Props) => {
  const renderTitle = () => {
    return <h2>Order list</h2>;
  };

  const renderFooter = () => {
    return <hr />;
  };

  const columns: ColumnsType<TableDataRow> = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      width: 100,
    },
    {
      title: "Side",
      dataIndex: "side",
      key: "side",
      width: 100,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
    },
    {
      title: "Quantity",
      key: "qty",
      width: 100,
      render: (_, { qty }) => qty,
    },
    {
      title: "Price",
      key: "price",
      width: 200,
      render: (_, { filled_avg_price, limit_price, stop_price }) => {
        const price = filled_avg_price || limit_price || stop_price;

        if (price) {
          return <PriceDisplay value={parseFloat(price)} />;
        } else {
          // un-filled market order
          return "";
        }
      },
    },
    {
      title: "Value",
      key: "value",
      width: 200,
      render: (_, { filled_avg_price, limit_price, qty, stop_price }) => {
        const price = filled_avg_price || limit_price || stop_price;

        if (price) {
          return (
            data && <PriceDisplay value={parseFloat(price) * parseFloat(qty)} />
          );
        } else {
          // un-filled market order
          return "";
        }
      },
    },
    {
      title: "P/L",
      key: "profit_loss",
      width: 100,
      render: (_, { profit }) =>
        profit ? <PriceDisplay value={profit} indicatorOrigin={0} /> : "",
    },
    {
      title: "P/L %",
      key: "profit_loss_percentage",
      width: 50,
      render: (_, { profitPercentage }) =>
        profitPercentage ? (
          <PercentageDisplay value={profitPercentage} indicatorOrigin={0} />
        ) : (
          ""
        ),
    },
    {
      title: "SL",
      key: "stop_loss_type",
      width: 0,
      render: (_, { tradeStatus }) => tradeStatus,
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
      key: "operations",
      render: (_, order) => {
        const disabled = (
          nonCancellableOrderStatus as unknown as string[]
        ).includes(order.status);
        return disabled ? (
          ""
        ) : (
          <Button onClick={() => handleDeleteOrder(order.id)}>Cancel</Button>
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
