import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "@firebase/auth";
import { getApp } from "../auth/initializeFirebase";
import { ONE_HOUR_IN_MS } from "../lib/helpers";

const enabledHejareUsers = [
  "leopold",
  "anna",
  "ludde",
  "damien",
  "johan.jansson",
];
const enabledExternalEmails = ["albin@theodoratech.se", "roosleo@gmail.com"];

export async function signInWithGoogle() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  const result = await signInWithPopup(auth, provider);

  const user = result.user;
  const { email } = user;
  if (!email) {
    throw new Error("Sorry, You must ask #Jaws-team for access.");
  }

  const [name, domain]: string[] = email.split("@");
  if (domain !== "hejare.se" && !enabledExternalEmails.includes(email)) {
    throw new Error(
      "Sorry, you must use your @hejare account. (Or ask #Jaws-team for external access)",
    );
  } else if (domain === "hejare.se" && !enabledHejareUsers.includes(name)) {
    throw new Error(
      `Sorry, ${name}, you must ask #Jaws-team for individual Hejare access.`,
    );
  }

  const idToken = await user.getIdToken();
  return {
    userId: user.uid,
    idToken: idToken,
    displayName: user.displayName || "",
    email: user.email || "",
    sessionExpires: Date.now() + ONE_HOUR_IN_MS,
  };
}

export const refresh = async () => {
  const app = getApp();
  const auth = getAuth(app);
  return auth.currentUser?.getIdToken();
};

export async function signOutUser() {
  const user = getAuth();
  await signOut(user);
  localStorage.clear();
}
