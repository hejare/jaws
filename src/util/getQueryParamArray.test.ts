import { getQueryParamArray } from "./getQueryParamArray";

describe("getQueryParamArray", () => {
  it("works for a list as string", () => {
    expect(getQueryParamArray({ list: "1, 2, 3" }, "list")).toEqual([
      "1",
      "2",
      "3",
    ]);
  });

  it("works for a single value as string", () => {
    expect(getQueryParamArray({ list: "1" }, "list")).toEqual(["1"]);
  });

  it("works for a list that's already an array", () => {
    expect(getQueryParamArray({ list: ["1", "2", "3"] }, "list")).toEqual([
      "1",
      "2",
      "3",
    ]);
  });

  it("returns undefined when no value", () => {
    expect(getQueryParamArray({}, "notFound")).toBeUndefined();
  });
});
