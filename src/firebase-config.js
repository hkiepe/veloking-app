import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

/* const firebaseConfig = {
  // TODO create a .ENV file to secure my data
  apiKey: "AIzaSyBrmJySbDW85r8z_G3GNsMkVlktcJNC9nY",
  authDomain: "yield-backend.firebaseapp.com",
  projectId: "yield-backend",
  storageBucket: "yield-backend.appspot.com",
  messagingSenderId: "647360894787",
  appId: "1:647360894787:web:8bd96ec957365a497a41f6",
}; */

const firebaseConfig = {
  apiKey: "AIzaSyCLqQ90QElqBR9uY4rLRGEFS6R3MlwThGQ",
  authDomain: "veloking-backend.firebaseapp.com",
  projectId: "veloking-backend",
  storageBucket: "veloking-backend.appspot.com",
  messagingSenderId: "379515048574",
  appId: "1:379515048574:web:9a379b399adf8866b17e2f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
