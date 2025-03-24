
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCs8YqWU_YOu1Xms5yL3M-zQLHcrLPYFpM",
  authDomain: "garbagecollector-7bc51.firebaseapp.com",
  projectId: "garbagecollector-7bc51",
  storageBucket: "garbagecollector-7bc51.firebasestorage.app",
  messagingSenderId: "543646550751",
  appId: "1:543646550751:web:4c1fc3b34b44986993f76a"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);