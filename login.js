import { showPanel } from "./main.js";
import { initAdminPanel } from "./admin.js";
import { initModeratorPanel } from "./moderator.js";
import { initUserPanel } from "./users.js";

const LOGIN_WORKER_URL = "https://your-login-worker.workers.dev"; // Replace with your deployed URL

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
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.message) {
      msg.textContent = data.message || "❌ Login failed";
      return;
    }

    // Extract role from message: "✅ Login successful as {role}"
    const roleMatch = data.message.match(/as (\w+)/i);
    const role = roleMatch?.[1]?.toLowerCase();

    if (!role) {
      msg.textContent = "❌ Role not found in response.";
      return;
    }

    sessionStorage.setItem("loggedInEmail", email);
    sessionStorage.setItem("userRole", role);

    // Redirect based on role
    if (role === "admin") {
      history.pushState({ view: "admin" }, "", "#admin");
      showPanel("admin-panel");
      initAdminPanel();
    } else if (role === "moderator") {
      history.pushState({ view: "moderator" }, "", "#moderator");
      showPanel("moderator-panel");
      initModeratorPanel();
    } else {
      history.pushState({ view: "user" }, "", "#user");
      showPanel("user-panel");
      initUserPanel();
    }

    msg.textContent = ""; // clear msg on success

  } catch (err) {
    msg.textContent = "❌ Network error: " + err.message;
  }
};
