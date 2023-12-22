import { initializeApp } from 'firebase/app'; // 'app' 모듈에서 'initializeApp'을 가져옴

// Firebase의 다른 모듈을 필요에 따라 가져옴
import { getFirestore } from 'firebase/firestore';

// Firebase 앱 초기화
const firebaseConfig = {
  apiKey: "AIzaSyAj1-LmumpYRZmWVQtu8awCRs6KGrxHGQg",
  authDomain: "sungdong-web.firebaseapp.com",
  databaseURL: "https://sungdong-web-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sungdong-web",
  storageBucket: "sungdong-web.appspot.com",
  messagingSenderId: "377033696380",
  appId: "1:377033696380:web:89f804e8484d47ece895f9",
  measurementId: "G-YNS80BXYN9"
};

const app = initializeApp(firebaseConfig);

// Firebase 모듈 사용
const db = getFirestore(app);

export { app, db }; // 다른 파일에서 Firebase 모듈을 가져올 수 있도록 내보내기