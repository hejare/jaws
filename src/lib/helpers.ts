function addZero(value: number) {
  return value < 10 ? `0${value}` : value;
}

export const getToday = () => {
  const now = new Date();
  const nowDate = now.getDate();
  const nowMonth = now.getMonth() + 1;
  return `${now.getFullYear()}${addZero(nowMonth)}${addZero(nowDate)}`;
};

export const isToday = (datetime: string) => {
  const d = new Date(datetime);
  const now = new Date();
  return now.toDateString() === d.toDateString();
};

export const isOnSameDate = (datetime1: string, datetime2: string) => {
  const d1 = new Date(datetime1);
  const d2 = new Date(datetime2);
  return d1.toDateString() === d2.toDateString();
};

export const isoStringToTimeStamp = (isoString: string) => {
  const date = new Date(isoString);
  return date.getTime();
};

export const getDateTime = (timestampInput: number | string | null) => {
  if (!timestampInput) {
    return timestampInput;
  }

  const timestamp =
    typeof timestampInput === "string"
      ? parseInt(timestampInput)
      : timestampInput;

  const d = new Date(timestamp);
  const nowMonth = d.getMonth() + 1;
  const nowDate = d.getDate();
  const nowHours = d.getHours();
  const nowMinutes = d.getMinutes();
  return `${d.getFullYear()}-${addZero(nowMonth)}-${addZero(nowDate)} ${addZero(
    nowHours,
  )}:${addZero(nowMinutes)}`;
};

export const getNewRunId = () => {
  const now = new Date();
  const nowDate = now.getDate();
  const nowMonth = now.getMonth() + 1;
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const nowSeconds = now.getSeconds();
  return `${now.getFullYear()}${addZero(nowMonth)}${addZero(nowDate)}_${addZero(
    nowHours,
  )}${addZero(nowMinutes)}${addZero(nowSeconds)}`;
};
