const API = "https://YOUR_WORKER_DOMAIN";
export async function apiLogin(email, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
}
export async function apiGetUsers(adminEmail) {
  const res = await fetch(`${API}/users?email=${encodeURIComponent(adminEmail)}`);
  return await res.json();
}
export async function apiSetRole(adminEmail, targetEmail, newRole) {
  return await fetch(`${API}/set-role`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ adminEmail, targetEmail, newRole })
  });
}
export async function apiAddUser(adminEmail, newEmail, newRole) {
  return await fetch(`${API}/add-user`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ adminEmail, newEmail, newRole })
  });
}
