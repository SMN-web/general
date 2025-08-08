import {
  showPanel,
  saveLoginSession,
  loadLoginSession,
  setupLogoutHandler
} from "./main.js";

import { initAdminPanel } from "./admin.js";
import { initUserPanel } from "./users.js";
import { initModeratorPanel } from "./moderator.js";

// 🔄 Check for existing session on load
document.addEventListener("DOMContentLoaded", () => {
  const session = loadLoginSession();

  if (session) {
    const { email, role } = session;
    sessionStorage.setItem("loggedInEmail", email);
    sessionStorage.setItem("userRole", role);

    if (role === "admin") {
      showPanel("admin-panel");
      initAdminPanel();
    } else if (role === "moderator") {
      showPanel("moderator-panel");
      initModeratorPanel();
    } else {
      showPanel("user-panel");
      initUserPanel();
    }

    setupLogoutHandler();
  } else {
    showPanel("login-panel");
  }
});

// 🔐 Login functionality
document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const msg = document.getElementById("login-msg");

  if (!email || !password) {
    msg.textContent = "❌ All fields required.";
    return;
  }

  try {
    const res = await fetch("https://round-art-2c60.nafil-8895-s.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok || !data.message) {
      msg.textContent = "❌ Login failed";
      return;
    }

    // Extract role from message → e.g. "Login success as admin"
    const roleMatch = data.message.match(/as (\w+)/i);
    const role = roleMatch?.[1]?.toLowerCase();

    if (!role) {
      msg.textContent = "❌ Unable to detect role.";
      return;
    }

    // Save to both session + localStorage
    sessionStorage.setItem("loggedInEmail", email);
    sessionStorage.setItem("userRole", role);
    saveLoginSession(email, role);

    // Redirect by role
    if (role === "admin") {
      showPanel("admin-panel");
      initAdminPanel();
    } else if (role === "moderator") {
      showPanel("moderator-panel");
      initModeratorPanel();
    } else {
      showPanel("user-panel");
      initUserPanel();
    }

    setupLogoutHandler();
  } catch (err) {
    msg.textContent = "❌ Error: " + err.message;
  }
});
