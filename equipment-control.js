import { initEquipmentDashboard } from './equipment-dashboard.js';
import { initEquipmentList } from './equipment-list.js';
import { initEquipmentManage } from './equipment-manage.js';
import { initEquipmentEdit } from './equipment-edit.js';

export function initEquipmentControl() {
  // Accordion-style menu: toggle each group to show/hide submenu
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

  // Submenu buttons: switch visible section and run its initializer
  document.querySelectorAll('#equipment-section .equip-submenu button').forEach(btn => {
    btn.addEventListener('click', () => {
      // Hide all subsections
      document.querySelectorAll('#equipment-section .equip-subsection')
        .forEach(sec => sec.classList.add('hidden'));
      // Show the selected subsection
      const showId = btn.dataset.target;
      const secEl = document.getElementById(showId);
      if (secEl) secEl.classList.remove('hidden');
      // Run the correct initializer
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

  // Automatically show Dashboard by default when section loads
  const dashboardBtn = document.querySelector('#equipment-section .equip-submenu button[data-target="equip-dashboard"]');
  if (dashboardBtn) dashboardBtn.click();
}
