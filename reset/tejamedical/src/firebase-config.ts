// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJBvpETns6owQSAj8_B-eVOgipI5HkcI0",
  authDomain: "teja-medical.firebaseapp.com",
  databaseURL: "https://teja-medical-default-rtdb.firebaseio.com",
  projectId: "teja-medical",
  storageBucket: "teja-medical.appspot.com",
  messagingSenderId: "172072052190",
  appId: "1:172072052190:web:fcd64bdc368615ed0c294f",
  measurementId: "G-GF92STGY2Y",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
