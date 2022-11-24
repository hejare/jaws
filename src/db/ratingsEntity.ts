import { db } from "../services/firestoreService";
import { RatingDataType } from "./ratingsMeta";

export async function getRatings(breakoutRef: string) {
  const query = db.collection("ratings");
  const docs = await query.where("breakoutRef", "==", breakoutRef).get();

  const result: any = [];
  docs.forEach((doc: any) => {
    result.push({
      ...doc.data(),
      _ref: doc.ref.id,
    });
  });

  return result;
}

export async function getRatingsForDailyRun(runId: string) {
  const result: any = [];
  const docs = await db
    .collection("ratings")
    .where("breakoutRef", ">=", runId)
    .where("breakoutRef", "<", (parseInt(runId) + 1).toString())
    .get();
  docs.forEach((doc: any) => {
    result.push({
      ...doc.data(),
      _ref: doc.ref.id,
    });
  });

  return result;
}

export async function getRating(breakoutRef: string, userRef: string) {
  const query = db.collection("ratings");
  const results = await query
    .where("breakoutRef", "==", breakoutRef)
    .where("userRef", "==", userRef)
    .get();
  if (results.size === 0) {
    return null;
  }

  const doc = results.docs[0];
  return {
    ...doc.data(),
    _ref: doc.ref.id,
  } as RatingDataType;
}

export async function postRating(inputData: RatingDataType) {
  const data = {
    ...inputData,
    timestamp: Date.now(),
  };
  return db.collection("ratings").add(data);
}

export async function putRating(refId: string, inputData: RatingDataType) {
  const data = {
    ...inputData,
    timestamp: Date.now(),
  };
  return db.collection("ratings").doc(refId).set(data);
}
