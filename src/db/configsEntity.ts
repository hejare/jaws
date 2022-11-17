import { db } from "../services/firestoreService";

type ConfigDataType = {};

export async function getConfig(refId: string) {
  const query = db.collection("configs");
  const results = await query.doc(refId).get();

  if (results.size === 0) {
    return null;
  }
  const doc = results._docs()[0];
  return {
    ...doc.data(),
    _ref: doc.ref.id, // Note: Using ref id to simplify the reference handling. Use doc.ref (DocumentReference) if more advanced logs is needed later on
  };
}

export async function getLatestConfig() {
  const latestConfig = await db
    .collection("configs")
    .orderBy("timestamp", "desc")
    .limit(1)
    .get();
  if (latestConfig.size === 0) {
    return null;
  }

  const doc = latestConfig._docs()[0];
  return {
    ...doc.data(),
    _ref: doc.ref.id, // Note: Using ref id to simplify the reference handling. Use doc.ref (DocumentReference) if more advanced logs is needed later on
  };
}

export async function postConfig(data: ConfigDataType) {
  const ref = await db.collection("configs").add(data);
  return {
    ...data,
    _ref: ref.id,
  };
}

export async function putConfig(refId: string, data: ConfigDataType) {
  return db.collection("configs").doc(refId).set(data);
}
