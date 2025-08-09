document.addEventListener("DOMContentLoaded", () => {
  const subTabButtons = document.querySelectorAll(".equip-subtab");
  const subSections = document.querySelectorAll(".equip-subsection");

  subTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active style from all buttons
      subTabButtons.forEach(b => b.classList.remove("active"));
      // Hide all sections
      subSections.forEach(sec => sec.classList.add("hidden"));

      // Activate clicked tab
      btn.classList.add("active");
      const targetSection = document.getElementById(btn.dataset.target);
      targetSection.classList.remove("hidden");

      // Restart animation for fade-in
      targetSection.style.animation = "none";
      targetSection.offsetHeight; // force reflow
      targetSection.style.animation = null;
    });
  });
});
