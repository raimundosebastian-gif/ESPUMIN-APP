// =====================================================
//  MÓDULO ÚNICO DE INVENTARIO (MULTISUCURSAL)
//  - Compatible GitHub Pages y carpeta local
//  - Sin dependencias externas
//  - Preparado para sucursales + módulo central (Git)
//  - Molde para el resto de los módulos del ERP
// =====================================================

// -------------------- CONFIGURACIÓN SUCURSAL --------------------

const ID_SUCURSAL = "SUC-001"; // Cambiar en cada sucursal

// Intervalo de sincronización (ms)
const SYNC_INTERVAL = 30000; // 30 segundos

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
const KEY_INVENTARIO = "inventario";
const KEY_MOVIMIENTOS = "movimientosInventario";
const KEY_SYNC_QUEUE = "syncQueueInventario";

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
        tipo,              // ej: "movimientoInventario", "inventario"
        idRegistro,
        idSucursal: ID_SUCURSAL,
        timestamp: ahoraTimestamp(),
        estado: "pendiente"
    });
    setSyncQueue(queue);
}

// -------------------- INVENTARIO --------------------

function getInventario() {
    return lsGet(KEY_INVENTARIO, []);
}

function setInventario(data) {
    lsSet(KEY_INVENTARIO, data);
}

function getMovimientos() {
    return lsGet(KEY_MOVIMIENTOS, []);
}

function setMovimientos(data) {
    lsSet(KEY_MOVIMIENTOS, data);
}

// -------------------- LÓGICA DE NEGOCIO --------------------

function buscarItemInventario(producto, categoria) {
    const inventario = getInventario();
    const prodNorm = normalizarTexto(producto);
    const catNorm = normalizarTexto(categoria);

    return inventario.find(
        x =>
            normalizarTexto(x.producto) === prodNorm &&
            normalizarTexto(x.categoria) === catNorm
    );
}

function registrarIngreso(producto, categoria, cantidad) {
    const inventario = getInventario();
    const movimientos = getMovimientos();

    const prodNorm = normalizarTexto(producto);
    const catNorm = normalizarTexto(categoria);

    let item = buscarItemInventario(producto, categoria);

    if (!item) {
        item = {
            idProducto: generarIdUnico(),
            idSucursal: ID_SUCURSAL,
            producto,              // como lo escribió el usuario
            productoNorm: prodNorm,
            categoria,
            categoriaNorm: catNorm,
            cantidad: 0,
            fechaUltimoMovimiento: "",
            timestamp: ahoraTimestamp(),
            version: 1,
            estadoSync: "pendiente"
        };
        inventario.push(item);
    } else {
        item.version = (item.version || 1) + 1;
        item.timestamp = ahoraTimestamp();
        item.estadoSync = "pendiente";
    }

    item.cantidad += cantidad;
    item.fechaUltimoMovimiento = new Date().toLocaleString();

    const movimiento = {
        idMovimiento: generarIdUnico(),
        idProducto: item.idProducto,
        idSucursal: ID_SUCURSAL,
        producto: item.producto,
        productoNorm: item.productoNorm,
        categoria: item.categoria,
        categoriaNorm: item.categoriaNorm,
        tipo: "INGRESO",
        cantidad,
        fecha: item.fechaUltimoMovimiento,
        timestamp: ahoraTimestamp(),
        version: 1,
        estadoSync: "pendiente"
    };

    movimientos.push(movimiento);
    setInventario(inventario);
    setMovimientos(movimientos);

    // Agregar a cola de sincronización
    agregarASyncQueue("inventario", item.idProducto);
    agregarASyncQueue("movimientoInventario", movimiento.idMovimiento);
}

function registrarSalida(producto, categoria, cantidad) {
    const inventario = getInventario();
    const movimientos = getMovimientos();

    const item = buscarItemInventario(producto, categoria);

    if (!item) {
        throw new Error("El producto no existe en el inventario.");
    }

    if (item.cantidad < cantidad) {
        throw new Error("No hay suficiente stock para retirar.");
    }

    item.cantidad -= cantidad;
    item.fechaUltimoMovimiento = new Date().toLocaleString();
    item.version = (item.version || 1) + 1;
    item.timestamp = ahoraTimestamp();
    item.estadoSync = "pendiente";

    const movimiento = {
        idMovimiento: generarIdUnico(),
        idProducto: item.idProducto,
        idSucursal: ID_SUCURSAL,
        producto: item.producto,
        productoNorm: item.productoNorm,
        categoria: item.categoria,
        categoriaNorm: item.categoriaNorm,
        tipo: "SALIDA",
        cantidad,
        fecha: item.fechaUltimoMovimiento,
        timestamp: ahoraTimestamp(),
        version: 1,
        estadoSync: "pendiente"
    };

    movimientos.push(movimiento);
    setInventario(inventario);
    setMovimientos(movimientos);

    // Agregar a cola de sincronización
    agregarASyncQueue("inventario", item.idProducto);
    agregarASyncQueue("movimientoInventario", movimiento.idMovimiento);
}

// -------------------- LISTADO DE INVENTARIO --------------------

function initListadoInventario() {
    const tabla = document.getElementById("tablaInventario");
    if (!tabla) return;

    function cargarInventario() {
        tabla.innerHTML = `
            <tr><td colspan="5" class="sin-datos">Cargando...</td></tr>
        `;

        try {
            let inventario = getInventario();

            if (inventario.length === 0) {
                tabla.innerHTML = `
                    <tr><td colspan="5" class="sin-datos">No hay productos registrados</td></tr>
                `;
                return;
            }

            // Ordenar por producto
            inventario = inventario.sort((a, b) =>
                a.producto.localeCompare(b.producto, "es")
            );

            tabla.innerHTML = "";
            inventario.forEach(item => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${item.idProducto}</td>
                    <td>${item.producto}</td>
                    <td>${item.categoria}</td>
                    <td>${item.cantidad}</td>
                    <td>${item.fechaUltimoMovimiento || ""}</td>
                `;
                tabla.appendChild(fila);
            });
        } catch {
            tabla.innerHTML = `
                <tr><td colspan="5" class="sin-datos">Error al cargar inventario</td></tr>
            `;
        }
    }

    window.cargarInventario = cargarInventario;
    cargarInventario();
}

// -------------------- INGRESO DE INVENTARIO --------------------

function initIngresoInventario() {
    const form = document.getElementById("formIngreso");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const producto = document.getElementById("producto").value.trim();
        const categoria = document.getElementById("categoria").value.trim();
        const cantidad = parseInt(document.getElementById("cantidad").value);

        if (!producto || !categoria || isNaN(cantidad) || cantidad <= 0) {
            alert("Por favor complete todos los campos correctamente.");
            return;
        }

        try {
            registrarIngreso(producto, categoria, cantidad);
            alert("Ingreso registrado correctamente.");
            form.reset();
        } catch (error) {
            alert(error.message || "Error al registrar ingreso.");
        }
    });
}

// -------------------- SALIDA DE INVENTARIO --------------------

function initSalidaInventario() {
    const form = document.getElementById("formSalida");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const producto = document.getElementById("producto").value.trim();
        const categoria = document.getElementById("categoria").value.trim();
        const cantidad = parseInt(document.getElementById("cantidad").value);

        if (!producto || !categoria || isNaN(cantidad) || cantidad <= 0) {
            alert("Por favor complete todos los campos correctamente.");
            return;
        }

        try {
            registrarSalida(producto, categoria, cantidad);
            alert("Salida registrada correctamente.");
            form.reset();
        } catch (error) {
            alert(error.message || "Error al registrar salida.");
        }
    });
}

// -------------------- LISTADO DE MOVIMIENTOS --------------------

function initListadoMovimientos() {
    const tabla = document.getElementById("tablaMovimientos");
    if (!tabla) return;

    let movimientos = getMovimientos();

    if (movimientos.length === 0) {
        tabla.innerHTML = `<tr><td colspan="5" class="sin-datos">No hay movimientos registrados</td></tr>`;
        return;
    }

    // Ordenar por fecha (timestamp)
    movimientos = movimientos.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    tabla.innerHTML = "";
    movimientos.forEach(m => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${m.fecha}</td>
            <td>${m.producto}</td>
            <td>${m.categoria}</td>
            <td>${m.tipo}</td>
            <td>${m.cantidad}</td>
        `;
        tabla.appendChild(fila);
    });
}

// -------------------- KARDEX --------------------

function initKardex() {
    const select = document.getElementById("productoSelect");
    const tabla = document.getElementById("tablaKardex");
    if (!select || !tabla) return;

    const movimientos = getMovimientos();
    const productos = [...new Set(movimientos.map(m => m.producto))];

    productos.forEach(p => {
        const option = document.createElement("option");
        option.value = p;
        option.textContent = p;
        select.appendChild(option);
    });

    window.generarKardex = function () {
        const producto = select.value;
        const todosMovimientos = getMovimientos();
        let filtrados = todosMovimientos.filter(m => m.producto === producto);

        if (!producto || filtrados.length === 0) {
            tabla.innerHTML = `<tr><td colspan="5" class="sin-datos">No hay movimientos para este producto</td></tr>`;
            return;
        }

        // Ordenar por timestamp
        filtrados = filtrados.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        tabla.innerHTML = "";
        let saldo = 0;

        filtrados.forEach(m => {
            if (m.tipo === "INGRESO") saldo += m.cantidad;
            if (m.tipo === "SALIDA") saldo -= m.cantidad;

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${m.fecha}</td>
                <td>${m.tipo}</td>
                <td>${m.tipo === "INGRESO" ? m.cantidad : "-"}</td>
                <td>${m.tipo === "SALIDA" ? m.cantidad : "-"}</td>
                <td>${saldo}</td>
            `;
            tabla.appendChild(fila);
        });
    };
}

// -------------------- SINCRONIZACIÓN CON CENTRAL (ESQUELETO) --------------------
// Nota: acá solo dejamos el esqueleto. La implementación concreta de GitHub API
// se define cuando fijemos el repo central y el mecanismo de autenticación.

async function sincronizarConCentral() {
    const queue = getSyncQueue();
    if (!queue.length) return;

    // En esta versión dejamos el esqueleto preparado.
    // Más adelante se implementa el fetch hacia la API central.
    // Por ahora, simplemente marcamos como "simulado".
    const nuevaQueue = queue.map(item => ({
        ...item,
        estado: "simulado"
    }));

    setSyncQueue(nuevaQueue);
    // Cuando se implemente la API real:
    // - enviar registros pendientes
    // - marcar confirmados
    // - traer actualizaciones
}

// -------------------- INICIALIZACIÓN AUTOMÁTICA --------------------

document.addEventListener("DOMContentLoaded", () => {
    initListadoInventario();
    initIngresoInventario();
    initSalidaInventario();
    initListadoMovimientos();
    initKardex();

    // Sincronización periódica (esqueleto)
    setInterval(sincronizarConCentral, SYNC_INTERVAL);
});
