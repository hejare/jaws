import { db } from "../services/firestoreService";

export async function getTicker(refId: string) {
  const query = db.collection("tickers");
  const results = await query.doc(refId).get();

  if (!results.data()) {
    return null;
  }
  const doc = results;
  return {
    ...doc.data(),
  };
}

// "upsert" ("update" or "insert") => inserts if not existsing. updates if it exists
export async function upsertTicker(symbol: string) {
  // symbol is the ref
  const data = {
    symbol,
    // ... and more company info or notes or whatever
  };
  await db.collection("tickers").doc(symbol).set(data);
  return {
    ...data,
  };
}

export async function getAllTickers() {
  const result: any = [];
  const docs = await db.collection("tickers").get();
  docs.forEach((doc: any) => {
    result.push({
      ...doc.data(),
    });
  });

  return result;
}
