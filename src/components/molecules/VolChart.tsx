import { calculateVolatility } from "@jaws/lib/helpers";
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
  volatility: number;
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

  const [volatilityPeriod, setVolatilityPeriod] = useState(20);
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
      const jawsVolStats = [];
      let i = 0;
      while (i < navStats.length - volatilityPeriod) {
        const volatility = calculateVolatility(
          navStats
            .slice(i, volatilityPeriod + i)
            .map((jawsStat) => jawsStat.close),
          volatilityPeriod,
        );
        const date = new Date(Date.parse(navStats[volatilityPeriod + i].date))
          .toISOString()
          .split("T")[0];
        jawsVolStats.push({
          volatility,
          date,
        });
        i++;
      }

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
          let i = 0;
          while (i < tickerStats.length - volatilityPeriod) {
            const volatility = calculateVolatility(
              tickerStats
                .slice(i, volatilityPeriod + i)
                .map((indexStat) => indexStat.c),
              volatilityPeriod,
            );
            const date = new Date(
              Date.parse(tickerStats[volatilityPeriod + i].t),
            )
              .toISOString()
              .split("T")[0];
            acc[accTicker].push({
              volatility,
              date,
            });
            i++;
          }
          return acc;
        },
        {
          spy: [] as IndexStat[],
          vthr: [] as IndexStat[],
          qqq: [] as IndexStat[],
        },
      );

      // Merge data into Recharts format
      const chartData = jawsVolStats
        // filter out dates that are bigger than the last date of all the indexes
        .filter((navStats) => {
          return (
            Date.parse(navStats.date) > Date.parse(spy[0].date) &&
            Date.parse(navStats.date) > Date.parse(vthr[0].date) &&
            Date.parse(navStats.date) > Date.parse(qqq[0].date)
          );
        })
        .map((navStat, i) => {
          return {
            date: navStat.date,
            jaws: navStat.volatility,
            spy: findLastClose(spy, navStat.date).volatility,
            vthr: findLastClose(vthr, navStat.date).volatility,
            qqq: findLastClose(qqq, navStat.date).volatility,
          };
        });
      setChartData(chartData);
      return result;
    };
    void fetchData();
  }, []);

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
            Jaws: {payload[0].value.toFixed(4)}
          </div>
          <div>SPY: {payload[0].payload.spy.toFixed(4)}</div>
          <div>QQQ: {payload[0].payload.qqq.toFixed(4)}</div>
          <div>VTHR: {payload[0].payload.vthr.toFixed(4)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <h2>Volatility of Sharkster compared to indices</h2>
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
