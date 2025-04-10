// 📄 src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage'; // ✅ import storage

// 🔥 Replace with your own config from Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD8DmA9STlq2CHdcjpH1sXxxhdsGsMTcnE",
  authDomain: "expense-tracker-4f447.firebaseapp.com",
  databaseURL: "https://expense-tracker-4f447-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "expense-tracker-4f447",
  storageBucket: "expense-tracker-4f447.appspot.com", // ✅ small fix here too (was `.app`, should be `.appspot.com`)
  messagingSenderId: "682508044961",
  appId: "1:682508044961:web:678ca9799bcf67e9383ee0",
  measurementId: "G-KWT07WZ60T"
};

const app = initializeApp(firebaseConfig);

// ✅ Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// ✅ Export cleanly
export { auth, db, functions, storage };
