import { OrderTimeInForce } from "@master-chief/alpaca/@types/entities";

export interface BuySellConstants {
  STOP_LOSS_1_PORTFOLIO_PERCENTAGE: number;
  STOP_LOSS_2_ENABLED: boolean;
  TAKE_PARTIAL_PROFIT_INCREASE_PERCENTAGE: number;
  TAKE_PARTIAL_PROFIT_SELL_PERCENTAGE: number;
  BUY_ORDER_TIME_IN_FORCE: OrderTimeInForce;
}

const DEFAULT_CONFIG: BuySellConstants = {
  STOP_LOSS_1_PORTFOLIO_PERCENTAGE: 0.005,
  STOP_LOSS_2_ENABLED: true,
  TAKE_PARTIAL_PROFIT_INCREASE_PERCENTAGE: 0.1,
  TAKE_PARTIAL_PROFIT_SELL_PERCENTAGE: 0.5,
  BUY_ORDER_TIME_IN_FORCE: "day",
};

export const getBuySellHelpers = (config?: Partial<BuySellConstants>) => {
  const _config = { ...DEFAULT_CONFIG, ...config };

  return {
    getStopLossLimit: (totalAssets: number): number =>
      totalAssets * _config.STOP_LOSS_1_PORTFOLIO_PERCENTAGE,
  };
};
