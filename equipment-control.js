import { initEquipmentDashboard } from './equipment-dashboard.js';
import { initEquipmentList } from './equipment-list.js';
import { initEquipmentManage } from './equipment-manage.js';

export function initEquipmentControl() {
  const selectEl = document.getElementById("equipment-action-select");
  if (!selectEl) return;

  if (!selectEl.dataset.bound) {
    selectEl.dataset.bound = "true";
    selectEl.addEventListener("change", () => {
      // Hide all subsections
      document.querySelectorAll("#equipment-section .equip-subsection")
        .forEach(sec => sec.classList.add("hidden"));

      // Show selected subsection
      const target = document.getElementById(selectEl.value);
      if (target) target.classList.remove("hidden");

      // Initialize relevant section
      if (selectEl.value === "equip-dashboard") initEquipmentDashboard();
      if (selectEl.value === "equip-upload") initEquipmentList();
      if (selectEl.value === "equip-manage") initEquipmentManage();
    });
  }

  // Trigger initial load
  selectEl.dispatchEvent(new Event("change"));
}
