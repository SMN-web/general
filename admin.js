import { initAddUser } from "./add-user.js";
import { initUserControl } from "./user-control.js";
import { initUserLogs } from "./user-logs.js";
import { initEquipmentControl } from "./equipment-control.js";

export function initAdminPanel() {
  const tabs = {
    "add-user-tab": { section: "add-user-section", init: initAddUser },
    "user-control-tab": { section: "user-control-section", init: initUserControl },
    "user-logs-tab": { section: "user-logs-section", init: initUserLogs },
    "equipment-control-tab": { section: "equipment-control-section", init: initEquipmentControl }
  };

  Object.entries(tabs).forEach(([tabId, { section, init }]) => {
    const tabBtn = document.getElementById(tabId);
    if (tabBtn) {
      tabBtn.onclick = () => {
        Object.values(tabs).forEach(t => {
          document.getElementById(t.section)?.classList.add("hidden");
        });
        document.getElementById(section)?.classList.remove("hidden");
        init?.();
      };
    }
  });

  document.getElementById("add-user-tab")?.click();
}
