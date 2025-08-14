import { setupLogoutHandler, startHeartbeat } from "./main.js";
import { initCraneStatus } from "./crane-status.js";
import { initManliftStatus } from "./manlift-status.js";

export function initModeratorPanel() {
  document.getElementById("moderator-email").textContent =
    sessionStorage.getItem("loggedInEmail");

  setupLogoutHandler();
  startHeartbeat();
  initModeratorTabs();

  initCraneStatus();
  initManliftStatus();
}

function initModeratorTabs() {
  document.querySelectorAll('#moderator-panel .main-tab').forEach(mainBtn => {
    mainBtn.addEventListener('click', () => {
      document.querySelectorAll('#moderator-panel .main-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('#moderator-panel .main-section').forEach(sec => sec.classList.add('hidden'));
      mainBtn.classList.add('active');
      document.getElementById(mainBtn.dataset.main)?.classList.remove('hidden');
    });
  });

  setupModeratorSubTabs('#moderator-crane-section', '.crane-subtab', '.crane-subsection');
  setupModeratorSubTabs('#moderator-manlift-section', '.manlift-subtab', '.manlift-subsection');
}

function setupModeratorSubTabs(sectionSelector, tabSel, secSel) {
  document.querySelectorAll(`${sectionSelector} ${tabSel}`).forEach(tab => {
    tab.addEventListener('click', () => {
      const section = tab.closest(sectionSelector);
      section.querySelectorAll(tabSel).forEach(st => st.classList.remove('active'));
      section.querySelectorAll(secSel).forEach(sc => sc.classList.add('hidden'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target)?.classList.remove('hidden');
    });
  });
}
