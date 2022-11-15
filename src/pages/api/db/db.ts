const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

interface SharksData {
    name: string,
    size: string
}

if (!(getApps().length)) {
  initializeApp({
    credential: cert(process.env.PATH_TO_SERVICE_ACCOUNT_FILE)
  });
}

const db = getFirestore();

export async function getSharks() {
  let sharks: SharksData[] = [];
  const snapShot =  await db.collection('sharks').get()
  snapShot.forEach((doc: any) => {
    const {name, size} = doc.data()
    sharks.push({name, size})
})

return sharks
}

export async function postDailyRun(runId: string) {
  const data = {
    runId,
    timeInitiated: Date.now(),
    timeEnded: Date.now(),
    duration: 1000,
    status: "ongoing",
  }

  await db.collection('daily-runs').doc().set(data)

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


export async function postBreakout(runId: string ) {

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






