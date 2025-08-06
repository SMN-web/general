import { initLogin } from "./login.js";
import { initAdmin } from "./admin.js";

export let currentUser = null;

export function setPanel(panel) {
  document.querySelectorAll(".panel").forEach(
    el => el.classList.remove("active"));
  const target = document.getElementById(panel);
  if (target) {
    target.classList.add("active");
    target.classList.add("fade-in");
    setTimeout(() => target.classList.remove("fade-in"), 450);
  }
}

function renderShell() {
  document.getElementById("app").innerHTML = `
    <div id="login-panel" class="panel card"></div>
    <div id="admin-panel" class="panel card"></div>
    <div id="user-panel" class="panel card"></div>
    <div id="moderator-panel" class="panel card"></div>
  `;
}

renderShell();

initLogin(setPanel, usr => {
  currentUser = usr;
  if (usr.role === "admin") { initAdmin(setPanel, usr); setPanel("admin-panel"); }
  else if (usr.role === "moderator") setPanel("moderator-panel");
  else setPanel("user-panel");
});
