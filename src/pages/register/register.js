export function initRegister() {
  const form = document.getElementById("register_form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user_data = {
      name: document.getElementById("reg_name").value,
      email: document.getElementById("reg_email").value
    };

    /* Esto es un simulador de guardado de datos en lo que tenemos base de datos jaja
       ~Jair */

    localStorage.setItem("curren_user", JSON.stringify(user_data));
    
    alert(`¡Bienvenido, ${user_data.name}!`);
    
    window.location.hash = "#/";
  })
}