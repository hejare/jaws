// 131023 -> 13:10
export const formatTimeString = (time: string) => {
  return `${time.substring(0, 2)}:${time.substring(2, 4)}`;
};

// 20221128 -> 2022-11-28
export const formatDateString = (date: string) => {
  return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(
    6,
    8,
  )}`;
};

// 1669803192509 -> Wed, 30 Nov 2022 10:13:12
export const formatTimestampToUtc = (timestamp: number) =>
  new Date(timestamp).toUTCString().replace(" GMT", "");
