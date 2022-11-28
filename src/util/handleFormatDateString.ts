// 20221128 -> 2022-11-28
export const formatDateString = (date: string) => {
  return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(
    6,
    8,
  )}`;
};
