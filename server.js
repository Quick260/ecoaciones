const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DB_DIR = path.join(ROOT_DIR, "db");
const USERS_FILE = path.join(DB_DIR, "users.json");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

async function ensureDatabase() {
  await fs.mkdir(DB_DIR, { recursive: true });

  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]\n");
  }
}

async function readUsers() {
  await ensureDatabase();
  const content = await fs.readFile(USERS_FILE, "utf8");
  return JSON.parse(content || "[]");
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`);
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function calculateTotalPoints(completedActions = {}) {
  return Object.values(completedActions).reduce((sum, record) => {
    const completions = record.completions || {};

    return sum + Object.values(completions).reduce((periodSum, completion) => {
      return periodSum + Number(completion.points || record.points || 0);
    }, 0);
  }, 0);
}

function normalizeUser(user) {
  user.role = user.role || "user";
  user.selectedActions = Array.isArray(user.selectedActions) ? user.selectedActions : [];
  user.completedActions = user.completedActions || {};
  user.totalPoints = calculateTotalPoints(user.completedActions);

  return user;
}

function toPublicUser(user) {
  const { password: _password, ...publicUser } = normalizeUser(user);
  return publicUser;
}

function findUserIndex(users, userId) {
  return users.findIndex((user) => user.id === userId);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        reject(new Error("El cuerpo de la peticion es demasiado grande."));
        req.destroy();
      }
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function registerUser(req, res) {
  try {
    const body = await readRequestBody(req);
    const { name, email, password } = JSON.parse(body);

    if (!name || !email || !password) {
      sendJson(res, 400, { message: "Nombre, correo y contraseña son obligatorios." });
      return;
    }

    const users = await readUsers();
    const normalizedEmail = String(email).trim().toLowerCase();
    const emailExists = users.some((user) => user.email === normalizedEmail);

    if (emailExists) {
      sendJson(res, 409, { message: "Ya existe una cuenta con ese correo." });
      return;
    }

    const user = {
      id: crypto.randomUUID(),
      name: String(name).trim(),
      email: normalizedEmail,
      password: String(password),
      role: "user",
      selectedActions: [],
      completedActions: {},
      totalPoints: 0,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    await writeUsers(users);

    sendJson(res, 201, { message: "Cuenta creada.", user: toPublicUser(user) });
  } catch (error) {
    sendJson(res, 500, { message: "Error al guardar la cuenta." });
  }
}

async function loginUser(req, res) {
  try {
    const body = await readRequestBody(req);
    const { email, password } = JSON.parse(body);

    if (!email || !password) {
      sendJson(res, 400, { message: "Correo y contraseña son obligatorios." });
      return;
    }

    const users = await readUsers();
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = users.find((savedUser) => {
      return savedUser.email === normalizedEmail && savedUser.password === String(password);
    });

    if (!user) {
      sendJson(res, 401, { message: "Correo o contraseña incorrectos." });
      return;
    }

    const index = users.findIndex((savedUser) => savedUser.id === user.id);
    const normalizedUser = normalizeUser(user);
    users[index] = normalizedUser;
    await writeUsers(users);

    sendJson(res, 200, { message: "Sesion iniciada.", user: toPublicUser(normalizedUser) });
  } catch (error) {
    sendJson(res, 500, { message: "Error al iniciar sesión." });
  }
}

async function getUserProgress(userId, res) {
  const users = await readUsers();
  const index = findUserIndex(users, userId);

  if (index === -1) {
    sendJson(res, 404, { message: "Usuario no encontrado." });
    return;
  }

  const user = normalizeUser(users[index]);
  users[index] = user;
  await writeUsers(users);

  sendJson(res, 200, {
    selectedActions: user.selectedActions,
    completedActions: user.completedActions,
    totalPoints: user.totalPoints
  });
}

async function updateSelectedActions(req, res, userId) {
  try {
    const body = await readRequestBody(req);
    const { selectedActions } = JSON.parse(body);

    if (!Array.isArray(selectedActions)) {
      sendJson(res, 400, { message: "selectedActions debe ser un arreglo." });
      return;
    }

    const users = await readUsers();
    const index = findUserIndex(users, userId);

    if (index === -1) {
      sendJson(res, 404, { message: "Usuario no encontrado." });
      return;
    }

    const user = normalizeUser(users[index]);
    user.selectedActions = selectedActions;
    users[index] = user;
    await writeUsers(users);

    sendJson(res, 200, {
      selectedActions: user.selectedActions,
      completedActions: user.completedActions,
      totalPoints: user.totalPoints
    });
  } catch (error) {
    sendJson(res, 500, { message: "Error al guardar las acciones." });
  }
}

async function updateCompletedActions(req, res, userId) {
  try {
    const body = await readRequestBody(req);
    const { completedActions } = JSON.parse(body);

    if (!completedActions || Array.isArray(completedActions) || typeof completedActions !== "object") {
      sendJson(res, 400, { message: "completedActions debe ser un objeto." });
      return;
    }

    const users = await readUsers();
    const index = findUserIndex(users, userId);

    if (index === -1) {
      sendJson(res, 404, { message: "Usuario no encontrado." });
      return;
    }

    const user = normalizeUser(users[index]);
    user.completedActions = completedActions;
    user.totalPoints = calculateTotalPoints(completedActions);
    users[index] = user;
    await writeUsers(users);

    sendJson(res, 200, {
      selectedActions: user.selectedActions,
      completedActions: user.completedActions,
      totalPoints: user.totalPoints
    });
  } catch (error) {
    sendJson(res, 500, { message: "Error al guardar el progreso." });
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/db" || url.pathname.startsWith("/db/")) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("403 Forbidden");
    return;
  }

  const requestPath = url.pathname === "/" ? "/public/index.html" : url.pathname;
  const filePath = path.normalize(path.join(ROOT_DIR, requestPath));

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end("403 Forbidden");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath);

    res.writeHead(200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream"
    });
    res.end(file);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const progressMatch = url.pathname.match(/^\/api\/users\/([^/]+)\/progress$/);
  const selectedMatch = url.pathname.match(/^\/api\/users\/([^/]+)\/selected-actions$/);
  const completedMatch = url.pathname.match(/^\/api\/users\/([^/]+)\/completed-actions$/);

  if (req.method === "POST" && req.url === "/api/register") {
    await registerUser(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/login") {
    await loginUser(req, res);
    return;
  }

  if (req.method === "GET" && progressMatch) {
    await getUserProgress(progressMatch[1], res);
    return;
  }

  if (req.method === "PUT" && selectedMatch) {
    await updateSelectedActions(req, res, selectedMatch[1]);
    return;
  }

  if (req.method === "PUT" && completedMatch) {
    await updateCompletedActions(req, res, completedMatch[1]);
    return;
  }

  if (req.method === "GET") {
    await serveStatic(req, res);
    return;
  }

  res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("405 Method Not Allowed");
});

ensureDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Servidor listo en http://localhost:${PORT}`);
  });
});
