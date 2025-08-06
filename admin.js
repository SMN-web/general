import { showPanel, logout } from "./main.js";
import { fetchAllUsers } from "./api.js";

const logoutBtn = document.getElementById("logout-btn");
const listEl = document.getElementById("user-list");

logoutBtn.onclick = () => logout();

async function initAdmin() {
  const email = sessionStorage.getItem("loggedInEmail");
  if (!email) return;
  const res = await fetchAllUsers(email);
  if (res.error) {
    listEl.innerHTML = `<p>❌ ${res.error}</p>`;
    return;
  }
  listEl.innerHTML = res.users
    .map(u => `<p>${u.name} (${u.role})</p>`)
    .join("");
}

initAdmin();
