import { ExtendedTradesDataType, TRADE_STATUS } from "@jaws/db/tradesMeta";
import { isToday } from "@jaws/lib/helpers";
import { BuySellConstants } from "./buySellConstants";

const DEFAULT_BUY_SELL_CONFIG: BuySellConstants = {
  STOP_LOSS_1_PORTFOLIO_PERCENTAGE: 0.005,
  STOP_LOSS_2_ENABLED: true,
  TAKE_PARTIAL_PROFIT_INCREASE_FACTOR: 1.1,
  TAKE_PARTIAL_PROFIT_SELL_PERCENTAGE: 0.5,
  BUY_ORDER_TIME_IN_FORCE: "day",
  MOVING_AVERAGE_DAY_RANGE: 10,
  BUY_ORDER_EQUITY_PERCENTAGE: 0.1,
};

/**
 * Some props are required for our calculations to work
 */
type TradesDataWithRequiredProps = RequireSome<
  ExtendedTradesDataType,
  "avgEntryPrice" | "filledQuantity"
>;

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
      trade: TradesDataWithRequiredProps;
      currentPrice: number;
      movingAvg: number;
      /** Portfolio value, cash balance + value of investments */
      totalAssets: number;
    }): TRADE_STATUS {
      const sellPrices = this.getSellPriceLevels(opts);

      for (const tradeStatus of [
        TRADE_STATUS.STOP_LOSS_1,
        TRADE_STATUS.STOP_LOSS_2,
        TRADE_STATUS.STOP_LOSS_3,
      ]) {
        if (opts.currentPrice <= Number(sellPrices[tradeStatus])) {
          return tradeStatus;
        }
      }

      if (
        opts.trade.status !== TRADE_STATUS.PARTIAL_PROFIT_TAKEN &&
        opts.currentPrice >= Number(sellPrices.PARTIAL_PROFIT_TAKEN)
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
      trade: TradesDataWithRequiredProps;
      currentPrice: number;
      totalAssets: number;
      movingAvg: number;
    }): {
      [k in TRADE_STATUS]?: number;
    } & {
      [TRADE_STATUS.PARTIAL_PROFIT_TAKEN]: number;
    } {
      const isTradeFromToday = isToday(opts.trade.created);
      const stopLossMaxAmount = this.getStopLossMaxAmount(opts.totalAssets);

      return {
        [TRADE_STATUS.STOP_LOSS_1]: isTradeFromToday
          ? opts.trade.avgEntryPrice -
            stopLossMaxAmount / opts.trade.filledQuantity
          : undefined,
        [TRADE_STATUS.STOP_LOSS_2]:
          !isTradeFromToday && opts.movingAvg < opts.trade.avgEntryPrice
            ? Number(opts.trade.avgEntryPrice)
            : undefined,
        [TRADE_STATUS.STOP_LOSS_3]:
          !isTradeFromToday && opts.movingAvg >= opts.trade.avgEntryPrice
            ? opts.movingAvg
            : undefined,
        [TRADE_STATUS.PARTIAL_PROFIT_TAKEN]:
          opts.trade.avgEntryPrice *
          _config.TAKE_PARTIAL_PROFIT_INCREASE_FACTOR,
      };
    },

    getBuyOrderQuantity: function (opts: {
      /** The price we want to buy at */
      entryPrice: number;
      /** cash + portfolio */
      equity: number;
      cashBalance: number;
    }) {
      let maxOrderValue = Number(
        (opts.equity * _config.BUY_ORDER_EQUITY_PERCENTAGE).toFixed(4),
      );

      maxOrderValue = Math.min(maxOrderValue, opts.cashBalance);

      return {
        maxOrderValue,
        quantity: Math.floor(maxOrderValue / opts.entryPrice),
      };
    },
  };
};

export function tradeHasRequiredData(
  trade: ExtendedTradesDataType,
): asserts trade is TradesDataWithRequiredProps {
  const requiredFields: (keyof TradesDataWithRequiredProps)[] = [
    "avgEntryPrice",
    "filledQuantity",
  ];

  const missingFields = requiredFields.filter((k) => !trade[k]);

  if (missingFields.length) {
    throw new TypeError(
      `Trade is missing values for: ${missingFields.join(", ")}`,
    );
  }
}
