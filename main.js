import { apiLogin, apiGetUsers, apiAddUser, apiSetRole } from "./api.js";

const loginPanel = document.getElementById("login-panel");
const adminPanel = document.getElementById("admin-panel");
const loginBtn = document.getElementById("login-btn");
const loginMsg = document.getElementById("login-msg");
const emailInput = document.getElementById("login-email");
const passInput = document.getElementById("login-password");

loginBtn.onclick = async () => {
  const email = emailInput.value.trim();
  const password = passInput.value;
  loginMsg.textContent = "Logging in...";

  const res = await apiLogin(email, password);

  if (res.role === "admin") {
    loginPanel.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    loadUserList(email);
  } else {
    loginMsg.textContent = "Not authorized as admin.";
  }
};

async function loadUserList(adminEmail) {
  const { users } = await apiGetUsers(adminEmail);
  const userList = document.getElementById("user-list");
  userList.innerHTML = users.map(u => `
    <p>
      ${u.email} — 
      <select onchange="setRole('${adminEmail}', '${u.email}', this.value)">
        <option ${u.role === 'user' ? 'selected' : ''}>user</option>
        <option ${u.role === 'admin' ? 'selected' : ''}>admin</option>
        <option ${u.role === 'moderator' ? 'selected' : ''}>moderator</option>
      </select>
    </p>
  `).join('');
}

window.setRole = async (adminEmail, targetEmail, newRole) => {
  await apiSetRole(adminEmail, targetEmail, newRole);
  alert("Updated role!");
};

document.getElementById("add-user-btn").onclick = async () => {
  const adminEmail = emailInput.value.trim();
  const newEmail = document.getElementById("new-email").value.trim();
  const newRole = document.getElementById("new-role").value;
  await apiAddUser(adminEmail, newEmail, newRole);
  document.getElementById("admin-msg").textContent = "User added!";
  loadUserList(adminEmail);
};
