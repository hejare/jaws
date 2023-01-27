import { OrderTimeInForce } from "@master-chief/alpaca/@types/entities";

export interface BuySellConstants {
  STOP_LOSS_1_PORTFOLIO_PERCENTAGE: number;
  STOP_LOSS_2_ENABLED: boolean;
  TAKE_PARTIAL_PROFIT_INCREASE_FACTOR: number;
  TAKE_PARTIAL_PROFIT_SELL_PERCENTAGE: number;
  BUY_ORDER_TIME_IN_FORCE: OrderTimeInForce;
  MOVING_AVERAGE_DAY_RANGE: number;
}
