import { getTickerBars } from "@jaws/services/backendService";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
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

type IndexStat = {
  ticker: string;
  close: number;
  date: string;
};

type ChartData = {
  date: string;
  jaws: number;
  spy: number;
  vthr: number;
  qqq: number;
};

const RechartNavChart = () => {
  const today = new Date();
  const startDate = new Date(Date.UTC(today.getFullYear(), 0, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(today.getFullYear(), 11, 31, 0, 0, 0, 0));

  const [chartData, setChartData] = useState<ChartData[]>([]);

  const findLastClose = (indexStat: IndexStat[], date: string): IndexStat => {
    let index = indexStat.find((i) => i.date === date);
    if (!index) {
      // Find previous close closest to and before navStat.date
      const spyStatBefore = indexStat
        .filter((index) => Date.parse(index.date) < Date.parse(date))
        .sort((a, b) => {
          const aDate = new Date(a.date);
          const bDate = new Date(b.date);
          return bDate.getTime() - aDate.getTime();
        });
      index = spyStatBefore[0];
    }
    return index;
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(
        `/api/data/daily-stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      );
      const json = (await result.json()) as NavStatsResult;
      const navStats = json.data.map((navStatResult) => ({
        ticker: "JAWS",
        close: navStatResult.nav,
        date: new Date(Date.parse(navStatResult.date))
          .toISOString()
          .split("T")[0],
      }));

      const yesterday = dayjs().subtract(1, "day");
      const { spy, vthr, qqq } = Object.entries(
        await getTickerBars({
          symbols: ["SPY", "VTHR", "QQQ"],
          startDate: startDate.toISOString().split("T")[0],
          endDate: yesterday.toISOString().split("T")[0],
        }),
      ).reduce(
        (acc, [ticker, tickerStats]) => {
          const accTicker = ticker.toLowerCase() as "spy" | "vthr" | "qqq";
          acc[accTicker] = tickerStats.map((indexStat) => ({
            ticker: ticker,
            close: indexStat.c,
            date: new Date(Date.parse(indexStat.t)).toISOString().split("T")[0],
          }));
          return acc;
        },
        {
          spy: [] as IndexStat[],
          vthr: [] as IndexStat[],
          qqq: [] as IndexStat[],
        },
      );

      const spyScalingFactor =
        navStats[0].close / findLastClose(spy, navStats[0].date).close;
      const vthrScalingFactor =
        navStats[0].close / findLastClose(vthr, navStats[0].date).close;
      const qqqScalingFactor =
        navStats[0].close / findLastClose(qqq, navStats[0].date).close;

      // Merge data into Recharts format
      const chartData = navStats.map((navStat) => {
        const spyStat = findLastClose(spy, navStat.date);
        const vthrStat = findLastClose(vthr, navStat.date);
        const qqqStat = findLastClose(qqq, navStat.date);

        return {
          date: navStat.date,
          jaws: navStat.close,
          spy: spyStat.close * spyScalingFactor,
          vthr: vthrStat.close * vthrScalingFactor,
          qqq: qqqStat.close * qqqScalingFactor,
        };
      });
      setChartData(chartData);
      return result;
    };
    void fetchData();
  }, []);

  const percentageCalculator = (close: number, comparedTo: number) => {
    return ((close / comparedTo - 1) * 100).toFixed(2);
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, NameType>) => {
    if (active && payload && payload.length && payload[0].value) {
      return (
        <div
          style={{
            fontSize: "0.7em",
            backgroundColor: "#000",
            padding: "2px 15px",
            borderRadius: 20,
          }}
        >
          <div>{label}</div>
          <div style={{ color: "#71b16b" }}>
            Jaws: {payload[0].value.toFixed(2)} (
            {percentageCalculator(payload[0].value, 100)} %)
          </div>
          <div>
            SPY: {payload[0].payload.spy.toFixed(2)} (
            {percentageCalculator(payload[0].payload.spy, 100)} %)
          </div>
          <div>
            QQQ: {payload[0].payload.qqq.toFixed(2)} (
            {percentageCalculator(payload[0].payload.qqq, 100)} %)
          </div>
          <div>
            VTHR: {payload[0].payload.vthr.toFixed(2)} (
            {percentageCalculator(payload[0].payload.vthr, 100)} %)
          </div>
        </div>
      );
    }
    return null;
  };

  const chartDataMin = Math.min(
    ...chartData.map((data) => data.jaws),
    ...chartData.map((data) => data.spy),
    ...chartData.map((data) => data.vthr),
    ...chartData.map((data) => data.qqq),
  );

  const chartDataMax = Math.max(
    ...chartData.map((data) => data.jaws),
    ...chartData.map((data) => data.spy),
    ...chartData.map((data) => data.vthr),
    ...chartData.map((data) => data.qqq),
  );

  return (
    <>
      <h2>NAV performace of Sharkster compared to indeces</h2>
      <LineChart
        width={1000}
        height={800}
        data={chartData}
        margin={{ top: 50, right: 20, left: 20, bottom: 50 }}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          margin: "20px 20px",
        }}
      >
        <XAxis dataKey="date" angle={-45} textAnchor="end" />
        <YAxis
          dataKey="jaws"
          type="number"
          domain={[chartDataMin * 0.999, chartDataMax * 1.001]}
          tickFormatter={(tick: any, index: number) =>
            tick.toFixed(2).toString()
          }
        />
        <Legend verticalAlign="top" />
        <Tooltip
          offset={40}
          content={
            <CustomTooltip
              active={undefined}
              payload={undefined}
              label={undefined}
            />
          }
        />
        <CartesianGrid stroke="#d0e0e0" />
        {chartData.length > 0 && (
          <>
            <Line
              name="JAWS"
              type="monotone"
              dataKey="jaws"
              stroke="#71b16b"
              yAxisId={0}
              activeDot={{ r: 8 }}
            />
            <Line
              name="SPY"
              type="monotone"
              dataKey="spy"
              stroke="#8884d8"
              yAxisId={0}
            />
            <Line
              name="VTHR"
              type="monotone"
              dataKey="vthr"
              stroke="#FF0000"
              yAxisId={0}
            />
            <Line
              name="QQQ"
              type="monotone"
              dataKey="qqq"
              stroke="#000000"
              yAxisId={0}
            />
          </>
        )}
      </LineChart>
    </>
  );
};

export default RechartNavChart;
