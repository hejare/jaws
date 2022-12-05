export interface TradesDataType {
  ticker: string;
  orderType: string; // TODO type smh like- orderType: "buy" | "sell" | "move stop loss" | "take-profit";
  price: number;
  quantity: number;
  alpacaOrderId: string;
  createdAt: string;
  breakoutRef?: string;
  userRef?: string;
}
