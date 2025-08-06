export function showPanel(panelId) {
  document.querySelectorAll(".panel").forEach(el => el.classList.add("hidden"));
  document.getElementById(panelId)?.classList.remove("hidden");
}

export function logout() {
  sessionStorage.clear();
  showPanel("login-panel");
}
