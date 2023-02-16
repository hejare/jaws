import { getDateString, ONE_DAY_IN_MS } from "@jaws/lib/helpers";
import { getDailyStats } from "@jaws/services/backendService";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import PercentageDisplay from "../molecules/PercentageDisplay";

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 15px;
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

  const [stats, setStats] = useState<{ name: string; nav: number }[]>([]);

  const ranges = useMemo(getRanges, []);

  if (!dateRange) {
    setDateRange(ranges[0][1]);
  }

  useEffect(() => {
    if (!dateRange) {
      return;
    }

    setStats([]);

    void Promise.all([getDailyStats(dateRange)]).then(([jawsStats]) => {
      setStats([
        {
          name: "Jaws",
          nav:
            (jawsStats[jawsStats.length - 1].nav / jawsStats[0].nav - 1) * 100,
        },
      ]);
    });
  }, [dateRange]);

  return (
    <Wrapper>
      <>
        <label>
          NAV:{" "}
          <select
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
          <StatWrapper key={stat.name}>
            <span>{stat.name} • </span>
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
  const yesterday = new Date();
  const yesterdayMs = Number(yesterday);

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
      endDate: getDateString({ date: yesterday, withDashes: true }),
    },
  ]);
}
