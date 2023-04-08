import { calculateMean, calculateStandardDeviation, calculateVariance, getDaysDifference, transformToLogReturns } from "./helpers";

describe("helpers", () => {
  it("calculates difference in days", () => {
    const date1 = new Date("2023-02-06:20:00:00");
    const date2 = new Date("2023-02-03:01:00:00");

    expect(getDaysDifference(date1, date2)).toBe(3);
    expect(getDaysDifference(date2, date1)).toBe(3);
  });
});

describe("statistics helpers", () => {
  it('calculates the correct average', () => {
    const data = [1, 2, 3, 4, 5];
    expect(calculateMean(data)).toEqual(3);

    const data2 = [14, 5, 1, -5, 50];
    expect(calculateMean(data2)).toEqual(13);
  });

  it('calculates the correct average for an empty array', () => {
    const data: number[] = [];
    expect(calculateMean(data)).toEqual(NaN);
  });

  it('calculates the correct average for an array with one element', () => {
    const data = [1];
    expect(calculateMean(data)).toEqual(1);
  });

  it('calculates the correct variance', () => {
    const data = [2, 4, 4, 4, 5, 5, 7, 9];
    expect(calculateVariance(data)).toEqual(4);
  });

  it('calculates the correct standard deviation', () => {
    const data = [2, 4, 4, 4, 5, 5, 7, 9];
    expect(calculateStandardDeviation(data)).toEqual(2);
  });

  it('returns the log returns', () => {
    const data = [100, 200, 100, 150, 180];
    const logReturns = [Math.log(200/100), Math.log(100/200), Math.log(150/100), Math.log(180/150)];

    expect(transformToLogReturns(data)).toEqual(logReturns);
  });
});
