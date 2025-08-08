import { setupLogoutHandler, startHeartbeat } from "./main.js";

export function initUserPanel() {
  // Show user info, etc.
  const email = sessionStorage.getItem("loggedInEmail");
  document.getElementById("user-email").textContent = email;

  setupLogoutHandler();
  startHeartbeat();
}
