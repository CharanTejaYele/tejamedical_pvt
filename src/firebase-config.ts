// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCm1zfBx68aRzStG5lkP0PpntpzpmlsrCw",
  authDomain: "tejamedical-f8d3b.firebaseapp.com",
  databaseURL: "https://tejamedical-f8d3b-default-rtdb.firebaseio.com",
  projectId: "tejamedical-f8d3b",
  storageBucket: "tejamedical-f8d3b.appspot.com",
  messagingSenderId: "412287717878",
  appId: "1:412287717878:web:bd5f844ccdd3ebdf9c77d7",
  measurementId: "G-MBLTVXRTK8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
