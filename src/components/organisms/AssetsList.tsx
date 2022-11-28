import { INDICATOR } from "../../lib/priceHandler";
import Table, { Operations } from "../atoms/Table";
import PriceDisplay, {
  PRICE_DISPLAY_VARIANTS,
} from "../molecules/PriceDisplay";
import PercentageDisplay from "../molecules/PercentageDisplay";
import TradeViewButton from "../atoms/buttons/TradeViewButton";
import QuantityDisplay, {
  QUANTITY_DISPLAY_VARIANTS,
} from "../molecules/QuantityDisplay";

type AssetssListData = {
  symbol: string;
};
interface Props {
  data: AssetssListData[];
}
const AssetssList = ({ data }: Props) => {
  const renderTitle = () => {
    return <h2>Assets</h2>;
  };

  const renderFooter = () => {
    return (
      <>
        <hr />
      </>
    );
  };

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      width: 200,
    },
    {
      title: "Value",
      dataIndex: "",
      key: "value",
      width: 200,
      render: ({ avg_entry_price, qty }: any) => (
        <PriceDisplay value={parseFloat(avg_entry_price) * parseFloat(qty)} />
      ),
    },
    {
      title: "Value Diff",
      dataIndex: "",
      key: "valueDiff",
      width: 200,
      render: ({ avg_entry_price, current_price, qty }: any) => {
        const diff =
          (parseFloat(current_price) - parseFloat(avg_entry_price)) *
          parseFloat(qty);
        return (
          <PriceDisplay
            value={diff}
            indicator={
              diff > 0
                ? INDICATOR.POSITIVE
                : diff === 0
                ? INDICATOR.NEUTRAL
                : INDICATOR.NEGATIVE
            }
          />
        );
      },
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      width: 200,
      render: (quantity: string) => (
        <QuantityDisplay value={parseFloat(quantity)} />
      ),
    },
    {
      title: "Entry price",
      dataIndex: "",
      key: "avg_entry_price",
      width: 200,
      render: ({ avg_entry_price }: any) => (
        <PriceDisplay value={parseFloat(avg_entry_price)} />
      ),
    },
    {
      title: "Price",
      dataIndex: "",
      key: "current_price",
      width: 200,
      render: ({ current_price }: any) => (
        <PriceDisplay value={parseFloat(current_price)} />
      ),
    },
    {
      title: "Change",
      dataIndex: "change_today",
      key: "change_today",
      width: 200,
      render: (change_today: any) => (
        <PercentageDisplay
          indicator={
            change_today > 0
              ? INDICATOR.POSITIVE
              : change_today === 0
              ? INDICATOR.NEUTRAL
              : INDICATOR.NEGATIVE
          }
          value={parseFloat(change_today) * 100}
        />
      ),
    },
    {
      title: "Operations",
      dataIndex: "",
      key: "operations",
      className: "operations",
      render: ({ symbol }: any) => (
        <Operations>
          <TradeViewButton symbol={symbol}>TradeView</TradeViewButton>
        </Operations>
      ),
    },
  ];

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

export default AssetssList;
