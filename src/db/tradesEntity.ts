import { db } from "../services/firestoreService";
import { TradesDataType } from "./tradesMeta";

export async function postTrade(data: TradesDataType) {
  await db.collection("trades").doc().set(data);
  return {
    ...data,
  };
}
