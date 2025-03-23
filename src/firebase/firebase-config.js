// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwgn1QS7oGEsw8ThmGyUQ7wBa-Izk0-Ds",
  authDomain: "time-fit-admin-web-app.firebaseapp.com",
  projectId: "time-fit-admin-web-app",
  storageBucket: "time-fit-admin-web-app.firebasestorage.app",
  messagingSenderId: "331504649756",
  appId: "1:331504649756:web:268894aa9943e47a0ac1d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Inicializa los servicios que usarás:
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export { auth, database, googleProvider };