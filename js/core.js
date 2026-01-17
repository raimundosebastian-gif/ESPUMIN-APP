// ===============================
//   CORE DEL ERP ESPUMIN
// ===============================

// Obtener datos del localStorage
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Guardar datos
function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Generar ID único
function generarID() {
    return "_" + Math.random().toString(36).substr(2, 9);
}

// Formatear fecha
function formatDate(fechaISO) {
    const f = new Date(fechaISO);
    return f.toLocaleDateString("es-AR");
}

// Registrar auditoría
function registrarAuditoria(modulo, tipo, detalle) {
    let auditoria = getData("auditoria");

    auditoria.push({
        id: generarID(),
        fecha: new Date().toISOString(),
        modulo,
        tipo,
        detalle
    });

    setData("auditoria", auditoria);
}

// ===============================
//   ROLES Y PERMISOS
// ===============================

// Qué rol puede acceder a qué módulo
const permisos = {
    "Dashboard": ["Administrador", "Ventas", "Compras", "Producción", "Logística", "Caja", "Auditoría"],
    "Productos": ["Administrador", "Compras", "Producción"],
    "Precios": ["Administrador", "Ventas"],
    "Clientes": ["Administrador", "Ventas"],
    "Proveedores": ["Administrador", "Compras"],
    "Inventario": ["Administrador", "Producción", "Logística"],
    "Compras": ["Administrador", "Compras"],
    "Ventas": ["Administrador", "Ventas"],
    "Logística": ["Administrador", "Logística"],
    "Caja": ["Administrador", "Caja"],
    "Cuentas Clientes": ["Administrador", "Ventas", "Caja"],
    "Cuentas Proveedores": ["Administrador", "Compras", "Caja"],
    "Impuestos": ["Administrador"],
    "Agenda": ["Administrador", "Ventas", "Compras", "Producción", "Logística"],
    "Notificaciones": ["Administrador"],
    "Auditoría": ["Administrador", "Auditoría"],
    "Configuración": ["Administrador"],
    "Parámetros": ["Administrador"],
    "Usuarios y Roles": ["Administrador"],
    "Producción": ["Administrador", "Producción"],
    "Backups": ["Administrador"]
};

// Validar acceso
function tieneAcceso(modulo, rol) {
    return permisos[modulo]?.includes(rol);
}

// Proteger módulo
function protegerModulo() {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

    if (!usuarioActual) {
        alert("Debe iniciar sesión");
        window.location.href = "login.html";
        return;
    }

    if (!usuarioActual.activo) {
        alert("Usuario inactivo");
        window.location.href = "login.html";
        return;
    }

    const modulo = document.title.replace("ESPUMIN - ", "").trim();

    if (!tieneAcceso(modulo, usuarioActual.rol)) {
        alert("No tiene permiso para acceder a este módulo");
        window.location.href = "dashboard.html";
    }
}
