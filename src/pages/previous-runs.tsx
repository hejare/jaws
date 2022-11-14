import DatePicker from "../components/molecules/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

const PreviousRuns = () => {
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  const handleDateChange = (newValue: any) => {
    setDate(newValue);
  };

  return (
    <>
      <p>Choose date to view run</p>
      <DatePicker setDateValue={handleDateChange} />
    </>
  );
};

export default PreviousRuns;
