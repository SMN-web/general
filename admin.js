import { initAddUser } from "./add-user.js";
import { initUserControl } from "./user-control.js";
import { initUserLogs } from "./user-logs.js";
import { initEquipmentControl } from "./equipment-control.js";

export function initAdminPanel() {
  document.getElementById("admin-msg").textContent = "";

  // Set up tab button handlers
  const tabs = {
    "add-user-tab": "add-user-section",
    "user-control-tab": "user-control-section",
    "user-logs-tab": "user-logs-section",
    "equipment-control-tab": "equipment-control-section",
  };

  Object.entries(tabs).forEach(([btnId, sectionId]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.onclick = () => {
        // Hide all sections
        Object.values(tabs).forEach(id => {
          document.getElementById(id)?.classList.add("hidden");
        });

        // Show selected section
        document.getElementById(sectionId)?.classList.remove("hidden");

        // Call matching init function
        if (sectionId === "add-user-section") initAddUser();
        if (sectionId === "user-control-section") initUserControl();
        if (sectionId === "user-logs-section") initUserLogs();
        if (sectionId === "equipment-control-section") initEquipmentControl();
      };
    }
  });

  // Show default tab: Add User
  document.getElementById("add-user-tab")?.click();
}
