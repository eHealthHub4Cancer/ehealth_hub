// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9omkTlFN1eRgPRcC6Pe6wYR4umG9v_7s",
  authDomain: "ehealth-hub.firebaseapp.com",
  projectId: "ehealth-hub",
  storageBucket: "ehealth-hub.firebasestorage.app",
  messagingSenderId: "193859337748",
  appId: "1:193859337748:web:adc6281f367ff3e4147101",
  measurementId: "G-5T6F8TNT5K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, analytics };