export function initLogin() {
  const form = document.getElementById("login_form");
  const submitButton = document.getElementById("login_btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginData = {
      email: document.getElementById("login_email").value.trim(),
      password: document.getElementById("login_pass").value
    };

    submitButton.disabled = true;
    submitButton.textContent = "Entrando...";

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "No se pudo iniciar sesión.");
        return;
      }

      localStorage.setItem("curren_user", JSON.stringify(result.user));
      window.location.hash = "#/";
    } catch (error) {
      alert("No se pudo conectar con la base de datos. Ejecuta el proyecto con `npm start`.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Entrar";
    }
  });
}
