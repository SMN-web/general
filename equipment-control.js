import { initEquipmentDashboard } from "./equipment-dashboard.js";
import { initEquipmentList } from "./equipment-list.js";
import { initEquipmentManagement } from "./equipment-management.js";

export function initEquipmentControl() {
  const subTabs = document.querySelectorAll("#equipment-section .equip-subtab");
  const subSections = document.querySelectorAll("#equipment-section .equip-subsection");

  subTabs.forEach(btn => {
    if (!btn.dataset.bound) {
      btn.dataset.bound = "true";
      btn.addEventListener("click", () => {
        subTabs.forEach(b => b.classList.remove("active"));
        subSections.forEach(s => s.classList.add("hidden"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.target).classList.remove("hidden");

        if (btn.dataset.target === "equip-dashboard") initEquipmentDashboard();
        if (btn.dataset.target === "equip-list") initEquipmentList();
        if (btn.dataset.target === "equip-control") initEquipmentManagement();
      });
    }
  });

  document.querySelector('#equipment-section .equip-subtab.active')?.click();
}
