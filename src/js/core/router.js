import { loadView } from "./viewLoader.js";

export async function router() {
  const path = window.location.hash || "#/";

  const app = document.getElementById("app");

  if (path === "#/") {
    app.innerHTML = await loadView("home");
    return;
  }

  if (path === "#/about") {
    app.innerHTML = await loadView("about");
    return;
  }
 
  if (path === "#/todoList") {
    app.innerHTML = await loadView("todoList");

    const module = await import("../../pages/todoList/todoList.js");
    module.initTodoList();

    return;
  }

  if (path === "#/register"){
    app.innerHTML = await loadView("register");
    
    const module = await import("../../pages/register/register.js");
    module.initRegister();

    return;
  }

  app.innerHTML = "<h1>404</h1>";
}