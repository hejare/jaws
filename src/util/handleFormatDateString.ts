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
