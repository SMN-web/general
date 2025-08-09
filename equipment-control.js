import { initEquipmentDashboard } from './equipment-dashboard.js';
import { initEquipmentList } from './equipment-list.js';
import { initEquipmentManage } from './equipment-manage.js';

export function initEquipmentControl() {
  const actionSelect = document.getElementById("equipment-action-select");

  if (!actionSelect.dataset.bound) {
    actionSelect.dataset.bound = "true";
    actionSelect.addEventListener("change", () => {
      document.querySelectorAll("#equipment-section .equip-subsection")
        .forEach(sec => sec.classList.add("hidden"));

      document.getElementById(actionSelect.value).classList.remove("hidden");

      if (actionSelect.value === "equip-dashboard") initEquipmentDashboard();
      if (actionSelect.value === "equip-upload") initEquipmentList();
      if (actionSelect.value === "equip-manage") initEquipmentManage();
    });
  }

  // Trigger initial load on page load or section show
  actionSelect.dispatchEvent(new Event("change"));
}
