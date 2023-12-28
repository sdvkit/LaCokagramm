import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4SxJqOCjNH20_asnCLZSVrrbfXAqdDNU",
  authDomain: "chat-d4bd5.firebaseapp.com",
  projectId: "chat-d4bd5",
  storageBucket: "chat-d4bd5.appspot.com",
  messagingSenderId: "1059431591573",
  appId: "1:1059431591573:web:1232218496b0fe58c0759c"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
