import { auth, db } from "../js/firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= GLOBALS ================= */
let selectedJobId = null;
let selectedJobSkills = "";

/* ================= AUTH CHECK ================= */
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "../auth/index.html";
  } else {
    loadJobs();
  }
});

/* ================= LOAD POSTED JOBS ================= */
async function loadJobs() {
  const jobsList = document.getElementById("jobsList");
  jobsList.innerHTML = "";

  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, "jobs"),
    where("hrId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    jobsList.innerHTML = "<p>No jobs posted yet</p>";
    return;
  }

  snapshot.forEach((jobDoc) => {
    const job = jobDoc.data();

    const div = document.createElement("div");
    div.className = "job-card";
    div.innerHTML = `
      <h3>${job.title}</h3>
      <p><b>Skills:</b> ${job.skills}</p>
    `;

    div.onclick = () => openJobModal(jobDoc.id, job);

    jobsList.appendChild(div);
  });
}

/* ================= MATCH LOGIC ================= */
function calculateMatchPercentage(jobSkills, resumeText) {
  const skills = jobSkills
    .toLowerCase()
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  let matched = 0;

  skills.forEach(skill => {
    if (resumeText.includes(skill)) matched++;
  });

  return skills.length === 0
    ? 0
    : Math.round((matched / skills.length) * 100);
}

/* ================= OPEN JOB MODAL ================= */
async function openJobModal(jobId, job) {
  selectedJobId = jobId;
  selectedJobSkills = job.skills;

  document.getElementById("modalTitle").innerText = job.title;
  document.getElementById("modalSkills").innerText =
    "Required Skills: " + job.skills;

  document.getElementById("jobModal").classList.remove("hidden");

  await loadMatchedCandidates();
}

/* ================= LOAD MATCHED CANDIDATES ================= */
async function loadMatchedCandidates() {
  const table = document.getElementById("candidateTable");
  table.innerHTML = "";

  const snapshot = await getDocs(collection(db, "resumes"));

  let results = [];

  snapshot.forEach((docSnap) => {
    const resume = docSnap.data();

    const match = calculateMatchPercentage(
      selectedJobSkills,
      resume.resumeText.toLowerCase()
    );

    results.push({
      email: resume.email,
      match
    });
  });

  results.sort((a, b) => b.match - a.match);

  if (results.length === 0) {
    table.innerHTML = `<tr><td colspan="2">No candidates found</td></tr>`;
    return;
  }

  results.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.email}</td>
      <td>${r.match}%</td>
    `;
    table.appendChild(tr);
  });
}

/* ================= DELETE JOB ================= */
window.deleteJob = async function () {
  if (!selectedJobId) return;

  if (!confirm("Are you sure you want to delete this job?")) return;

  // ✅ FIXED LINE
  await deleteDoc(doc(db, "jobs", selectedJobId));

  closeModal();
  loadJobs();
};

/* ================= CLOSE MODAL ================= */
window.closeModal = function () {
  document.getElementById("jobModal").classList.add("hidden");
  document.getElementById("candidateTable").innerHTML = "";
  selectedJobId = null;
};

/* ================= BACK BUTTON ================= */
window.goBack = function () {
  window.location.href = "hr-dashboard.html";
};
