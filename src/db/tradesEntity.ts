import { db } from "../services/firestoreService";
import {
  ExtendedTradesDataType,
  TradesDataType,
  TRADE_STATUS,
} from "./tradesMeta";

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

export async function getTradesByStatus(status: TRADE_STATUS) {
  const query = db.collection("trades");
  const results = await query.where("status", "==", status).get();
  if (results.size === 0) {
    return [];
  }
  return results.docs.map((doc) => doc.data()) as TradesDataType[];
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
  } as TradesDataType;
}
