/* ============================================================
   CORE DEL SISTEMA ESPUMIN ERP
   ============================================================ */

/* ------------------------------
   UTILIDADES DE LOCALSTORAGE
   ------------------------------ */
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/* ------------------------------
   GENERAR ID ÚNICO
   ------------------------------ */
function generarID() {
    return crypto.randomUUID();
}

/* ------------------------------
   FORMATO DE FECHA
   ------------------------------ */
function formatDate(fechaISO) {
    if (!fechaISO) return "";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-AR") + " " + fecha.toLocaleTimeString("es-AR");
}

/* ------------------------------
   AUDITORÍA
   ------------------------------ */
function registrarAuditoria(modulo, tipo, detalle) {
    const auditoria = getData("auditoria");

    auditoria.push({
        id: generarID(),
        fecha: new Date().toISOString(),
        modulo,
        tipo,
        detalle
    });

    setData("auditoria", auditoria);
}

/* ------------------------------
   LOGIN Y SESIÓN
   ------------------------------ */
function login(usuario, clave) {
    const usuarios = getData("usuarios");

    const user = usuarios.find(u => u.usuario === usuario && u.clave === clave);

    if (!user) return false;

    localStorage.setItem("usuarioLogueado", JSON.stringify(user));

    registrarAuditoria("Login", "Ingreso", `Usuario: ${user.usuario}`);

    return true;
}

function logout() {
    const user = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (user) registrarAuditoria("Login", "Salida", `Usuario: ${user.usuario}`);

    localStorage.removeItem("usuarioLogueado");
    window.location.href = "index.html";
}

function getUsuarioActual() {
    return JSON.parse(localStorage.getItem("usuarioLogueado"));
}

/* ------------------------------
   PROTEGER MÓDULOS
   ------------------------------ */
function protegerModulo() {
    const user = getUsuarioActual();
    if (!user) {
        window.location.href = "index.html";
        return;
    }
}

/* ------------------------------
   CARGAR MENÚ DINÁMICO
   ------------------------------ */
function cargarMenu() {
    fetch("menu.html")
        .then(r => r.text())
        .then(html => {
            document.getElementById("menu-container").innerHTML = html;

            const user = getUsuarioActual();
            if (user) {
                const span = document.getElementById("usuarioActual");
                if (span) span.textContent = user.usuario;
            }
        });
}

/* ------------------------------
   INICIALIZACIÓN GLOBAL
   ------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("menu-container");
    if (menu) cargarMenu();
});
