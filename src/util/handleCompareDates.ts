export const areDatesTheSame = (a: Date, b: Date) => {
  const dateA = a.setHours(0, 0, 0, 0);
  const dateB = b.setHours(0, 0, 0, 0);

  if (dateA !== dateB) {
    return false;
  }

  return true;
};
