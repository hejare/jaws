import { db } from "../services/firestoreService";

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
  const results = await query.doc(refId).get();

  console.log("breakout:", results);
  // if (results.size === 0) {
  //   return null;
  // }
  // const doc = results.docs[0];
  const doc = results;
  return {
    ...doc.data(),
    _ref: doc.ref.id, // Note: Using ref id to simplify the reference handling. Use doc.ref (DocumentReference) if more advanced logs is needed later on
  };
}

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

export async function getAllBreakouts() {
  const result: any = [];
  const docs = await db.collection("breakouts").get();
  docs.forEach((doc: any) => {
    result.push(doc.data());
  });

  return result;
}
