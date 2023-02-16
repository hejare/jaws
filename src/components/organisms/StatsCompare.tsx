import { getDateString, ONE_DAY_IN_MS } from "@jaws/lib/helpers";
import { getDailyStats, getTickerBars } from "@jaws/services/backendService";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import PercentageDisplay from "../molecules/PercentageDisplay";

const Wrapper = styled.div<{ loading: boolean }>`
  display: flex;
  margin-bottom: 15px;
  opacity: ${(props) => (props.loading ? 0.7 : 1)};
`;

const StatWrapper = styled.div`
  display: flex;
  gap: 5px;
  padding: 0 10px;
  border-right: 1px solid #888;

  &:last-child {
    border-right: none;
  }
`;

export function StatsCompare() {
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [stats, setStats] = useState<{ ticker: string; nav: number }[]>([]);

  const ranges = useMemo(getRanges, []);

  if (!dateRange) {
    setDateRange(ranges[0][1]);
  }

  useEffect(() => {
    if (!dateRange) {
      return;
    }

    setIsLoading(true);

    void Promise.all([
      getDailyStats(dateRange),
      getTickerBars({ symbols: ["SPY", "SDY", "IWM"], ...dateRange }),
    ]).then(([jawsStats, tickerStats]) => {
      setIsLoading(false);
      setStats([
        {
          ticker: "Jaws NAV",
          nav:
            (jawsStats[jawsStats.length - 1].nav / jawsStats[0].nav - 1) * 100,
        },
        ...Object.entries(tickerStats).map(([ticker, bars]) => {
          return {
            ticker,
            nav: (bars[bars.length - 1].c / bars[0].c - 1) * 100,
          };
        }),
      ]);
    });
  }, [dateRange]);

  return (
    <Wrapper loading={isLoading}>
      <>
        <label>
          <select
            disabled={isLoading}
            onChange={(e: any) => {
              setDateRange(ranges[e.target.value][1]);
            }}
          >
            {ranges.map(([name], i) => (
              <option value={i} key={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        {stats.map((stat) => (
          <StatWrapper key={stat.ticker}>
            <span>{stat.ticker} • </span>
            <PercentageDisplay value={stat.nav} indicatorOrigin={0} />
          </StatWrapper>
        ))}
      </>
    </Wrapper>
  );
}

type RangeName =
  | "Yesterday"
  | "1 week"
  | "2 weeks"
  | "1 month"
  | "2 months"
  | "3 months";

type DateRanges = [RangeName, { startDate: string; endDate: string }][];

function getRanges(): DateRanges {
  const yesterdayMs = Number(new Date()) - ONE_DAY_IN_MS;

  const ranges = {
    Yesterday: new Date(yesterdayMs - ONE_DAY_IN_MS),
    "1 week": new Date(yesterdayMs - 7 * ONE_DAY_IN_MS),
    "2 weeks": new Date(yesterdayMs - 2 * 7 * ONE_DAY_IN_MS),
    "1 month": new Date(yesterdayMs - 30 * ONE_DAY_IN_MS),
    "2 months": new Date(yesterdayMs - 60 * ONE_DAY_IN_MS),
    "3 months": new Date(yesterdayMs - 90 * ONE_DAY_IN_MS),
  };

  return Object.entries(ranges).map(([name, date]) => [
    name as RangeName,
    {
      startDate: getDateString({ date, withDashes: true }),
      endDate: getDateString({ date: new Date(yesterdayMs), withDashes: true }),
    },
  ]);
}
