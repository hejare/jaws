import Button from "../atoms/buttons/Button";
import Table from "../atoms/Table";
import { DailyRunStatus } from "../../db/dailyRunsMeta";
import NavButton from "../atoms/buttons/NavButton";

// const cancellableStatus = [DailyRunStatus.INITIATED] as const;
const nonCancellableStatus = [DailyRunStatus.COMPLETED] as const;

type DailyRunsListData = {
  runId: string;
  status: string;
  initiated: string;
  ended: string;
  duration: number;
};
interface Props {
  data: DailyRunsListData[];
}
const DailyRunsList = ({ data }: Props) => {
  const renderTitle = () => {
    return <h2>Daily Runs</h2>;
  };

  const renderFooter = () => {
    return (
      <>
        <hr />
        The <u>Duration</u> is the run time for Sharksters to identify
        breakouts, not including render of images and network latencies.
      </>
    );
  };

  const columns = [
    {
      title: "RunId",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (runId: string) => (
        <NavButton href={`daily-runs/${runId}`}>{runId}</NavButton>
      ),
    },
    {
      title: "Initiated at",
      dataIndex: "initiated",
      key: "initiated",
      width: 200,
    },
    {
      title: "Ended at",
      dataIndex: "ended",
      key: "ended",
      width: 200,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 50,
      render: (duration: number) => <>{(duration / 1).toFixed(2)} min</>,
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
      render: (item: any) => {
        const disabled = (nonCancellableStatus as unknown as string[]).includes(
          item.status,
        );
        return disabled ? (
          ""
        ) : (
          <Button
            onClick={() =>
              console.log("Try and cancel this daily run...:", item.orderId)
            }
          >
            Cancel
          </Button>
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

export default DailyRunsList;
