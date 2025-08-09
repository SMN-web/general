import { initRiggingDetails } from "./rigging-details.js";
import { initRiggingLogs } from "./rigging-logs.js";

export function initRiggingControl() {
  const subTabs = document.querySelectorAll("#rigging-section .rigging-subtab");
  const subSections = document.querySelectorAll("#rigging-section .rigging-subsection");

  subTabs.forEach(btn => {
    if (!btn.dataset.bound) {
      btn.dataset.bound = "true";
      btn.addEventListener("click", () => {
        subTabs.forEach(b => b.classList.remove("active"));
        subSections.forEach(s => s.classList.add("hidden"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.target).classList.remove("hidden");

        if (btn.dataset.target === "rigging-details") initRiggingDetails();
        if (btn.dataset.target === "rigging-logs") initRiggingLogs();
      });
    }
  });

  document.querySelector('#rigging-section .rigging-subtab.active')?.click();
}
