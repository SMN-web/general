import { setupLogoutHandler, startHeartbeat } from "./main.js";
import { initCraneStatus } from "./crane-status.js";
import { initManliftStatus } from "./manlift-status.js";

export function initModeratorPanel() {
  document.getElementById("moderator-email").textContent =
    sessionStorage.getItem("loggedInEmail");

  setupLogoutHandler();
  startHeartbeat();
  initModeratorTabs();

  // Attach logic for the status forms
  initCraneStatus();
  initManliftStatus();
}

function initModeratorTabs() {
  document.querySelectorAll('#moderator-panel .main-tab').forEach(mainBtn => {
    mainBtn.addEventListener('click', () => {
      document.querySelectorAll('#moderator-panel .main-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('#moderator-panel .main-section').forEach(sec => sec.classList.add('hidden'));
      mainBtn.classList.add('active');
      const targetSection = document.getElementById(mainBtn.dataset.main);
      if (!targetSection) return;
      targetSection.classList.remove('hidden');
      const firstTab = targetSection.querySelector(mainBtn.dataset.main.includes('crane') ? '.crane-subtab' : '.manlift-subtab');
      if (firstTab) firstTab.click();
    });
  });

  setupModeratorSubTabs('#moderator-crane-section', '.crane-subtab', '.crane-subsection');
  setupModeratorSubTabs('#moderator-manlift-section', '.manlift-subtab', '.manlift-subsection');
}

function setupModeratorSubTabs(sectionSelector, tabSel, secSel) {
  document.querySelectorAll(`${sectionSelector} ${tabSel}`).forEach(tab => {
    tab.addEventListener('click', () => {
      const section = tab.closest(sectionSelector);
      if (!section) return;
      section.querySelectorAll(tabSel).forEach(st => st.classList.remove('active'));
      section.querySelectorAll(secSel).forEach(sc => sc.classList.add('hidden'));
      tab.classList.add('active');
      const targetElem = document.getElementById(tab.dataset.target);
      if (targetElem) targetElem.classList.remove('hidden');
    });
  });
}
