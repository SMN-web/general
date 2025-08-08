export async function initUserControl() {
  const adminEmail = sessionStorage.getItem("loggedInEmail");
  const container = document.getElementById("user-control-list");
  const msg = document.getElementById("admin-msg");

  container.innerHTML = "<p>Loading users...</p>";

  try {
    const res = await fetch(`https://fragrant-recipe-072a.nafil-8895-s.workers.dev/users?email=${adminEmail}`);
    const data = await res.json();

    if (!res.ok || !data.users) {
      container.innerHTML = "❌ Failed to load users.";
      return;
    }

    container.innerHTML = "";

    data.users.forEach(user => {
      const card = document.createElement("div");
      card.className = "user-entry"; // style as needed

      const name = document.createElement("span");
      name.textContent = `${user.name} (${user.email})`;

      const roleSelect = document.createElement("select");
      ["user", "moderator", "admin"].forEach(role => {
        const opt = new Option(role, role, false, user.role === role);
        roleSelect.appendChild(opt);
      });

      roleSelect.disabled = user.email === adminEmail;

      roleSelect.onchange = async () => {
        const res2 = await fetch("https://mute-snowflake-11b4.nafil-8895-s.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminEmail,
            targetEmail: user.email,
            newRole: roleSelect.value
          })
        });
        const d = await res2.json();
        msg.textContent = res2.ok && d.success ? "✅ Role updated." : `❌ ${d.error || "Update failed"}`;
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️ Delete";
      deleteBtn.disabled = user.role === "admin";

      deleteBtn.onclick = () => {
        if (!confirm(`Delete ${user.email}?`)) return;
        container.removeChild(card);
        msg.textContent = `⚠️ Simulated delete of ${user.email} (no server call).`;
      };

      card.append(name, roleSelect, deleteBtn);
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "❌ Error loading users.";
    msg.textContent = err.message;
  }
}
