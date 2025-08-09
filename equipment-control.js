import { initEquipmentDashboard } from './equipment-dashboard.js';
import { initEquipmentList } from './equipment-list.js';
import { initEquipmentManage } from './equipment-manage.js';

export function initEquipmentControl() {
  // Toggle submenus on group click
  document.querySelectorAll('#equipment-section .equip-menu-group').forEach(group => {
    group.addEventListener('click', () => {
      // Toggle this group's submenu
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

  // Submenu item click: show correct subsection (hide others)
  document.querySelectorAll('#equipment-section .equip-submenu button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#equipment-section .equip-subsection').forEach(sec => sec.classList.add('hidden'));
      const showId = btn.dataset.target;
      document.getElementById(showId).classList.remove('hidden');

      // Initialize logic
      if (showId === 'equip-dashboard') initEquipmentDashboard();
      if (showId === 'equip-upload') initEquipmentList();
      if (showId === 'equip-list') initEquipmentManage();
    });
  });

  // Default: show dashboard (can customize if needed)
  document.querySelectorAll('#equipment-section .equip-subsection').forEach(sec => sec.classList.add('hidden'));
  document.getElementById('equip-dashboard').classList.remove('hidden');
  initEquipmentDashboard();
}
