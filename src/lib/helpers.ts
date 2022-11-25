function addZero(value: number) {
  return value < 10 ? `0${value}` : value;
}

export const getToday = () => {
  const now = new Date();
  const nowDate = now.getDate();
  const nowMonth = now.getMonth() + 1;
  return `${now.getFullYear()}${addZero(nowMonth)}${addZero(nowDate)}`;
};

export const getDateTime = (timestamp: string) => {
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
