export const API_LOGIN   = "https://login-worker.example.workers.dev";
export const API_USERS   = "https://admin-users-worker.example.workers.dev/users";

// More APIs can be added later (e.g., for moderator, user, etc.)

export async function loginUser(email, password) {
  const res = await fetch(API_LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
}

export async function fetchAllUsers(adminEmail) {
  const res = await fetch(`${API_USERS}?email=${encodeURIComponent(adminEmail)}`);
  return await res.json();
}
