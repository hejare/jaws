import { getDaysDifference } from "./helpers";

describe("helpers", () => {
  it("calculates difference in days", () => {
    const date1 = new Date("2023-02-06:20:00:00");
    const date2 = new Date("2023-02-03:01:00:00");

    expect(getDaysDifference(date1, date2)).toBe(3);
    expect(getDaysDifference(date2, date1)).toBe(3);
  });
});
