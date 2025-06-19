// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";  // ← ADD THIS LINE
import config from './config';

// Initialize Firebase
const app = initializeApp(config.firebase);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);  // ← ADD THIS LINE

export { db, auth, analytics, storage };  // ← ADD storage TO EXPORTS