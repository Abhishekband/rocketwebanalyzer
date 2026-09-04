import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIPSiRQ79ZmQAr-7hHeyOGeFASOR7qUXU",
  authDomain: "ai-resume-screening-9374d.firebaseapp.com",
  projectId: "ai-resume-screening-9374d",
  storageBucket: "ai-resume-screening-9374d.appspot.com",
  messagingSenderId: "784549985286",
  appId: "1:784549985286:web:ddeb092ed820a98b2d1787"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("🔥 Firebase fully initialized");
