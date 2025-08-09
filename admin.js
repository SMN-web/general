import { setupLogoutHandler, startHeartbeat } from "./main.js";
import { initUserControlMain } from "./user-control-main.js";
import { initEquipmentControl } from "./equipment-control.js";
import { initRiggingControl } from "./rigging-control.js";

const mainTabMap = {
  "user-section": initUserControlMain,
  "equipment-section": initEquipmentControl,
  "rigging-section": initRiggingControl
};

export function initAdminPanel() {
  setupLogoutHandler();
  startHeartbeat();

  const mainTabs = document.querySelectorAll(".main-tab");
  const mainSections = document.querySelectorAll(".main-section");

  mainTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      mainTabs.forEach(t => t.classList.remove("active"));
      mainSections.forEach(sec => sec.classList.add("hidden"));

      tab.classList.add("active");
      const targetId = tab.dataset.main;
      document.getElementById(targetId).classList.remove("hidden");

      if (typeof mainTabMap[targetId] === "function") {
        mainTabMap[targetId]();
      }
    });
  });

  document.querySelector('.main-tab[data-main="user-section"]').click();
}
