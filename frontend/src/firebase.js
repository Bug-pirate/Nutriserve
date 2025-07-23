// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCeOqr1GPMXFpy13N91WXxpypjZCHhOwMI",
  authDomain: "nutriserve-ff504.firebaseapp.com",
  projectId: "nutriserve-ff504",
  storageBucket: "nutriserve-ff504.firebasestorage.app",
  messagingSenderId: "239628471576",
  appId: "1:239628471576:web:21ed331496faadbc3e226d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth
export const auth = getAuth(app);
