// equipment-control.js

export function initEquipmentControl() {
  console.log("✅ Equipment Control initialized (placeholder mode)");

  const subTabButtons = document.querySelectorAll(".equip-subtab");
  const subSections = document.querySelectorAll(".equip-subsection");

  if (!subTabButtons.length || !subSections.length) {
    console.warn("⚠️ Equipment sub-tabs or sections not found in DOM.");
    return;
  }

  // Attach click events
  subTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active from all tabs
      subTabButtons.forEach(b => b.classList.remove("active"));
      // Hide all sub-sections
      subSections.forEach(sec => sec.classList.add("hidden"));

      // Activate clicked tab
      btn.classList.add("active");

      const targetId = btn.dataset.target;
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");

        // Restart fade-in animation
        targetSection.style.animation = "none";
        targetSection.offsetHeight; // force reflow
        targetSection.style.animation = null;
      }
    });
  });
}
