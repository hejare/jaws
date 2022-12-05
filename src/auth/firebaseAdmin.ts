// Allow importing firebase-admin as wildcard.
/* eslint-disable no-import-assign */
import firebaseAdmin from "firebase-admin";

import {
  initializeApp,
  cert,
  getApps,
  ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { certJson } from "../services/firebaseCert";

if (!getApps().length) {
  initializeApp({
    credential: cert(<ServiceAccount>certJson),
  });
}

const firestore = getFirestore();
const auth = firebaseAdmin.auth();

export { firestore, auth };
