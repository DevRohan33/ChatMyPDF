import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBFs19eiR7FamNY63hnM6NM4opDQOCaMDQ",
    authDomain: "chatmypdf.firebaseapp.com",
    projectId: "chatmypdf",
    storageBucket: "chatmypdf.firebasestorage.app",
    messagingSenderId: "614535941562",
    appId: "1:614535941562:web:b6b100598283acdc7de183",
    measurementId: "G-1YZ2X2PYV3"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
