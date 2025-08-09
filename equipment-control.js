// equipment-control.js
import { initEquipmentDashboard } from './equipment-dashboard.js';
import { initEquipmentManagement } from './equipment-management.js';
import { initRiggingDetails } from './rigging-details.js';

export function initEquipmentControl() {
  console.log("✅ Equipment Control: main initializer running");

  const subTabButtons = document.querySelectorAll(".equip-subtab");
  const subSections = document.querySelectorAll(".equip-subsection");

  if (!subTabButtons.length || !subSections.length) {
    console.warn("⚠️ Equipment Control: Sub-tabs or sections not found.");
    return;
  }

  subTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Reset UI
      subTabButtons.forEach(b => b.classList.remove("active"));
      subSections.forEach(sec => sec.classList.add("hidden"));

      // Show correct section
      btn.classList.add("active");
      const targetId = btn.dataset.target;
      const targetSection = document.getElementById(targetId);
      targetSection.classList.remove("hidden");

      // Restart fade animation
      targetSection.style.animation = "none";
      targetSection.offsetHeight; // reflow
      targetSection.style.animation = null;

      // Call the right sub-module init
      if (targetId === "equip-dashboard") initEquipmentDashboard();
      if (targetId === "equip-control") initEquipmentManagement();
      if (targetId === "rigging-details") initRiggingDetails();
    });
  });

  // Initialize default active section (Dashboard)
  initEquipmentDashboard();
}
