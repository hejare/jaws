export const ONE_MINUTE_IN_MS = 60000;
export const TEN_MINUTES_IN_MS = 600000;
export const ONE_HOUR_IN_MS = 3600000;
export const SESSION_LENGTH_IN_MS = TEN_MINUTES_IN_MS;
export const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24;

function addZero(value: number) {
  return value < 10 ? `0${value}` : value;
}

export const getDateString = ({
  date,
  withDashes,
}: {
  date: Date;
  withDashes: boolean;
}) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return [date.getFullYear(), addZero(month), addZero(day)].join(
    withDashes ? "-" : "",
  );
};

export const getToday = () => {
  const now = new Date();
  const nowDate = now.getDate();
  const nowMonth = now.getMonth() + 1;
  return `${now.getFullYear()}${addZero(nowMonth)}${addZero(nowDate)}`;
};

export const getTodayWithDashes = () => {
  const now = new Date();
  const nowDate = now.getDate();
  const nowMonth = now.getMonth() + 1;
  return `${now.getFullYear()}-${addZero(nowMonth)}-${addZero(nowDate)}`;
};

export const getISOStringForToday = () => {
  const date = getTodayWithDashes(); // I know, this could have been done better, but I am lazy...
  const nowDate = new Date(date);
  return nowDate.toISOString();
};

export const isToday = (datetime: string | number) => {
  // Note: if number, its a timestamp
  const d = new Date(datetime);
  const now = new Date();
  return now.toDateString() === d.toDateString();
};

export const isOnSameDate = (datetime1: string, datetime2: string) => {
  const d1 = new Date(datetime1);
  const d2 = new Date(datetime2);
  return d1.toDateString() === d2.toDateString();
};

export const getDateTime = (timestampInput: number | string | null) => {
  if (!timestampInput) {
    return timestampInput;
  }

  const timestamp =
    typeof timestampInput === "string" && isNaN(Date.parse(timestampInput))
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

export function isValidSymbol(symbol: string): boolean {
  return Boolean(
    symbol &&
      typeof symbol === "string" &&
      symbol.length >= 1 &&
      symbol.length <= 5,
  );
}

export const getDaysDifference = (date1: Date, date2: Date): number => {
  return Math.floor(Math.abs(Number(date1) - Number(date2)) / ONE_DAY_IN_MS);
};

export const calculateMean = (values: number[]): number => {
  return values.reduce((a, b) => a + b, 0) / values.length;
};

export const calculateStandardDeviation = (values: number[]) => {
  return Math.sqrt(calculateVariance(values));
}

export const calculateVariance = (values: number[]) => {
  const mean = calculateMean(values);
  const squareDiffs = values.map((value) => {
    const diff = value - mean;
    const sqrDiff = diff * diff;
    return sqrDiff;
  });

  return calculateMean(squareDiffs);
}

export const calculateStandardDeviationForPeriod = (values: number[], period: number) => {
  const standardDeviation = calculateStandardDeviation(values);
  return standardDeviation * Math.sqrt(period);
}

export const transformToLogReturns = (stockPrices: number[]): number[] => {
  const logReturns: number[] = [];
  for (let i = 0; i < stockPrices.length-1; i++) {
    const periodReturn = Math.log(stockPrices[i+1] / stockPrices[i]);
    logReturns.push(periodReturn);
  }
  return logReturns;
};

export const riskFreeRate = (oneYearTreasuryYield: number, inflationRate: number) => {
  return oneYearTreasuryYield - inflationRate;
};

export const calculateVolatility = (stockPrices: number[], period: number) => {
  const logReturns = transformToLogReturns(stockPrices);
  return calculateStandardDeviationForPeriod(logReturns, period);
}
