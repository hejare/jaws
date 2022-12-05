export interface TradesDataType {
  ticker: string;
  orderType: string; // TODO type smh like- orderType: "buy" | "sell" | "move stop loss" | "take-profit";
  price: number;
  quantity: number;
  alpacaOrderId: string;
  createdAtISOString: string;
  breakoutRef?: string;
  userRef?: string;
}
