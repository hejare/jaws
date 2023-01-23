import { getBuySellHelpers } from "./buySellHelper";

describe("buySellHelper", () => {
  it("calculates stop-loss limit", () => {
    const helpers = getBuySellHelpers();
    expect(helpers.getStopLossLimit(100)).toBe(0.5);
    expect(helpers.getStopLossLimit(45873)).toBe(45873 * 0.005);

    expect(
      getBuySellHelpers({
        STOP_LOSS_1_PORTFOLIO_PERCENTAGE: 0.02,
      }).getStopLossLimit(100),
    ).toBe(2);
  });
});
