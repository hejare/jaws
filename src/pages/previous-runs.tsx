import dayjs, { Dayjs } from "dayjs";
import type { NextPage } from "next";
import { useState } from "react";
import styled from "styled-components";
import DatePicker from "../components/molecules/DatePicker";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const PreviousRuns: NextPage = () => {
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  const handleDateChange = (newValue: any) => {
    setDate(newValue);
  };

  return (
    <PageContainer>
      <p>Choose date to view run</p>
      <DatePicker setDateValue={handleDateChange} />
    </PageContainer>
  );
};

export default PreviousRuns;
