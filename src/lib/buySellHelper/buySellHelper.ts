import { TradesDataType, TRADE_STATUS } from "@jaws/db/tradesMeta";
import { isToday } from "@jaws/lib/helpers";
import { BuySellConstants } from "./buySellConstants";

const DEFAULT_BUY_SELL_CONFIG: BuySellConstants = {
  STOP_LOSS_1_PORTFOLIO_PERCENTAGE: 0.005,
  STOP_LOSS_2_ENABLED: true,
  TAKE_PARTIAL_PROFIT_INCREASE_FACTOR: 1.1,
  TAKE_PARTIAL_PROFIT_SELL_PERCENTAGE: 0.5,
  BUY_ORDER_TIME_IN_FORCE: "day",
  MOVING_AVERAGE_DAY_RANGE: 10,
};

export const getBuySellHelpers = (config?: Partial<BuySellConstants>) => {
  const _config = { ...DEFAULT_BUY_SELL_CONFIG, ...config };

  return {
    get config() {
      return { ..._config } as const;
    },

    /**
     * Returns the maximum amount of money (total value) the position is
     * allowed to drop before triggering Stop loss (1)
     */
    getStopLossMaxAmount: (totalAssets: number): number =>
      totalAssets * _config.STOP_LOSS_1_PORTFOLIO_PERCENTAGE,

    determineNewTradeStatus: (opts: {
      trade: TradesDataType;
      lastTradePrice: number;
      movingAvg: number;
      stopLossMaxAmount: number;
    }): TRADE_STATUS => {
      const stopLossType = determineStopLossType(opts);

      if (stopLossType) {
        return stopLossType;
      } else if (shouldTakePartialProfit(opts)) {
        return TRADE_STATUS.PARTIAL_PROFIT_TAKEN;
      } else {
        return opts.trade.status;
      }
    },

    getSellPriceLevels: function (opts: {
      trade: TradesDataType;
      lastTradePrice: number;
      totalAssets: number;
      movingAvg: number;
    }) {
      return {
        [TRADE_STATUS.STOP_LOSS_1]:
          opts.trade.price -
          this.getStopLossMaxAmount(opts.totalAssets) / opts.trade.quantity,
        [TRADE_STATUS.PARTIAL_PROFIT_TAKEN]:
          opts.trade.price * _config.TAKE_PARTIAL_PROFIT_INCREASE_FACTOR,
      };
    },
  };

  function determineStopLossType({
    trade,
    stopLossMaxAmount,
    lastTradePrice,
    movingAvg,
  }: {
    trade: TradesDataType;
    stopLossMaxAmount: number;
    lastTradePrice: number;
    movingAvg: number;
  }): TRADE_STATUS | undefined {
    // Stop loss case (1)
    if ((trade.price - lastTradePrice) * trade.quantity >= stopLossMaxAmount)
      return TRADE_STATUS.STOP_LOSS_1;

    if (!isToday(trade.created)) {
      // Stop loss case (2)
      if (lastTradePrice <= trade.price) return TRADE_STATUS.STOP_LOSS_2;

      // Stop loss case (3) Take profit
      if (movingAvg && lastTradePrice <= movingAvg)
        return TRADE_STATUS.STOP_LOSS_3;
    }

    return;
  }

  function shouldTakePartialProfit({
    trade,
    lastTradePrice,
  }: {
    trade: TradesDataType;
    lastTradePrice: number;
  }): boolean {
    if (trade.status === TRADE_STATUS.PARTIAL_PROFIT_TAKEN) {
      // We only want to do this once; Since it's already been done, the
      // next sell should be a stop-loss to sell 100%
      return false;
    }

    return (
      trade.price * _config.TAKE_PARTIAL_PROFIT_INCREASE_FACTOR <=
      lastTradePrice
    );
  }
};
