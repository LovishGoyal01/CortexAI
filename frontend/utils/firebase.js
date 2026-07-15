// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cortexai-1614c.firebaseapp.com",
  projectId: "cortexai-1614c",
  storageBucket: "cortexai-1614c.firebasestorage.app",
  messagingSenderId: "601735827632",
  appId: "1:601735827632:web:0906d6c9c22a07f387eb75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// All line are on firebase just add thse bottom two lines