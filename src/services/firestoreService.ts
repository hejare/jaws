const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

import { certJson } from "./firebaseCert";

if (!getApps().length) {
  initializeApp({
    credential: cert(certJson),
  });
}

export const db = getFirestore();
