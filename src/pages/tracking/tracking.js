import {
  addDaysToSimulatedDate,
  addMonthsToSimulatedDate,
  getCurrentDate,
  getPeriodKey,
  resetSimulatedDate
} from "../../js/utils/appDate.js";
import { getProgress, saveCompletedActions } from "../../js/utils/progressApi.js";
import { isAdmin } from "../../js/utils/session.js";

export async function initTrackingPage() {
  const dailyList = document.getElementById("dailyList");
  const weeklyList = document.getElementById("weeklyList");
  const monthlyList = document.getElementById("monthlyList");
  const activeDate = document.getElementById("activeDate");
  const totalPoints = document.getElementById("totalPoints");
  const adminDateControls = document.getElementById("adminDateControls");

  let selected = [];
  let completed = {};
  let accumulatedPoints = 0;

  async function loadProgress() {
    try {
      const progress = await getProgress();
      selected = progress.selectedActions || [];
      completed = progress.completedActions || {};
      accumulatedPoints = progress.totalPoints || 0;
    } catch (error) {
      alert(error.message);
    }
  }

  function getActionRecord(action) {
    return completed[action.text] || {
      freq: action.freq,
      points: action.points,
      completions: {}
    };
  }

  function isCompletedInCurrentPeriod(action) {
    const record = getActionRecord(action);
    const periodKey = getPeriodKey(action.freq);

    return Boolean(record.completions?.[periodKey]);
  }

  async function completeAction(actionText) {
    const action = selected.find((item) => item.text === actionText);

    if (!action || isCompletedInCurrentPeriod(action)) return;

    const periodKey = getPeriodKey(action.freq);
    const record = getActionRecord(action);

    record.freq = action.freq;
    record.points = action.points;
    record.completions = record.completions || {};
    record.completions[periodKey] = {
      completedAt: getCurrentDate(),
      points: action.points
    };

    completed[action.text] = record;
    try {
      const progress = await saveCompletedActions(completed);
      completed = progress.completedActions || {};
      accumulatedPoints = progress.totalPoints || 0;
    } catch (error) {
      alert(error.message);
    }

    render();
  }

  function calculateTotalPoints() {
    return accumulatedPoints;
  }

  function renderAdminControls() {
    if (!isAdmin()) {
      adminDateControls.innerHTML = "";
      return;
    }

    adminDateControls.innerHTML = `
      <span>Simulación para administrador</span>
      <button type="button" data-date-action="day">+1 día</button>
      <button type="button" data-date-action="month">+1 mes</button>
      <button type="button" data-date-action="reset">Fecha real</button>
    `;
  }

  function renderList(listElement, actions) {
    // Si no hay acciones en esta categoría, mostramos un mensaje amigable
    if (actions.length === 0) {
      listElement.innerHTML = `
        <div style="text-align: center; color: var(--texto-secundario); padding: 30px 0;">
          <p>Aún no has agregado acciones aquí.</p>
        </div>`;
      return;
    }

    // Dibujamos cada acción con sus nuevas clases
    listElement.innerHTML = actions.map(action => {
      // Verificamos si esta acción específica está completada
      const isDone = isCompletedInCurrentPeriod(action);
      
      return `
        <li class="tracking-item ${isDone ? 'completed' : ''}">
          <input 
            type="checkbox" 
            data-text="${action.text}" 
            ${isDone ? "checked" : ""}
            ${isDone ? "disabled" : ""}
          />
          <div class="tracking-info">
            <strong>${action.text}</strong>
            <span class="tracking-points">+${action.points} pts</span>
            <span class="tracking-status">
              ${isDone ? "Completada en este periodo" : "Disponible para completar"}
            </span>
          </div>
        </li>
      `;
    }).join("");
  }

  function render() {
    activeDate.textContent = getCurrentDate();
    totalPoints.textContent = `${calculateTotalPoints()} pts`;
    renderAdminControls();

    const daily = selected.filter(a => a.freq === "Diario");
    const weekly = selected.filter(a => a.freq === "Semanal");
    const monthly = selected.filter(a => a.freq === "Mensual");

    renderList(dailyList, daily);
    renderList(weeklyList, weekly);
    renderList(monthlyList, monthly);
  }

  // Delegación de eventos (evita duplicar listeners)
  function handleCheck(e) {
    if (e.target.matches("input[type='checkbox']")) {
      completeAction(e.target.dataset.text);
    }
  }

  adminDateControls.addEventListener("click", (e) => {
    const action = e.target.dataset.dateAction;

    if (!action) return;

    if (action === "day") addDaysToSimulatedDate(1);
    if (action === "month") addMonthsToSimulatedDate(1);
    if (action === "reset") resetSimulatedDate();

    render();
  });

  dailyList.addEventListener("change", handleCheck);
  weeklyList.addEventListener("change", handleCheck);
  monthlyList.addEventListener("change", handleCheck);

  // Opcional: escuchar cambios globales (por si otra vista modifica datos)
  window.addEventListener("eco_updated", () => {
    loadProgress().then(render);
  });

  window.addEventListener("eco_date_changed", () => {
    render();
  });

  await loadProgress();
  render();
}
