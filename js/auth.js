import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export function register(email, password){
  return createUserWithEmailAndPassword(auth,email,password);
}
export function login(email,password){
  return signInWithEmailAndPassword(auth,email,password);
}
export function authCheck(callback){
  onAuthStateChanged(auth,callback);
}
