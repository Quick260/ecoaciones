import { loadView } from "./viewLoader.js";
import { getCurrentUser } from "../utils/session.js";

const publicRoutes = ["#/login", "#/register"];

function isLoggedIn() {
  return Boolean(getCurrentUser());
}

function updateNavbar() {
  const loggedIn = isLoggedIn();
  const privateLinks = document.querySelectorAll(".nav-link:not(.public-link):not(.logout-button)");
  const publicLinks = document.querySelectorAll(".public-link");
  const logoutButton = document.getElementById("logout_btn");

  privateLinks.forEach((link) => {
    link.style.display = loggedIn ? "" : "none";
  });

  publicLinks.forEach((link) => {
    link.style.display = loggedIn ? "none" : "";
  });

  if (logoutButton) {
    logoutButton.style.display = loggedIn ? "inline-block" : "none";
    logoutButton.onclick = () => {
      localStorage.removeItem("curren_user");
      window.location.hash = "#/login";
      updateNavbar();
    };
  }
}

export async function router() {
  const path = window.location.hash || "#/";
  const loggedIn = isLoggedIn();

  updateNavbar();

  if (!loggedIn && !publicRoutes.includes(path)) {
    window.location.hash = "#/login";
    return;
  }

  if (loggedIn && path === "#/login") {
    window.location.hash = "#/";
    return;
  }

  const app = document.getElementById("app");

  if (path === "#/") {
    app.innerHTML = await loadView("home");
    const module = await import("../../pages/home/home.js")
    module.initHome();
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

  if (path === "#/tracking") {
    app.innerHTML = await loadView("tracking");

    const module = await import("../../pages/tracking/tracking.js");
    module.initTrackingPage();
    
    return;
  }
    
    
  if (path === "#/register"){
    app.innerHTML = await loadView("register");
    
    const module = await import("../../pages/register/register.js");
    module.initRegister();

    return;
  }

  if (path === "#/login"){
    app.innerHTML = await loadView("login");

    const module = await import("../../pages/login/login.js");
    module.initLogin();

    return;
  }

  app.innerHTML = "<h1>404</h1>";
}
