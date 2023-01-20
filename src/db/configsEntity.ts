import { db } from "@jaws/services/firestoreService";

type ConfigDataType = Record<string, string | number>;

export async function getConfig(refId: string) {
  const query = db.collection("configs");
  const doc = await query.doc(refId).get();
  if (!doc.data()) {
    return null;
  }
  return {
    ...doc.data(),
    _ref: doc.ref.id,
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

  const doc = latestConfig.docs[0];
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
  const res = await db.collection("configs").doc(refId).set(data);
  return res;
}

export async function getAllConfigs() {
  const result: any = [];
  const docs = await db.collection("configs").get();
  docs.forEach((doc: any) => {
    result.push({
      ...doc.data(),
      _ref: doc.ref.id,
    });
  });

  return result;
}
