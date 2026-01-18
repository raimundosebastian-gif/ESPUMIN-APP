/* ============================================================
   AGENDA.JS — MÓDULO CENTRAL DEL ERP
   Arquitectura: multisucursal, modular, escalable
   Funciones: tareas, eventos, alertas, auditoría, sincronización
   Este archivo NO debe modificarse en el futuro.
   ============================================================ */

/* ------------------------------------------------------------
   1) CONSTANTES GLOBALES DEL MÓDULO AGENDA
   ------------------------------------------------------------ */

// Clave principal de almacenamiento
const KEY_AGENDA = "ERP_AGENDA_DATA";

// Versionado para sincronización y auditoría
const VERSION_AGENDA = 1;

// Cola de sincronización (para sucursales offline)
const KEY_SYNC_AGENDA = "ERP_AGENDA_SYNC_QUEUE";

// Identificador fijo de sucursal (se detecta automáticamente)
let sucursalID = "central"; // se ajusta en Bloque 2

// Nombre visible editable de la sucursal (se carga en Bloque 2)
let nombreSucursal = "Sucursal sin nombre";

// Estructura base del módulo Agenda
const Agenda = {
    tareas: [],          // todas las tareas/eventos/alertas
    syncQueue: [],       // cola de sincronización
    version: VERSION_AGENDA,
};


/* ------------------------------------------------------------
   2) TIPOS, CATEGORÍAS Y MÓDULOS ORIGEN
   ------------------------------------------------------------ */

// Tipos de evento que soporta Agenda
const TIPOS_EVENTO = [
    "tarea",
    "alerta",
    "evento",
    "recordatorio"
];

// Categorías generales (extensibles)
const CATEGORIAS = [
    "general",
    "control",
    "seguimiento",
    "stock",
    "cobranza",
    "compra",
    "auditoria",
    "produccion",
    "proveedor"
];

// Módulos origen permitidos (ERP completo)
const MODULOS_ORIGEN = [
    "agenda",
    "ventas",
    "inventario",
    "proveedores",
    "compras",
    "produccion",
    "caja",
    "auditoria"
];


/* ------------------------------------------------------------
   3) PRIORIDAD AUTOMÁTICA SEGÚN MÓDULO
   ------------------------------------------------------------ */

const PRIORIDAD_POR_MODULO = {
    agenda: "baja",
    ventas: "media",
    inventario: "media",
    proveedores: "media",
    compras: "media",
    produccion: "alta",
    caja: "alta",
    auditoria: "alta"
};


/* ------------------------------------------------------------
   4) FUNCIÓN BASE PARA CREAR OBJETOS DE TAREA/EVENTO
   ------------------------------------------------------------ */

function crearObjetoAgenda({
    titulo,
    descripcion,
    fecha,
    estado = "pendiente",
    moduloOrigen = "agenda",
    categoria = "general",
    tipo = "tarea",
    prioridad = null,
    sucursal = sucursalID,
    metadata = {}
}) {
    return {
        id: crypto.randomUUID(),
        titulo,
        descripcion,
        fecha,
        estado,
        moduloOrigen,
        categoria,
        tipo,
        prioridad: prioridad || PRIORIDAD_POR_MODULO[moduloOrigen] || "media",
        sucursal,
        metadata,
        version: VERSION_AGENDA,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
    };
}

/* ============================================================
   BLOQUE 2 — DETECCIÓN DE SUCURSAL + NOMBRE EDITABLE + CARGA
   ============================================================ */

/* ------------------------------------------------------------
   1) DETECTAR SUCURSAL AUTOMÁTICAMENTE SEGÚN LA CARPETA LOCAL
   ------------------------------------------------------------ */

function detectarSucursal() {
    const url = location.href.toLowerCase();

    // Sucursales locales (carpetas)
    if (url.includes("sucursal1")) return "sucursal1";
    if (url.includes("sucursal2")) return "sucursal2";
    if (url.includes("sucursal3")) return "sucursal3";

    // Si no coincide con ninguna carpeta local → es el módulo central
    return "central";
}

sucursalID = detectarSucursal();


/* ------------------------------------------------------------
   2) NOMBRE VISIBLE EDITABLE DE LA SUCURSAL
   ------------------------------------------------------------ */

// Cargar nombre visible desde localStorage
function cargarNombreSucursal() {
    const guardado = localStorage.getItem("ERP_NOMBRE_SUCURSAL");
    if (guardado) {
        nombreSucursal = guardado;
    } else {
        // Nombre por defecto según sucursal
        if (sucursalID === "central") nombreSucursal = "Central";
        else nombreSucursal = sucursalID.toUpperCase();
    }
}

cargarNombreSucursal();

// Guardar nombre visible editable
function setNombreSucursal(nombre) {
    nombreSucursal = nombre.trim();
    localStorage.setItem("ERP_NOMBRE_SUCURSAL", nombreSucursal);
}


/* ------------------------------------------------------------
   3) CARGA INICIAL DE DATOS DE AGENDA
   ------------------------------------------------------------ */

function cargarAgendaDesdeStorage() {
    const data = localStorage.getItem(KEY_AGENDA);

    if (data) {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed.tareas)) {
                Agenda.tareas = parsed.tareas;
            }
        } catch (e) {
            console.error("Error cargando datos de agenda:", e);
        }
    }
}

cargarAgendaDesdeStorage();


/* ------------------------------------------------------------
   4) CARGA DE COLA DE SINCRONIZACIÓN (SUCURSALES OFFLINE)
   ------------------------------------------------------------ */

function cargarSyncQueue() {
    const data = localStorage.getItem(KEY_SYNC_AGENDA);

    if (data) {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                Agenda.syncQueue = parsed;
            }
        } catch (e) {
            console.error("Error cargando cola de sync:", e);
        }
    }
}

cargarSyncQueue();


/* ------------------------------------------------------------
   5) GUARDAR CAMBIOS EN STORAGE
   ------------------------------------------------------------ */

function guardarAgenda() {
    localStorage.setItem(KEY_AGENDA, JSON.stringify({
        tareas: Agenda.tareas,
        version: Agenda.version
    }));
}

function guardarSyncQueue() {
    localStorage.setItem(KEY_SYNC_AGENDA, JSON.stringify(Agenda.syncQueue));
}
