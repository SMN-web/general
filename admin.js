import { initAddUser } from "./add-user.js";
import { initUserControl } from "./user-control.js";
import { initUserLogs } from "./user-logs.js";
import { initEquipmentControl } from "./equipment-control.js";

export function initAdminPanel() {
  const msgBox = document.getElementById("admin-msg");
  msgBox.textContent = "";

  const tabMap = {
    "add-user-tab": {
      section: "add-user-section",
      init: initAddUser
    },
    "user-control-tab": {
      section: "user-control-section",
      init: initUserControl
    },
    "user-logs-tab": {
      section: "user-logs-section",
      init: initUserLogs
    },
    "equipment-control-tab": {
      section: "equipment-control-section",
      init: initEquipmentControl
    }
  };

  // Attach listeners to all tab buttons
  Object.entries(tabMap).forEach(([tabId, { section, init }]) => {
    const tab = document.getElementById(tabId);
    tab?.addEventListener("click", () => {
      Object.values(tabMap).forEach(({ section }) => {
        document.getElementById(section)?.classList.add("hidden");
      });

      document.getElementById(section)?.classList.remove("hidden");
      if (typeof init === "function") init();
    });
  });

  // Default tab on load
  document.getElementById("add-user-tab")?.click();
}
