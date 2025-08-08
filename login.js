import { saveLoginSession, showPanel } from "./main.js";

import { initAdminPanel } from "./admin.js";
import { initUserPanel } from "./users.js";
import { initModeratorPanel } from "./moderator.js";

// TEMP login endpoint to simulate roles
const LOGIN_WORKER_URL = "https://round-art-2c60.nafil-8895-s.workers.dev";

document.getElementById("login-btn").onclick = async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const msg = document.getElementById("login-msg");

  if (!email || !password) {
    msg.textContent = "❌ Fill all fields";
    return;
  }

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
    if (!role) return (msg.textContent = "❌ Invalid role");

    sessionStorage.setItem("loggedInEmail", email);
    sessionStorage.setItem("userRole", role);

    if (role === "admin") {
      showPanel("admin-panel");
      initAdminPanel();
      saveLoginSession(email, role);

    } else if (role === "moderator") {
      showPanel("moderator-panel");
      initModeratorPanel();
      saveLoginSession(email, role); 

    } else {
      showPanel("user-panel");
      initUserPanel();
      saveLoginSession(email, role);

    }
  } catch (err) {
    msg.textContent = "❌ Login error: " + err.message;
  }
};
