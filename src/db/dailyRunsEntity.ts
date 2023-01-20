import { db } from "@jaws/services/firestoreService";
import { DailyRunDataType, DailyRunStatus } from "./dailyRunsMeta";

export async function getDailyRun(runId: string) {
  const query = db.collection("daily-runs");
  const results = await query.where("runId", "==", runId).get();
  if (results.size === 0) {
    return null;
  }

  const doc = results.docs[0];
  return {
    ...doc.data(),
  } as DailyRunDataType;
}

export async function getDailyRunByDate(date: string) {
  const result: any = [];
  const docs = await db
    .collection("daily-runs")
    .where("runId", ">=", date)
    .where("runId", "<", (parseInt(date) + 1).toString())
    .get();
  docs.forEach((doc: any) => {
    result.push({
      ...doc.data(),
      _ref: doc.ref.id,
    });
  });

  return result;
}

export async function postDailyRun(runId: string) {
  const data = {
    runId,
    timeInitiated: Date.now(),
    status: DailyRunStatus.INITIATED,
  };
  await db.collection("daily-runs").doc(runId).set(data);
  return {
    ...data,
  } as DailyRunDataType;
}

export async function putDailyRun(refId: string, data: DailyRunDataType) {
  return db.collection("daily-runs").doc(refId).set(data);
}

export async function getAllDailyRuns() {
  const result: any = [];
  const docs = await db.collection("daily-runs").get();
  docs.forEach((doc: any) => {
    result.push({
      ...doc.data(),
      _ref: doc.ref.id,
    });
  });

  return result;
}

export async function getLatestDailyRun() {
  const docs = await db
    .collection("daily-runs")
    .orderBy("timeInitiated", "desc")
    .limit(1)
    .get();

  const result: DailyRunDataType[] = [];
  docs.forEach((doc: any) => {
    result.push({
      ...doc.data(),
      _ref: doc.ref.id,
    });
  });

  if (result.length === 0) {
    return null;
  }
  return result[0];
}
