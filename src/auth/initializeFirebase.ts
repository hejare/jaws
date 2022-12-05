import { initializeApp } from "@firebase/app";

let app: any;

function initializeFirebase() {
  app = initializeApp({
    apiKey: "AIzaSyBonFpyHM1Z-reqvpwsttfIlHwUXoIGOX4",
    authDomain: "jaws-sharkster.firebaseapp.com",
    databaseURL: "https://jaws-sharkster.firebaseio.com",
    projectId: "jaws-sharkster",
  });
}

export default initializeFirebase;
export const getApp = () => app;
