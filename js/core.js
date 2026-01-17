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
//   ROLES Y PERMISOS (UNIFICADO)
// ===============================

// admin = acceso total
// operador = acceso operativo

const permisos = {
    "dashboard": ["admin", "operador"],
    "inventario": ["admin", "operador"],
    "clientes": ["admin", "operador"],
    "proveedores": ["admin", "operador"],
    "ventas": ["admin", "operador"],
    "configuracion": ["admin"],
    "auditoria": ["admin"]
};

// Validar acceso
function tieneAcceso(modulo, rol) {
    return permisos[modulo]?.includes(rol);
}

// Proteger módulo
function protegerModulo(moduloClave) {
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

    if (!tieneAcceso(moduloClave, usuarioActual.rol)) {
        alert("No tiene permiso para acceder a este módulo");
        window.location.href = "dashboard.html";
    }
}
