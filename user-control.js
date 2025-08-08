export async function initUserControl() {
  const admin = sessionStorage.getItem("loggedInEmail");
  const list = document.getElementById("user-control-list");
  const msg = document.getElementById("admin-msg");
  list.innerHTML = "Loading...";

  try {
    const res = await fetch(`https://fragrant-recipe-072a.nafil-8895-s.workers.dev/users?email=${admin}`);
    const data = await res.json();

    if (!res.ok || !data.users) return (list.innerHTML = "❌ Failed");

    list.innerHTML = "";
    data.users.forEach(user => {
      const card = document.createElement("p");
      card.textContent = `${user.name} (${user.email}) `;

      const select = document.createElement("select");
      ["user", "moderator", "admin"].forEach(r => {
        const opt = new Option(r, r, false, r === user.role);
        select.appendChild(opt);
      });

      select.disabled = user.email === admin;
      select.onchange = async () => {
        const res2 = await fetch("https://mute-snowflake-11b4.nafil-8895-s.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminEmail: admin,
            targetEmail: user.email,
            newRole: select.value
          })
        });
        const d = await res2.json();
        msg.textContent = res2.ok && d.success ? "✅ Role updated." : `❌ ${d.error}`;
      };

      const del = document.createElement("button");
      del.textContent = "Delete";
      del.disabled = user.role === "admin";

      del.onclick = async () => {
  if (!confirm(`Are you sure you want to delete ${user.email}?`)) return;

  const resDel = await fetch("https://long-truth-057f.nafil-8895-s.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminEmail: admin, targetEmail: user.email })
  });

  const result = await resDel.json();

  if (resDel.ok && result.success) {
    list.removeChild(card);
    msg.textContent = `✅ Deleted ${user.email}`;
  } else {
    msg.textContent = `❌ ${result.error || "Deletion failed"}`;
  }
};


      card.append(" ", select, " ", del);
      list.appendChild(card);
    });
  } catch (err) {
    msg.textContent = "❌ Error: " + err.message;
  }
}
