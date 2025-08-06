const WORKER_URL = "https://round-art-2c60.nafil-8895-s.workers.dev"; // replace with your deployed URL

document.getElementById("login-btn").onclick = async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const msg = document.getElementById("login-msg");

  msg.textContent = "";

  if (!email || !password) {
    msg.textContent = "Please enter both email and password.";
    return;
  }

  msg.textContent = "Logging in...";

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = "❌ " + (data.error || "Login failed");
      return;
    }

    const { role, name } = data;

    // Hide login panel and show message
    document.getElementById("login-panel").classList.add("hidden");
    document.getElementById("welcome-message").classList.remove("hidden");

    const msgBox = document.getElementById("custom-message");
    if (role === "admin") msgBox.textContent = `🔐 Welcome Admin, ${name}`;
    else if (role === "moderator") msgBox.textContent = `🧑‍⚖️ Welcome Moderator, ${name}`;
    else if (role === "user") msgBox.textContent = `👋 Welcome User, ${name}`;
    else msgBox.textContent = `👤 Welcome, ${name}`;
  } catch (err) {
    msg.textContent = "❌ " + err.message;
  }
};
