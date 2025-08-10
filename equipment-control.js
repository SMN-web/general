import { initEquipmentDashboard } from './equipment-dashboard.js';
import { initEquipmentList } from './equipment-list.js';
import { initEquipmentManage } from './equipment-manage.js';
import { initEquipmentEdit } from './equipment-edit.js';

export function initEquipmentControl() {
  // Toggle submenus when clicking group header
  document.querySelectorAll('#equipment-section .equip-menu-group').forEach(group => {
    group.addEventListener('click', () => {
      const targetGroup = group.dataset.group;
      document.querySelectorAll('#equipment-section .equip-submenu').forEach(menu => {
        if (menu.dataset.parent === targetGroup) {
          menu.classList.toggle('hidden');
        } else {
          menu.classList.add('hidden');
        }
      });
    });
  });

  // Submenu buttons click
  document.querySelectorAll('#equipment-section .equip-submenu button').forEach(btn => {
    btn.addEventListener('click', () => {
      // hide all subsections
      document.querySelectorAll('#equipment-section .equip-subsection')
        .forEach(sec => sec.classList.add('hidden'));

      // show the selected subsection
      const showId = btn.dataset.target;
      const sectionEl = document.getElementById(showId);
      if (sectionEl) {
        sectionEl.classList.remove('hidden');
      }

      // initialise section
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
    ===== DEFAULT LOADING =====
    If you want dashboard to load automatically, uncomment:
  */
  // const dashboardBtn = document.querySelector(
  //   '#equipment-section .equip-submenu button[data-target="equip-dashboard"]'
  // );
  // if (dashboardBtn) dashboardBtn.click();
}
