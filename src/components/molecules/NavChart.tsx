import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type NavStatsResult = {
  status: string;
  data: [
    {
      nav: number;
      date: string;
    },
  ];
};

type NavStat = {
  nav: number;
  date: string;
};

const RechartNavChart = () => {
  const [navStats, setNavStats] = useState<NavStat[]>([]);

  useEffect(() => {
    const today = new Date();
    const start = new Date(Date.UTC(today.getFullYear(), 0, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(today.getFullYear(), 11, 31, 0, 0, 0, 0));
    const fetchData = async () => {
      const result = await fetch(
        `/api/data/daily-stats?startDate=${start.toISOString()}&endDate=${end.toISOString()}`,
      );
      const json = (await result.json()) as NavStatsResult;
      setNavStats(
        json.data.map((navStatResult) => ({
          nav: navStatResult.nav,
          date: new Date(Date.parse(navStatResult.date))
            .toISOString()
            .split("T")[0],
        })),
      );
      return result;
    };
    void fetchData();
  }, []);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, NameType>) => {
    if (active && payload && payload.length && payload[0].value) {
      return (
        <div style={{ backgroundColor: "#000", padding: 10, borderRadius: 20 }}>
          <p>{label}</p>
          <p>{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <LineChart
      width={600}
      height={400}
      data={navStats}
      margin={{ top: 50, right: 20, left: 20, bottom: 50 }}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        marginTop: "20px",
      }}
    >
      <XAxis dataKey="date" angle={-45} textAnchor="end" />
      <YAxis dataKey="nav" />
      <Tooltip
        content={
          <CustomTooltip
            active={undefined}
            payload={undefined}
            label={undefined}
          />
        }
      />
      <CartesianGrid stroke="#d0e0e0" />
      <Line type="monotone" dataKey="nav" stroke="#ff7300" yAxisId={0} />
    </LineChart>
  );
};

export default RechartNavChart;
