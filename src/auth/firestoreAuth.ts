import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "@firebase/auth";

const enabledHejareUsers = [
  "leopold",
  "anna",
  "ludde",
  "damien",
  "johan.jansson",
];
const enabledExternalEmails = ["albin@theodoratech.se", "roosleo@gmail.com"];

export async function signInWithGoogle() {
  // try {
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

  // const credential = GoogleAuthProvider.credentialFromResult(result);
  // const token = credential?.accessToken;
  // const token2 = await user.getIdToken(true);
  // const payload = await admin.auth().verifyIdToken(token);
  console.log("Authenticated user:", user);
  return {
    displayName: user.displayName || "",
    email: user.email || "",
    lastSignInTime: user.metadata.lastSignInTime || "",
  };
}

export async function signOutUser() {
  const user = getAuth();
  await signOut(user);
  localStorage.clear();
}
