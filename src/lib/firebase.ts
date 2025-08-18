
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "budgetwise-tp3pe",
  "appId": "1:943872607880:web:66ee805b18066841f1c13d",
  "storageBucket": "budgetwise-tp3pe.appspot.com",
  "apiKey": "AIzaSyA_zB2haKA_5ccUuRLBzmDzfoEgkr1ge8w",
  "authDomain": "budgetwise-tp3pe.firebaseapp.com",
  "messagingSenderId": "943872607880",
  "measurementId": "G-MEASUREMENT_ID"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
