import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAjm-ybdu4shhI3eY4xWcn03V955gaSb-I",
    authDomain: "liliao-ea863.firebaseapp.com",
    projectId: "liliao-ea863",
    storageBucket: "liliao-ea863.appspot.com",
    messagingSenderId: "919631872978",
    appId: "1:919631872978:web:5bc7d5714132b58dc9fe0b",
    measurementId: "G-6Y381S9BLN"
  };


export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);