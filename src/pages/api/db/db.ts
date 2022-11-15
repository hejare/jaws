const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

import { certJson } from "../db/firebaseCert";

if (!(getApps().length)) {
  initializeApp({
    credential: cert(certJson)
  });
}

const db = getFirestore();

export async function getDailyRun(runId: string) {
  const query = db.collection("daily-runs");
  const results = await query.where("runId", "==", runId).get();
  if (results.size === 0) {
    return null;
  }

  const doc = results._docs()[0];
  return {
    ...doc.data(),
    _ref: doc.ref.id, // Note: Using ref id to simplify the reference handling. Use doc.ref (DocumentReference) if more advanced logs is needed later on
  }
}

export async function postDailyRun(runId: string) {
  const data = {
    runId,
    timeInitiated: Date.now(),
    timeEnded: Date.now(),
    duration: 1000,
    status: "ongoing",
  }

  const ref = await db.collection('daily-runs').add(data)
  return {
    ...data,
    _ref: ref.id
  };
}

export type DailyRunDataType = {
  status: "initiated" | "completed";
  duration: number;
  timeEnded: number;
}
export async function putDailyRun(refId: string, data: DailyRunDataType) {
  return db.collection('daily-runs').doc(refId).set(data)
}

export async function postTicker() {

  // todo check if ticker already exists in DB

  const data = {
    symbol: "TSLA",
    comment: "Electric cars",
    tradeViewLink: "https://tradingwiew_blabla.com"
  }

  await db.collection('tickers').doc().set(data)
}

async function getTicker() {
  // TODO getTicker
}

export async function postConfig() {
  const data = {
    someField: "a",
    someOtherField: "b",
    date: Date.now()
  }

  await db.collection('configs').doc().set(data)
}

async function getConfig() {
  // TODO getConfig
}


export async function postBreakout(runId: string) {

  // ? configRef and tickerRef from where? getConfig, getTicker -> givet runId

  const data = {
    dailyRunRef: runId,
    configRef: "blabla",
    tickerRef: "blabla",
    relativeStrength: 123449,
    breakoutValue: 12893,
    image: "somestorage/blaha/graph.png",
    date: Date.now(),
  }

  await db.collection('breakouts').doc().set(data)

}






