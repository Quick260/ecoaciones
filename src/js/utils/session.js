export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("curren_user"));
}

export function getCurrentUserId() {
  return getCurrentUser()?.id || "guest";
}

export function isAdmin() {
  return getCurrentUser()?.role === "admin";
}
