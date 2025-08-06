import { loginUser } from "./api.js";
import { showPanel } from "./main.js";

document.getElementById("login-btn").onclick = async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const msg = document.getElementById("login-msg");
  msg.textContent = "";

  if (!email || !password) {
    msg.textContent = "Please enter email and password.";
    return;
  }

  msg.textContent = "Logging in...";
  const res = await loginUser(email, password);

  if (res.error) {
    msg.textContent = "❌ " + res.error;
    return;
  }

  sessionStorage.setItem("loggedInEmail", res.email);
  sessionStorage.setItem("userRole", res.role);

  if (res.role === "admin") showPanel("admin-panel");
  else if (res.role === "moderator") showPanel("moderator-panel");
  else if (res.role === "user") showPanel("user-panel");
  else msg.textContent = "❌ Unknown role.";
};
