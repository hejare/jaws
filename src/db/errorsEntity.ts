import { db } from "../services/firestoreService";
import { ErrorDataParsedType } from "./errorsMeta";

export async function getError(runId: string) {
  const query = db.collection("error");
  const results = await query.where("runId", "==", runId).get();
  if (results.size === 0) {
    return null;
  }

  const doc = results.docs[0];
  const { message, timestamp, miscJson } = doc.data();
  return {
    message,
    timestamp,
    runId,
    misc: JSON.parse(miscJson),
  } as ErrorDataParsedType;
}

export async function getErrorsByDate(date: string) {
  const result: ErrorDataParsedType[] = [];
  const docs = await db
    .collection("errors")
    .where("runId", ">=", date)
    .where("runId", "<", (parseInt(date) + 1).toString())
    .get();
  docs.forEach((doc: any) => {
    const { message, runId, timestamp, miscJson } = doc.data();
    result.push({
      message,
      timestamp,
      runId,
      misc: JSON.parse(miscJson),
    });
  });

  return result;
}

export async function postError(runId: string, message: string, misc: any) {
  const data = {
    runId,
    message: message,
    timestamp: Date.now(),
    miscJson: JSON.stringify(misc),
  };
  await db.collection("errors").doc(runId).set(data);
}
