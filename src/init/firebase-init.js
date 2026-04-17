import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyDVXsJuFYDTWJFfGzKXklZMLe_Q9SUQbX0",
  authDomain: "anonymo-1.firebaseapp.com",
  databaseURL: "https://anonymo-1-default-rtdb.firebaseio.com",
  projectId: "anonymo-1",
  storageBucket: "anonymo-1.appspot.com",
  messagingSenderId: "1057020697347",
  appId: "1:1057020697347:web:8c1fd64e193582fdda6736",
  measurementId: "G-6SE7BK8WTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);