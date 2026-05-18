import { getProgress } from "../../js/utils/progressApi.js";

export async function initHome() {
    // 1. Recuperar nombre del usuario
    const userData = JSON.parse(localStorage.getItem("curren_user"));
    const nameDisplay = document.getElementById("user_name");

    if (userData && userData.name) {
        // Tomamos solo el primer nombre por estética
        nameDisplay.textContent = userData.name.split(' ')[0];
    }

    // 2. Calcular estadísticas básicas
    let selectedActions = [];
    let totalPoints = 0;

    try {
        const progress = await getProgress();
        selectedActions = progress.selectedActions || [];
        totalPoints = progress.totalPoints || 0;
    } catch (error) {
        alert(error.message);
    }

    // Mostrar cuántas acciones tiene en su lista
    document.getElementById("stat_actions").textContent = `${selectedActions.length} activas`;

    document.getElementById("stat_points").textContent = `${totalPoints} acumulados`;
}
