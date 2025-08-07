export function initUserPanel() {
  const email = sessionStorage.getItem("loggedInEmail");
  document.getElementById("user-panel").innerHTML = `
    <h2>👤 User Dashboard</h2>
    <p>Welcome user, ${email}.</p>
  `;
}
