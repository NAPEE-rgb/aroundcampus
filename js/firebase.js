// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDOP-zPbX8PVC_hPvyBx1piqaPXnpnnqf4",
  authDomain: "around-campus-af30e.firebaseapp.com",
  projectId: "around-campus-af30e",
  storageBucket: "around-campus-af30e.firebasestorage.app",
  messagingSenderId: "103282625956",
  appId: "1:103282625956:web:19659f7c9224a7df140531"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
