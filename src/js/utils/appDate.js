import { isAdmin } from "./session.js";

const SIMULATED_DATE_KEY = "eco_simulated_date";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function realToday() {
  return formatDate(new Date());
}

export function getCurrentDate() {
  if (!isAdmin()) return realToday();

  return localStorage.getItem(SIMULATED_DATE_KEY) || realToday();
}

export function addDaysToSimulatedDate(days) {
  const date = new Date(`${getCurrentDate()}T00:00:00`);
  date.setDate(date.getDate() + days);
  localStorage.setItem(SIMULATED_DATE_KEY, formatDate(date));
  window.dispatchEvent(new Event("eco_date_changed"));
}

export function addMonthsToSimulatedDate(months) {
  const date = new Date(`${getCurrentDate()}T00:00:00`);
  date.setMonth(date.getMonth() + months);
  localStorage.setItem(SIMULATED_DATE_KEY, formatDate(date));
  window.dispatchEvent(new Event("eco_date_changed"));
}

export function resetSimulatedDate() {
  localStorage.removeItem(SIMULATED_DATE_KEY);
  window.dispatchEvent(new Event("eco_date_changed"));
}

export function getPeriodKey(freq, dateValue = getCurrentDate()) {
  const date = new Date(`${dateValue}T00:00:00`);

  if (freq === "Mensual") {
    return dateValue.slice(0, 7);
  }

  if (freq === "Semanal") {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
  }

  return dateValue;
}
