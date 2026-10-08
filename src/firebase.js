// Firebase Configuration & Initialization
// StayFinder — stayfind-97fee

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAGpkgj_qAXg3Os1QrowFaGqj_24b82ArU",
  authDomain: "stayfind-97fee.firebaseapp.com",
  projectId: "stayfind-97fee",
  storageBucket: "stayfind-97fee.firebasestorage.app",
  messagingSenderId: "18175495546",
  appId: "1:18175495546:web:db135b16e663b4db8f5ac3",
  measurementId: "G-0YYJ2QV7N4"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Safe Analytics Initialization (non-blocking)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  }).catch(() => {});
}

export { app, analytics, auth, db, storage };
