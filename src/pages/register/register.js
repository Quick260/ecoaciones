export function initRegister() {
  const form = document.getElementById("register_form");
  const submitButton = document.getElementById("reg_btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user_data = {
      name: document.getElementById("reg_name").value.trim(),
      email: document.getElementById("reg_email").value.trim(),
      password: document.getElementById("reg_pass").value
    };

    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user_data)
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "No se pudo crear la cuenta.");
        return;
      }

      localStorage.setItem("curren_user", JSON.stringify(result.user));

      alert(`¡Bienvenido, ${result.user.name}!`);

      window.location.hash = "#/";
    } catch (error) {
      alert("No se pudo conectar con la base de datos. Ejecuta el proyecto con `npm start`.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar";
    }
  });
}
