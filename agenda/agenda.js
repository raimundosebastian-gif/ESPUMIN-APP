// =====================================================
//  MÓDULO ÚNICO DE AGENDA (MULTISUCURSAL)
//  - Compatible GitHub Pages y carpeta local
//  - Sin dependencias externas
//  - Preparado para sucursales + módulo central (Git)
//  - Molde para el resto de los módulos del ERP
// =====================================================

// -------------------- CONFIGURACIÓN SUCURSAL --------------------

const ID_SUCURSAL = "SUC-001"; // Cambiar en cada sucursal
const SYNC_INTERVAL = 30000;   // 30 segundos

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
        return JSON.parse(localStorage.getItem(clave)) || defecto;
    } catch {
        return defecto;
    }
}

function lsSet(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}

// Claves de almacenamiento
const KEY_AGENDA = "agendaLocal";
const KEY_SYNC_QUEUE = "syncQueueAgenda";

// -------------------- SYNC QUEUE --------------------

function getSyncQueue() {
    return lsGet(KEY_SYNC_QUEUE, []);
}

function setSyncQueue(queue) {
    lsSet(KEY_SYNC_QUEUE, queue);
}

function agregarASyncQueue(tipo, idRegistro) {
    const queue = getSyncQueue();
    queue.push({
        idSync: generarIdUnico(),
        tipo,              // ej: "tareaAgenda"
        idRegistro,
        idSucursal: ID_SUCURSAL,
        timestamp: ahoraTimestamp(),
        estado: "pendiente"
    });
    setSyncQueue(queue);
}

// -------------------- AGENDA --------------------

function getAgenda() {
    return lsGet(KEY_AGENDA, []);
}

function setAgenda(data) {
    lsSet(KEY_AGENDA, data);
}

// -------------------- LÓGICA DE NEGOCIO --------------------

function crearTarea(titulo, descripcion, fecha) {
    const agenda = getAgenda();

    const tarea = {
        idTarea: generarIdUnico(),
        idSucursal: ID_SUCURSAL,
        titulo,
        tituloNorm: normalizarTexto(titulo),
        descripcion,
        descripcionNorm: normalizarTexto(descripcion),
        fecha,
        estado: "pendiente",
        timestamp: ahoraTimestamp(),
        version: 1,
        estadoSync: "pendiente"
    };

    agenda.push(tarea);
    setAgenda(agenda);

    agregarASyncQueue("tareaAgenda", tarea.idTarea);
}

function editarTarea(idTarea, nuevosDatos) {
    const agenda = getAgenda();
    const tarea = agenda.find(t => t.idTarea === idTarea);

    if (!tarea) throw new Error("La tarea no existe.");

    tarea.titulo = nuevosDatos.titulo || tarea.titulo;
    tarea.descripcion = nuevosDatos.descripcion || tarea.descripcion;
    tarea.fecha = nuevosDatos.fecha || tarea.fecha;
    tarea.estado = nuevosDatos.estado || tarea.estado;

    tarea.tituloNorm = normalizarTexto(tarea.titulo);
    tarea.descripcionNorm = normalizarTexto(tarea.descripcion);

    tarea.version++;
    tarea.timestamp = ahoraTimestamp();
    tarea.estadoSync = "pendiente";

    setAgenda(agenda);
    agregarASyncQueue("tareaAgenda", tarea.idTarea);
}

function cambiarEstadoTarea(idTarea, nuevoEstado) {
    const agenda = getAgenda();
    const tarea = agenda.find(t => t.idTarea === idTarea);

    if (!tarea) throw new Error("La tarea no existe.");

    tarea.estado = nuevoEstado;
    tarea.version++;
    tarea.timestamp = ahoraTimestamp();
    tarea.estadoSync = "pendiente";

    setAgenda(agenda);
    agregarASyncQueue("tareaAgenda", tarea.idTarea);
}

function eliminarTarea(idTarea) {
    let agenda = getAgenda();
    agenda = agenda.filter(t => t.idTarea !== idTarea);

    setAgenda(agenda);
    agregarASyncQueue("tareaAgenda", idTarea);
}

// -------------------- LISTADO DE AGENDA --------------------

function initAgendaListado() {
    const tabla = document.getElementById("tablaAgenda");
    if (!tabla) return;

    let agenda = getAgenda();

    if (agenda.length === 0) {
        tabla.innerHTML = `<tr><td colspan="5" class="sin-datos">No hay tareas registradas</td></tr>`;
        return;
    }

    // Ordenar por fecha
    agenda = agenda.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    tabla.innerHTML = "";
    agenda.forEach(t => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${t.fecha}</td>
            <td>${t.titulo}</td>
            <td>${t.descripcion}</td>
            <td>${t.estado}</td>
            <td>${t.idTarea}</td>
        `;
        tabla.appendChild(fila);
    });
}

// -------------------- CREAR TAREA --------------------

function initAgendaNueva() {
    const form = document.getElementById("formNuevaTarea");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const titulo = document.getElementById("titulo").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const fecha = document.getElementById("fecha").value;

        if (!titulo || !descripcion || !fecha) {
            alert("Complete todos los campos.");
            return;
        }

        crearTarea(titulo, descripcion, fecha);
        alert("Tarea creada correctamente.");
        form.reset();
    });
}

// -------------------- EDITAR TAREA --------------------

function initAgendaEditar() {
    const form = document.getElementById("formEditarTarea");
    if (!form) return;

    const idTarea = new URLSearchParams(window.location.search).get("id");
    const agenda = getAgenda();
    const tarea = agenda.find(t => t.idTarea === idTarea);

    if (!tarea) {
        alert("La tarea no existe.");
        return;
    }

    document.getElementById("titulo").value = tarea.titulo;
    document.getElementById("descripcion").value = tarea.descripcion;
    document.getElementById("fecha").value = tarea.fecha;
    document.getElementById("estado").value = tarea.estado;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        editarTarea(idTarea, {
            titulo: document.getElementById("titulo").value.trim(),
            descripcion: document.getElementById("descripcion").value.trim(),
            fecha: document.getElementById("fecha").value,
            estado: document.getElementById("estado").value
        });

        alert("Tarea actualizada correctamente.");
    });
}

// -------------------- SINCRONIZACIÓN CON CENTRAL (ESQUELETO) --------------------

async function sincronizarAgendaConCentral() {
    const queue = getSyncQueue();
    if (!queue.length) return;

    // Esqueleto: se implementa cuando definamos el repo central
    const nuevaQueue = queue.map(item => ({
        ...item,
        estado: "simulado"
    }));

    setSyncQueue(nuevaQueue);
}

// -------------------- INICIALIZACIÓN AUTOMÁTICA --------------------

document.addEventListener("DOMContentLoaded", () => {
    initAgendaListado();
    initAgendaNueva();
    initAgendaEditar();

    setInterval(sincronizarAgendaConCentral, SYNC_INTERVAL);
});
