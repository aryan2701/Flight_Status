
// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBRnyBcjmOo1x3hH1iGF8XRRdg_sXG9tjY",
  authDomain: "flightsupdates-9831a.firebaseapp.com",
  projectId: "flightsupdates-9831a",
  storageBucket: "flightsupdates-9831a.appspot.com",
  messagingSenderId: "332620022538",
  appId: "1:332620022538:web:bd544b87eec7e310d170f3",
  measurementId: "G-XLG2ETWJVR",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
