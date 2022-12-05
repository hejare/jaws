import { db } from "../services/firestoreService";
import { TradesDataType } from "./tradesMeta";

export async function postTrade(data: TradesDataType) {
  await db.collection("trades").doc().set(data);
  return {
    ...data,
  };
}

export const handleSaveOrder = async (
  ticker: string,
  orderType: string,
  price: number,
  quantity: number,
  alpacaOrderId: string,
  createdAt: string,
  breakoutRef?: string,
) => {
  const data: TradesDataType = {
    ticker,
    orderType: orderType.toUpperCase(),
    price,
    quantity,
    alpacaOrderId,
    createdAt,
    userRef: "ludde@hejare.se",
  };

  if (breakoutRef) {
    data.breakoutRef = breakoutRef;
  }

  await postTrade(data);
};
