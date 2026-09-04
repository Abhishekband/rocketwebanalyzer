import { auth, db } from "../js/firebase.js";


import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= LOGIN ================= */
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const loginButton = document.querySelector("#loginForm .submit-button");

  // Disable & blur the button
  loginButton.disabled = true;
  loginButton.classList.add("loading");

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
    const role = userDoc.data().role;

    if (role === "hr") {
      window.location.href = "/frontend/hr/hr-dashboard.html";
    } else {
      window.location.href = "/frontend/candidate/upload-resume.html";
    }
  } catch (error) {
    
  let msg = "Login failed. Please try again.";

  if (error.code === "auth/user-not-found") {
    msg = "No account found with this email.";
  } else if (error.code === "auth/wrong-password") {
    msg = "Incorrect password.";
  } else if (error.code === "auth/invalid-email") {
    msg = "Please enter a valid email address.";
  }

  showToast(msg, "error");

  loginButton.disabled = false;
  loginButton.classList.remove("loading");
}


    // Re-enable button on error
    loginButton.disabled = false;
    loginButton.classList.remove("loading");
  }
 );

/* ================= REGISTER ================= */
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const role = document.getElementById("role").value;
  const registerButton = document.querySelector("#registerForm .submit-button");

  // Disable & blur the button
  registerButton.disabled = true;
  registerButton.classList.add("loading");

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCred.user.uid), {
      email,
      role
    });

    showToast("Registration successful ✅");
  } catch (error) {
    alert(error.message);
    // Re-enable button on error
    registerButton.disabled = false;
    registerButton.classList.remove("loading");
  } finally {
    // Optional: remove blur if you want button to stay disabled until page refresh
    registerButton.classList.remove("loading");
  }
});


function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  toast.innerHTML = `
    <i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-xmark"}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.4s ease forwards";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
