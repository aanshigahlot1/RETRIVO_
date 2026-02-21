import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// 🔥 Firebase Config (YOUR PROJECT)
const firebaseConfig = {
  apiKey: "AIzaSyDiDOUE26n8nt9DVYtxRho73C14egX3kQM",
  authDomain: "retrivo-lost-and-found.firebaseapp.com",
  databaseURL:
    "https://retrivo-lost-and-found-default-rtdb.firebaseio.com",
  projectId: "retrivo-lost-and-found",
  storageBucket: "retrivo-lost-and-found.firebasestorage.app",
  messagingSenderId: "694488366486",
  appId: "1:694488366486:web:ae70da3e1e2b711cbe71b7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Database
export const db = getDatabase(app);