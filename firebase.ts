// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsAm_YX3iL_i_6SL6Vq5uMLtJabzNS2lo",
  authDomain: "note-craft.firebaseapp.com",
  projectId: "note-craft",
  storageBucket: "note-craft.appspot.com",
  messagingSenderId: "856112925816",
  appId: "1:856112925816:web:28b79592cd2ca9f4ae718d",
  measurementId: "G-2PBXMJXQV4"
};

// Initialize Firebase
const app = getApps().length === 0 ?  initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const analytics = getAnalytics(app);
export {db, analytics}