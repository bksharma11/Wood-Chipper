
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrr97f_JeUiVIgHch7jeVMTX0uyTeroTc",
  authDomain: "wood-chipper-f73d8.firebaseapp.com",
  databaseURL: "https://wood-chipper-f73d8-default-rtdb.firebaseio.com",
  projectId: "wood-chipper-f73d8",
  storageBucket: "wood-chipper-f73d8.firebasestorage.app",
  messagingSenderId: "965375691222",
  appId: "1:965375691222:web:34cea49e2cc8c69a16fc77",
  measurementId: "G-GWWEVELJ4B"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
