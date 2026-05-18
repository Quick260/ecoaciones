import { getCurrentUserId } from "./session.js";

export async function getProgress() {
  const response = await fetch(`/api/users/${getCurrentUserId()}/progress`);
  const progress = await response.json();

  if (!response.ok) {
    throw new Error(progress.message || "No se pudo cargar el progreso.");
  }

  return progress;
}

export async function saveSelectedActions(selectedActions) {
  const response = await fetch(`/api/users/${getCurrentUserId()}/selected-actions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ selectedActions })
  });
  const progress = await response.json();

  if (!response.ok) {
    throw new Error(progress.message || "No se pudieron guardar las acciones.");
  }

  window.dispatchEvent(new Event("eco_updated"));
  return progress;
}

export async function saveCompletedActions(completedActions) {
  const response = await fetch(`/api/users/${getCurrentUserId()}/completed-actions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ completedActions })
  });
  const progress = await response.json();

  if (!response.ok) {
    throw new Error(progress.message || "No se pudo guardar el progreso.");
  }

  window.dispatchEvent(new Event("eco_updated"));
  return progress;
}
