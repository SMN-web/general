export async function initAdminPanel() {
const email = sessionStorage.getItem("loggedInEmail");
const list = document.getElementById("user-list");

const res = await fetch(https://admin-users-worker.example.workers.dev/users?email=${email});
const data = await res.json();

document.getElementById("admin-msg").textContent = "";
list.innerHTML = "";

if (!data || data.error) {
list.innerHTML = ❌ ${data.error};
return;
}

data.users.forEach(user => {
const row = document.createElement("p");
const select = document.createElement("select");
["user", "moderator", "admin"].forEach(opt => {
  const o = new Option(opt, opt, false, opt === user.role);
  select.appendChild(o);
});

select.onchange = async () => {
  const update = await fetch("https://mute-snowflake-11b4.nafil-8895-s.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      adminEmail: email,
      targetEmail: user.email,
      newRole: select.value
    })
  });

  const d = await update.json();
  document.getElementById("admin-msg").textContent =
    update.ok && d.success ? "✅ Role updated." : `❌ ${d.error}`;
};

row.textContent = `${user.name} (${user.email}) `;
row.appendChild(select);
list.appendChild(row);
});
}