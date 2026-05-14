export function initHome() {
    // 1. Recuperar nombre del usuario
    const userData = JSON.parse(localStorage.getItem("curren_user"));
    const nameDisplay = document.getElementById("user_name");

    if (userData && userData.name) {
        // Tomamos solo el primer nombre por estética
        nameDisplay.textContent = userData.name.split(' ')[0];
    }

    // 2. Calcular estadísticas básicas
    const selectedActions = JSON.parse(localStorage.getItem("eco_selected")) || [];
    const completedActions = JSON.parse(localStorage.getItem("eco_completed")) || {};

    // Mostrar cuántas acciones tiene en su lista
    document.getElementById("stat_actions").textContent = `${selectedActions.length} activas`;

    // Calcular puntos totales de las acciones completadas
    const totalPoints = selectedActions.reduce((sum, action) => {
        return completedActions[action.text] ? sum + action.points : sum;
    }, 0);

    document.getElementById("stat_points").textContent = `${totalPoints} acumulados`;
}