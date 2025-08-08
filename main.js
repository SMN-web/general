// main.js

// 🔄 Show only the selected panel
export function showPanel(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
}

// ✅ Save login session (localStorage)
export function saveLoginSession(email, role) {
  localStorage.setItem("session_email", email);
  localStorage.setItem("session_role", role);
}

// ✅ Load login session (returns null if not found)
export function loadLoginSession() {
  const email = localStorage.getItem("session_email");
  const role = localStorage.getItem("session_role");
  if (email && role) return { email, role };
  return null;
}

// ✅ Clear session on logout
export function clearLoginSession() {
  localStorage.removeItem("session_email");
  localStorage.removeItem("session_role");
  history.pushState({ view: "login" }, "", "#login");
  showPanel("login-panel");
}

// ✅ Call on page load → reads session and routes
export function initAppRouter(panels) {
  const saved = loadLoginSession();

  if (saved) {
    const { email, role } = saved;
    sessionStorage.setItem("loggedInEmail", email);
    sessionStorage.setItem("userRole", role);

    if (role === "admin") {
      history.replaceState({ view: "admin", tab: "add-user-tab" }, "", "#admin");
      showPanel("admin-panel");
      panels.initAdminPanel();
    } else if (role === "moderator") {
      history.replaceState({ view: "moderator" }, "", "#moderator");
      showPanel("moderator-panel");
      panels.initModeratorPanel();
    } else {
      history.replaceState({ view: "user" }, "", "#user");
      showPanel("user-panel");
      panels.initUserPanel();
    }
  } else {
    // Default to login view
    history.replaceState({ view: "login" }, "", "#login");
    showPanel("login-panel");
  }
}

// ✅ SPAs: Make browser back/forward buttons behave
export function setupPopState(panels) {
  window.onpopstate = (e) => {
    const state = e.state || {};

    if (!state.view) {
      showPanel("login-panel");
      return;
    }

    if (state.view === "admin") {
      showPanel("admin-panel");
      panels.initAdminPanel();
      if (state.tab && typeof panels.switchAdminTab === "function") {
        panels.switchAdminTab(state.tab, false); // tabId, don't push again
      }
    } else if (state.view === "moderator") {
      showPanel("moderator-panel");
      panels.initModeratorPanel();
    } else if (state.view === "user") {
      showPanel("user-panel");
      panels.initUserPanel();
    } else {
      showPanel("login-panel");
    }
  };
}
