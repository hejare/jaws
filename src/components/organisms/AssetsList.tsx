import { PortfolioTableAsset } from "@jaws/lib/hooks/useGetTableData";
import { INDICATOR } from "@jaws/lib/priceHandler";
import { ColumnsType } from "rc-table/lib/interface";
import NavButton from "../atoms/buttons/NavButton";
import TradeViewButton from "../atoms/buttons/TradeViewButton";
import Table, { Operations } from "../atoms/Table";
import PercentageDisplay from "../molecules/PercentageDisplay";
import PriceDisplay from "../molecules/PriceDisplay";
import QuantityDisplay from "../molecules/QuantityDisplay";

interface Props {
  data: PortfolioTableAsset[];
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

  const columns: ColumnsType<PortfolioTableAsset> = [
    {
      title: "Symbol",
      key: "symbol",
      width: 200,
      render: (_, { ticker }) => (
        <NavButton href={`/tickers/${ticker}`}>{ticker}</NavButton>
      ),
    },
    {
      title: "Value",
      key: "value",
      width: 200,
      render: (_, { value }) => <PriceDisplay value={value} />,
    },
    {
      title: "% of portfolio",
      key: "percent_of_total_assets",
      width: 200,
      render: (_, { percentOfTotalAssets }) => (
        <PercentageDisplay value={percentOfTotalAssets} />
      ),
    },
    {
      title: "Value Diff",
      key: "valueDiff",
      width: 200,
      render: (_, { avgEntryPrice, currentPrice, quantity }) => {
        const diff = (currentPrice - avgEntryPrice) * quantity;
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
      key: "qty",
      width: 200,
      render: (_, { quantity }) => <QuantityDisplay value={quantity} />,
    },
    {
      title: "Entry price",
      dataIndex: "",
      key: "avgEntryPrice",
      width: 200,
      render: (_, { avgEntryPrice }) => <PriceDisplay value={avgEntryPrice} />,
    },
    {
      title: "Current price",
      key: "current_price",
      width: 200,
      render: (_, { currentPrice }) => <PriceDisplay value={currentPrice} />,
    },
    {
      title: "MA",
      key: "ma",
      width: 130,
      render: (_, { movingAvg }) => (
        <PriceDisplay value={movingAvg}></PriceDisplay>
      ),
    },
    {
      title: "Change today",
      dataIndex: "change_today",
      width: 200,
      render: (_, { changeToday }) => (
        <PercentageDisplay
          indicator={
            changeToday > 0
              ? INDICATOR.POSITIVE
              : changeToday === 0
              ? INDICATOR.NEUTRAL
              : INDICATOR.NEGATIVE
          }
          value={changeToday * 100}
        />
      ),
    },
    {
      title: "Change since entry",
      key: "change_since_entry",
      width: 200,
      render: (_, { changeSinceEntry }) => (
        <PercentageDisplay
          indicator={
            changeSinceEntry > 0
              ? INDICATOR.POSITIVE
              : changeSinceEntry === 0
              ? INDICATOR.NEUTRAL
              : INDICATOR.NEGATIVE
          }
          value={changeSinceEntry * 100}
        />
      ),
    },

    {
      title: "Days in trade",
      key: "days_in_trade",
      render: (_, { daysInTrade }) => daysInTrade,
    },

    {
      title: "Stop loss",
      key: "stoploss",
      render: (_, { stopLossType }) => stopLossType,
    },
    {
      title: "SL Price",
      key: "stoploss_price",
      render: (_, { stopLossPrice }) => {
        return <PriceDisplay value={stopLossPrice}></PriceDisplay>;
      },
    },
    {
      title: "Profit taken",
      key: "partial_profit_taken",
      render: (_, { takenPartialProfit }) => (takenPartialProfit ? "✅" : ""),
    },
    {
      title: "Operations",
      key: "operations",
      className: "operations",
      render: (_, { ticker }) => (
        <Operations>
          <TradeViewButton symbol={ticker}>TradeView</TradeViewButton>
        </Operations>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      rowKey={({ breakoutRef }: { breakoutRef: string }) => breakoutRef}
      title={renderTitle}
      footer={renderFooter}
    />
  );
};

export default AssetssList;
