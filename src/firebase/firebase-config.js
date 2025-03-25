import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwgn1QS7oGEsw8ThmGyUQ7wBa-Izk0-Ds",
  authDomain: "time-fit-admin-web-app.firebaseapp.com",
  projectId: "time-fit-admin-web-app",
  storageBucket: "time-fit-admin-web-app.appspot.com",
  messagingSenderId: "331504649756",
  appId: "1:331504649756:web:268894aa9943e47a0ac1d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Optional: Configure Google Sign-In
googleProvider.setCustomParameters({
  'prompt': 'select_account'
});

export { auth, db, googleProvider };