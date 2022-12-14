import Table from "rc-table";

export interface BreakoutData {
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
  titleText?: string;
}

const TickerBreakoutList = ({ data, titleText }: Props) => {
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
      title: "Value",
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
    return <h2>{titleText ? titleText : "Breakouts"}</h2>;
  };

  const renderFooter = () => {
    return <hr />;
  };

  return (
    <Table
      columns={columns}
      data={data}
      rowKey={({ _ref }: { _ref: string }) => _ref}
      title={renderTitle}
      footer={renderFooter}
    />
  );
};

export default TickerBreakoutList;
