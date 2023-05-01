// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDt10-jQPEW7miWLQFAWg_nnObgmXvh92Y",
    authDomain: "react-4d966.firebaseapp.com",
    projectId: "react-4d966",
    storageBucket: "react-4d966.appspot.com",
    messagingSenderId: "2969662134",
    appId: "1:2969662134:web:f2f9bdf938e87370072c17",
    measurementId: "G-3SM7TN6Y4N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app);