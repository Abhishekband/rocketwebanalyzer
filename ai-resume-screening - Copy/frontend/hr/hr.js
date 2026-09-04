import { auth, db } from "../js/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= POST JOB ================= */
document.getElementById("jobForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("jobTitle").value.trim();
  const skills = document.getElementById("jobSkills").value.trim();

  const user = auth.currentUser;
  if (!user) return;

  try {
    await addDoc(collection(db, "jobs"), {
      title,
      skills,
      hrId: user.uid,
      createdAt: serverTimestamp()
    });

    alert("Job posted successfully ✅");
    document.getElementById("jobForm").reset();
    loadJobs();

  } catch (error) {
    alert(error.message);
  }
});

/* ================= LOAD HR JOBS ================= */
async function loadJobs() {
  const jobList = document.getElementById("jobList");
  if (!jobList) return;

  jobList.innerHTML = "";

  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, "jobs"),
    where("hrId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    jobList.innerHTML = "<p>No jobs posted yet</p>";
    return;
  }

  snapshot.forEach((doc) => {
    const job = doc.data();

    const div = document.createElement("div");
    div.style.marginBottom = "15px";
    div.innerHTML = `
      <strong>${job.title}</strong><br>
      <small><b>Skills:</b> ${job.skills}</small>
      <hr>
    `;
    jobList.appendChild(div);
  });
}

/* ================= AUTH CHECK ================= */
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "../auth/index.html";
  } else {
    loadJobs();
  }
});

/* ================= PANEL TOGGLE (LOGIN / REGISTER STYLE) ================= */
window.toggleHRPanel = function () {
  const wrapper = document.querySelector(".hr-wrapper");

  if (!wrapper) return;

  wrapper.classList.toggle("toggled");

  if (wrapper.classList.contains("toggled")) {
    loadJobs();
  }
};

/* ================= LOGOUT ================= */
window.logout = async function () {
  await signOut(auth);
  window.location.href = " /index.html";
};
