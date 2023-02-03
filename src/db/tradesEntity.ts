import { db } from "@jaws/services/firestoreService";
import { ExtendedTradesDataType, TradesDataType } from "./tradesMeta";

export async function postTrade(data: TradesDataType) {
  await db.collection("trades").doc(data.breakoutRef).set(data);
}

export async function putTrade(data: ExtendedTradesDataType) {
  await db.collection("trades").doc(data.breakoutRef).set(data);
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
  } as ExtendedTradesDataType;
}

export async function getLatestTrade(ticker: string) {
  const docs = await db.collection("trades").orderBy("created", "desc").get();

  const result: ExtendedTradesDataType[] = [];
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
  await query.doc(ref).delete();
  return;
}

export async function getTradesByStatus(...status: string[]) {
  const query = db.collection("trades");
  const results = await query.where("status", "in", status).get();
  if (results.size === 0) {
    return [];
  }
  return results.docs.map((doc) => doc.data()) as ExtendedTradesDataType[];
}

export async function getTradeByOrderId(orderId: string) {
  const query = db.collection("trades");
  const results = await query.where("alpacaOrderId", "==", orderId).get();
  if (results.size === 0) {
    return null;
  }

  const doc = results.docs[0];
  return {
    ...doc.data(),
  } as ExtendedTradesDataType;
}

export async function getAllTrades() {
  const results = await db.collection("trades").get();
  if (results.size === 0) {
    return [];
  }
  return results.docs.map((doc) => doc.data()) as ExtendedTradesDataType[];
}
