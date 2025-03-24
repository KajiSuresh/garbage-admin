import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCs8YqWU_YOu1Xms5yL3M-zQLHcrLPYFpM",
  authDomain: "garbagecollector-7bc51.firebaseapp.com",
  projectId: "garbagecollector-7bc51",
  storageBucket: "garbagecollector-7bc51.firebasestorage.app",
  messagingSenderId: "543646550751",
  appId: "1:543646550751:web:4c1fc3b34b44986993f76a"
};
// Initialize Firebase only if it hasn't been initialized already
let app;
const auth = getAuth(getFirebaseApp());
const db = getFirestore(getFirebaseApp());

function getFirebaseApp() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  } else {
    return getApps()[0];
  }
}

export { app, auth, db };