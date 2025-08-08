// Hide all panels and show a specific one
export function showPanel(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
}

// Save user login info (email + role) to localStorage
export function saveLoginSession(email, role) {
  localStorage.setItem("session_email", email);
  localStorage.setItem("session_role", role);
  sessionStorage.setItem("loggedInEmail", email);
  sessionStorage.setItem("userRole", role);
}

// Load saved session from localStorage
export function loadLoginSession() {
  const email = localStorage.getItem("session_email");
  const role = localStorage.getItem("session_role");
  if (email && role) return { email, role };
  return null;
}

// Clear session and return user to login panel
export function clearLoginSession() {
  localStorage.removeItem("session_email");
  localStorage.removeItem("session_role");
  sessionStorage.clear();
  history.pushState({ view: "login" }, "", "#login");
  showPanel("login-panel");
}

// Attach logout button logic (call after DOM is loaded)
export function setupLogoutHandler() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      clearLoginSession();
    };
  }
}
