import { db } from "../services/firestoreService";
import { ErrorDataDBType, ErrorDataParsedType } from "./errorsMeta";

export async function getError(refId: string) {
  const query = db.collection("errors");
  const results = await query.doc(refId).get();

  if (!results.data()) {
    return null;
  }
  const doc = results;
  const { runId, message, timestamp, miscJson } = doc.data() as ErrorDataDBType;
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

export async function getSpecificErrors(runIds: string[]) {
  const result: ErrorDataParsedType[] = [];
  const docs = await db
    .collection("errors")
    .where("runId", "in", runIds.slice(0, 10))
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
  const timestamp = Date.now();
  const data = {
    runId,
    message: message,
    timestamp: timestamp,
    miscJson: JSON.stringify(misc),
  };
  await db.collection("errors").doc(timestamp.toString()).set(data);
  return data;
}
