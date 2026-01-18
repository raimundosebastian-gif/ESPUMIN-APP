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

/* ============================================================
   BLOQUE 3 — DATOS DE PRUEBA (MULTISUCURSAL + MULTIMÓDULO)
   ============================================================ */

/* ------------------------------------------------------------
   1) GENERAR DATOS DE PRUEBA SOLO SI NO EXISTEN
   ------------------------------------------------------------ */

function generarDatosPruebaAgenda() {
    if (Agenda.tareas.length > 0) {
        console.log("Agenda: datos existentes detectados, no se generan datos de prueba.");
        return;
    }

    console.log("Agenda: generando datos de prueba...");

    const hoy = new Date();
    const mañana = new Date(Date.now() + 86400000);
    const ayer = new Date(Date.now() - 86400000);

    const fechaISO = (f) => f.toISOString().split("T")[0];

    const datos = [

        /* --------------------------------------------------------
           TAREAS DE VENTAS (PRIORIDAD MEDIA)
           -------------------------------------------------------- */
        crearObjetoAgenda({
            titulo: "Llamar a cliente por presupuesto pendiente",
            descripcion: "Cliente solicitó actualización del presupuesto enviado ayer.",
            fecha: fechaISO(mañana),
            moduloOrigen: "ventas",
            categoria: "seguimiento",
            tipo: "tarea",
            sucursal: sucursalID
        }),

        crearObjetoAgenda({
            titulo: "Confirmar entrega de venta #1023",
            descripcion: "Verificar disponibilidad de transporte.",
            fecha: fechaISO(hoy),
            moduloOrigen: "ventas",
            categoria: "control",
            tipo: "evento",
            sucursal: sucursalID
        }),

        /* --------------------------------------------------------
           ALERTAS DE INVENTARIO (PRIORIDAD MEDIA / ALTA)
           -------------------------------------------------------- */
        crearObjetoAgenda({
            titulo: "Stock crítico: Espuma 250ml",
            descripcion: "El inventario reporta menos de 10 unidades.",
            fecha: fechaISO(hoy),
            moduloOrigen: "inventario",
            categoria: "stock",
            tipo: "alerta",
            sucursal: sucursalID
        }),

        crearObjetoAgenda({
            titulo: "Revisión de lote vencido",
            descripcion: "Control de vencimientos en depósito.",
            fecha: fechaISO(ayer),
            moduloOrigen: "inventario",
            categoria: "control",
            tipo: "tarea",
            sucursal: sucursalID
        }),

        /* --------------------------------------------------------
           PROVEEDORES (PRIORIDAD MEDIA)
           -------------------------------------------------------- */
        crearObjetoAgenda({
            titulo: "Llamar a proveedor por demora",
            descripcion: "Pedido #554 no llegó en fecha.",
            fecha: fechaISO(mañana),
            moduloOrigen: "proveedores",
            categoria: "seguimiento",
            tipo: "tarea",
            sucursal: sucursalID
        }),

        /* --------------------------------------------------------
           COMPRAS (PRIORIDAD MEDIA)
           -------------------------------------------------------- */
        crearObjetoAgenda({
            titulo: "Aprobar orden de compra #889",
            descripcion: "Revisión de precios y cantidades.",
            fecha: fechaISO(hoy),
            moduloOrigen: "compras",
            categoria: "compra",
            tipo: "evento",
            sucursal: sucursalID
        }),

        /* --------------------------------------------------------
           PRODUCCIÓN (PRIORIDAD ALTA)
           -------------------------------------------------------- */
        crearObjetoAgenda({
            titulo: "Control de producción: lote 2201",
            descripcion: "Verificar parámetros de calidad.",
            fecha: fechaISO(hoy),
            moduloOrigen: "produccion",
            categoria: "produccion",
            tipo: "tarea",
            sucursal: sucursalID
        }),

        /* --------------------------------------------------------
           CAJA (PRIORIDAD ALTA)
           -------------------------------------------------------- */
        crearObjetoAgenda({
            titulo: "Conciliación diaria de caja",
            descripcion: "Control de ingresos y egresos.",
            fecha: fechaISO(hoy),
            moduloOrigen: "caja",
            categoria: "control",
            tipo: "tarea",
            sucursal: sucursalID
        }),

        /* --------------------------------------------------------
           AUDITORÍA (PRIORIDAD ALTA)
           -------------------------------------------------------- */
        crearObjetoAgenda({
            titulo: "Auditoría interna mensual",
            descripcion: "Revisión de procesos y documentación.",
            fecha: fechaISO(mañana),
            moduloOrigen: "auditoria",
            categoria: "auditoria",
            tipo: "evento",
            sucursal: sucursalID
        }),

        /* --------------------------------------------------------
           TAREAS GENERALES (PRIORIDAD BAJA)
           -------------------------------------------------------- */
        crearObjetoAgenda({
            titulo: "Reunión de equipo",
            descripcion: "Planificación semanal.",
            fecha: fechaISO(mañana),
            moduloOrigen: "agenda",
            categoria: "general",
            tipo: "evento",
            sucursal: sucursalID
        })
    ];

    Agenda.tareas = datos;
    guardarAgenda();
}

generarDatosPruebaAgenda();

/* ============================================================
   BLOQUE 4 — CRUD COMPLETO + SYNC QUEUE + API INTERNA
   ============================================================ */

/* ------------------------------------------------------------
   1) AGREGAR TAREA / EVENTO / ALERTA
   ------------------------------------------------------------ */

function agregarTareaAgenda(objetoTarea) {
    // Actualizar versión y fecha
    objetoTarea.version = VERSION_AGENDA;
    objetoTarea.fechaActualizacion = new Date().toISOString();

    // Guardar en memoria
    Agenda.tareas.push(objetoTarea);

    // Guardar en storage
    guardarAgenda();

    // Agregar a cola de sincronización si no es central
    if (sucursalID !== "central") {
        Agenda.syncQueue.push({
            accion: "crear",
            data: objetoTarea
        });
        guardarSyncQueue();
    }

    return objetoTarea.id;
}


/* ------------------------------------------------------------
   2) API INTERNA PARA OTROS MÓDULOS DEL ERP
   ------------------------------------------------------------ */

function crearEventoAgenda({
    titulo,
    descripcion,
    fecha,
    estado = "pendiente",
    moduloOrigen = "agenda",
    categoria = "general",
    tipo = "tarea",
    prioridad = null,
    metadata = {}
}) {
    const objeto = crearObjetoAgenda({
        titulo,
        descripcion,
        fecha,
        estado,
        moduloOrigen,
        categoria,
        tipo,
        prioridad,
        metadata,
        sucursal: sucursalID
    });

    return agregarTareaAgenda(objeto);
}


/* ------------------------------------------------------------
   3) EDITAR TAREA
   ------------------------------------------------------------ */

function editarTareaAgenda(id, cambios) {
    const tarea = Agenda.tareas.find(t => t.id === id);
    if (!tarea) return false;

    // Aplicar cambios
    Object.assign(tarea, cambios);

    // Actualizar fecha y versión
    tarea.fechaActualizacion = new Date().toISOString();
    tarea.version = VERSION_AGENDA;

    guardarAgenda();

    // Registrar en cola de sync si no es central
    if (sucursalID !== "central") {
        Agenda.syncQueue.push({
            accion: "editar",
            id,
            cambios
        });
        guardarSyncQueue();
    }

    return true;
}


/* ------------------------------------------------------------
   4) COMPLETAR TAREA
   ------------------------------------------------------------ */

function completarTareaAgenda(id) {
    return editarTareaAgenda(id, { estado: "completada" });
}


/* ------------------------------------------------------------
   5) ELIMINAR TAREA (FÍSICO)
   ------------------------------------------------------------ */

function eliminarTareaAgenda(id) {
    const index = Agenda.tareas.findIndex(t => t.id === id);
    if (index === -1) return false;

    const eliminada = Agenda.tareas.splice(index, 1)[0];

    guardarAgenda();

    // Registrar en cola de sync si no es central
    if (sucursalID !== "central") {
        Agenda.syncQueue.push({
            accion: "eliminar",
            id
        });
        guardarSyncQueue();
    }

    return true;
}


/* ------------------------------------------------------------
   6) BUSCAR TAREA POR ID
   ------------------------------------------------------------ */

function obtenerTareaAgenda(id) {
    return Agenda.tareas.find(t => t.id === id) || null;
}


/* ------------------------------------------------------------
   7) LISTAR TAREAS POR SUCURSAL (MULTISUCURSAL REAL)
   ------------------------------------------------------------ */

function obtenerTareasPorSucursal(sucursal = sucursalID) {
    return Agenda.tareas.filter(t => t.sucursal === sucursal);
}


/* ------------------------------------------------------------
   8) LISTAR TODAS LAS TAREAS (CENTRAL)
   ------------------------------------------------------------ */

function obtenerTodasLasTareas() {
    return Agenda.tareas;
}

/* ============================================================
   BLOQUE 5 — FILTROS + NORMALIZACIÓN + MÉTRICAS + UTILIDADES
   ============================================================ */

/* ------------------------------------------------------------
   1) NORMALIZAR TAREAS (asegura compatibilidad futura)
   ------------------------------------------------------------ */

function normalizarTarea(t) {
    return {
        id: t.id,
        titulo: t.titulo || "",
        descripcion: t.descripcion || "",
        fecha: t.fecha || new Date().toISOString().split("T")[0],
        estado: t.estado || "pendiente",
        moduloOrigen: t.moduloOrigen || "agenda",
        categoria: t.categoria || "general",
        tipo: t.tipo || "tarea",
        prioridad: t.prioridad || PRIORIDAD_POR_MODULO[t.moduloOrigen] || "media",
        sucursal: t.sucursal || sucursalID,
        metadata: t.metadata || {},
        version: t.version || VERSION_AGENDA,
        fechaCreacion: t.fechaCreacion || new Date().toISOString(),
        fechaActualizacion: t.fechaActualizacion || new Date().toISOString()
    };
}


/* ------------------------------------------------------------
   2) FILTROS AVANZADOS
   ------------------------------------------------------------ */

function filtrarTareas({
    estado = null,
    fecha = null,
    moduloOrigen = null,
    categoria = null,
    prioridad = null,
    tipo = null,
    sucursal = null
} = {}) {

    return Agenda.tareas.filter(t => {

        if (estado && t.estado !== estado) return false;
        if (fecha && t.fecha !== fecha) return false;
        if (moduloOrigen && t.moduloOrigen !== moduloOrigen) return false;
        if (categoria && t.categoria !== categoria) return false;
        if (prioridad && t.prioridad !== prioridad) return false;
        if (tipo && t.tipo !== tipo) return false;
        if (sucursal && t.sucursal !== sucursal) return false;

        return true;
    });
}


/* ------------------------------------------------------------
   3) FILTROS RÁPIDOS (ATAJOS PARA EL DASHBOARD)
   ------------------------------------------------------------ */

function obtenerPendientes() {
    return filtrarTareas({ estado: "pendiente" });
}

function obtenerCompletadas() {
    return filtrarTareas({ estado: "completada" });
}

function obtenerCriticas() {
    return filtrarTareas({ prioridad: "alta", estado: "pendiente" });
}

function obtenerPorModulo(modulo) {
    return filtrarTareas({ moduloOrigen: modulo });
}

function obtenerPorSucursal(suc) {
    return filtrarTareas({ sucursal: suc });
}


/* ------------------------------------------------------------
   4) MÉTRICAS PARA EL DASHBOARD
   ------------------------------------------------------------ */

function obtenerMetricasAgenda() {
    const pendientes = obtenerPendientes().length;
    const completadas = obtenerCompletadas().length;
    const criticas = obtenerCriticas().length;

    // Métricas por módulo
    const porModulo = {};
    for (const mod of MODULOS_ORIGEN) {
        porModulo[mod] = obtenerPorModulo(mod).length;
    }

    // Métricas por sucursal (solo en central)
    const porSucursal = {};
    if (sucursalID === "central") {
        const sucursales = ["central", "sucursal1", "sucursal2", "sucursal3"];
        for (const s of sucursales) {
            porSucursal[s] = obtenerPorSucursal(s).length;
        }
    }

    return {
        pendientes,
        completadas,
        criticas,
        porModulo,
        porSucursal
    };
}


/* ------------------------------------------------------------
   5) ORDENAMIENTO (para listados y dashboard)
   ------------------------------------------------------------ */

function ordenarTareasPorFecha(lista) {
    return lista.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}

function ordenarTareasPorPrioridad(lista) {
    const orden = { alta: 1, media: 2, baja: 3 };
    return lista.sort((a, b) => orden[a.prioridad] - orden[b.prioridad]);
}


/* ------------------------------------------------------------
   6) PREPARACIÓN PARA WIDGETS FUTUROS DEL DASHBOARD
   ------------------------------------------------------------ */

const widgetsAgenda = [];

function registrarWidgetAgenda(nombre, callbackRender) {
    widgetsAgenda.push({ nombre, callbackRender });
}

function renderizarWidgetsAgenda(contenedor) {
    widgetsAgenda.forEach(w => {
        const div = document.createElement("div");
        div.className = "widget-agenda";
        div.innerHTML = `<h3>${w.nombre}</h3>`;
        div.appendChild(w.callbackRender());
        contenedor.appendChild(div);
    });
}

/* ============================================================
   BLOQUE 6 — INICIALIZADORES DE PANTALLAS DEL MÓDULO AGENDA
   ============================================================ */

/* ------------------------------------------------------------
   1) DASHBOARD DE AGENDA
   ------------------------------------------------------------ */

function initDashboardAgenda() {
    const elSucursal = document.getElementById("infoSucursalAgenda");
    const elPendientes = document.getElementById("metricasPendientes");
    const elCompletadas = document.getElementById("metricasCompletadas");
    const elCriticas = document.getElementById("metricasCriticas");
    const elPorModulo = document.getElementById("metricasPorModulo");
    const elPorSucursal = document.getElementById("metricasPorSucursal");
    const elWidgets = document.getElementById("widgetsAgenda");

    if (!elSucursal) return;

    // Mostrar sucursal
    elSucursal.textContent = `${sucursalID} — ${nombreSucursal}`;

    // Obtener métricas
    const m = obtenerMetricasAgenda();

    elPendientes.textContent = m.pendientes;
    elCompletadas.textContent = m.completadas;
    elCriticas.textContent = m.criticas;

    // Métricas por módulo
    elPorModulo.innerHTML = "";
    for (const mod in m.porModulo) {
        const li = document.createElement("li");
        li.textContent = `${mod}: ${m.porModulo[mod]}`;
        elPorModulo.appendChild(li);
    }

    // Métricas por sucursal (solo en central)
    if (sucursalID === "central") {
        elPorSucursal.innerHTML = "";
        for (const s in m.porSucursal) {
            const li = document.createElement("li");
            li.textContent = `${s}: ${m.porSucursal[s]}`;
            elPorSucursal.appendChild(li);
        }
    }

    // Render widgets
    if (elWidgets) {
        renderizarWidgetsAgenda(elWidgets);
    }
}


/* ------------------------------------------------------------
   2) LISTADO DE AGENDA
   ------------------------------------------------------------ */

function initListadoAgenda() {
    const tabla = document.getElementById("tablaAgenda");
    if (!tabla) return;

    const lista = ordenarTareasPorFecha(Agenda.tareas);

    tabla.innerHTML = "";

    lista.forEach(t => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${t.fecha}</td>
            <td>${t.titulo}</td>
            <td>${t.moduloOrigen}</td>
            <td>${t.categoria}</td>
            <td>${t.prioridad}</td>
            <td>${t.estado}</td>
            <td>${t.sucursal}</td>
            <td>
                <a href="detalle-agenda.html?id=${t.id}">Ver</a> |
                <a href="editar-agenda.html?id=${t.id}">Editar</a>
            </td>
        `;

        tabla.appendChild(tr);
    });
}


/* ------------------------------------------------------------
   3) NUEVA TAREA
   ------------------------------------------------------------ */

function initNuevaAgenda() {
    const form = document.getElementById("formNuevaAgenda");
    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();

        const titulo = form.titulo.value.trim();
        const descripcion = form.descripcion.value.trim();
        const fecha = form.fecha.value;
        const moduloOrigen = form.moduloOrigen.value;
        const categoria = form.categoria.value;
        const tipo = form.tipo.value;

        crearEventoAgenda({
            titulo,
            descripcion,
            fecha,
            moduloOrigen,
            categoria,
            tipo
        });

        alert("Tarea creada correctamente");
        location.href = "listado-agenda.html";
    });
}


/* ------------------------------------------------------------
   4) EDITAR TAREA
   ------------------------------------------------------------ */

function initEditarAgenda() {
    const form = document.getElementById("formEditarAgenda");
    if (!form) return;

    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    const tarea = obtenerTareaAgenda(id);
    if (!tarea) {
        alert("Tarea no encontrada");
        return;
    }

    // Cargar datos en el formulario
    form.titulo.value = tarea.titulo;
    form.descripcion.value = tarea.descripcion;
    form.fecha.value = tarea.fecha;
    form.moduloOrigen.value = tarea.moduloOrigen;
    form.categoria.value = tarea.categoria;
    form.tipo.value = tarea.tipo;

    form.addEventListener("submit", e => {
        e.preventDefault();

        editarTareaAgenda(id, {
            titulo: form.titulo.value.trim(),
            descripcion: form.descripcion.value.trim(),
            fecha: form.fecha.value,
            moduloOrigen: form.moduloOrigen.value,
            categoria: form.categoria.value,
            tipo: form.tipo.value
        });

        alert("Tarea actualizada");
        location.href = "detalle-agenda.html?id=" + id;
    });
}


/* ------------------------------------------------------------
   5) DETALLE DE TAREA
   ------------------------------------------------------------ */

function initDetalleAgenda() {
    const cont = document.getElementById("detalleAgenda");
    if (!cont) return;

    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    const t = obtenerTareaAgenda(id);
    if (!t) {
        cont.innerHTML = "<p>Tarea no encontrada</p>";
        return;
    }

    cont.innerHTML = `
        <h2>${t.titulo}</h2>
        <p><strong>Descripción:</strong> ${t.descripcion}</p>
        <p><strong>Fecha:</strong> ${t.fecha}</p>
        <p><strong>Estado:</strong> ${t.estado}</p>
        <p><strong>Módulo origen:</strong> ${t.moduloOrigen}</p>
        <p><strong>Categoría:</strong> ${t.categoria}</p>
        <p><strong>Tipo:</strong> ${t.tipo}</p>
        <p><strong>Prioridad:</strong> ${t.prioridad}</p>
        <p><strong>Sucursal:</strong> ${t.sucursal} — ${nombreSucursal}</p>
        <p><strong>Creado:</strong> ${t.fechaCreacion}</p>
        <p><strong>Actualizado:</strong> ${t.fechaActualizacion}</p>

        <button onclick="completarTareaAgenda('${t.id}'); location.reload();">
            Marcar como completada
        </button>

        <button onclick="eliminarTareaAgenda('${t.id}'); location.href='listado-agenda.html';">
            Eliminar
        </button>
    `;
}
