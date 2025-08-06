export function showPanel(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
}

window.addEventListener("popstate", () => {
  const view = history.state?.view || "login";
  if (view === "admin") showPanel("admin-panel");
  else showPanel("login-panel");
});

document.getElementById("logout-btn").onclick = () => {
  sessionStorage.clear();
  history.pushState({ view: "login" }, "", "#login");
  showPanel("login-panel");
};
