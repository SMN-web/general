export const API_LOGIN     = "https://round-art-2c60.nafil-8895-s.workers.dev/login";
export const API_USERS     = "https://fragrant-recipe-072a.nafil-8895-s.workers.dev/users";
export const API_SET_ROLE  = "https://mute-snowflake-11b4.nafil-8895-s.workers.dev/set-role";
export const API_ADD_USER  = "https://green-star-3210.nafil-8895-s.workers.dev/add-user";

export async function apiLogin(email, password) {
  const res = await fetch(API_LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
}

export async function apiGetUsers(adminEmail) {
  const res = await fetch(`${API_USERS}?email=${encodeURIComponent(adminEmail)}`);
  return await res.json();
}

export async function apiSetRole(adminEmail, targetEmail, newRole) {
  const res = await fetch(API_SET_ROLE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminEmail, targetEmail, newRole })
  });
  return await res.json();
}

export async function apiAddUser(adminEmail, newEmail, newRole) {
  const res = await fetch(API_ADD_USER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminEmail, newEmail, newRole })
  });
  return await res.json();
}
