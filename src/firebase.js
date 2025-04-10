// 📄 src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// 🔥 Replace with your own config from Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD8DmA9STlq2CHdcjpH1sXxxhdsGsMTcnE",
    authDomain: "expense-tracker-4f447.firebaseapp.com",
    databaseURL: "https://expense-tracker-4f447-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "expense-tracker-4f447",
    storageBucket: "expense-tracker-4f447.firebasestorage.app",
    messagingSenderId: "682508044961",
    appId: "1:682508044961:web:678ca9799bcf67e9383ee0",
    measurementId: "G-KWT07WZ60T"
  };
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
