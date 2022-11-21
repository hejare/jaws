const { FIRESTORE_PRIVATE_KEY, FIRESTORE_PRIVATE_KEY_ID } = process.env;

const FIRESTORE_PRIVATE_KEY_ADJUSTED = FIRESTORE_PRIVATE_KEY.replace("\\n", "\n");

console.log("FIRESTORE_PRIVATE_KEY_ADJUSTED=", FIRESTORE_PRIVATE_KEY_ADJUSTED)
const FIRESTORE_PROJECT_ID = "jaws-sharkster";
const FIRESTORE_CLIENT_EMAIL =
  "firebase-adminsdk-t8lhg@jaws-sharkster.iam.gserviceaccount.com";
const FIRESTORE_CLIENT_ID = "100601735786943602379";
const FIRESTORE_AUTH_URI = "https://accounts.google.com/o/oauth2/auth";
const FIRESTORE_TOKEN_URI = "https://oauth2.googleapis.com/token";
const FIRESTORE_AUTH_PROVIDER_X509_CERT_URL =
  "https://www.googleapis.com/oauth2/v1/certs";
const FIRESTORE_CLIENT_X509_CERT_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-t8lhg%40jaws-sharkster.iam.gserviceaccount.com";

export const certJson = {
  type: "service_account",
  project_id: FIRESTORE_PROJECT_ID,
  private_key_id: FIRESTORE_PRIVATE_KEY_ID,
  private_key: FIRESTORE_PRIVATE_KEY_ADJUSTED,
  client_email: FIRESTORE_CLIENT_EMAIL,
  client_id: FIRESTORE_CLIENT_ID,
  auth_uri: FIRESTORE_AUTH_URI,
  token_uri: FIRESTORE_TOKEN_URI,
  auth_provider_x509_cert_url: FIRESTORE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: FIRESTORE_CLIENT_X509_CERT_URL,
};
