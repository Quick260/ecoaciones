# Ecoacciones
--- 
## Descripcion
Ecoacciones es una aplicación web prototipo que busca incentivar a las personas a realizar acciones que ayudan al medioambiente haciendo que se sienta poco tedioso

---
## Tecnologias
- HTML
- CSS
- JavaScript

---
## Estructura del proyecto 

```
.
├── public
│   ├── assets
│   │   ├── fonts
│   │   ├── icons
│   │   └── images
│   ├── favicon.ico
│   └── index.html      #html principal
├── README.md
└── src
    ├── css             #CSS reciclable
    │   ├── base
    │   │   ├── reset.css
    │   │   └── variables.css
    │   ├── components
    │   │   └── button.css
    │   ├── layouts
    │   │   └── header.css
    │   └── main.css
    ├── js
    │   ├── core
    │   │   ├── app.js         #entry point de la app
    │   │   ├── cache.js       #manejo del cache
    │   │   ├── router.js      #manejo de rutas
    │   │   └── viewLoader.js
    │   ├── modules
    │   │   └── navbar.js
    │   └── utils
    │       └── helpers.js
    └── pages                  #carpeta de paginas  
        ├── about
        │   ├── about.css
        │   ├── about.html
        │   └── about.js
        ├── home
        │   ├── home.css
        │   ├── home.html
        │   └── home.js
        └── todoList
            ├── todoList.css
            ├── todoList.html
            └── todoList.js
```


## Agregar pagina
1. Para agregar una pagina, primeramente necesitaremos agregarla al archivo de rutas `./src/js/core/router`, si la pagina requiere visión en el cambio de estado también debe ser declarado 
```js
if (path === "#/todoList") {

	app.innerHTML = await loadView("todoList");

	const module = await import("../../pages/todoList/todoList.js");
	module.initTodoList();

	return;
}
```
2. Agregar a `./src/pages` una carpeta con el nombre de la pagina y un archivo .css, .html y .js
3. Asegurese de que los nombres respeten las convenciones 

---
## Cómo ejecutar el proyecto

1. Abrir el proyecto en VS Code
2. Instalar extensión Live Server
3. Abrir `public/index.html`
4. Click en "Open with Live Server"
  
---

## Funcionalidades

- Sistema de rutas con hash (#/)
- Carga dinámica de vistas con fetch
- Página Todo List funcional
- Render dinámico con innerHTML
- Módulos ES6 con import/export

---
## Notas técnicas

Este proyecto implementa una SPA manual:

- El router detecta cambios en `window.location.hash`
- Las vistas se cargan dinámicamente con `fetch`
- Cada página se inicializa con un módulo JS independiente
- El contenido se renderiza dentro del contenedor `#app`