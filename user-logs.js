export function initUserLogs() {
  const container = document.getElementById("user-logs-section");
  const msgBox = document.getElementById("admin-msg");

  container.innerHTML = "<p>Loading user logs...</p>";

  fetch("https://tight-union-1a81.nafil-8895-s.workers.dev") // TODO: replace with your actual Worker URL
    .then(res => res.json())
    .then(data => {
      if (!data.users || !Array.isArray(data.users)) {
        container.innerHTML = "❌ Failed to load user logs.";
        return;
      }

      if (data.users.length === 0) {
        container.innerHTML = "<p>No user logs found.</p>";
        return;
      }

      const list = document.createElement("ul");
      list.className = "user-log-list";

      data.users.forEach(user => {
        const li = document.createElement("li");

        const name = user.name || user.email;
        const role = user.role || "User";
        const lastLogin = user.last_login ? new Date(user.last_login) : null;
        const lastLogout = user.last_logout;
        const lastActivity = user.last_activity ? new Date(user.last_activity) : null;

        // Determine status text
        const now = Date.now();
        const onlineThreshold = 2 * 60 * 1000; // 2 mins
        let statusText = "❓ Unknown";

        if (lastLogout === "0" || lastLogout === 0 || lastLogout === null) {
          // User has not logged out — check last activity
          if (lastActivity) {
            const diff = now - lastActivity.getTime();
            if (diff < onlineThreshold) {
              statusText = "🟢 Online";
            } else {
              statusText = `Last seen ${formatRelative(lastActivity)}`;
            }
          } else {
            statusText = "No recent activity";
          }
        } else {
          // User has logged out
          statusText = `Offline since ${formatRelative(new Date(lastLogout))}`;
        }

        li.innerHTML = `
          <div class="user-card">
            <div class="user-main">
              <div class="user-name">
                <span class="user-avatar">${name[0]?.toUpperCase() || "U"}</span>
                <span class="user-fullname">${name}</span>
                <span class="user-role">(${role})</span>
              </div>
              <div class="user-status ${statusClass(statusText)}">${statusText}</div>
            </div>
            <div class="user-meta">
              <span><strong>Login:</strong> ${formatDate(lastLogin)}</span>
              <span><strong>Logout:</strong> ${formatDate(lastLogout)}</span>
              <span><strong>Activity:</strong> ${lastActivity ? formatRelative(lastActivity) : "–"}</span>
            </div>
          </div>
        `;

        list.appendChild(li);
      });

      container.innerHTML = "<h3>📓 User Logs</h3>";
      container.appendChild(list);
    })
    .catch(err => {
      msgBox.textContent = "❌ Error loading logs: " + err.message;
      container.innerHTML = "Error loading user logs.";
    });
}

// -------- Helpers --------

// Returns CSS class name for status pill color
function statusClass(status) {
  if (status.includes("Online")) return "status-online";
  if (status.includes("Offline")) return "status-offline";
  if (status.includes("Last seen")) return "status-away";
  return "status-unknown";
}

// Formats date in Qatar time (UTC+3)
function formatDate(date) {
  if (!date || date === "0") return "–";
  const d = new Date(date);
  const adjusted = new Date(d.getTime() + 3 * 60 * 60 * 1000); // UTC+3
  return adjusted.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: false
  }) + " (QAT)";
}

// Formats relative time text
function formatRelative(date) {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
