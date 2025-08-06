import { apiLogin } from './api.js';

export function initLogin(setPanel, onLogin) {
  const wrap = document.getElementById("login-panel");
  wrap.innerHTML = `
    <h2>Sign in</h2>
    <form autocomplete="off" id="login-form">
      <fluent-text-field id="email" placeholder="Email" type="email"></fluent-text-field>
      <fluent-text-field id="password" placeholder="Password" type="password"></fluent-text-field>
      <button type="submit">Login</button>
      <div style="color:red;" id="login-msg"></div>
    </form>
  `;
  wrap.classList.add("active");
  document.getElementById("login-form").onsubmit = async (e) => {
    e.preventDefault();
    const email = wrap.querySelector("#email").value;
    const password = wrap.querySelector("#password").value;
    document.getElementById("login-msg").textContent = "Authenticating...";
    const res = await apiLogin(email, password);
    if (res && res.role) { onLogin(res); }
    else { document.getElementById("login-msg").textContent = res?.error || "Login failed"; }
  };
}
