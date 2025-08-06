export function showPanel(panelId) {
  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(panelId)?.classList.remove("hidden");
}

// 👇 on back/forward, update views from history
window.addEventListener("popstate", () => {
  const state = history.state;
  if (state?.view === "admin") {
    showPanel("admin-panel");
  } else {
    showPanel("login-panel");
  }
});
