import { initEquipmentDashboard } from './equipment-dashboard.js';
import { initEquipmentList } from './equipment-list.js';
import { initEquipmentManage } from './equipment-manage.js';
import { initEquipmentEdit } from './equipment-edit.js';

export function initEquipmentControl() {
  // Toggle submenu visibility when a group header is clicked
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

  // Handle submenu button clicks
  document.querySelectorAll('#equipment-section .equip-submenu button').forEach(btn => {
    btn.addEventListener('click', () => {
      // Hide all subsections first
      document
        .querySelectorAll('#equipment-section .equip-subsection')
        .forEach(sec => sec.classList.add('hidden'));

      // Show the selected subsection
      const showId = btn.dataset.target;
      const sectionEl = document.getElementById(showId);
      if (sectionEl) {
        sectionEl.classList.remove('hidden');
      }

      // Initialize logic for the shown section
      if (showId === 'equip-dashboard') {
        initEquipmentDashboard();
      } else if (showId === 'equip-upload') {
        initEquipmentList();
      } else if (showId === 'equip-list') {
        initEquipmentManage();
      } else if (showId === 'equip-edit') {
        initEquipmentEdit();
      }
    });
  });

  /*
    ====== DEFAULT VIEW OPTION ======
    By default, nothing is shown until user clicks a submenu item.
    If you want Dashboard to auto-show on load, uncomment below:
  */

  // const dashboardBtn = document.querySelector(
  //   '#equipment-section .equip-submenu button[data-target="equip-dashboard"]'
  // );
  // if (dashboardBtn) dashboardBtn.click();
}
