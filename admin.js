import { showPanel } from './main.js';
import { fetchAllUsers } from './api.js';

const adminMsg = document.getElementById("admin-msg");
const userList = document.getElementById("user-list");

export async function initAdminPanel() {
  const email = sessionStorage.getItem("loggedInEmail");
  if (!email) {
    adminMsg.textContent = "No admin email found in session.";
    return;
  }

  const res = await fetchAllUsers(email);
  userList.innerHTML = "";

  if (res.error) {
    adminMsg.textContent = `❌ ${res.error}`;
    return;
  }

  res.users.forEach(user => {
    const userP = document.createElement("p");
    const roleSelect = document.createElement("select");

    ["user", "moderator", "admin"].forEach(role => {
      const opt = new Option(role, role, false, role === user.role);
      roleSelect.appendChild(opt);
    });

    roleSelect.onchange = async () => {
      const r = await fetch("https://modify-role-worker.example.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: email,
          targetEmail: user.email,
          newRole: roleSelect.value
        })
      });
      const d = await r.json();
      adminMsg.textContent = d.success ? "✅ Role updated" : `❌ ${d.error}`;
    };

    userP.innerHTML = `<strong>${user.name}</strong> (${user.email}) `;
    userP.appendChild(roleSelect);

    userList.appendChild(userP);
  });
}
