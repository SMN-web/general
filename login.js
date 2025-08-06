const LOGIN_API = "https://round-art-2c60.nafil-8895-s.workers.dev"; // Replace with actual URL

document.getElementById("login-btn").onclick = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("login-msg");

  if (!email || !password) {
    msg.textContent = "❌ Email and password are required";
    return;
  }

  msg.textContent = "🔄 Logging in...";

  try {
    const response = await fetch(LOGIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    msg.textContent = data.message || "⚠️ Unexpected response.";
  } catch (err) {
    msg.textContent = "❌ Failed to connect: " + err.message;
  }
};
