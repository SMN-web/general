// login.js
// 1. Setup Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtZnYYDb5TR01G6zsCtrF0HBR6pnQ2Beg",
    authDomain: "general-68ca7.firebaseapp.com",
    projectId: "general-68ca7",
    storageBucket: "general-68ca7.firebasestorage.app",
    messagingSenderId: "674522865143",
    appId: "1:674522865143:web:c4ec47f2e370c33c3ca2f2",
    measurementId: "G-6L0DXHGCBE"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 2. Login Handler
document.getElementById("login-btn").onclick = async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const msg = document.getElementById("login-msg");
  msg.textContent = "";

  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    const user = cred.user;
    const idToken = await user.getIdToken();
    // Save token for later API calls
    sessionStorage.setItem("firebaseIdToken", idToken);

    // 3. Tell backend your email (optionally)
    const res = await fetch("https://login.nafil-8895-s.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + idToken
      },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok || !data.role) {
      msg.textContent = data.message || "❌ Login failed";
      return;
    }
    // Show dashboard with user role
    document.getElementById("login-panel").style.display = "none";
    document.getElementById("dashboard-panel").style.display = "";
    document.getElementById("dash-role").textContent = "Welcome, " + data.role;
  } catch (err) {
    msg.textContent = "❌ " + (err.message || "Invalid login");
  }
};

// 4. Persistent login/session check
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const idToken = await user.getIdToken();
    // Optionally: get user's role again from backend
    document.getElementById("login-panel").style.display = "none";
    document.getElementById("dashboard-panel").style.display = "";
    document.getElementById("dash-role").textContent = "Welcome Back!";
    sessionStorage.setItem("firebaseIdToken", idToken);
  }
});

// 5. Logout handler
document.getElementById("logout-btn").onclick = async () => {
  await auth.signOut();
  sessionStorage.clear();
  document.getElementById("dashboard-panel").style.display = "none";
  document.getElementById("login-panel").style.display = "";
};
