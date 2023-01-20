import { db } from "@jaws/services/firestoreService";
import { ErrorDataDBType, ErrorDataParsedType } from "./errorsMeta";

export async function getErrors(refId: string) {
  const result: any = [];
  const query = db.collection("errors");
  const docs = await query.where("runId", "==", refId).get();

  docs.forEach((doc: any) => {
    const { runId, message, timestamp, miscJson } =
      doc.data() as ErrorDataDBType;
    result.push({
      message,
      timestamp,
      runId,
      misc: JSON.parse(miscJson),
    } as ErrorDataParsedType);
  });

  return result;
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

export async function postError(
  runId: string,
  message: string,
  misc: any,
  errorKey?: string,
) {
  const timestamp = Date.now();
  const data = {
    runId,
    message: message,
    timestamp: timestamp,
    miscJson: JSON.stringify(misc),
  };
  await db
    .collection("errors")
    .doc(errorKey || timestamp.toString())
    .set(data);
  return data;
}
