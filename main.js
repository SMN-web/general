// 🔄 Show one panel
export function showPanel(id) {
  document.querySelectorAll(".panel").forEach(panel => {
    panel.classList.add("hidden");
  });
  document.getElementById(id)?.classList.remove("hidden");
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

// 🔁 Clear and logout
export function clearLoginSession() {
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
