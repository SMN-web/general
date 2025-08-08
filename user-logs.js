export function initUserLogs() {
  const container = document.getElementById("user-logs-section");
  const msgBox = document.getElementById("admin-msg");
  container.innerHTML = "<p>Loading user logs...</p>";

  fetch("https://tight-union-1a81.nafil-8895-s.workers.dev") // ⬅️ Replace with your actual API endpoint
    .then(res => res.json())
    .then(data => {
      if (!data.users || !Array.isArray(data.users)) {
        container.innerHTML = "❌ Failed to load user logs.";
        return;
      }

      if (data.users.length === 0) {
        container.innerHTML = "<p>No users found.</p>";
        return;
      }

      const now = Date.now();
      const onlineThreshold = 2 * 60 * 1000; // 2 minutes in ms
      const list = document.createElement("ul");
      list.className = "user-log-list";

      data.users.forEach(user => {
        const name = user.name || user.email;
        const role = user.role || "user";

        const lastLogin    = user.last_login    ? new Date(user.last_login)    : null;
        const lastLogout   = user.last_logout   !== undefined ? user.last_logout : null;
        const lastActivity = user.last_activity ? new Date(user.last_activity) : null;

        // 🌐 Status logic
        let statusText = "❓ Unknown";

        if (lastLogout === "0" || lastLogout === 0 || lastLogout === null) {
          // User is still logged in
          if (lastActivity) {
            const diff = now - lastActivity.getTime();
            if (diff < onlineThreshold) {
              statusText = "🟢 Online";
            } else {
              statusText = `🕓 Last seen ${formatRelative(lastActivity)}`;
            }
          } else {
            statusText = "⚪ No activity yet";
          }
        } else {
          // User has logged out
          if (lastLogout) {
            const logoutTime = new Date(lastLogout);
            statusText = `🔴 Offline since ${formatRelative(logoutTime)}`;
          } else {
            statusText = "⚫ Logged out (no time)";
          }
        }

        const li = document.createElement("li");
        li.className = "user-log-entry";

        li.innerHTML = `
          <strong>👤 ${name}</strong> <span style="color:gray">(${role})</span><br>
          ▪️ Last login: ${formatDate(lastLogin)}<br>
          ▪️ Last logout: ${formatDate(lastLogout)}<br>
          ▪️ Status: ${statusText}
        `;

        list.appendChild(li);
      });

      container.innerHTML = "<h4>📊 User Activity Logs</h4>";
      container.appendChild(list);
    })
    .catch(err => {
      msgBox.textContent = "❌ Error loading logs: " + err.message;
      container.innerHTML = "Failed to load user logs.";
    });
}

// 🧩 Relative formatter ― e.g. "3 mins ago"
function formatRelative(date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

// 🕐 Present Qatar time (UTC+3)
function formatDate(raw) {
  if (!raw || raw === "0") return "–";
  const date = new Date(raw);
  const adjusted = new Date(date.getTime() + 3 * 60 * 60 * 1000); // UTC+3
  return adjusted.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: false
  }) + " (QAT)";
}
