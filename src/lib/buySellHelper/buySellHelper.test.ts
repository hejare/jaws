import { TradesDataType, TRADE_SIDE, TRADE_STATUS } from "@jaws/db/tradesMeta";
import { getBuySellHelpers } from "@jaws/lib/buySellHelper/buySellHelper";

describe("buySellHelper", () => {
  it("calculates stop-loss limit", () => {
    const helpers = getBuySellHelpers();
    expect(helpers.getStopLossMaxAmount(100)).toBe(0.5);
    expect(helpers.getStopLossMaxAmount(45873)).toBe(45873 * 0.005);

    expect(
      getBuySellHelpers({
        STOP_LOSS_1_PORTFOLIO_PERCENTAGE: 0.02,
      }).getStopLossMaxAmount(100),
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

  describe("determines the sell trade status (if any) for a position", () => {
    const helpers1 = getBuySellHelpers({
      STOP_LOSS_1_PORTFOLIO_PERCENTAGE: 0.005,
    });

    const stopLossMaxAmount = helpers1.getStopLossMaxAmount(10000);

    it("should only return some statuses on day 1", () => {
      const todayTrade: TradesDataType = {
        price: 20,
        quantity: 15,
        breakoutRef: "BREAKOUT_REF",
        created: Date.now(),
        side: TRADE_SIDE.BUY,
        status: TRADE_STATUS.FILLED,
        ticker: "GOOG",
        alpacaOrderId: "ALPACA_ORDER_ID",
      };

      const tradeTakePartialProfit = helpers1.determineTradeStatus({
        trade: todayTrade,
        lastTradePrice: 25, // up more than 10%
        movingAvg: 23,
        stopLossMaxAmount: stopLossMaxAmount,
      });

      expect(tradeTakePartialProfit).toBe(TRADE_STATUS.PARTIAL_PROFIT_TAKEN);

      const tradeStopLoss1 = helpers1.determineTradeStatus({
        trade: todayTrade,
        lastTradePrice: 15,
        movingAvg: 23,
        stopLossMaxAmount: stopLossMaxAmount,
      });

      expect(tradeStopLoss1).toBe(TRADE_STATUS.STOP_LOSS_1);

      const tradeStopLoss2 = helpers1.determineTradeStatus({
        trade: todayTrade,
        lastTradePrice: 19.5, // dropped below entry, should be STOP_LOSS_2
        movingAvg: 23,
        stopLossMaxAmount: stopLossMaxAmount,
      });

      expect(tradeStopLoss2).toBe(undefined);

      const tradeStopLoss3 = helpers1.determineTradeStatus({
        trade: todayTrade,
        lastTradePrice: 20.5, // dropped below movingAvg, should be STOP_LOSS_3
        movingAvg: 20.7,
        stopLossMaxAmount: stopLossMaxAmount,
      });

      expect(tradeStopLoss3).toBe(undefined);
    });

    it("should check for all statuses on day >1", () => {
      const yesterdayTrade: TradesDataType = {
        price: 20,
        quantity: 15,
        breakoutRef: "BREAKOUT_REF",
        created: Date.now() - 60 * 60 * 24 * 1000,
        side: TRADE_SIDE.BUY,
        status: TRADE_STATUS.FILLED,
        ticker: "GOOG",
        alpacaOrderId: "ALPACA_ORDER_ID",
      };

      const tradeTakePartialProfit = helpers1.determineTradeStatus({
        trade: yesterdayTrade,
        lastTradePrice: 25, // up more than 10%
        movingAvg: 23,
        stopLossMaxAmount,
      });

      expect(tradeTakePartialProfit).toBe(TRADE_STATUS.PARTIAL_PROFIT_TAKEN);

      const tradeStopLoss1 = helpers1.determineTradeStatus({
        trade: yesterdayTrade,
        lastTradePrice: 15,
        movingAvg: 23,
        stopLossMaxAmount,
      });

      expect(tradeStopLoss1).toBe(TRADE_STATUS.STOP_LOSS_1);

      const tradeStopLoss2 = helpers1.determineTradeStatus({
        trade: yesterdayTrade,
        lastTradePrice: 19.5, // dropped below entry, should be STOP_LOSS_2
        movingAvg: 23,
        stopLossMaxAmount,
      });

      expect(tradeStopLoss2).toBe(TRADE_STATUS.STOP_LOSS_2);

      const tradeStopLoss3 = helpers1.determineTradeStatus({
        trade: yesterdayTrade,
        lastTradePrice: 20.5, // dropped below movingAvg, should be STOP_LOSS_3
        movingAvg: 20.7,
        stopLossMaxAmount,
      });

      expect(tradeStopLoss3).toBe(TRADE_STATUS.STOP_LOSS_3);
    });
  });
  it("should only take partial profit once", () => {
    const helpers1 = getBuySellHelpers({
      STOP_LOSS_1_PORTFOLIO_PERCENTAGE: 0.005,
    });

    const stopLossMaxAmount = helpers1.getStopLossMaxAmount(10000);

    const yesterdayTrade: TradesDataType = {
      price: 20,
      quantity: 15,
      breakoutRef: "BREAKOUT_REF",
      created: Date.now() - 60 * 60 * 24 * 1000,
      side: TRADE_SIDE.BUY,
      status: TRADE_STATUS.FILLED,
      ticker: "GOOG",
      alpacaOrderId: "ALPACA_ORDER_ID",
    };

    const tradeTakePartialProfit = helpers1.determineTradeStatus({
      trade: yesterdayTrade,
      lastTradePrice: 25, // up more than 10%
      movingAvg: 23,
      stopLossMaxAmount,
    });

    expect(tradeTakePartialProfit).toBe(TRADE_STATUS.PARTIAL_PROFIT_TAKEN);

    const secondStatusCheck = helpers1.determineTradeStatus({
      trade: { ...yesterdayTrade, status: TRADE_STATUS.PARTIAL_PROFIT_TAKEN },
      lastTradePrice: 25, // up more than 10%
      movingAvg: 23,
      stopLossMaxAmount,
    });

    expect(secondStatusCheck).toBe(undefined);

    const tradeDroppedValue = helpers1.determineTradeStatus({
      trade: { ...yesterdayTrade, status: TRADE_STATUS.PARTIAL_PROFIT_TAKEN },
      lastTradePrice: 21,
      movingAvg: 23,
      stopLossMaxAmount,
    });

    expect(tradeDroppedValue).toBe(TRADE_STATUS.STOP_LOSS_3);
  });

  it("checks and determines the stop-loss type in the correct order", () => {
    const helpers1 = getBuySellHelpers({
      STOP_LOSS_1_PORTFOLIO_PERCENTAGE: 0.005,
    });

    const stopLossMaxAmount = helpers1.getStopLossMaxAmount(10000);

    const yesterdayTrade: TradesDataType = {
      price: 20,
      quantity: 15,
      breakoutRef: "BREAKOUT_REF",
      created: Date.now() - 60 * 60 * 24 * 1000,
      side: TRADE_SIDE.BUY,
      status: TRADE_STATUS.FILLED,
      ticker: "GOOG",
      alpacaOrderId: "ALPACA_ORDER_ID",
    };

    // dropped below everything
    const tradeStopLoss1 = helpers1.determineTradeStatus({
      trade: yesterdayTrade,
      lastTradePrice: 15,
      movingAvg: 23,
      stopLossMaxAmount,
    });

    expect(tradeStopLoss1).toBe(TRADE_STATUS.STOP_LOSS_1);

    // dropped below moving avg AND entry price
    const tradeStopLoss2 = helpers1.determineTradeStatus({
      trade: yesterdayTrade,
      lastTradePrice: 19.5, // dropped below entry, should be STOP_LOSS_2
      movingAvg: 19.8,
      stopLossMaxAmount,
    });

    expect(tradeStopLoss2).toBe(TRADE_STATUS.STOP_LOSS_2);

    // only droppped below moving avg
    const tradeStopLoss3 = helpers1.determineTradeStatus({
      trade: yesterdayTrade,
      lastTradePrice: 20.5, // dropped below movingAvg, should be STOP_LOSS_3
      movingAvg: 20.7,
      stopLossMaxAmount,
    });

    expect(tradeStopLoss3).toBe(TRADE_STATUS.STOP_LOSS_3);
  });
});
