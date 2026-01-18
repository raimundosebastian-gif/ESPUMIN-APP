// =====================================================
//  MÓDULO ÚNICO DE VENTAS (MULTISUCURSAL)
//  - Compatible GitHub Pages y carpeta local
//  - Sin dependencias externas
//  - Integrado con Inventario, Agenda, Caja y Reportes
//  - Preparado para sucursales + módulo central (Git)
// =====================================================

// -------------------- CONFIGURACIÓN SUCURSAL --------------------

const ID_SUCURSAL = "SUC-001"; // Cambiar en cada sucursal
const SYNC_INTERVAL_VENTAS = 30000; // 30 segundos
const STOCK_CRITICO_UMBRAL = 5;     // Umbral para tareas automáticas de stock crítico

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
const KEY_VENTAS = "ventasLocal";
const KEY_SYNC_QUEUE_VENTAS = "syncQueueVentas";

const KEY_INVENTARIO = "inventarioLocal";
const KEY_MOVIMIENTOS_INVENTARIO = "movimientosInventario";

const KEY_AGENDA = "agendaLocal";

// =====================================================
//  SYNC QUEUE VENTAS
// =====================================================

function getSyncQueueVentas() {
    return lsGet(KEY_SYNC_QUEUE_VENTAS, []);
}

function setSyncQueueVentas(queue) {
    lsSet(KEY_SYNC_QUEUE_VENTAS, queue);
}

function agregarASyncQueueVentas(tipo, idRegistro) {
    const queue = getSyncQueueVentas();
    queue.push({
        idSync: generarIdUnico(),
        tipo,              // ej: "venta"
        idRegistro,
        idSucursal: ID_SUCURSAL,
        timestamp: ahoraTimestamp(),
        estado: "pendiente"
    });
    setSyncQueueVentas(queue);
}

// =====================================================
//  VENTAS
// =====================================================

function getVentas() {
    return lsGet(KEY_VENTAS, []);
}

function setVentas(data) {
    lsSet(KEY_VENTAS, data);
}

// =====================================================
//  INVENTARIO (INTEGRACIÓN)
// =====================================================

function getInventario() {
    return lsGet(KEY_INVENTARIO, []);
}

function setInventario(data) {
    lsSet(KEY_INVENTARIO, data);
}

function getMovimientosInventario() {
    return lsGet(KEY_MOVIMIENTOS_INVENTARIO, []);
}

function setMovimientosInventario(data) {
    lsSet(KEY_MOVIMIENTOS_INVENTARIO, data);
}

function buscarProductoEnInventarioPorItem(item) {
    const inventario = getInventario();
    return inventario.find(p =>
        (p.idProducto && item.idProducto && p.idProducto === item.idProducto) ||
        (normalizarTexto(p.producto) === normalizarTexto(item.producto))
    );
}

function registrarMovimientoInventarioDesdeVenta(item, fechaVenta) {
    const movimientos = getMovimientosInventario();

    const movimiento = {
        idMovimiento: generarIdUnico(),
        idProducto: item.idProducto || item.producto,
        idSucursal: ID_SUCURSAL,
        producto: item.producto,
        categoria: item.categoria || "",
        tipo: "SALIDA",
        cantidad: Number(item.cantidad) || 0,
        fecha: fechaVenta,
        timestamp: ahoraTimestamp(),
        version: 1,
        estadoSync: "pendiente"
    };

    movimientos.push(movimiento);
    setMovimientosInventario(movimientos);
}

function actualizarInventarioPorVenta(items, fechaVenta) {
    let inventario = getInventario();
    let inventarioModificado = false;

    items.forEach(item => {
        const cantidadVenta = Number(item.cantidad) || 0;
        if (!cantidadVenta) return;

        let prod = inventario.find(p =>
            (p.idProducto && item.idProducto && p.idProducto === item.idProducto) ||
            (normalizarTexto(p.producto) === normalizarTexto(item.producto))
        );

        if (!prod) {
            // Si no existe, lo creamos (para auditoría, puede quedar en negativo)
            prod = {
                idProducto: item.idProducto || generarIdUnico(),
                idSucursal: ID_SUCURSAL,
                producto: item.producto,
                productoNorm: normalizarTexto(item.producto),
                categoria: item.categoria || "",
                categoriaNorm: normalizarTexto(item.categoria || ""),
                cantidad: 0,
                fechaUltimoMovimiento: fechaVenta,
                timestamp: ahoraTimestamp(),
                version: 1,
                estadoSync: "pendiente"
            };
            inventario.push(prod);
        }

        prod.cantidad = Number(prod.cantidad || 0) - cantidadVenta;
        prod.fechaUltimoMovimiento = fechaVenta;
        prod.timestamp = ahoraTimestamp();
        prod.version = (prod.version || 1) + 1;
        prod.estadoSync = "pendiente";

        inventarioModificado = true;

        registrarMovimientoInventarioDesdeVenta(item, fechaVenta);
    });

    if (inventarioModificado) {
        setInventario(inventario);
    }
}

// =====================================================
//  AGENDA (TAREAS AUTOMÁTICAS)
// =====================================================

function getAgenda() {
    return lsGet(KEY_AGENDA, []);
}

function setAgenda(data) {
    lsSet(KEY_AGENDA, data);
}

function crearTareaAgenda(titulo, descripcion, fechaISO) {
    const tareas = getAgenda();

    const tarea = {
        idTarea: generarIdUnico(),
        idSucursal: ID_SUCURSAL,
        titulo,
        tituloNorm: normalizarTexto(titulo),
        descripcion,
        descripcionNorm: normalizarTexto(descripcion),
        fecha: fechaISO || new Date().toISOString().slice(0, 16),
        estado: "pendiente",
        timestamp: ahoraTimestamp(),
        version: 1,
        estadoSync: "pendiente"
    };

    tareas.push(tarea);
    setAgenda(tareas);
}

function crearTareasAutomaticasPorVenta(venta) {
    const total = Number(venta.totalFinal || venta.total || 0);

    // Venta grande
    if (total >= 5000) {
        crearTareaAgenda(
            "Revisar venta grande",
            `Venta ${venta.idVenta} por ${total} al cliente ${venta.cliente}`,
            venta.fecha
        );
    }

    // Cliente frecuente (ejemplo simple: nombre repetido en el día)
    const ventas = getVentas().filter(v =>
        (v.cliente === venta.cliente) &&
        (v.fecha || "").substring(0, 10) === (venta.fecha || "").substring(0, 10)
    );
    if (ventas.length >= 3) {
        crearTareaAgenda(
            "Seguimiento cliente frecuente",
            `El cliente ${venta.cliente} realizó ${ventas.length} compras en el día.`,
            venta.fecha
        );
    }

    // Stock crítico por producto
    const inventario = getInventario();
    venta.items.forEach(item => {
        const prod = inventario.find(p =>
            (p.idProducto && item.idProducto && p.idProducto === item.idProducto) ||
            (normalizarTexto(p.producto) === normalizarTexto(item.producto))
        );
        if (!prod) return;

        const stockActual = Number(prod.cantidad) || 0;
        if (stockActual <= STOCK_CRITICO_UMBRAL) {
            crearTareaAgenda(
                "Stock crítico",
                `Producto ${prod.producto} quedó con stock ${stockActual} unidades.`,
                venta.fecha
            );
        }
    });
}

// =====================================================
//  VALIDACIÓN DE STOCK PARA VENTA
// =====================================================

function validarStockParaVenta(items) {
    const inventario = getInventario();
    const errores = [];

    items.forEach(item => {
        const cantidadVenta = Number(item.cantidad) || 0;
        if (!cantidadVenta) return;

        const prod = inventario.find(p =>
            (p.idProducto && item.idProducto && p.idProducto === item.idProducto) ||
            (normalizarTexto(p.producto) === normalizarTexto(item.producto))
        );

        if (!prod) {
            errores.push(`Producto no encontrado en inventario: ${item.producto}`);
            return;
        }

        const stockActual = Number(prod.cantidad) || 0;
        if (stockActual < cantidadVenta) {
            errores.push(`Stock insuficiente para ${item.producto}. Stock: ${stockActual}, solicitado: ${cantidadVenta}`);
        }
    });

    return errores;
}

// =====================================================
//  CAJA (CÁLCULO DESDE VENTAS)
// =====================================================

function calcularCajaPorFecha(fechaISO) {
    const ventas = getVentas();
    const fechaBase = fechaISO;

    let total = 0;
    const porMetodo = {};

    ventas.forEach(v => {
        if (!v.fecha || !v.estado || v.estado !== "pagada") return;

        const fechaVenta = (v.fecha || "").substring(0, 10);
        if (fechaVenta !== fechaBase) return;

        const monto = Number(v.totalFinal || v.total || 0);
        total += monto;

        const mp = v.metodoPago || "desconocido";
        porMetodo[mp] = (porMetodo[mp] || 0) + monto;
    });

    return { total, porMetodo };
}

// =====================================================
//  LÓGICA DE NEGOCIO VENTAS
// =====================================================

function crearVenta(datosVenta) {
    const ventas = getVentas();

    const items = datosVenta.items || [];
    const erroresStock = validarStockParaVenta(items);
    if (erroresStock.length) {
        throw new Error("Error de stock:\n" + erroresStock.join("\n"));
    }

    const venta = {
        idVenta: generarIdUnico(),
        idSucursal: ID_SUCURSAL,

        fecha: datosVenta.fecha,
        timestamp: ahoraTimestamp(),

        cliente: datosVenta.cliente || "Consumidor Final",
        vendedor: datosVenta.vendedor || "USUARIO-TEST",

        items: items.map(it => ({
            idProducto: it.idProducto || null,
            producto: it.producto,
            categoria: it.categoria || "",
            cantidad: Number(it.cantidad) || 0,
            precioUnitario: Number(it.precioUnitario) || 0,
            subtotal: (Number(it.cantidad) || 0) * (Number(it.precioUnitario) || 0)
        })),

        descuento: Number(datosVenta.descuento) || 0,
        recargo: Number(datosVenta.recargo) || 0,
        total: 0,
        totalFinal: 0,

        metodoPago: datosVenta.metodoPago || "efectivo",
        estado: datosVenta.estado || "pagada",

        nroComprobante: datosVenta.nroComprobante || "",

        version: 1,
        estadoSync: "pendiente"
    };

    venta.total = venta.items.reduce((acc, it) => acc + (it.subtotal || 0), 0);
    venta.totalFinal = venta.total - venta.descuento + venta.recargo;

    ventas.push(venta);
    setVentas(ventas);

    actualizarInventarioPorVenta(venta.items, venta.fecha);
    crearTareasAutomaticasPorVenta(venta);
    agregarASyncQueueVentas("venta", venta.idVenta);

    return venta;
}

function editarVenta(idVenta, nuevosDatos) {
    const ventas = getVentas();
    const idx = ventas.findIndex(v => v.idVenta === idVenta);
    if (idx === -1) throw new Error("La venta no existe.");

    const venta = ventas[idx];

    // Nota: no recalculamos stock histórico aquí (sería un módulo aparte).
    // Solo actualizamos datos de cabecera e items.

    venta.cliente = nuevosDatos.cliente || venta.cliente;
    venta.vendedor = nuevosDatos.vendedor || venta.vendedor;
    venta.fecha = nuevosDatos.fecha || venta.fecha;
    venta.metodoPago = nuevosDatos.metodoPago || venta.metodoPago;
    venta.estado = nuevosDatos.estado || venta.estado;
    venta.nroComprobante = nuevosDatos.nroComprobante || venta.nroComprobante;

    if (Array.isArray(nuevosDatos.items) && nuevosDatos.items.length) {
        venta.items = nuevosDatos.items.map(it => ({
            idProducto: it.idProducto || null,
            producto: it.producto,
            categoria: it.categoria || "",
            cantidad: Number(it.cantidad) || 0,
            precioUnitario: Number(it.precioUnitario) || 0,
            subtotal: (Number(it.cantidad) || 0) * (Number(it.precioUnitario) || 0)
        }));
    }

    venta.descuento = (nuevosDatos.descuento !== undefined) ? Number(nuevosDatos.descuento) : venta.descuento;
    venta.recargo = (nuevosDatos.recargo !== undefined) ? Number(nuevosDatos.recargo) : venta.recargo;

    venta.total = venta.items.reduce((acc, it) => acc + (it.subtotal || 0), 0);
    venta.totalFinal = venta.total - venta.descuento + venta.recargo;

    venta.version++;
    venta.timestamp = ahoraTimestamp();
    venta.estadoSync = "pendiente";

    ventas[idx] = venta;
    setVentas(ventas);

    agregarASyncQueueVentas("venta", venta.idVenta);
}

function cambiarEstadoVenta(idVenta, nuevoEstado) {
    const ventas = getVentas();
    const venta = ventas.find(v => v.idVenta === idVenta);
    if (!venta) throw new Error("La venta no existe.");

    venta.estado = nuevoEstado;
    venta.version++;
    venta.timestamp = ahoraTimestamp();
    venta.estadoSync = "pendiente";

    setVentas(ventas);
    agregarASyncQueueVentas("venta", venta.idVenta);
}

function eliminarVenta(idVenta) {
    let ventas = getVentas();
    ventas = ventas.filter(v => v.idVenta !== idVenta);
    setVentas(ventas);
    agregarASyncQueueVentas("venta", idVenta);
}

// =====================================================
//  LISTADO DE VENTAS
// =====================================================

function initVentasListado() {
    const tabla = document.getElementById("tablaVentas");
    if (!tabla) return;

    let ventas = getVentas();

    if (!ventas.length) {
        tabla.innerHTML = `<tr><td colspan="6" class="sin-datos">No hay ventas registradas</td></tr>`;
        return;
    }

    ventas = ventas.sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));

    tabla.innerHTML = "";
    ventas.forEach(v => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${(v.fecha || "").replace("T", " ")}</td>
            <td>${v.cliente}</td>
            <td>${v.metodoPago}</td>
            <td>${v.estado}</td>
            <td>${v.totalFinal}</td>
            <td>${v.idVenta}</td>
        `;
        tabla.appendChild(fila);
    });
}

// =====================================================
//  NUEVA VENTA
// =====================================================

function initVentasNueva() {
    const form = document.getElementById("formNuevaVenta");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const cliente = document.getElementById("cliente")?.value.trim() || "Consumidor Final";
        const vendedor = document.getElementById("vendedor")?.value.trim() || "USUARIO-TEST";
        const fecha = document.getElementById("fecha")?.value;
        const metodoPago = document.getElementById("metodoPago")?.value || "efectivo";
        const descuento = document.getElementById("descuento")?.value || 0;
        const recargo = document.getElementById("recargo")?.value || 0;
        const nroComprobante = document.getElementById("nroComprobante")?.value || "";

        const itemsContainer = document.getElementById("itemsContainer");
        const items = [];

        if (itemsContainer) {
            const filas = itemsContainer.querySelectorAll(".item-venta");
            filas.forEach(fila => {
                const producto = fila.querySelector(".item-producto")?.value.trim();
                const categoria = fila.querySelector(".item-categoria")?.value.trim();
                const cantidad = fila.querySelector(".item-cantidad")?.value;
                const precioUnitario = fila.querySelector(".item-precio")?.value;

                if (producto && cantidad && precioUnitario) {
                    items.push({
                        producto,
                        categoria,
                        cantidad: Number(cantidad),
                        precioUnitario: Number(precioUnitario)
                    });
                }
            });
        }

        if (!fecha) {
            alert("Complete la fecha.");
            return;
        }

        if (!items.length) {
            alert("Agregue al menos un ítem a la venta.");
            return;
        }

        try {
            crearVenta({
                cliente,
                vendedor,
                fecha,
                metodoPago,
                descuento,
                recargo,
                nroComprobante,
                items
            });
            alert("Venta registrada correctamente.");
            form.reset();
        } catch (err) {
            alert(err.message || "Error al registrar la venta.");
        }
    });
}

// =====================================================
//  DETALLE DE VENTA
// =====================================================

function initVentasDetalle() {
    const cont = document.getElementById("detalleVenta");
    if (!cont) return;

    const id = new URLSearchParams(window.location.search).get("id");
    const ventas = getVentas();
    const venta = ventas.find(v => v.idVenta === id);

    if (!venta) {
        cont.innerHTML = "La venta no existe.";
        return;
    }

    let itemsHTML = "";
    venta.items.forEach(it => {
        itemsHTML += `
            <tr>
                <td>${it.producto}</td>
                <td>${it.categoria || ""}</td>
                <td>${it.cantidad}</td>
                <td>${it.precioUnitario}</td>
                <td>${it.subtotal}</td>
            </tr>
        `;
    });

    cont.innerHTML = `
        <p><strong>Fecha:</strong> ${(venta.fecha || "").replace("T", " ")}</p>
        <p><strong>Cliente:</strong> ${venta.cliente}</p>
        <p><strong>Vendedor:</strong> ${venta.vendedor}</p>
        <p><strong>Método de pago:</strong> ${venta.metodoPago}</p>
        <p><strong>Estado:</strong> ${venta.estado}</p>
        <p><strong>Nro Comprobante:</strong> ${venta.nroComprobante || "-"}</p>
        <p><strong>Total:</strong> ${venta.total}</p>
        <p><strong>Descuento:</strong> ${venta.descuento}</p>
        <p><strong>Recargo:</strong> ${venta.recargo}</p>
        <p><strong>Total Final:</strong> ${venta.totalFinal}</p>

        <h3>Items</h3>
        <table class="tabla-inventario">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>
    `;
}

// =====================================================
//  EDITAR VENTA
// =====================================================

function initVentasEditar() {
    const form = document.getElementById("formEditarVenta");
    if (!form) return;

    const id = new URLSearchParams(window.location.search).get("id");
    const ventas = getVentas();
    const venta = ventas.find(v => v.idVenta === id);

    if (!venta) {
        alert("La venta no existe.");
        return;
    }

    const clienteInput = document.getElementById("cliente");
    const fechaInput = document.getElementById("fecha");
    const vendedorInput = document.getElementById("vendedor");
    const metodoPagoSelect = document.getElementById("metodoPago");
    const descuentoInput = document.getElementById("descuento");
    const recargoInput = document.getElementById("recargo");
    const nroComprobanteInput = document.getElementById("nroComprobante");
    const itemsContainer = document.getElementById("itemsContainer");

    if (clienteInput) clienteInput.value = venta.cliente;
    if (fechaInput) fechaInput.value = venta.fecha;
    if (vendedorInput) vendedorInput.value = venta.vendedor;
    if (metodoPagoSelect) metodoPagoSelect.value = venta.metodoPago;
    if (descuentoInput) descuentoInput.value = venta.descuento;
    if (recargoInput) recargoInput.value = venta.recargo;
    if (nroComprobanteInput) nroComprobanteInput.value = venta.nroComprobante || "";

    if (itemsContainer) {
        itemsContainer.innerHTML = "";
        venta.items.forEach(it => {
            const div = document.createElement("div");
            div.className = "item-venta";
            div.innerHTML = `
                <input type="text" class="item-producto" value="${it.producto}" placeholder="Producto">
                <input type="text" class="item-categoria" value="${it.categoria || ""}" placeholder="Categoría">
                <input type="number" class="item-cantidad" value="${it.cantidad}" placeholder="Cantidad" min="1">
                <input type="number" class="item-precio" value="${it.precioUnitario}" placeholder="Precio" min="0">
            `;
            itemsContainer.appendChild(div);
        });
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const cliente = clienteInput?.value.trim() || "Consumidor Final";
        const vendedor = vendedorInput?.value.trim() || "USUARIO-TEST";
        const fecha = fechaInput?.value;
        const metodoPago = metodoPagoSelect?.value || "efectivo";
        const descuento = descuentoInput?.value || 0;
        const recargo = recargoInput?.value || 0;
        const nroComprobante = nroComprobanteInput?.value || "";

        const items = [];
        if (itemsContainer) {
            const filas = itemsContainer.querySelectorAll(".item-venta");
            filas.forEach(fila => {
                const producto = fila.querySelector(".item-producto")?.value.trim();
                const categoria = fila.querySelector(".item-categoria")?.value.trim();
                const cantidad = fila.querySelector(".item-cantidad")?.value;
                const precioUnitario = fila.querySelector(".item-precio")?.value;

                if (producto && cantidad && precioUnitario) {
                    items.push({
                        producto,
                        categoria,
                        cantidad: Number(cantidad),
                        precioUnitario: Number(precioUnitario)
                    });
                }
            });
        }

        if (!fecha) {
            alert("Complete la fecha.");
            return;
        }

        if (!items.length) {
            alert("Agregue al menos un ítem a la venta.");
            return;
        }

        try {
            editarVenta(id, {
                cliente,
                vendedor,
                fecha,
                metodoPago,
                descuento,
                recargo,
                nroComprobante,
                items
            });
            alert("Venta actualizada correctamente.");
        } catch (err) {
            alert(err.message || "Error al actualizar la venta.");
        }
    });
}

// =====================================================
//  REPORTES DE VENTAS
// =====================================================

function generarReporteVentas() {
    const tabla = document.getElementById("tablaReporteVentas");
    if (!tabla) return;

    const fechaDesde = document.getElementById("fechaDesde")?.value;
    const fechaHasta = document.getElementById("fechaHasta")?.value;

    let ventas = getVentas();

    if (fechaDesde) {
        ventas = ventas.filter(v => (v.fecha || "").substring(0, 10) >= fechaDesde);
    }
    if (fechaHasta) {
        ventas = ventas.filter(v => (v.fecha || "").substring(0, 10) <= fechaHasta);
    }

    if (!ventas.length) {
        tabla.innerHTML = `<tr><td colspan="4" class="sin-datos">No hay ventas en el rango seleccionado</td></tr>`;
        return;
    }

    ventas = ventas.sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));

    tabla.innerHTML = "";
    ventas.forEach(v => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${(v.fecha || "").replace("T", " ")}</td>
            <td>${v.cliente}</td>
            <td>${v.totalFinal}</td>
            <td>${v.idVenta}</td>
        `;
        tabla.appendChild(fila);
    });
}

// =====================================================
//  CAJA DE VENTAS
// =====================================================

function generarCaja() {
    const fechaCaja = document.getElementById("fechaCaja")?.value;
    const cont = document.getElementById("resultadoCaja");
    if (!cont) return;

    if (!fechaCaja) {
        cont.innerHTML = "Seleccione una fecha para ver la caja.";
        return;
    }

    const { total, porMetodo } = calcularCajaPorFecha(fechaCaja);

    if (!total) {
        cont.innerHTML = "No hay ventas pagadas en la fecha seleccionada.";
        return;
    }

    let detalle = "";
    Object.keys(porMetodo).forEach(mp => {
        detalle += `<p><strong>${mp}:</strong> ${porMetodo[mp]}</p>`;
    });

    cont.innerHTML = `
        <p><strong>Fecha:</strong> ${fechaCaja}</p>
        <p><strong>Total caja:</strong> ${total}</p>
        <h3>Por método de pago</h3>
        ${detalle}
    `;
}

// =====================================================
//  SINCRONIZACIÓN CON CENTRAL (ESQUELETO)
// =====================================================

async function sincronizarVentasConCentral() {
    const queue = getSyncQueueVentas();
    if (!queue.length) return;

    const nuevaQueue = queue.map(item => ({
        ...item,
        estado: "simulado"
    }));

    setSyncQueueVentas(nuevaQueue);
}

// =====================================================
//  DATOS DE PRUEBA AMPLIADOS — VENTAS
// =====================================================

function cargarDatosPruebaVentas() {

    const ventas = [
        {
            idVenta: generarIdUnico(),
            idSucursal: ID_SUCURSAL,
            fecha: "2026-01-12T10:00",
            timestamp: ahoraTimestamp(),
            cliente: "Juan Pérez",
            vendedor: "TEST-USER",
            items: [
                { idProducto: "P-001", producto: "Yerba", categoria: "Alimentos", cantidad: 1, precioUnitario: 1500, subtotal: 1500 }
            ],
            descuento: 0,
            recargo: 0,
            total: 1500,
            totalFinal: 1500,
            metodoPago: "efectivo",
            estado: "pagada",
            nroComprobante: "A-0001-00000001",
            version: 1,
            estadoSync: "pendiente"
        },
        {
            idVenta: generarIdUnico(),
            idSucursal: ID_SUCURSAL,
            fecha: "2026-01-12T11:00",
            timestamp: ahoraTimestamp(),
            cliente: "María López",
            vendedor: "TEST-USER",
            items: [
                { idProducto: "P-002", producto: "Azúcar", categoria: "Alimentos", cantidad: 1, precioUnitario: 900, subtotal: 900 },
                { idProducto: "P-004", producto: "Fideos", categoria: "Alimentos", cantidad: 2, precioUnitario: 700, subtotal: 1400 }
            ],
            descuento: 100,
            recargo: 0,
            total: 2300,
            totalFinal: 2200,
            metodoPago: "tarjeta",
            estado: "pagada",
            nroComprobante: "A-0001-00000002",
            version: 1,
            estadoSync: "pendiente"
        },
        {
            idVenta: generarIdUnico(),
            idSucursal: ID_SUCURSAL,
            fecha: "2026-01-11T17:30",
            timestamp: ahoraTimestamp(),
            cliente: "Carlos Gómez",
            vendedor: "TEST-USER",
            items: [
                { idProducto: "P-003", producto: "Detergente", categoria: "Limpieza", cantidad: 1, precioUnitario: 1200, subtotal: 1200 }
            ],
            descuento: 0,
            recargo: 0,
            total: 1200,
            totalFinal: 1200,
            metodoPago: "transferencia",
            estado: "pagada",
            nroComprobante: "A-0001-00000003",
            version: 1,
            estadoSync: "pendiente"
        },
        {
            idVenta: generarIdUnico(),
            idSucursal: ID_SUCURSAL,
            fecha: "2026-01-10T15:00",
            timestamp: ahoraTimestamp(),
            cliente: "Cliente de Prueba",
            vendedor: "TEST-USER",
            items: [
                { idProducto: "P-004", producto: "Fideos", categoria: "Alimentos", cantidad: 3, precioUnitario: 700, subtotal: 2100 }
            ],
            descuento: 0,
            recargo: 200,
            total: 2100,
            totalFinal: 2300,
            metodoPago: "QR",
            estado: "pagada",
            nroComprobante: "A-0001-00000004",
            version: 1,
            estadoSync: "pendiente"
        },
        {
            idVenta: generarIdUnico(),
            idSucursal: ID_SUCURSAL,
            fecha: "2026-01-12T12:00",
            timestamp: ahoraTimestamp(),
            cliente: "Ana Torres",
            vendedor: "TEST-USER",
            items: [
                { idProducto: "P-001", producto: "Yerba", categoria: "Alimentos", cantidad: 1, precioUnitario: 1500, subtotal: 1500 },
                { idProducto: "P-002", producto: "Azúcar", categoria: "Alimentos", cantidad: 1, precioUnitario: 900, subtotal: 900 }
            ],
            descuento: 0,
            recargo: 0,
            total: 2400,
            totalFinal: 2400,
            metodoPago: "efectivo",
            estado: "pendiente",
            nroComprobante: "",
            version: 1,
            estadoSync: "pendiente"
        }
    ];

    lsSet(KEY_VENTAS, ventas);
}

if (lsGet(KEY_VENTAS, []).length === 0) {
    cargarDatosPruebaVentas();
}

// =====================================================
//  INICIALIZACIÓN AUTOMÁTICA
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    initVentasListado();
    initVentasNueva();
    initVentasDetalle();
    initVentasEditar();

    setInterval(sincronizarVentasConCentral, SYNC_INTERVAL_VENTAS);
});
