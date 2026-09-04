import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyDIPSiRQ79ZmQAr-7hHeyOGeFASOR7qUXU",
  authDomain: "ai-resume-screening-9374d.firebaseapp.com",
  projectId: "ai-resume-screening-9374d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= CLOUDINARY CONFIG ================= */
const CLOUD_NAME = "dsjwjftni";
const UPLOAD_PRESET = "Resumes";

/* ================= ELEMENTS ================= */
const form = document.getElementById("resumeForm");
const msg = document.getElementById("msg");

/* ================= PDF.JS LOAD ================= */
import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";

/* ================= RESUME UPLOAD ================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Uploading resume...";
  msg.style.color = "#00eaff";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const file = document.getElementById("resume").files[0];

  if (!file) {
    msg.textContent = "Please select a PDF file";
    msg.style.color = "red";
    return;
  }

  try {
    /* ===== 1. UPLOAD TO CLOUDINARY ===== */
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    if (!uploadRes.ok) throw new Error("Cloudinary upload failed");

    const uploadData = await uploadRes.json();
    const resumeURL = uploadData.secure_url;

    /* ===== 2. EXTRACT TEXT FROM PDF ===== */
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      extractedText += strings.join(" ") + " ";
    }

    /* ===== 3. STORE IN FIRESTORE ===== */
    await addDoc(collection(db, "resumes"), {
      name,
      email,
      resumeURL,
      resumeText: extractedText.toLowerCase(),
      createdAt: serverTimestamp()
    });

    msg.textContent = "✅ Resume uploaded successfully!";
    msg.style.color = "#00ff9d";
    form.reset();

  } catch (err) {
    console.error(err);
    msg.textContent = "❌ Upload failed. Try again.";
    msg.style.color = "red";
  }
});

/* ================= LOGOUT ================= */
window.logout = async function () {
  await signOut(auth);
  window.location.href = " /index.html";
};
