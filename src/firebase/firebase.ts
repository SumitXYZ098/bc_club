import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD4vmDRuiWZZiNK5kP1pkAt20uCHWkBEEc",
  authDomain: "login-bcclub.firebaseapp.com",
  projectId: "login-bcclub",
  storageBucket: "login-bcclub.firebasestorage.app",
  messagingSenderId: "265527084086",
  appId: "1:265527084086:web:62f1f6c14bc5389d064497",
  measurementId: "G-W1WQ990S5L",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const googlePopup = () => signInWithPopup(auth, provider);
