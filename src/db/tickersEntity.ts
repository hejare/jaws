import { db } from "../services/firestoreService"

export async function getTicker(symbol: string) {
  const query = db.collection("tickers");
  const results = await query.where("symbol", "==", symbol).get();
  if (results.size === 0) {
    return null;
  }

  const doc = results._docs()[0];
  return {
    ...doc.data(),
    _ref: doc.ref.id, // Note: Using ref id to simplify the reference handling. Use doc.ref (DocumentReference) if more advanced logs is needed later on
  }
}

export async function postTicker(symbol: string) {
  const data = {
    symbol,
    // tradeViewLink: `https://www.tradingview.com/symbols/${symbol}/`
  }

  const ref = await db.collection('tickers').add(data)
  return {
    ...data,
    _ref: ref.id,
  };
}
