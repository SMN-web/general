import { fetchAllUsers } from "./api.js";
import { showPanel } from "./main.js";

export function initAdminPanel() {
  const email = sessionStorage.getItem("loggedInEmail");
  if (!email) return console.error("No admin email found.");

  // ✨ Push admin panel to browser history
  history.pushState({ view: "admin" }, "", "#admin");

  document.getElementById("admin-msg").textContent = "";
  document.getElementById("user-list").innerHTML = "Loading...";

  fetchAllUsers(email).then(res => {
    if (res.error) {
      document.getElementById("user-list").innerHTML = `❌ ${res.error}`;
    } else {
      renderUserList(res.users);
    }
  });
}

function renderUserList(users) {
  const list = document.getElementById("user-list");
  list.innerHTML = "";

  users.forEach(user => {
    const p = document.createElement("p");
    const roleSelect = document.createElement("select");

    ["user", "moderator", "admin"].forEach(r => {
      const opt = new Option(r, r, false, r === user.role);
      roleSelect.appendChild(opt);
    });

    roleSelect.onchange = async () => {
      const res = await fetch("https://mute-snowflake-11b4.nafil-8895-s.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: sessionStorage.getItem("loggedInEmail"),
          targetEmail: user.email,
          newRole: roleSelect.value
        })
      });
      const data = await res.json();
      document.getElementById("admin-msg").textContent =
        data.success ? "✅ Role updated." : `❌ ${data.error}`;
    };

    p.innerHTML = `<strong>${user.name}</strong> (${user.email}) `;
    p.appendChild(roleSelect);
    list.appendChild(p);
  });
}
