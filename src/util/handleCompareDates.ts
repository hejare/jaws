export const areDatesTheSame = (dateA: Date, dateB: Date) => {
  const current = dateA.setHours(0, 0, 0, 0);
  const compare = dateB.setHours(0, 0, 0, 0);

  if (current !== compare) {
    return false;
  }

  return true;
};
