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
  createdAtISOString: string,
  breakoutRef?: string,
) => {
  const data: TradesDataType = {
    ticker,
    orderType,
    price,
    quantity,
    alpacaOrderId,
    createdAtISOString,
  };

  if (breakoutRef) {
    data.breakoutRef = breakoutRef;
  }

  await postTrade(data);
};
