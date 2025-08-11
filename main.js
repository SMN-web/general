// 🔄 Show one panel
export function showPanel(id) {
  document.querySelectorAll(".panel").forEach(panel => {
    panel.classList.add("hidden");
  });
  document.getElementById(id)?.classList.remove("hidden");
}

export function startHeartbeat() {
  const email = sessionStorage.getItem("loggedInEmail");
  if (!email) return;

  const send = () => {
    fetch("https://white-breeze-db09.nafil-8895-s.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
  };

  send(); // initial
  const interval = setInterval(send, 60 * 1000); // every minute

  window.addEventListener("blur", () => clearInterval(interval));
  window.addEventListener("beforeunload", () => clearInterval(interval));
}


// 💾 Save user session
export function saveLoginSession(email, role) {
  localStorage.setItem("session_email", email);
  localStorage.setItem("session_role", role);
}

// 📦 Load session
export function loadLoginSession() {
  const email = localStorage.getItem("session_email");
  const role = localStorage.getItem("session_role");
  if (email && role) return { email, role };
  return null;
}

function notifyLogoutToServer() {
  const email = sessionStorage.getItem("loggedInEmail");
  if (!email) return;

  // Send POST request to logout worker asynchronously
  fetch("https://lively-cell-d074.nafil-8895-s.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  }).catch(err => {
    console.warn("⚠️ Logout tracking failed:", err);
  });
}

// 🔁 Clear and logout
export function clearLoginSession() {
notifyLogoutToServer(); 
  localStorage.removeItem("session_email");
  localStorage.removeItem("session_role");
  sessionStorage.clear();
  showPanel("login-panel");
}

// ✋ Attach logout to all possible logout buttons
export function setupLogoutHandler() {
  const logoutButtons = document.querySelectorAll("#logout-btn");

  logoutButtons.forEach(btn => {
    btn.onclick = () => {
      clearLoginSession();
    };
  });
}

please integrate all other codes with these code to avoid any work distribution or error