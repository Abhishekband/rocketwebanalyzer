// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { 
    getFirestore 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// =====================================================
// FIREBASE CONFIGURATION
// =====================================================
// Replace these values with your Firebase project's
// configuration from Firebase Console.

const firebaseConfig = {
  apiKey: "AIzaSyAE1c9OKqGHLEi6ralAiTMbCzwQnU7fuZ0",
  authDomain: "ai-web-traffic-analyzer.firebaseapp.com",
  projectId: "ai-web-traffic-analyzer",
  storageBucket: "ai-web-traffic-analyzer.firebasestorage.app",
  messagingSenderId: "983206433214",
  appId: "1:983206433214:web:f1ec5024f8327ee496a9ef",
  measurementId: "G-C3FJBN8DMC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
const auth = getAuth(app);

// Cloud Firestore
const db = getFirestore(app);

// Export so other JavaScript files can use Firebase
export { app, auth, db };