import { db } from "../services/firestoreService";

export interface ExistingBreakoutDataType extends BreakoutDataType {
  _ref: string;
}

export interface BreakoutWithRatingDataType extends BreakoutDataType {
  _ref: string;
  rating?: number;
}

export type BreakoutDataType = {
  dailyRunRef: string;
  configRef: string;
  tickerRef: string;
  relativeStrength: number;
  breakoutValue: number;
  image: string;
};

export async function getBreakout(refId: string) {
  const query = db.collection("breakouts");
  const doc = await query.doc(refId).get();
  if (!doc.data()) {
    return null;
  }
  return {
    ...doc.data(),
    _ref: doc.ref.id,
  };
}

export async function getBreakOutsForTicker(ticker: string) {
  const result: any = [];
  const query = db.collection("breakouts");
  const docs = await query.where("tickerRef", "==", ticker).get();

  docs.forEach((doc: any) => {
    result.push({
      ...doc.data(),
      _ref: doc.ref.id,
    });
  });
  return result;
}

export async function putBreakout(refId: string, data: BreakoutDataType) {
  return db.collection("breakouts").doc(refId).set(data);
}

// "upsert" ("update" or "insert") => inserts if not existsing. updates if it exists
export async function upsertBreakout(breakoutData: BreakoutDataType) {
  const refId = `${breakoutData.dailyRunRef}-${breakoutData.tickerRef}`;
  const data = {
    ...breakoutData,
    timestamp: Date.now(),
  };
  return db.collection("breakouts").doc(refId).set(data);
}

export async function getAllBreakouts() {
  const result: any = [];
  const docs = await db.collection("breakouts").get();
  docs.forEach((doc: any) => {
    result.push({
      ...doc.data(),
      _ref: doc.ref.id,
    });
  });

  return result;
}

export async function getBreakoutsByDailyRun(dailyRunRef: string) {
  const result: any = [];
  const query = db.collection("breakouts");
  const docs = await query.where("dailyRunRef", "==", dailyRunRef).get();

  docs.forEach((doc: any) => {
    result.push({
      ...doc.data(),
      _ref: doc.ref.id,
    });
  });

  return result;
}
