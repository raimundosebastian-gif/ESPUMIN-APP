/* ============================================================
   CORE DEL SISTEMA - ESPUMIN ERP BASE
   Este archivo contiene:
   - Helpers globales
   - Manejo de storage
   - Auditoría
   - Notificaciones
   - Configuración global
   - Seguridad (login + roles)
   - Inicialización del sistema
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
        configuracion: {}
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
        tipo,
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
        location.href = "index.html";
        return;
    }
}

/* ============================
   INICIALIZACIÓN DEL SISTEMA
============================ */

function inicializarSistema() {
    initStorage();

    // Ejemplo de datos mínimos para pruebas
    if (getData("usuarios").length === 0) {
        setData("usuarios", [
            { id: generarID(), usuario: "admin", clave: "1234", rol: "admin" }
        ]);
    }

    if (getData("productos").length === 0) {
        setData("productos", [
            { id: generarID(), nombre: "Producto demo", stock: 10, precio: 1000 }
        ]);
    }

    if (getData("clientes").length === 0) {
        setData("clientes", [
            { id: generarID(), nombre: "Cliente demo", telefono: "123456" }
        ]);
    }

    if (getData("proveedores").length === 0) {
        setData("proveedores", [
            { id: generarID(), nombre: "Proveedor demo", telefono: "987654" }
        ]);
    }

    registrarAuditoria("Sistema", "Core", "Inicialización del sistema");
}

/* ============================
   EJECUCIÓN AUTOMÁTICA
============================ */

inicializarSistema();
