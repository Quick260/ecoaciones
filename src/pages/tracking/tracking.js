export function initTrackingPage() {
  const dailyList = document.getElementById("dailyList");
  const weeklyList = document.getElementById("weeklyList");
  const monthlyList = document.getElementById("monthlyList");

  let completed = JSON.parse(localStorage.getItem("eco_completed")) || {};

  function saveCompleted() {
    localStorage.setItem("eco_completed", JSON.stringify(completed));
  }

  function toggleCompleted(actionText) {
    completed[actionText] = !completed[actionText];
    saveCompleted();
    render();
  }

  function getSelected() {
    return JSON.parse(localStorage.getItem("eco_selected")) || [];
  }

  function renderList(listElement, actions) {
    if (actions.length === 0) {
      listElement.innerHTML = "<li>No hay acciones</li>";
      return;
    }

    listElement.innerHTML = actions.map(action => `
      <li style="margin-bottom:8px;">
        <label>
          <input 
            type="checkbox" 
            data-text="${action.text}" 
            ${completed[action.text] ? "checked" : ""}
          />
          <strong>${action.text}</strong>
        </label>
        <br>
        Puntos: ${action.points}
      </li>
    `).join("");
  }

  function render() {
    const selected = getSelected();

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
      toggleCompleted(e.target.dataset.text);
    }
  }

  dailyList.addEventListener("change", handleCheck);
  weeklyList.addEventListener("change", handleCheck);
  monthlyList.addEventListener("change", handleCheck);

  // Opcional: escuchar cambios globales (por si otra vista modifica datos)
  window.addEventListener("eco_updated", () => {
    render();
  });

  render();
}