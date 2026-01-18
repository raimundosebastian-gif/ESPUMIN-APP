// =====================================================
//  MÓDULO ÚNICO DE INVENTARIO (MULTISUCURSAL)
//  - Compatible GitHub Pages y carpeta local
//  - Sin dependencias externas
//  - Integrado con Ventas, Kardex y Reportes
//  - Preparado para sucursales + módulo central (Git)
// =====================================================

// -------------------- CONFIGURACIÓN SUCURSAL --------------------

const ID_SUCURSAL = "SUC-001"; // Cambiar en cada sucursal
const SYNC_INTERVAL_INVENTARIO = 30000; // 30 segundos

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
const KEY_INVENTARIO = "inventarioLocal";
const KEY_MOVIMIENTOS_INVENTARIO = "movimientosInventario";
const KEY_SYNC_QUEUE_INVENTARIO = "syncQueueInventario";

// -------------------- SYNC QUEUE INVENTARIO --------------------

function getSyncQueueInventario() {
    return lsGet(KEY_SYNC_QUEUE_INVENTARIO, []);
}

function setSyncQueueInventario(queue) {
    lsSet(KEY_SYNC_QUEUE_INVENTARIO, queue);
}

function agregarASyncQueueInventario(tipo, idRegistro) {
    const queue = getSyncQueueInventario();
    queue.push({
        idSync: generarIdUnico(),
        tipo,              // ej: "producto", "movimiento"
        idRegistro,
        idSucursal: ID_SUCURSAL,
        timestamp: ahoraTimestamp(),
        estado: "pendiente"
    });
    setSyncQueueInventario(queue);
}

// =====================================================
//  INVENTARIO (PRODUCTOS)
// =====================================================

function getInventario() {
    return lsGet(KEY_INVENTARIO, []);
}

function setInventario(data) {
    lsSet(KEY_INVENTARIO, data);
}

function buscarProductoEnInventarioPorNombreONId(inventario, item) {
    return inventario.find(p =>
        (p.idProducto && item.idProducto && p.idProducto === item.idProducto) ||
        (normalizarTexto(p.producto) === normalizarTexto(item.producto))
    );
}

function crearProductoBaseDesdeItem(item, fechaMovimiento) {
    return {
        idProducto: item.idProducto || generarIdUnico(),
        idSucursal: ID_SUCURSAL,
        producto: item.producto,
        productoNorm: normalizarTexto(item.producto),
        categoria: item.categoria || "",
        categoriaNorm: normalizarTexto(item.categoria || ""),
        cantidad: 0,
        fechaUltimoMovimiento: fechaMovimiento,
        timestamp: ahoraTimestamp(),
        version: 1,
        estadoSync: "pendiente"
    };
}

// tipo: "INGRESO" | "SALIDA"
function actualizarInventario(item, tipo, fechaMovimiento) {
    let inventario = getInventario();
    let prod = buscarProductoEnInventarioPorNombreONId(inventario, item);

    if (!prod) {
        prod = crearProductoBaseDesdeItem(item, fechaMovimiento);
        inventario.push(prod);
    }

    const cantidadMovimiento = Number(item.cantidad) || 0;
    if (tipo === "INGRESO") {
        prod.cantidad = Number(prod.cantidad || 0) + cantidadMovimiento;
    } else if (tipo === "SALIDA") {
        prod.cantidad = Number(prod.cantidad || 0) - cantidadMovimiento;
    }

    prod.fechaUltimoMovimiento = fechaMovimiento;
    prod.timestamp = ahoraTimestamp();
    prod.version = (prod.version || 1) + 1;
    prod.estadoSync = "pendiente";

    setInventario(inventario);
    agregarASyncQueueInventario("producto", prod.idProducto);
}

// =====================================================
//  MOVIMIENTOS DE INVENTARIO (KARDEX)
// =====================================================

function getMovimientosInventario() {
    return lsGet(KEY_MOVIMIENTOS_INVENTARIO, []);
}

function setMovimientosInventario(data) {
    lsSet(KEY_MOVIMIENTOS_INVENTARIO, data);
}

function registrarMovimientoInventario(item, tipo, fechaMovimiento) {
    const movimientos = getMovimientosInventario();

    const movimiento = {
        idMovimiento: generarIdUnico(),
        idProducto: item.idProducto || item.producto,
        idSucursal: ID_SUCURSAL,
        producto: item.producto,
        categoria: item.categoria || "",
        tipo: tipo, // "INGRESO" | "SALIDA"
        cantidad: Number(item.cantidad) || 0,
        fecha: fechaMovimiento,
        timestamp: ahoraTimestamp(),
        version: 1,
        estadoSync: "pendiente"
    };

    movimientos.push(movimiento);
    setMovimientosInventario(movimientos);
    agregarASyncQueueInventario("movimiento", movimiento.idMovimiento);
}

// =====================================================
//  VALIDACIONES
// =====================================================

function validarMovimientoInventario(item, tipo) {
    const errores = [];

    if (!item.producto || !item.producto.toString().trim()) {
        errores.push("El producto es obligatorio.");
    }

    const cantidad = Number(item.cantidad);
    if (!cantidad || cantidad <= 0) {
        errores.push("La cantidad debe ser mayor a cero.");
    }

    if (tipo !== "INGRESO" && tipo !== "SALIDA") {
        errores.push("Tipo de movimiento inválido.");
    }

    if (tipo === "SALIDA") {
        const inventario = getInventario();
        const prod = buscarProductoEnInventarioPorNombreONId(inventario, item);
        if (!prod) {
            errores.push(`Producto no encontrado en inventario: ${item.producto}`);
        } else {
            const stockActual = Number(prod.cantidad) || 0;
            if (stockActual < cantidad) {
                errores.push(`Stock insuficiente para ${item.producto}. Stock: ${stockActual}, solicitado: ${cantidad}`);
            }
        }
    }

    return errores;
}

// =====================================================
//  LISTADO DE INVENTARIO
// =====================================================

function initListadoInventario() {
    const tabla = document.getElementById("tablaInventario");
    if (!tabla) return;

    let inventario = getInventario();

    if (!inventario.length) {
        tabla.innerHTML = `<tr><td colspan="5" class="sin-datos">No hay productos en inventario</td></tr>`;
        return;
    }

    inventario = inventario.sort((a, b) => normalizarTexto(a.producto).localeCompare(normalizarTexto(b.producto)));

    tabla.innerHTML = "";
    inventario.forEach(p => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${p.producto}</td>
            <td>${p.categoria || ""}</td>
            <td>${p.cantidad}</td>
            <td>${(p.fechaUltimoMovimiento || "").replace("T", " ")}</td>
            <td>${p.idProducto}</td>
        `;
        tabla.appendChild(fila);
    });
}

// =====================================================
//  INGRESO DE INVENTARIO
// =====================================================

function initIngresoInventario() {
    const form = document.getElementById("formIngresoInventario");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const producto = document.getElementById("producto")?.value.trim();
        const categoria = document.getElementById("categoria")?.value.trim();
        const cantidad = document.getElementById("cantidad")?.value;
        const fecha = document.getElementById("fecha")?.value;

        if (!fecha) {
            alert("Complete la fecha.");
            return;
        }

        const item = {
            producto,
            categoria,
            cantidad: Number(cantidad)
        };

        const errores = validarMovimientoInventario(item, "INGRESO");
        if (errores.length) {
            alert("Errores:\n" + errores.join("\n"));
            return;
        }

        registrarMovimientoInventario(item, "INGRESO", fecha);
        actualizarInventario(item, "INGRESO", fecha);

        alert("Ingreso registrado correctamente.");
        form.reset();
    });
}

// =====================================================
//  SALIDA DE INVENTARIO
// =====================================================

function initSalidaInventario() {
    const form = document.getElementById("formSalidaInventario");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const producto = document.getElementById("producto")?.value.trim();
        const categoria = document.getElementById("categoria")?.value.trim();
        const cantidad = document.getElementById("cantidad")?.value;
        const fecha = document.getElementById("fecha")?.value;

        if (!fecha) {
            alert("Complete la fecha.");
            return;
        }

        const item = {
            producto,
            categoria,
            cantidad: Number(cantidad)
        };

        const errores = validarMovimientoInventario(item, "SALIDA");
        if (errores.length) {
            alert("Errores:\n" + errores.join("\n"));
            return;
        }

        registrarMovimientoInventario(item, "SALIDA", fecha);
        actualizarInventario(item, "SALIDA", fecha);

        alert("Salida registrada correctamente.");
        form.reset();
    });
}

// =====================================================
//  LISTADO DE MOVIMIENTOS (KARDEX SIMPLE)
// =====================================================

function initListadoMovimientos() {
    const tabla = document.getElementById("tablaMovimientos");
    if (!tabla) return;

    let movimientos = getMovimientosInventario();

    if (!movimientos.length) {
        tabla.innerHTML = `<tr><td colspan="6" class="sin-datos">No hay movimientos registrados</td></tr>`;
        return;
    }

    movimientos = movimientos.sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));

    tabla.innerHTML = "";
    movimientos.forEach(m => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${(m.fecha || "").replace("T", " ")}</td>
            <td>${m.producto}</td>
            <td>${m.categoria || ""}</td>
            <td>${m.tipo}</td>
            <td>${m.cantidad}</td>
            <td>${m.idMovimiento}</td>
        `;
        tabla.appendChild(fila);
    });
}

// =====================================================
//  KARDEX POR PRODUCTO (BÁSICO)
// =====================================================

function initKardex() {
    const tabla = document.getElementById("tablaKardex");
    const inputProducto = document.getElementById("productoKardex");
    if (!tabla || !inputProducto) return;

    function renderKardex() {
        const filtro = normalizarTexto(inputProducto.value);
        let movimientos = getMovimientosInventario();

        if (filtro) {
            movimientos = movimientos.filter(m =>
                normalizarTexto(m.producto).includes(filtro) ||
                (m.idProducto && m.idProducto.toString().includes(filtro))
            );
        }

        if (!movimientos.length) {
            tabla.innerHTML = `<tr><td colspan="6" class="sin-datos">No hay movimientos para el filtro aplicado</td></tr>`;
            return;
        }

        movimientos = movimientos.sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));

        tabla.innerHTML = "";
        movimientos.forEach(m => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${(m.fecha || "").replace("T", " ")}</td>
                <td>${m.producto}</td>
                <td>${m.categoria || ""}</td>
                <td>${m.tipo}</td>
                <td>${m.cantidad}</td>
                <td>${m.idMovimiento}</td>
            `;
            tabla.appendChild(fila);
        });
    }

    inputProducto.addEventListener("input", renderKardex);
    renderKardex();
}

// =====================================================
//  SINCRONIZACIÓN CON CENTRAL (ESQUELETO)
// =====================================================

async function sincronizarInventarioConCentral() {
    const queue = getSyncQueueInventario();
    if (!queue.length) return;

    const nuevaQueue = queue.map(item => ({
        ...item,
        estado: "simulado"
    }));

    setSyncQueueInventario(nuevaQueue);
}

// =====================================================
//  DATOS DE PRUEBA AMPLIADOS — INVENTARIO
//  Solo se cargan si no hay inventario cargado
// =====================================================

function cargarDatosPruebaInventario() {

    const inventario = [
        {
            idProducto: "P-001",
            idSucursal: ID_SUCURSAL,
            producto: "Yerba",
            productoNorm: "yerba",
            categoria: "Alimentos",
            categoriaNorm: "alimentos",
            cantidad: 48,
            fechaUltimoMovimiento: "2026-01-12T10:00",
            timestamp: ahoraTimestamp(),
            version: 3,
            estadoSync: "pendiente"
        },
        {
            idProducto: "P-002",
            idSucursal: ID_SUCURSAL,
            producto: "Azúcar",
            productoNorm: "azucar",
            categoria: "Alimentos",
            categoriaNorm: "alimentos",
            cantidad: 30,
            fechaUltimoMovimiento: "2026-01-12T09:30",
            timestamp: ahoraTimestamp(),
            version: 2,
            estadoSync: "pendiente"
        },
        {
            idProducto: "P-003",
            idSucursal: ID_SUCURSAL,
            producto: "Detergente",
            productoNorm: "detergente",
            categoria: "Limpieza",
            categoriaNorm: "limpieza",
            cantidad: 15,
            fechaUltimoMovimiento: "2026-01-11T17:00",
            timestamp: ahoraTimestamp(),
            version: 1,
            estadoSync: "pendiente"
        },
        {
            idProducto: "P-004",
            idSucursal: ID_SUCURSAL,
            producto: "Fideos",
            productoNorm: "fideos",
            categoria: "Alimentos",
            categoriaNorm: "alimentos",
            cantidad: 60,
            fechaUltimoMovimiento: "2026-01-10T14:00",
            timestamp: ahoraTimestamp(),
            version: 1,
            estadoSync: "pendiente"
        }
    ];

    const movimientos = [
        // Yerba
        { idMovimiento: generarIdUnico(), idProducto: "P-001", idSucursal: ID_SUCURSAL, producto: "Yerba", categoria: "Alimentos", tipo: "INGRESO", cantidad: 50, fecha: "2026-01-10T09:00", timestamp: ahoraTimestamp(), version: 1, estadoSync: "pendiente" },
        { idMovimiento: generarIdUnico(), idProducto: "P-001", idSucursal: ID_SUCURSAL, producto: "Yerba", categoria: "Alimentos", tipo: "SALIDA", cantidad: 2, fecha: "2026-01-12T10:00", timestamp: ahoraTimestamp(), version: 1, estadoSync: "pendiente" },

        // Azúcar
        { idMovimiento: generarIdUnico(), idProducto: "P-002", idSucursal: ID_SUCURSAL, producto: "Azúcar", categoria: "Alimentos", tipo: "INGRESO", cantidad: 30, fecha: "2026-01-11T08:00", timestamp: ahoraTimestamp(), version: 1, estadoSync: "pendiente" },

        // Detergente
        { idMovimiento: generarIdUnico(), idProducto: "P-003", idSucursal: ID_SUCURSAL, producto: "Detergente", categoria: "Limpieza", tipo: "INGRESO", cantidad: 15, fecha: "2026-01-11T17:00", timestamp: ahoraTimestamp(), version: 1, estadoSync: "pendiente" },

        // Fideos
        { idMovimiento: generarIdUnico(), idProducto: "P-004", idSucursal: ID_SUCURSAL, producto: "Fideos", categoria: "Alimentos", tipo: "INGRESO", cantidad: 60, fecha: "2026-01-10T14:00", timestamp: ahoraTimestamp(), version: 1, estadoSync: "pendiente" },

        // Movimientos adicionales para probar listados
        { idMovimiento: generarIdUnico(), idProducto: "P-001", idSucursal: ID_SUCURSAL, producto: "Yerba", categoria: "Alimentos", tipo: "SALIDA", cantidad: 1, fecha: "2026-01-12T11:00", timestamp: ahoraTimestamp(), version: 1, estadoSync: "pendiente" },
        { idMovimiento: generarIdUnico(), idProducto: "P-002", idSucursal: ID_SUCURSAL, producto: "Azúcar", categoria: "Alimentos", tipo: "SALIDA", cantidad: 1, fecha: "2026-01-12T11:30", timestamp: ahoraTimestamp(), version: 1, estadoSync: "pendiente" },
        { idMovimiento: generarIdUnico(), idProducto: "P-003", idSucursal: ID_SUCURSAL, producto: "Detergente", categoria: "Limpieza", tipo: "SALIDA", cantidad: 1, fecha: "2026-01-12T12:00", timestamp: ahoraTimestamp(), version: 1, estadoSync: "pendiente" }
    ];

    lsSet(KEY_INVENTARIO, inventario);
    lsSet(KEY_MOVIMIENTOS_INVENTARIO, movimientos);
}

if (lsGet(KEY_INVENTARIO, []).length === 0) {
    cargarDatosPruebaInventario();
}

// =====================================================
//  INICIALIZACIÓN AUTOMÁTICA
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    initListadoInventario();
    initIngresoInventario();
    initSalidaInventario();
    initListadoMovimientos();
    initKardex();

    setInterval(sincronizarInventarioConCentral, SYNC_INTERVAL_INVENTARIO);
});
