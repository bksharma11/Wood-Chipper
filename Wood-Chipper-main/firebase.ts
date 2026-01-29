
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqFbh7fuGJ3687pA4zTtir4IKcmlIHzKs",
  authDomain: "chipper-app-519b1.firebaseapp.com",
  databaseURL: "https://chipper-app-519b1-default-rtdb.firebaseio.com",
  projectId: "chipper-app-519b1",
  storageBucket: "chipper-app-519b1.firebasestorage.app",
  messagingSenderId: "486832204820",
  appId: "1:486832204820:web:bb1a81ff386180e6444b01",
  measurementId: "G-PNH52L45WG"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
