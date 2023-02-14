import { calculateNAV } from "./calculateNAV";

describe("calculateNAV", () => {
  it("Calculates NAV with 0 cash flow", () => {
    const equity = 52845;
    const numShares = 535.2;
    const cashFlow = 0;

    const { NAV, newNumShares } = calculateNAV({ equity, numShares, cashFlow });

    expect(NAV).toBeCloseTo(98.74);
    expect(newNumShares).toBe(numShares);
  });

  it("Calculates NAV with positive cash flow", () => {
    const equity = 53845;
    const numShares = 535.2;
    const cashFlow = 1000;

    const { NAV, newNumShares } = calculateNAV({ equity, numShares, cashFlow });

    expect(NAV).toBeCloseTo(98.74);
    expect(newNumShares).toBeCloseTo(545.33);
  });

  it("Calculates NAV with negative cash flow", () => {
    const equity = 51845;
    const numShares = 535.2;
    const cashFlow = -1000;

    const { NAV, newNumShares } = calculateNAV({ equity, numShares, cashFlow });

    expect(NAV).toBeCloseTo(98.74);
    expect(newNumShares).toBeCloseTo(525.07);
  });

  it("Calculates correctly from day to day", () => {
    const equities = [50000, 52000]; // 4% increase
    const startNumShares = 100;
    const cashFlowDay2 = 1000; // half of increase is due to cash flow

    const { NAV: NAV1 } = calculateNAV({
      equity: equities[0],
      numShares: startNumShares,
      cashFlow: 0,
    });

    expect(NAV1).toBe(500);

    const { NAV: NAV2, newNumShares } = calculateNAV({
      equity: equities[1],
      numShares: startNumShares,
      cashFlow: cashFlowDay2,
    });

    expect(NAV2 / NAV1).toBe(1.02); // 2% increase in NAV

    // Cash flow means buying or selling at the "new" NAV price, in this
    // case when the equity was 51000
    expect(newNumShares).toBeCloseTo(startNumShares + cashFlowDay2 / NAV2);
  });
});
