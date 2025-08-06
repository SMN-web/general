import { apiGetUsers, apiSetRole, apiAddUser } from './api.js';

export function initAdmin(setPanel, currentUser) {
  const wrap = document.getElementById("admin-panel");
  async function refreshUsers() {
    const res = await apiGetUsers(currentUser.email);
    if (!res.users) { wrap.querySelector("#users-list").innerHTML = "Could not load users."; return; }
    wrap.querySelector("#users-list").innerHTML = `
      <table style="width:99%;margin-top:1em;">
        <tr><th>Email</th><th>Role</th><th>Change Role</th></tr>
        ${res.users.map(user => `
          <tr>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
              <select onchange="window.changeUserRole && window.changeUserRole('${user.email}', this.value)">
                <option value="user" ${user.role==="user"?"selected":""}>User</option>
                <option value="moderator" ${user.role==="moderator"?"selected":""}>Moderator</option>
                <option value="admin" ${user.role==="admin"?"selected":""}>Admin</option>
              </select>
            </td>
          </tr>
        `).join("")}
      </table>
    `;
    window.changeUserRole = async (email, newRole) => {
      await apiSetRole(currentUser.email, email, newRole);
      refreshUsers();
    };
  }
  wrap.innerHTML = `
    <h2>👑 Admin Panel</h2>
    <button onclick="location.reload()">Logout</button>
    <hr />
    <h3>Add User</h3>
    <form id="add-user-form">
      <input id="new-email" type="email" placeholder="New user's email" required />
      <select id="new-role">
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Add User</button>
      <span id="add-user-result"></span>
    </form>
    <div id="users-list">Loading...</div>
  `;
  wrap.querySelector("#add-user-form").onsubmit = async (e) => {
    e.preventDefault();
    const email = wrap.querySelector("#new-email").value;
    const role = wrap.querySelector("#new-role").value;
    wrap.querySelector("#add-user-result").textContent = "Adding...";
    await apiAddUser(currentUser.email, email, role);
    wrap.querySelector("#add-user-result").textContent = "User added!";
    refreshUsers();
  };
  refreshUsers();
}
