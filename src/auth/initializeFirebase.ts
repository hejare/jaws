import { initializeApp } from "@firebase/app";

export default function initializeFirebase() {
  initializeApp({
    apiKey: "AIzaSyBonFpyHM1Z-reqvpwsttfIlHwUXoIGOX4",
    authDomain: "jaws-sharkster.firebaseapp.com",
    databaseURL: "https://jaws-sharkster.firebaseio.com",
    projectId: "jaws-sharkster",
  });
}
