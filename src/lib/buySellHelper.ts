import { TradesDataType, TRADE_STATUS } from "@jaws/db/tradesMeta";
import { OrderTimeInForce } from "@master-chief/alpaca/@types/entities";
import { isToday } from "./helpers";

export interface BuySellConstants {
  STOP_LOSS_1_PORTFOLIO_PERCENTAGE: number;
  STOP_LOSS_2_ENABLED: boolean;
  TAKE_PARTIAL_PROFIT_INCREASE_FACTOR: number;
  TAKE_PARTIAL_PROFIT_SELL_PERCENTAGE: number;
  BUY_ORDER_TIME_IN_FORCE: OrderTimeInForce;
  MOVING_AVERAGE_DAY_RANGE: number;
}

const DEFAULT_CONFIG: BuySellConstants = {
  STOP_LOSS_1_PORTFOLIO_PERCENTAGE: 0.005,
  STOP_LOSS_2_ENABLED: true,
  TAKE_PARTIAL_PROFIT_INCREASE_FACTOR: 1.1,
  TAKE_PARTIAL_PROFIT_SELL_PERCENTAGE: 0.5,
  BUY_ORDER_TIME_IN_FORCE: "day",
  MOVING_AVERAGE_DAY_RANGE: 10,
};

export const getBuySellHelpers = (config?: Partial<BuySellConstants>) => {
  const _config = { ...DEFAULT_CONFIG, ...config };

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

    determineTradeStatus: (opts: {
      trade: TradesDataType;
      lastTradePrice: number;
      movingAvg: number;
      stopLossMaxAmount: number;
    }): TRADE_STATUS | undefined => {
      const stopLossType = determineStopLossType(opts);

      if (stopLossType) {
        return stopLossType;
      } else if (isTakePartialProfit(opts)) {
        return TRADE_STATUS.TAKE_PARTIAL_PROFIT;
      }

      return;
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

  /** After 10% increase in value, we take profit */
  function isTakePartialProfit({
    trade,
    lastTradePrice,
  }: {
    trade: TradesDataType;
    lastTradePrice: number;
  }) {
    if (trade.status === TRADE_STATUS.TAKE_PARTIAL_PROFIT) {
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
