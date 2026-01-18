// =====================================================
//  MÓDULO ÚNICO DE AGENDA (MULTISUCURSAL)
//  - Compatible GitHub Pages y carpeta local
//  - Sin dependencias externas
//  - Integrado lógicamente con Ventas (tareas automáticas)
//  - Preparado para sucursales + módulo central (Git)
// =====================================================

// -------------------- CONFIGURACIÓN SUCURSAL --------------------

const ID_SUCURSAL = "SUC-001"; // Cambiar en cada sucursal
const SYNC_INTERVAL_AGENDA = 30000; // 30 segundos

// -------------------- UTILIDADES GENERALES --------------------

function generarIdUnico() {
    return Date.now().toString() + "-" + Math.floor(Math.random() * 1000).toString();
}

function ahoraTimestamp() {
    return Date.now();
}

function normalizarTexto(texto) {
    return (texto || "").toString().trim().toLowerCase();
}

// -------------------- LOCALSTORAGE HELPERS --------------------

function lsGet(clave, defecto = []) {
    try {
        const valor = localStorage.getItem(clave);
        if (!valor) return defecto;
        return JSON.parse(valor);
    } catch {
        return defecto;
    }
}

function lsSet(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}

// Claves de almacenamiento
const KEY_AGENDA = "agendaLocal";
const KEY_SYNC_QUEUE_AGENDA = "syncQueueAgenda";

// =====================================================
//  SYNC QUEUE AGENDA
// =====================================================

function getSyncQueueAgenda() {
    return lsGet(KEY_SYNC_QUEUE_AGENDA, []);
}

function setSyncQueueAgenda(queue) {
    lsSet(KEY_SYNC_QUEUE_AGENDA, queue);
}

function agregarASyncQueueAgenda(tipo, idRegistro) {
    const queue = getSyncQueueAgenda();
    queue.push({
        idSync: generarIdUnico(),
        tipo,              // ej: "tarea"
        idRegistro,
        idSucursal: ID_SUCURSAL,
        timestamp: ahoraTimestamp(),
        estado: "pendiente"
    });
    setSyncQueueAgenda(queue);
}

// =====================================================
//  AGENDA (TAREAS)
// =====================================================

function getAgenda() {
    return lsGet(KEY_AGENDA, []);
}

function setAgenda(data) {
    lsSet(KEY_AGENDA, data);
}

function crearTarea(datos) {
    const tareas = getAgenda();

    const tarea = {
        idTarea: generarIdUnico(),
        idSucursal: ID_SUCURSAL,

        titulo: datos.titulo || "Tarea sin título",
        tituloNorm: normalizarTexto(datos.titulo || "Tarea sin título"),

        descripcion: datos.descripcion || "",
        descripcionNorm: normalizarTexto(datos.descripcion || ""),

        fecha: datos.fecha || new Date().toISOString().slice(0, 16),
        estado: datos.estado || "pendiente",

        timestamp: ahoraTimestamp(),
        version: 1,
        estadoSync: "pendiente"
    };

    tareas.push(tarea);
    setAgenda(tareas);
    agregarASyncQueueAgenda("tarea", tarea.idTarea);

    return tarea;
}

function editarTarea(idTarea, nuevosDatos) {
    const tareas = getAgenda();
    const idx = tareas.findIndex(t => t.idTarea === idTarea);
    if (idx === -1) throw new Error("La tarea no existe.");

    const tarea = tareas[idx];

    if (nuevosDatos.titulo !== undefined) {
        tarea.titulo = nuevosDatos.titulo || "Tarea sin título";
        tarea.tituloNorm = normalizarTexto(tarea.titulo);
    }

    if (nuevosDatos.descripcion !== undefined) {
        tarea.descripcion = nuevosDatos.descripcion || "";
        tarea.descripcionNorm = normalizarTexto(tarea.descripcion);
    }

    if (nuevosDatos.fecha !== undefined) {
        tarea.fecha = nuevosDatos.fecha || tarea.fecha;
    }

    if (nuevosDatos.estado !== undefined) {
        tarea.estado = nuevosDatos.estado || tarea.estado;
    }

    tarea.version = (tarea.version || 1) + 1;
    tarea.timestamp = ahoraTimestamp();
    tarea.estadoSync = "pendiente";

    tareas[idx] = tarea;
    setAgenda(tareas);
    agregarASyncQueueAgenda("tarea", tarea.idTarea);
}

function cambiarEstadoTarea(idTarea, nuevoEstado) {
    const tareas = getAgenda();
    const tarea = tareas.find(t => t.idTarea === idTarea);
    if (!tarea) throw new Error("La tarea no existe.");

    tarea.estado = nuevoEstado;
    tarea.version = (tarea.version || 1) + 1;
    tarea.timestamp = ahoraTimestamp();
    tarea.estadoSync = "pendiente";

    setAgenda(tareas);
    agregarASyncQueueAgenda("tarea", tarea.idTarea);
}

function eliminarTarea(idTarea) {
    let tareas = getAgenda();
    tareas = tareas.filter(t => t.idTarea !== idTarea);
    setAgenda(tareas);
    agregarASyncQueueAgenda("tarea", idTarea);
}

// =====================================================
//  LISTADO DE TAREAS
// =====================================================

function initAgendaListado() {
    const tabla = document.getElementById("tablaAgenda");
    if (!tabla) return;

    let tareas = getAgenda();

    if (!tareas.length) {
        tabla.innerHTML = `<tr><td colspan="6" class="sin-datos">No hay tareas registradas</td></tr>`;
        return;
    }

    tareas = tareas.sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));

    tabla.innerHTML = "";
    tareas.forEach(t => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${(t.fecha || "").replace("T", " ")}</td>
            <td>${t.titulo}</td>
            <td>${t.descripcion || ""}</td>
            <td>${t.estado}</td>
            <td>${t.idTarea}</td>
            <td>
                <button type="button" class="btn-estado" data-id="${t.idTarea}" data-estado="${t.estado}">
                    ${t.estado === "pendiente" ? "Completar" : "Reabrir"}
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });

    tabla.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-estado");
        if (!btn) return;

        const id = btn.getAttribute("data-id");
        const estadoActual = btn.getAttribute("data-estado");
        const nuevoEstado = estadoActual === "pendiente" ? "completada" : "pendiente";

        try {
            cambiarEstadoTarea(id, nuevoEstado);
            initAgendaListado();
        } catch (err) {
            alert(err.message || "Error al cambiar el estado de la tarea.");
        }
    });
}

// =====================================================
//  NUEVA TAREA
// =====================================================

function initAgendaNueva() {
    const form = document.getElementById("formNuevaTarea");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const titulo = document.getElementById("titulo")?.value.trim();
        const descripcion = document.getElementById("descripcion")?.value.trim();
        const fecha = document.getElementById("fecha")?.value;
        const estado = document.getElementById("estado")?.value || "pendiente";

        if (!titulo) {
            alert("El título es obligatorio.");
            return;
        }

        try {
            crearTarea({
                titulo,
                descripcion,
                fecha,
                estado
            });
            alert("Tarea creada correctamente.");
            form.reset();
        } catch (err) {
            alert(err.message || "Error al crear la tarea.");
        }
    });
}

// =====================================================
//  EDITAR TAREA
// =====================================================

function initAgendaEditar() {
    const form = document.getElementById("formEditarTarea");
    if (!form) return;

    const id = new URLSearchParams(window.location.search).get("id");
    const tareas = getAgenda();
    const tarea = tareas.find(t => t.idTarea === id);

    if (!tarea) {
        alert("La tarea no existe.");
        return;
    }

    const tituloInput = document.getElementById("titulo");
    const descripcionInput = document.getElementById("descripcion");
    const fechaInput = document.getElementById("fecha");
    const estadoSelect = document.getElementById("estado");

    if (tituloInput) tituloInput.value = tarea.titulo;
    if (descripcionInput) descripcionInput.value = tarea.descripcion || "";
    if (fechaInput) fechaInput.value = tarea.fecha;
    if (estadoSelect) estadoSelect.value = tarea.estado;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const titulo = tituloInput?.value.trim();
        const descripcion = descripcionInput?.value.trim();
        const fecha = fechaInput?.value;
        const estado = estadoSelect?.value || "pendiente";

        if (!titulo) {
            alert("El título es obligatorio.");
            return;
        }

        try {
            editarTarea(id, {
                titulo,
                descripcion,
                fecha,
                estado
            });
            alert("Tarea actualizada correctamente.");
        } catch (err) {
            alert(err.message || "Error al actualizar la tarea.");
        }
    });
}

// =====================================================
//  FILTROS BÁSICOS DE AGENDA
// =====================================================

function filtrarAgendaPorEstado(estado) {
    let tareas = getAgenda();
    if (estado && estado !== "todas") {
        tareas = tareas.filter(t => t.estado === estado);
    }
    return tareas;
}

function initAgendaFiltros() {
    const selectEstado = document.getElementById("filtroEstado");
    const tabla = document.getElementById("tablaAgenda");
    if (!selectEstado || !tabla) return;

    function render() {
        let tareas = filtrarAgendaPorEstado(selectEstado.value);

        if (!tareas.length) {
            tabla.innerHTML = `<tr><td colspan="6" class="sin-datos">No hay tareas para el filtro seleccionado</td></tr>`;
            return;
        }

        tareas = tareas.sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));

        tabla.innerHTML = "";
        tareas.forEach(t => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${(t.fecha || "").replace("T", " ")}</td>
                <td>${t.titulo}</td>
                <td>${t.descripcion || ""}</td>
                <td>${t.estado}</td>
                <td>${t.idTarea}</td>
                <td>
                    <button type="button" class="btn-estado" data-id="${t.idTarea}" data-estado="${t.estado}">
                        ${t.estado === "pendiente" ? "Completar" : "Reabrir"}
                    </button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    selectEstado.addEventListener("change", render);
    render();
}

// =====================================================
//  SINCRONIZACIÓN CON CENTRAL (ESQUELETO)
// =====================================================

async function sincronizarAgendaConCentral() {
    const queue = getSyncQueueAgenda();
    if (!queue.length) return;

    const nuevaQueue = queue.map(item => ({
        ...item,
        estado: "simulado"
    }));

    setSyncQueueAgenda(nuevaQueue);
}

// =====================================================
//  DATOS DE PRUEBA AMPLIADOS — AGENDA
// =====================================================

function cargarDatosPruebaAgenda() {

    const tareas = [
        {
            idTarea: generarIdUnico(),
            idSucursal: ID_SUCURSAL,
            titulo: "Llamar a proveedor",
            tituloNorm: "llamar a proveedor",
            descripcion: "Confirmar entrega de mercadería",
            descripcionNorm: "confirmar entrega de mercadería",
            fecha: "2026-01-12T12:00",
            estado: "pendiente",
            timestamp: ahoraTimestamp(),
            version: 1,
            estadoSync: "pendiente"
        },
        {
            idTarea: generarIdUnico(),
            idSucursal: ID_SUCURSAL,
            titulo: "Revisar stock crítico",
            tituloNorm: "revisar stock critico",
            descripcion: "Producto Yerba por debajo del mínimo",
            descripcionNorm: "producto yerba por debajo del minimo",
            fecha: "2026-01-12T09:00",
            estado: "pendiente",
            timestamp: ahoraTimestamp(),
            version: 1,
            estadoSync: "pendiente"
        },
        {
            idTarea: generarIdUnico(),
            idSucursal: ID_SUCURSAL,
            titulo: "Control de caja",
            tituloNorm: "control de caja",
            descripcion: "Verificar cierre del día anterior",
            descripcionNorm: "verificar cierre del dia anterior",
            fecha: "2026-01-11T18:00",
            estado: "completada",
            timestamp: ahoraTimestamp(),
            version: 1,
            estadoSync: "pendiente"
        },
        {
            idTarea: generarIdUnico(),
            idSucursal: ID_SUCURSAL,
            titulo: "Seguimiento cliente frecuente",
            tituloNorm: "seguimiento cliente frecuente",
            descripcion: "Cliente Juan Pérez realizó 3 compras esta semana",
            descripcionNorm: "cliente juan perez realizo 3 compras esta semana",
            fecha: "2026-01-13T10:00",
            estado: "pendiente",
            timestamp: ahoraTimestamp(),
            version: 1,
            estadoSync: "pendiente"
        }
    ];

    lsSet(KEY_AGENDA, tareas);
}

if (lsGet(KEY_AGENDA, []).length === 0) {
    cargarDatosPruebaAgenda();
}

// =====================================================
//  INICIALIZACIÓN AUTOMÁTICA
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    initAgendaListado();
    initAgendaNueva();
    initAgendaEditar();
    initAgendaFiltros();

    setInterval(sincronizarAgendaConCentral, SYNC_INTERVAL_AGENDA);
});
