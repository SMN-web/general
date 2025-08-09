import { initEquipmentDashboard } from './equipment-dashboard.js';
import { initEquipmentList } from './equipment-list.js';
import { initEquipmentManage } from './equipment-manage.js';

export function initEquipmentControl() {
  const selectEl = document.getElementById("equipment-action-select");
  if (!selectEl) return;

  // Bind event only once
  if (!selectEl.dataset.bound) {
    selectEl.dataset.bound = "true";
    selectEl.addEventListener("change", () => {
      document.querySelectorAll("#equipment-section .equip-subsection")
        .forEach(sec => sec.classList.add("hidden"));

      // Show relevant subsection
      const target = document.getElementById(selectEl.value);
      if (target) target.classList.remove("hidden");

      // Re-init the feature for the selected subsection
      if (selectEl.value === "equip-dashboard") initEquipmentDashboard();
      if (selectEl.value === "equip-upload") initEquipmentList();
      if (selectEl.value === "equip-manage") initEquipmentManage();
    });
  }

  // Always trigger change, so shows something!
  selectEl.dispatchEvent(new Event("change"));
}
