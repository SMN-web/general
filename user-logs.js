export function initUserLogs() {
  const container = document.getElementById("user-logs-section");
  const msgBox = document.getElementById("admin-msg");

  container.innerHTML = "<p>Loading user logs...</p>";

  fetch("https://tight-union-1a81.nafil-8895-s.workers.dev") // 🔁 Replace with your API endpoint
    .then(res => res.json())
    .then(data => {
      if (!data.users || !Array.isArray(data.users)) {
        container.innerHTML = "❌ Failed to load user logs.";
        return;
      }

      if (data.users.length === 0) {
        container.innerHTML = "<p>No users found in log.</p>";
        return;
      }

      const now = Date.now();
      const onlineThresholdMs = 2 * 60 * 1000; // 2 minutes

      const list = document.createElement("ul");
      list.className = "user-log-list";

      data.users.forEach(user => {
        const li = document.createElement("li");
        li.className = "user-log-entry";

        const name = user.name || user.email;
        const role = user.role || "–";
        const lastLogin = user.last_login ? new Date(user.last_login) : null;
        const lastLogout = user.last_logout ? new Date(user.last_logout) : null;
        const lastActivity = user.last_activity ? new Date(user.last_activity) : null;

        const nowTime = now;

        // Determine presence status
        let statusText = "❓ Unknown";

        if (lastActivity && (!lastLogout || lastActivity > lastLogout)) {
          const diff = nowTime - lastActivity.getTime();
          if (diff < onlineThresholdMs) {
            statusText = "🟢 Online";
          } else {
            statusText = `🔕 Last seen ${formatRelative(lastActivity)}`;
          }
        } else if (lastLogout) {
          statusText = `🔴 Logged out ${formatRelative(lastLogout)}`;
        }

        // Build the block
        li.innerHTML = `
          <strong>👤 ${name}</strong> <span style="color:gray">(${role})</span><br>
          ▪️ Last login: ${lastLogin ? lastLogin.toLocaleString() : "–"}<br>
          ▪️ Last logout: ${lastLogout ? lastLogout.toLocaleString() : "–"}<br>
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

// 🕒 Helper: display "5 mins ago" etc.
function formatRelative(date) {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
