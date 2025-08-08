import { initAddUser } from "./add-user.js";
import { initUserControl } from "./user-control.js";
import { initUserLogs } from "./user-logs.js";
import { initEquipmentControl } from "./equipment-control.js";
import { setupLogoutHandler, startHeartbeat } from "./main.js";

const tabMap = {
  "add-user-tab": { section: "add-user-section", init: initAddUser },
  "user-control-tab": { section: "user-control-section", init: initUserControl },
  "user-logs-tab": { section: "user-logs-section", init: initUserLogs },
  "equipment-control-tab": { section: "equipment-control-section", init: initEquipmentControl }
};

export function initAdminPanel() {
  setupLogoutHandler(); // ✅ logout button inside admin panel
  startHeartbeat();
  Object.entries(tabMap).forEach(([tabId, { section, init }]) => {
    const btn = document.getElementById(tabId);
    if (!btn.dataset.hasInit) {
      btn.dataset.hasInit = "true";
      btn.addEventListener("click", () => {
        switchAdminTab(tabId);
      });
    }
  });

  // Show default tab
  switchAdminTab("add-user-tab");
}

export function switchAdminTab(tabId) {
  Object.values(tabMap).forEach(({ section }) => {
    document.getElementById(section)?.classList.add("hidden");
  });

  const { section, init } = tabMap[tabId] || {};
  if (section) {
    document.getElementById(section)?.classList.remove("hidden");
    init?.();
  }
}
