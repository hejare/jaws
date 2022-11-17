import { db } from "../services/firestoreService";

export type BreakoutDataType = {
  dailyRunRef: string;
  configRef: string;
  tickerRef: string;
  relativeStrength: number;
  breakoutValue: number;
  image: string;
};

export async function postBreakout(breakoutData: BreakoutDataType) {
  const data = {
    ...breakoutData,
    date: Date.now(),
  };
  const ref = await db.collection("breakouts").add(data);
  return {
    ...data,
    _ref: ref.id,
  };
}
