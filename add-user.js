const form = document.getElementById("add-user-form");
const msg = document.getElementById("admin-msg");

form.onsubmit = async (e) => {
  e.preventDefault();

  const name = document.getElementById("new-name").value.trim();
  const email = document.getElementById("new-email").value.trim();
  const role = document.getElementById("new-role").value;
  const adminEmail = sessionStorage.getItem("loggedInEmail");

  if (!name || !email || !role) {
    msg.textContent = "❌ All fields required.";
    return;
  }

  const res = await fetch("https://green-star-3210.nafil-8895-s.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, role, adminEmail })
  });

  const data = await res.json();
  msg.textContent = res.ok && data.success ? "✅ User added!" : `❌ ${data.error}`;
};
