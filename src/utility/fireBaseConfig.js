// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB2wwcXGmbjZyhYGoND4dnaOkO4grSKezc",
    authDomain: "vueshop-4ffbb.firebaseapp.com",
    projectId: "vueshop-4ffbb",
    storageBucket: "vueshop-4ffbb.firebasestorage.app",
    messagingSenderId: "1067528313977",
    appId: "1:1067528313977:web:980390bde2d1687b6308a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
export { app as firebaseApp, db, auth }