export interface TradesDataType {
  ticker: string;
  orderType: string; // TODO trades constant options
  price: number;
  quantity: number;
  alpacaOrderId: string;
  createdAtISOString: string;
  breakoutRef?: string;
  userRef?: string; // TODO trades "ludde@hejare.se"
}
