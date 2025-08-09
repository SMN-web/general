import { initAddUser } from "./add-user.js";
import { initUserControl } from "./user-control.js";
import { initUserLogs } from "./user-logs.js";

export function initUserControlMain() {
  const subTabs = document.querySelectorAll("#user-section .user-subtab");
  const subSections = document.querySelectorAll("#user-section .user-subsection");

  subTabs.forEach(btn => {
    if (!btn.dataset.bound) {
      btn.dataset.bound = "true";
      btn.addEventListener("click", () => {
        subTabs.forEach(b => b.classList.remove("active"));
        subSections.forEach(s => s.classList.add("hidden"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.target).classList.remove("hidden");

        if (btn.dataset.target === "add-user-sub") initAddUser();
        if (btn.dataset.target === "user-control-sub") initUserControl();
        if (btn.dataset.target === "user-logs-sub") initUserLogs();
      });
    }
  });

  document.querySelector('#user-section .user-subtab.active')?.click();
}
