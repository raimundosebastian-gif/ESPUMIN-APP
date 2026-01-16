/* ============================================================
   CORE DEL SISTEMA - ESPUMIN ERP BASE (EXTENDIDO)
   Nuevos módulos agregados:
   - Caja / Tesorería
   - Agenda / Calendario
   - Logística / Entregas
   - Producción / Ensamblado
   - Impuestos / IVA / Retenciones
============================================================ */

/* ============================
   HELPERS GENERALES
============================ */

function generarID() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function formatCurrency(value, currency = "ARS") {
    const num = Number(value) || 0;
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency
    }).format(num);
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("es-AR");
}

function validarCampos(campos) {
    return campos.every(c => c !== null && c !== undefined && c !== "");
}

/* ============================
   STORAGE CENTRALIZADO
============================ */

function getData(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function initStorage() {
    const estructuras = {
        usuarios: [],
        productos: [],
        precios: [],
        clientes: [],
        ventas: [],
        reportes: [],
        backups: [],
        proveedores: [],
        compras: [],
        inventario: [],
        cuentasClientes: [],
        cuentasProveedores: [],
        auditoria: [],
        notificaciones: [],
        configuracion: {},

        // NUEVOS MÓDULOS
        caja: [],
        cuentasBancarias: [],
        agenda: [],
        logistica: [],
        produccion: [],
        impuestos: []
    };

    Object.keys(estructuras).forEach(key => {
        if (!localStorage.getItem(key)) {
            setData(key, estructuras[key]);
        }
    });
}

/* ============================
   AUDITORÍA GLOBAL
============================ */

function registrarAuditoria(tipo, modulo, descripcion, extra = {}) {
    const auditoria = getData("auditoria");
    auditoria.push({
        id: generarID(),
        fecha: new Date().toISOString(),
        tipo,
        modulo,
        descripcion,
        usuario: localStorage.getItem("loggedUser") || "Sistema",
        extra
    });
    setData("auditoria", auditoria);
}

/* ============================
   NOTIFICACIONES GLOBALES
============================ */

function agregarNotificacion(tipo, modulo, mensaje, extra = {}) {
    const notificaciones = getData("notificaciones");
    notificaciones.push({
        id: generarID(),
        fecha: new Date().toISOString(),
        tipo, // info, warning, error
        modulo,
        mensaje,
        revisada: false,
        extra
    });
    setData("notificaciones", notificaciones);
}

/* ============================
   CONFIGURACIÓN GLOBAL
============================ */

function getConfig() {
    return JSON.parse(localStorage.getItem("configuracion") || "{}");
}

function setConfig(obj) {
    localStorage.setItem("configuracion", JSON.stringify(obj));
}

/* ============================
   SEGURIDAD (LOGIN + ROLES)
============================ */

function login(usuario, clave) {
    const usuarios = getData("usuarios");
    const u = usuarios.find(x => x.usuario === usuario && x.clave === clave);

    if (!u) return false;

    localStorage.setItem("loggedUser", u.usuario);
    localStorage.setItem("userRole", u.rol || "usuario");

    registrarAuditoria("Login", "Seguridad", "Inicio de sesión", { usuario });

    return true;
}

function logout() {
    registrarAuditoria("Logout", "Seguridad", "Cierre de sesión", {
        usuario: localStorage.getItem("loggedUser")
    });

    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole");
}

function protegerModulo() {
    const usuario = localStorage.getItem("loggedUser");
    if (!usuario) {
        location.replace("index.html");
        return;
    }
}

/* ============================
   FUNCIONES BASE PARA NUEVOS MÓDULOS
============================ */

/* ---- CAJA / TESORERÍA ---- */
function getCaja() { return getData("caja"); }
function addCaja(mov) {
    const caja = getCaja();
    caja.push(mov);
    setData("caja", caja);
    registrarAuditoria("Alta", "Caja", "Nuevo movimiento", mov);
}
function updateCaja(id, data) {
    const caja = getCaja().map(m => m.id === id ? { ...m, ...data } : m);
    setData("caja", caja);
    registrarAuditoria("Modificación", "Caja", "Movimiento actualizado", { id, data });
}
function deleteCaja(id) {
    const caja = getCaja().filter(m => m.id !== id);
    setData("caja", caja);
    registrarAuditoria("Baja", "Caja", "Movimiento eliminado", { id });
}

/* ---- AGENDA ---- */
function getAgenda() { return getData("agenda"); }
function addAgenda(ev) {
    const agenda = getAgenda();
    agenda.push(ev);
    setData("agenda", agenda);
    registrarAuditoria("Alta", "Agenda", "Nuevo evento", ev);
}
function updateAgenda(id, data) {
    const agenda = getAgenda().map(e => e.id === id ? { ...e, ...data } : e);
    setData("agenda", agenda);
    registrarAuditoria("Modificación", "Agenda", "Evento actualizado", { id, data });
}
function deleteAgenda(id) {
    const agenda = getAgenda().filter(e => e.id !== id);
    setData("agenda", agenda);
    registrarAuditoria("Baja", "Agenda", "Evento eliminado", { id });
}

/* ---- LOGÍSTICA ---- */
function getLogistica() { return getData("logistica"); }
function addLogistica(env) {
    const log = getLogistica();
    log.push(env);
    setData("logistica", log);
    registrarAuditoria("Alta", "Logística", "Nueva entrega", env);
}
function updateLogistica(id, data) {
    const log = getLogistica().map(e => e.id === id ? { ...e, ...data } : e);
    setData("logistica", log);
    registrarAuditoria("Modificación", "Logística", "Entrega actualizada", { id, data });
}
function deleteLogistica(id) {
    const log = getLogistica().filter(e => e.id !== id);
    setData("logistica", log);
    registrarAuditoria("Baja", "Logística", "Entrega eliminada", { id });
}

/* ---- PRODUCCIÓN ---- */
function getProduccion() { return getData("produccion"); }
function addProduccion(op) {
    const prod = getProduccion();
    prod.push(op);
    setData("produccion", prod);
    registrarAuditoria("Alta", "Producción", "Nueva orden", op);
}
function updateProduccion(id, data) {
    const prod = getProduccion().map(o => o.id === id ? { ...o, ...data } : o);
    setData("produccion", prod);
    registrarAuditoria("Modificación", "Producción", "Orden actualizada", { id, data });
}
function deleteProduccion(id) {
    const prod = getProduccion().filter(o => o.id !== id);
    setData("produccion", prod);
    registrarAuditoria("Baja", "Producción", "Orden eliminada", { id });
}

/* ---- IMPUESTOS ---- */
function getImpuestos() { return getData("impuestos"); }
function addImpuesto(reg) {
    const imp = getImpuestos();
    imp.push(reg);
    setData("impuestos", imp);
    registrarAuditoria("Alta", "Impuestos", "Nuevo registro", reg);
}
function updateImpuesto(id, data) {
    const imp = getImpuestos().map(r => r.id === id ? { ...r, ...data } : r);
    setData("impuestos", imp);
    registrarAuditoria("Modificación", "Impuestos", "Registro actualizado", { id, data });
}
function deleteImpuesto(id) {
    const imp = getImpuestos().filter(r => r.id !== id);
    setData("impuestos", imp);
    registrarAuditoria("Baja", "Impuestos", "Registro eliminado", { id });
}

/* ============================
   INICIALIZACIÓN DEL SISTEMA
============================ */

function inicializarSistema() {
    initStorage();

    // Datos demo mínimos
   if (getData("usuarios").length === 0) {
    setData("usuarios", [
        { id: generarID(), usuario: "admin", clave: "1234", rol: "admin" }
    ]);
}


    registrarAuditoria("Sistema", "Core", "Inicialización del sistema");
}

/* ============================
   EJECUCIÓN AUTOMÁTICA
============================ */

inicializarSistema();
