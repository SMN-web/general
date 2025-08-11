import { setupLogoutHandler, startHeartbeat } from "./main.js";

export function initModeratorPanel() {
  const email = sessionStorage.getItem("loggedInEmail");
  document.getElementById("moderator-email").textContent = email;

  setupLogoutHandler();
  startHeartbeat();

  initModeratorTabs();
}

// === Moderator Main & Sub-tab Handlers ===

function initModeratorTabs() {
  // Main tab switching inside moderator panel
  document.querySelectorAll('#moderator-panel .main-tab').forEach(mainBtn => {
    mainBtn.addEventListener('click', () => {
      // deactivate all main tabs and hide sections (within moderator only)
      document.querySelectorAll('#moderator-panel .main-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('#moderator-panel .main-section').forEach(sec => sec.classList.add('hidden'));

      // activate clicked tab
      mainBtn.classList.add('active');

      // show its section
      const targetSection = document.getElementById(mainBtn.dataset.main);
      if (!targetSection) return;
      targetSection.classList.remove('hidden');

      // default sub-tab when switching main tabs
      if (mainBtn.dataset.main === 'moderator-crane-section') {
        const firstCraneTab = targetSection.querySelector('.crane-subtab');
        if (firstCraneTab) firstCraneTab.click();
      }
      if (mainBtn.dataset.main === 'moderator-manlift-section') {
        const firstManliftTab = targetSection.querySelector('.manlift-subtab');
        if (firstManliftTab) firstManliftTab.click();
      }
    });
  });

  // Sub-tab switching
  setupModeratorSubTabs('#moderator-crane-section', '.crane-subtab', '.crane-subsection');
  setupModeratorSubTabs('#moderator-manlift-section', '.manlift-subtab', '.manlift-subsection');
}

function setupModeratorSubTabs(sectionSelector, subtabSelector, subsectionSelector) {
  document.querySelectorAll(sectionSelector + ' ' + subtabSelector).forEach(tab => {
    tab.addEventListener('click', () => {
      const section = tab.closest(sectionSelector);
      if (!section) return;

      // deactivate all sub-tabs in this section
      section.querySelectorAll(subtabSelector).forEach(st => st.classList.remove('active'));
      // hide all subsections
      section.querySelectorAll(subsectionSelector).forEach(sc => sc.classList.add('hidden'));

      // activate clicked sub-tab
      tab.classList.add('active');

      // show targeted subsection
      const targetId = tab.dataset.target;
      if (targetId) {
        const targetElem = document.getElementById(targetId);
        if (targetElem) targetElem.classList.remove('hidden');
      }
    });
  });
}
