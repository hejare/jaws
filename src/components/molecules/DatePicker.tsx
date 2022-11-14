import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  setDateValue: (date: Date) => void;
}

const DatePicker = ({ setDateValue }: Props) => {
  const [value, setValue] = useState<Dayjs | null>(dayjs("2022-04-07"));

  const handleChange = (newValue: any) => {
    setValue(newValue);
    setDateValue(newValue.$d);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label="Date desktop"
        inputFormat="DD-MM-YYYY"
        value={value}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
