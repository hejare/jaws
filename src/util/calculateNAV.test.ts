import { calculateNAV } from "./calculateNAV";

describe("calculateNAV", () => {
  it("Calculates NAV with 0 cash flow", () => {
    const equity = 52845;
    const numShares = 535.2;
    const cashFlow = 0;

    const { NAV, newNumShares } = calculateNAV({
      equity,
      numShares,
      netDeposits: cashFlow,
    });

    expect(NAV).toBeCloseTo(98.74);
    expect(newNumShares).toBe(numShares);
  });

  it("Calculates NAV with positive cash flow", () => {
    const equity = 53845;
    const numShares = 535.2;
    const cashFlow = 1000;

    const { NAV, newNumShares } = calculateNAV({
      equity,
      numShares,
      netDeposits: cashFlow,
    });

    expect(NAV).toBeCloseTo(98.74);
    expect(newNumShares).toBeCloseTo(545.33);
  });

  it("Calculates NAV with negative cash flow", () => {
    const equity = 51845;
    const numShares = 535.2;
    const cashFlow = -1000;

    const { NAV, newNumShares } = calculateNAV({
      equity,
      numShares,
      netDeposits: cashFlow,
    });

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
      netDeposits: 0,
    });

    expect(NAV1).toEqual(500);

    const { NAV: NAV2, newNumShares } = calculateNAV({
      equity: equities[1],
      numShares: startNumShares,
      netDeposits: cashFlowDay2,
    });

    expect(NAV2 / NAV1).toEqual(1.02); // 2% increase in NAV

    // Deposits means buying or selling at the "new" NAV price, in this
    // case when the equity was 51000. We should have created as many
    // new shares as can be bought for $1000 with the new price:
    //
    // newly_created_shares
    //            = 1000 (deposit) / (51000 (eq) / 100 (shares))
    //            = 1000 / 510
    //            = 1.96
    //
    // new_num_shares = start_num_shares + 1.96
    //                = 100 + 1.96
    //                = 101.96
    //
    // new_nav = 52000 (new eq) / 101.96 (new number of shares)
    //         = 510
    expect(newNumShares).toBeCloseTo(101.96);
    expect(NAV2).toBeCloseTo(510);
  });
});
