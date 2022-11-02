const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

interface SharksData {
    name: string,
    size: string
}

initializeApp({
  credential: cert(process.env.PATH_TO_SERVICE_ACCOUNT_FILE)
});

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






