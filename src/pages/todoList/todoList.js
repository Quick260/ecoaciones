export function initTodoList() {
  const CATEGORIES = [
    {
      title: "🟢 Ahorro de agua",
      actions: [
        { text: "🚿 Duchas cortas", freq: "Diario", points: 5 },
        { text: "🚰 Cerrar la llave", freq: "Diario", points: 3 },
        { text: "🪣 Reutilizar agua", freq: "Semanal", points: 7 },
        { text: "🔧 Reportar fugas", freq: "Mensual", points: 15 }
      ]
    },
    {
      title: "⚡ Ahorro de energía",
      actions: [
        { text: "💡 Apagar luces", freq: "Diario", points: 4 },
        { text: "🔌 Desconectar aparatos", freq: "Diario", points: 5 },
        { text: "🌞 Luz natural", freq: "Diario", points: 3 },
        { text: "📺 Reducir uso dispositivos", freq: "Semanal", points: 6 }
      ]
    },
    {
      title: "♻️ Reciclaje y residuos",
      actions: [
        { text: "🗑️ Separar basura", freq: "Diario", points: 6 },
        { text: "♻️ Reciclar", freq: "Semanal", points: 8 },
        { text: "🚯 No tirar basura", freq: "Diario", points: 4 },
        { text: "🔄 Reutilizar objetos", freq: "Mensual", points: 10 }
      ]
    },
    {
      title: "🚫 Reducción de plásticos",
      actions: [
        { text: "🛍️ Bolsa reutilizable", freq: "Semanal", points: 6 },
        { text: "🥤 Evitar popotes", freq: "Diario", points: 3 },
        { text: "🥡 Evitar desechables", freq: "Semanal", points: 7 },
        { text: "🚰 Botella reutilizable", freq: "Diario", points: 5 }
      ]
    },
    {
      title: "🚶 Transporte sostenible",
      actions: [
        { text: "🚶 Caminar", freq: "Diario", points: 8 },
        { text: "🚲 Bicicleta", freq: "Semanal", points: 10 },
        { text: "🚌 Transporte público", freq: "Semanal", points: 9 },
        { text: "🚗 Compartir auto", freq: "Mensual", points: 12 }
      ]
    },
    {
      title: "🌳 Cuidado del entorno",
      actions: [
        { text: "🌱 Cuidar plantas", freq: "Semanal", points: 6 },
        { text: "🧹 Limpiar espacios", freq: "Mensual", points: 10 },
        { text: "🐾 Cuidar animales", freq: "Diario", points: 5 },
        { text: "🌿 No dañar áreas verdes", freq: "Diario", points: 4 }
      ]
    },
    {
      title: "🛒 Consumo responsable",
      actions: [
        { text: "🛍️ Comprar local", freq: "Semanal", points: 7 },
        { text: "🥗 No desperdiciar comida", freq: "Diario", points: 6 },
        { text: "📦 Comprar necesario", freq: "Semanal", points: 5 },
        { text: "♻️ Productos reciclables", freq: "Semanal", points: 6 }
      ]
    }
  ];

  let selected = JSON.parse(localStorage.getItem("eco_selected")) || [];

  const list = document.getElementById("list");

  function save() {
    setSelected(selected);
  }

  function toggleAction(action) {
    const exists = selected.find(a => a.text === action.text);

    if (exists) {
      selected = selected.filter(a => a.text !== action.text);
    } else {
      selected.push(action);
    }

    save();
    render();
  }

  function render() {
    list.innerHTML = CATEGORIES.map(category => `
      <div style="margin-bottom:20px;">
        <h2>${category.title}</h2>
        <ul>
          ${category.actions.map(action => {
            const isActive = selected.some(a => a.text === action.text);

            return `
              <li style="margin-bottom:8px;">
                <strong>${action.text}</strong><br>
                Frecuencia: ${action.freq} | Puntos: ${action.points}
                <br>
                <button data-text="${action.text}">
                  ${isActive ? "Quitar" : "Agregar"}
                </button>
              </li>
            `;
          }).join("")}
        </ul>
      </div>
    `).join("");

    document.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = CATEGORIES
          .flatMap(c => c.actions)
          .find(a => a.text === btn.dataset.text);

        toggleAction(action);
      });
    });
  }

  render();
}

export function getSelected() {
  return JSON.parse(localStorage.getItem("eco_selected")) || [];
}

export function setSelected(data) {
  localStorage.setItem("eco_selected", JSON.stringify(data));
  window.dispatchEvent(new Event("eco_updated"));
}