// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvVfZmY0yPSYj_Q-53AGk90R-I3Epob0M",
  authDomain: "sareewebsite-8926c.firebaseapp.com",
  projectId: "sareewebsite-8926c",
  storageBucket: "sareewebsite-8926c.firebasestorage.app",
  messagingSenderId: "486878958316",
  appId: "1:486878958316:web:d7ee126983b25ad1390bc9",
  measurementId: "G-8JN99R6E44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);