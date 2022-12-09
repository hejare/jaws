import { db } from "../services/firestoreService";
import { TradesDataType } from "./tradesMeta";

export async function postTrade(data: TradesDataType) {
  await db.collection("trades").doc(data.breakoutRef).set(data);
  return {
    ...data,
  };
}

export async function getTrades(ticker: string) {
  const query = db.collection("trades");
  const results = await query.where("ticker", "==", ticker).get();
  if (results.size === 0) {
    return null;
  }

  const doc = results.docs[0];
  return {
    ...doc.data(),
  } as TradesDataType;
}

export async function getLatestTrade(ticker: string) {
  const docs = await db.collection("trades").orderBy("created", "desc").get();

  const result: TradesDataType[] = [];
  docs.forEach((doc: any) => {
    const data = doc.data();
    if (data.ticker === ticker) {
      result.push({
        ...data,
      });
    }
  });

  if (result.length === 0) {
    return null;
  }
  return result[0];
}

export async function deleteTrade(ref: string) {
  const query = db.collection("trades");
  const results = await query.doc(ref).delete();
  return results;
}
