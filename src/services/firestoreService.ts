import {
  initializeApp,
  cert,
  getApps,
  ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { certJson } from "./firebaseCert";

console.log("certJson:", certJson);
if (!getApps().length) {
  initializeApp({
    credential: cert(<ServiceAccount>certJson),
  });
}

export const db = getFirestore();
