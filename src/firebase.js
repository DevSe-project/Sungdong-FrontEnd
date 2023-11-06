// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAj1-LmumpYRZmWVQtu8awCRs6KGrxHGQg",
  authDomain: "sungdong-web.firebaseapp.com",
  projectId: "sungdong-web",
  storageBucket: "sungdong-web.appspot.com",
  messagingSenderId: "377033696380",
  appId: "1:377033696380:web:89f804e8484d47ece895f9",
  measurementId: "G-YNS80BXYN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);