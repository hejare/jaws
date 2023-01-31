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

    determineNewTradeStatus: function (opts: {
      trade: TradesDataType;
      lastTradePrice: number;
      movingAvg: number;
      stopLossMaxAmount: number;
    }): TRADE_STATUS {
      const sellPrices = this.getSellPriceLevels(opts);

      for (let tradeStatus of [
        TRADE_STATUS.STOP_LOSS_1,
        TRADE_STATUS.STOP_LOSS_2,
        TRADE_STATUS.STOP_LOSS_3,
      ]) {
        if (opts.lastTradePrice <= Number(sellPrices[tradeStatus])) {
          return tradeStatus;
        }
      }

      if (
        opts.trade.status !== TRADE_STATUS.PARTIAL_PROFIT_TAKEN &&
        opts.lastTradePrice >= Number(sellPrices.PARTIAL_PROFIT_TAKEN)
      ) {
        return TRADE_STATUS.PARTIAL_PROFIT_TAKEN;
      }

      return opts.trade.status;
    },

    /**
     * Returns an object with the price for the "currently active" sell
     * levels, i.e. the possible TRADE_STATUSes that the trade can
     * transition to.
     */
    getSellPriceLevels: function (opts: {
      trade: TradesDataType;
      lastTradePrice: number;
      totalAssets?: number;
      movingAvg: number;
      stopLossMaxAmount?: number;
    }): { [k in TRADE_STATUS]?: number } {
      const isTradeFromToday = isToday(opts.trade.created);

      const stopLossMaxAmount =
        opts.stopLossMaxAmount ||
        this.getStopLossMaxAmount(opts.totalAssets || 0);

      return {
        [TRADE_STATUS.STOP_LOSS_1]: isTradeFromToday
          ? opts.trade.price - stopLossMaxAmount / opts.trade.quantity
          : undefined,
        [TRADE_STATUS.STOP_LOSS_2]:
          !isTradeFromToday && opts.movingAvg < opts.trade.price
            ? opts.trade.price
            : undefined,
        [TRADE_STATUS.STOP_LOSS_3]:
          !isTradeFromToday && opts.movingAvg >= opts.trade.price
            ? opts.movingAvg
            : undefined,
        [TRADE_STATUS.PARTIAL_PROFIT_TAKEN]:
          opts.trade.price * _config.TAKE_PARTIAL_PROFIT_INCREASE_FACTOR,
      };
    },
  };
};
