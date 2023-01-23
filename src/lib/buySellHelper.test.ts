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

  it("exposes a copy of the config", () => {
    const helpers1 = getBuySellHelpers();

    const defaultConfig = {
      STOP_LOSS_1_PORTFOLIO_PERCENTAGE: 0.005,
      STOP_LOSS_2_ENABLED: true,
      TAKE_PARTIAL_PROFIT_INCREASE_FACTOR: 1.1,
      TAKE_PARTIAL_PROFIT_SELL_PERCENTAGE: 0.5,
      BUY_ORDER_TIME_IN_FORCE: "day",
      MOVING_AVERAGE_DAY_RANGE: 10,
    };

    expect(helpers1.config).toStrictEqual(defaultConfig);

    const helpers2 = getBuySellHelpers({
      STOP_LOSS_1_PORTFOLIO_PERCENTAGE: 0.23,
    });
    expect(helpers2.config.STOP_LOSS_1_PORTFOLIO_PERCENTAGE).toBe(0.23);
  });
});
