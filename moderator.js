import { setupLogoutHandler, startHeartbeat } from "./main.js";
  
export function initModeratorPanel() {
  const email = sessionStorage.getItem("loggedInEmail");
  document.getElementById("moderator-email").textContent = email;

  setupLogoutHandler();
  startHeartbeat();
}
