import { db } from "../services/firestoreService";
import { RatingDataType } from "./ratingsMeta";

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
