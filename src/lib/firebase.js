import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAOK9RTGfMbyjPJ0NGYfny23zosKl-PngA",
  authDomain: "instachat-ea00a.firebaseapp.com",
  projectId: "instachat-ea00a",
  storageBucket: "instachat-ea00a.appspot.com",
  messagingSenderId: "703510367332",
  appId: "1:703510367332:web:a6a2e4afb9e9480b84a371",
  measurementId: "G-BJ7F9FEHLT",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
