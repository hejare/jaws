import getNextJSConfig from "next/config";
import Button from "../atoms/buttons/Button";
import Table from "../atoms/Table";
import { DailyRunStatus } from "../../db/dailyRunsMeta";
import Ticker from "../atoms/Ticker";
import NavButton from "../atoms/buttons/NavButton";

export type PartialBreakoutDataType = {
  image: string;
  tickerRef: string;
  relativeStrength: number;
  breakoutValue: number;
  configRef: string;
};
// const cancellableStatus = [DailyRunStatus.INITIATED] as const;
const nonCancellableStatus = [DailyRunStatus.COMPLETED] as const;

const { publicRuntimeConfig } = getNextJSConfig();
const { IMAGE_SERVICE_BASE_URL = "[NOT_DEFINED_IN_ENV]" } = publicRuntimeConfig;

interface Props {
  data: PartialBreakoutDataType[];
}
const BreakoutsList = ({ data }: Props) => {
  const renderTitle = () => {
    return <h2>Breakouts</h2>;
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
      title: "Ticker",
      dataIndex: "tickerRef",
      key: "tickerRef",
      width: 100,
      render: (tickerRef: string) => <Ticker id={tickerRef} />,
    },
    {
      title: "Relative Strength",
      dataIndex: "relativeStrength",
      key: "relativeStrength",
      width: 200,
    },
    {
      title: "Breakout Value",
      dataIndex: "breakoutValue",
      key: "breakoutValue",
      width: 200,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 50,
      render: (image: string) => (
        <img src={`${IMAGE_SERVICE_BASE_URL as string}/${image}`} />
      ),
    },
    {
      title: "Operations",
      dataIndex: "",
      key: "operations",
      render: (item: any) => {
        console.log(item);
        return (
          <>
            <Button
              onClick={() => console.log("Try and BUY this breakout...:", item)}
            >
              Place Order
            </Button>
            <NavButton
              href={`https://www.tradingview.com/symbols/${
                item.symbol as string
              }`}
            >
              TradeView
            </NavButton>
          </>
        );
      },
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

export default BreakoutsList;
