import { initEquipmentDashboard } from './equipment-dashboard.js';
import { initEquipmentList } from './equipment-list.js';
import { initEquipmentManage } from './equipment-manage.js';

export function initEquipmentControl() {
  // Toggle submenus when clicking group headers
  document.querySelectorAll('#equipment-section .equip-menu-group').forEach(group => {
    group.addEventListener('click', () => {
      const targetGroup = group.dataset.group;
      document.querySelectorAll('.equip-submenu').forEach(menu => {
        if (menu.dataset.parent === targetGroup) {
          menu.classList.toggle('hidden');
        } else {
          menu.classList.add('hidden');
        }
      });
    });
  });

  // Handle submenu item clicks
  document.querySelectorAll('#equipment-section .equip-submenu button').forEach(btn => {
    btn.addEventListener('click', () => {
      // Hide all subsections first
      document.querySelectorAll('#equipment-section .equip-subsection')
        .forEach(sec => sec.classList.add('hidden'));

      // Show selected section
      const showId = btn.dataset.target;
      const secEl = document.getElementById(showId);
      if (secEl) secEl.classList.remove('hidden');

      // Run the right init logic
      if (showId === 'equip-dashboard') {
        initEquipmentDashboard();
      } else if (showId === 'equip-upload') {
        initEquipmentList();
      } else if (showId === 'equip-list') {
        initEquipmentManage();
      }
    });
  });

  /*
    === Default behaviour options ===

    Uncomment ONE of the following:

    1. NO default: everything stays hidden until user clicks submenu
       (Make sure all .equip-subsection in HTML start with "hidden" class)

    2. Default to dashboard: programmatically click Dashboard button:
  */

  // ---- OPTION 1: Hide all by default ----
  // document.querySelectorAll('#equipment-section .equip-subsection')
  //   .forEach(sec => sec.classList.add('hidden'));

  // ---- OPTION 2: Default to Dashboard ----
  const dashboardBtn = document.querySelector(
    '#equipment-section .equip-submenu button[data-target="equip-dashboard"]'
  );
  if (dashboardBtn) dashboardBtn.click();
}
