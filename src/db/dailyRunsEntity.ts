import { db } from "../services/firestoreService";

type DailyRunDataType = {
  status: "initiated" | "completed";
  duration: number;
  timeEnded: number;
};

export async function getDailyRun(runId: string) {
  const query = db.collection("daily-runs");
  const results = await query.where("runId", "==", runId).get();
  if (results.size === 0) {
    return null;
  }

  const doc = results.docs[0];
  return {
    ...doc.data(),
    _ref: doc.ref.id, // Note: Using ref id to simplify the reference handling. Use doc.ref (DocumentReference) if more advanced logs is needed later on
  };
}

export async function postDailyRun(runId: string) {
  const data = {
    runId,
    timeInitiated: Date.now(),
    timeEnded: Date.now(),
    duration: 1000,
    status: "ongoing",
  };

  const ref = await db.collection("daily-runs").add(data);
  return {
    ...data,
    _ref: ref.id,
  };
}

export async function putDailyRun(refId: string, data: DailyRunDataType) {
  return db.collection("daily-runs").doc(refId).set(data);
}

export async function getAllDailyRuns() {
  const result: any = [];
  const docs = await db.collection("daily-runs").get();
  docs.forEach((doc: any) => {
    result.push(doc.data());
  });

  return result;
}
