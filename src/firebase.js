// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/firestore";
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

// firebaseConfig 정보로 firebase 시작
firebase.initializeApp(firebaseConfig);

// firebase의 firestore 인스턴스를 변수에 저장
const firestore = firebase.firestore();

// 필요한 곳에서 사용할 수 있도록 내보내기
export { firestore };