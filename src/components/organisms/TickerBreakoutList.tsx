import Table from "rc-table";
import {
  BreakoutDataType,
  ExistingBreakoutDataType,
} from "../../db/breakoutsEntity";
import { BreakoutStoreType } from "../../store/breakoutsStore";

interface BreakoutData {
  image: string;
  tickerRef: string;
  relativeStrength: number;
  breakoutValue: number;
  configRef: string;
  dailyRunRef: string;
  timestamp: string;
  _ref: string;
}

interface Props {
  data: BreakoutData[];
}

const TickerBreakoutList = ({ data }: Props) => {
  const columns = [
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp: string) => {
        const isoDate = new Date(timestamp).toISOString().split("T");
        return <div style={{ textAlign: "right" }}>{isoDate[0]}</div>;
      },
    },
    {
      title: "Breakout Value",
      dataIndex: "breakoutValue",
      key: "breakoutValue",
      width: 200,
      render: (breakoutValue: string) => (
        <div style={{ textAlign: "right" }}>
          {parseFloat(breakoutValue).toFixed(2)}
        </div>
      ),
    },
    {
      title: "Relative Strength",
      dataIndex: "relativeStrength",
      key: "relativeStrength",
      width: 200,
      render: (relativeStrength: string) => (
        <div style={{ textAlign: "right" }}>
          {parseFloat(relativeStrength).toFixed(2)}
        </div>
      ),
    },
  ];

  const renderTitle = () => {
    return <h2>Breakouts</h2>;
  };

  const renderFooter = () => {
    return <hr />;
  };

  return (
    <div>
      TickerBreakoutList
      <Table
        columns={columns}
        data={data}
        rowKey={({ id }: { id: string }) => id}
        title={renderTitle}
        footer={renderFooter}
      />
    </div>
  );
};

export default TickerBreakoutList;
