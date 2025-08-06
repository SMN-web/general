import { showPanel } from "./main.js";
import { initAdminPanel } from "./admin.js";

const LOGIN_WORKER_URL = "https://round-art-2c60.nafil-8895-s.workers.dev"; // CHANGE THIS

document.getElementById("login-btn").onclick = async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const msg = document.getElementById("login-msg");

  if (!email || !password) {
    msg.textContent = "❌ Fill all fields";
    return;
  }

  msg.textContent = "🔐 Logging in...";

  try {
    const res = await fetch(LOGIN_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok || !data.message) {
      msg.textContent = data.message || "❌ Login failed";
      return;
    }

    const roleMatch = data.message.match(/as (\w+)/i);
    const role = roleMatch?.[1]?.toLowerCase();

    if (role !== "admin") {
      msg.textContent = "❌ Admin only access";
      return;
    }

    sessionStorage.setItem("loggedInEmail", email);
    sessionStorage.setItem("userRole", role);

    history.pushState({ view: "admin" }, "", "#admin");
    showPanel("admin-panel");
    initAdminPanel();
  } catch (err) {
    msg.textContent = "❌ Network error: " + err.message;
  }
};
