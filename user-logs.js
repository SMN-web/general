export function initUserLogs() {
  const container = document.getElementById("user-logs-list");
  const msgBox = document.getElementById("admin-msg");

  container.innerHTML = "<p>Loading user logs...</p>";

  fetch("https://tight-union-1a81.nafil-8895-s.workers.dev")
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

        const now = Date.now();
        const onlineThreshold = 2 * 60 * 1000;
        let statusText = "❓ Unknown";

        if (lastLogout === "0" || lastLogout === 0 || lastLogout === null) {
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

      // Replace contents
      container.innerHTML = "";
      container.appendChild(list);
    })
    .catch(err => {
      msgBox.textContent = "❌ Error loading logs: " + err.message;
      container.innerHTML = "Error loading user logs.";
    });
}
