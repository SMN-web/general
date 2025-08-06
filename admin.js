export async function initAdminPanel() {
  const email = sessionStorage.getItem("loggedInEmail");
  const msgBox = document.getElementById("admin-msg");
  const list = document.getElementById("user-list");
  msgBox.textContent = "";
  list.textContent = "Loading...";

  const res = await fetch(`https://fragrant-recipe-072a.nafil-8895-s.workers.dev/users?email=${email}`);
  const data = await res.json();

  if (!res.ok || !data.users) {
    list.textContent = `❌ ${data.error || "Failed to load users."}`;
    return;
  }

  list.innerHTML = "";

  data.users.forEach(user => {
    const row = document.createElement("p");
    const select = document.createElement("select");

    ["user", "moderator", "admin"].forEach(role => {
      const o = new Option(role, role, false, role === user.role);
      select.appendChild(o);
    });

    select.onchange = async () => {
      const res2 = await fetch("https://mute-snowflake-11b4.nafil-8895-s.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: email,
          targetEmail: user.email,
          newRole: select.value
        })
      });
      const d = await res2.json();
      msgBox.textContent = res2.ok && d.success ? "✅ Role updated." : `❌ ${d.error}`;
initAdminPanel();
    };

    row.innerHTML = `${user.name} (${user.email}) `;
    row.appendChild(select);
    list.appendChild(row);
  });
}
