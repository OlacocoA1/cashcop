// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCThCejvaE5K7rUwwMcQZYeuGd7rkhqhmQ",
  authDomain: "cashchop-aa33e.firebaseapp.com",
  projectId: "cashchop-aa33e",
  storageBucket: "cashchop-aa33e.firebasestorage.app",
  messagingSenderId: "977465105616",
  appId: "1:977465105616:web:f8dcd659d244c1b5dd52d5",
  measurementId: "G-R471K682RM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
