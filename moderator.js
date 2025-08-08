import { setupLogoutHandler } from "./main.js";
  
  
export function initModeratorPanel() {
  setupLogoutHandler();
  const email = sessionStorage.getItem("loggedInEmail");
  document.getElementById("moderator-panel").innerHTML = `
    <h2>🛡️ Moderator Dashboard</h2>
    <p>Welcome moderator, ${email}.</p>
  `;
}
