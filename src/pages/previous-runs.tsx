import dayjs, { Dayjs } from "dayjs";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styled from "styled-components";
import DatePicker from "../components/molecules/DatePicker";
import fetch from "node-fetch";
import { handleResult } from "../util/handleResult";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const PreviousRuns: NextPage = () => {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [dailyRuns, setDailyRuns] = useState();

  const handleDateChange = (newValue: any) => {
    setDate(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      const runs = await fetch("/api/data/daily-runs").then(handleResult);
      setDailyRuns(runs);
    };

    fetchData();
  }, []);

  // TODO map over runs

  return (
    <PageContainer>
      <p>Choose date to view run</p>
      <DatePicker setDateValue={handleDateChange} />
    </PageContainer>
  );
};

export default PreviousRuns;
