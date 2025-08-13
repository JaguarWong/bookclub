// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAQrxoIeQfRGX9PCc9VYUAo04J_tadmAJM",
//   authDomain: "bookclub-d50d6.firebaseapp.com",
//   projectId: "bookclub-d50d6",
//   storageBucket: "bookclub-d50d6.firebasestorage.app",
//   messagingSenderId: "590674284",
//   appId: "1:590674284:web:53f5bf7d94ae43f4bf1b49",
//   measurementId: "G-0PY2MNBZ1B"
// };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Export Firestore instance
// export { db, collection, addDoc, serverTimestamp };


// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc
} from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAQrxoIeQfRGX9PCc9VYUAo04J_tadmAJM",
  authDomain: "bookclub-d50d6.firebaseapp.com",
  projectId: "bookclub-d50d6",
  storageBucket: "bookclub-d50d6.firebasestorage.app",
  messagingSenderId: "590674284",
  appId: "1:590674284:web:53f5bf7d94ae43f4bf1b49",
  measurementId: "G-0PY2MNBZ1B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export everything you need
export {
  db,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc
};
