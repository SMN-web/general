//
// === PANEL VISIBILITY & SESSION HANDLING ===
//

// Show one panel by ID, hide others
export function showPanel(id) {
  document.querySelectorAll(".panel").forEach(panel => {
    panel.classList.add("hidden");
  });
  document.getElementById(id)?.classList.remove("hidden");
}

// Heartbeat ping to server to track active session
export function startHeartbeat() {
  const email = sessionStorage.getItem("loggedInEmail");
  if (!email) return;

  const send = () => {
    fetch("https://white-breeze-db09.nafil-8895-s.workers.dev.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
  };

  send(); // initial ping
  const interval = setInterval(send, 60 * 1000); // repeat every 1 min

  window.addEventListener("blur", () => clearInterval(interval));
  window.addEventListener("beforeunload", () => clearInterval(interval));
}

// Save session credentials
export function saveLoginSession(email, role) {
  localStorage.setItem("session_email", email);
  localStorage.setItem("session_role", role);
}

// Load session credentials
export function loadLoginSession() {
  const email = localStorage.getItem("session_email");
  const role = localStorage.getItem("session_role");
  if (email && role) return { email, role };
  return null;
}

// Notify server of logout
function notifyLogoutToServer() {
  const email = sessionStorage.getItem("loggedInEmail");
  if (!email) return;

  fetch("https://lively-cell-d074.nafil-8895-s.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  }).catch(err => {
    console.warn("⚠️ Logout tracking failed:", err);
  });
}

// Clear local/session storage and return to login screen
export function clearLoginSession() {
  notifyLogoutToServer();
  localStorage.removeItem("session_email");
  localStorage.removeItem("session_role");
  sessionStorage.clear();
  showPanel("login-panel");
}

// Attach logout handler to all logout buttons
export function setupLogoutHandler() {
  const logoutButtons = document.querySelectorAll("#logout-btn");
  logoutButtons.forEach(btn => {
    btn.onclick = () => {
      clearLoginSession();
    };
  });
}

//
// === MAIN TAB & SUB‑TAB / EQUIPMENT MENU HANDLING ===
//

// Main tab click handling
document.querySelectorAll('.main-tab').forEach(mainBtn => {
  mainBtn.addEventListener('click', () => {

    // deactivate all main tabs & hide all main sections
    document.querySelectorAll('.main-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.main-section').forEach(sec => sec.classList.add('hidden'));

    // activate clicked main tab & show its section
    mainBtn.classList.add('active');
    const targetSection = document.getElementById(mainBtn.dataset.main);
    if (!targetSection) return;
    targetSection.classList.remove('hidden');

    // Always reset the default view for each section
    switch (mainBtn.dataset.main) {
      case 'equipment-section': {
        // ensure menu + first submenu button is activated
        const firstEquipMenu = targetSection.querySelector('.equip-menu-group');
        if (firstEquipMenu) {
          firstEquipMenu.click();
        } else {
          const firstEquipTab = targetSection.querySelector('.equip-subtab');
          if (firstEquipTab) firstEquipTab.click();
        }
        break;
      }
      case 'user-section': {
        const firstUserTab = targetSection.querySelector('.user-subtab');
        if (firstUserTab) firstUserTab.click();
        break;
      }
      case 'rigging-section': {
        const firstRiggingTab = targetSection.querySelector('.rigging-subtab');
        if (firstRiggingTab) firstRiggingTab.click();
        break;
      }
    }
  });
});

// Generic sub‑tab setup
function setupSubTabs(sectionSelector, subtabSelector, subsectionSelector) {
  document.querySelectorAll(sectionSelector + ' ' + subtabSelector).forEach(tab => {
    tab.addEventListener('click', () => {
      const section = tab.closest(sectionSelector);
      section.querySelectorAll(subtabSelector).forEach(st => st.classList.remove('active'));
      section.querySelectorAll(subsectionSelector).forEach(sc => sc.classList.add('hidden'));
      tab.classList.add('active');
      const targetId = tab.dataset.target;
      if (targetId) {
        document.getElementById(targetId)?.classList.remove('hidden');
      }
    });
  });
}

// Init sub‑tabs for all sections
setupSubTabs('#user-section', '.user-subtab', '.user-subsection');
setupSubTabs('#equipment-section', '.equip-subtab', '.equip-subsection');
setupSubTabs('#rigging-section', '.rigging-subtab', '.rigging-subsection');

// Equipment menu group click handling
document.querySelectorAll('#equipment-section .equip-menu-group').forEach(groupBtn => {
  groupBtn.addEventListener('click', () => {
    const parentSection = groupBtn.closest('#equipment-section');

    // hide all submenus & deactivate all groups
    parentSection.querySelectorAll('.equip-submenu').forEach(sm => sm.classList.add('hidden'));
    parentSection.querySelectorAll('.equip-menu-group').forEach(mg => mg.classList.remove('active'));

    // activate this group
    groupBtn.classList.add('active');

    // show its submenu
    const submenu = parentSection.querySelector(`.equip-submenu[data-parent="${groupBtn.dataset.group}"]`);
    if (submenu) {
      submenu.classList.remove('hidden');
      // click first button inside
      const firstBtn = submenu.querySelector('button[data-target]');
      if (firstBtn) firstBtn.click();
    }
  });
});

//
// === INIT ===
setupLogoutHandler();
