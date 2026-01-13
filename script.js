/* ============================================================
   SISTEMA ESPUMIN APP - SCRIPT PRINCIPAL
   Gestión de Clientes, Productos, Ventas, Precios y Reportes
   ============================================================ */


/* ============================================================
   UTILIDADES DE LOCALSTORAGE
   ============================================================ */

function obtenerClientes() {
    return JSON.parse(localStorage.getItem("clientes")) || [];
}

function guardarClientes(lista) {
    localStorage.setItem("clientes", JSON.stringify(lista));
}

function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

function guardarProductos(lista) {
    localStorage.setItem("productos", JSON.stringify(lista));
}

function obtenerVentas() {
    return JSON.parse(localStorage.getItem("ventas")) || [];
}

function guardarVentas(lista) {
    localStorage.setItem("ventas", JSON.stringify(lista));
}


/* ============================================================
   CLIENTES (MEJORADO)
   ============================================================ */

function guardarCliente() {
    let nombre = document.getElementById("cliente-nombre").value.trim();
    let apellido = document.getElementById("cliente-apellido").value.trim();
    const telefono = document.getElementById("cliente-telefono").value.trim();

    if (!nombre || !apellido || telefono.length !== 10) {
        alert("Complete todos los campos correctamente.");
        return;
    }

    // Capitalizar
    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
    apellido = apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase();

    const clientes = obtenerClientes();

    // ❌ Verificar duplicados
    const existe = clientes.some(c =>
        c.nombre === nombre &&
        c.apellido === apellido &&
        c.telefono === telefono
    );

    if (existe) {
        alert("Este cliente ya existe en el sistema.");
        return;
    }

    clientes.push({
        id: Date.now(),
        nombre,
        apellido,
        telefono
    });

    guardarClientes(clientes);

    // Limpiar campos
    document.getElementById("cliente-nombre").value = "";
    document.getElementById("cliente-apellido").value = "";
    document.getElementById("cliente-telefono").value = "";

    mostrarClientes();
    alert("Cliente guardado.");
}

function mostrarClientes(lista = null) {
    const clientes = lista || obtenerClientes();
    const cont = document.getElementById("lista-clientes");

    if (!cont) return;

    if (clientes.length === 0) {
        cont.innerHTML = "<p>No hay clientes cargados.</p>";
        return;
    }

    clientes.sort((a, b) => a.apellido.localeCompare(b.apellido));

    cont.innerHTML = clientes.map(c => `
        <div style="margin-bottom:10px; padding:10px; background:rgba(255,255,255,0.15); border-radius:6px;">
            <strong>${c.apellido}, ${c.nombre}</strong> - ${c.telefono}
            <br>
            <button onclick="editarCliente(${c.id})"
                style="margin-top:5px; padding:5px 10px; background:white; color:#007bff; border:none; border-radius:4px; cursor:pointer;">
                Editar
            </button>
            <button onclick="eliminarCliente(${c.id})"
                style="margin-top:5px; padding:5px 10px; background:white; color:#ff4444; border:none; border-radius:4px; cursor:pointer;">
                Eliminar
            </button>
        </div>
    `).join("");
}

function eliminarCliente(id) {
    // ⚠ Confirmación antes de eliminar
    if (!confirm("¿Seguro que desea eliminar este cliente? Esta acción no se puede deshacer.")) {
        return;
    }

    const clientes = obtenerClientes().filter(c => c.id !== id);
    guardarClientes(clientes);
    mostrarClientes();
}

function editarCliente(id) {
    const clientes = obtenerClientes();
    const c = clientes.find(x => x.id === id);
    if (!c) return;

    let nuevoNombre = prompt("Nuevo nombre:", c.nombre);
    let nuevoApellido = prompt("Nuevo apellido:", c.apellido);
    let nuevoTelefono = prompt("Nuevo teléfono (10 dígitos):", c.telefono);

    if (!nuevoNombre || !nuevoApellido || !nuevoTelefono || nuevoTelefono.length !== 10) {
        alert("Datos inválidos.");
        return;
    }

    // Capitalizar
    nuevoNombre = nuevoNombre.charAt(0).toUpperCase() + nuevoNombre.slice(1).toLowerCase();
    nuevoApellido = nuevoApellido.charAt(0).toUpperCase() + nuevoApellido.slice(1).toLowerCase();

    // ❌ Evitar duplicados al editar
    const existe = clientes.some(x =>
        x.id !== id &&
        x.nombre === nuevoNombre &&
        x.apellido === nuevoApellido &&
        x.telefono === nuevoTelefono
    );

    if (existe) {
        alert("Ya existe otro cliente con esos datos.");
        return;
    }

    c.nombre = nuevoNombre.trim();
    c.apellido = nuevoApellido.trim();
    c.telefono = nuevoTelefono.trim();

    guardarClientes(clientes);
    mostrarClientes();
}

function buscarClientes() {
    const input = document.getElementById("buscar-cliente");
    if (!input) return;

    const texto = input.value.toLowerCase();
    const clientes = obtenerClientes();

    const filtrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(texto) ||
        c.apellido.toLowerCase().includes(texto) ||
        c.telefono.includes(texto)
    );

    mostrarClientes(filtrados);
}



/* ============================================================
   PRODUCTOS
   ============================================================ */

function guardarProducto() {
    const nombre = document.getElementById("prod-nombre").value.trim();
    const precio = parseFloat(document.getElementById("prod-precio").value);
    const unidad = document.getElementById("prod-unidad").value;
    const estado = document.getElementById("prod-estado").value;

    if (!nombre || isNaN(precio)) {
        alert("Complete todos los campos.");
        return;
    }

    const productos = obtenerProductos();

    productos.push({
        id: Date.now(),
        nombre,
        precio,
        unidad,
        estado
    });

    guardarProductos(productos);
    mostrarProductos();
    alert("Producto guardado.");
}

function mostrarProductos() {
    const productos = obtenerProductos();
    const cont = document.getElementById("lista-productos");

    if (!cont) return;

    if (productos.length === 0) {
        cont.innerHTML = "<p>No hay productos cargados.</p>";
        return;
    }

    cont.innerHTML = productos.map(p => `
        <div style="margin-bottom:10px;">
            <strong>${p.nombre}</strong> - $${p.precio} (${p.unidad}) - ${p.estado}
        </div>
    `).join("");
}


/* ============================================================
   PRECIOS (MEJORADO)
   ============================================================ */

function cargarProductosEnPrecios() {
    const productos = obtenerProductos();
    const select = document.getElementById("precio-producto");

    if (!select) return;

    // Ordenar por nombre
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

    select.innerHTML = productos.map(p =>
        `<option value="${p.id}">${p.nombre}</option>`
    ).join("");
}

function mostrarPrecioActual() {
    const id = parseInt(document.getElementById("precio-producto").value);
    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === id);

    if (!prod) return;

    document.getElementById("precio-actual").innerHTML =
        `<strong>Precio actual:</strong> $${prod.precio}`;
}

function guardarPrecio() {
    const id = parseInt(document.getElementById("precio-producto").value);
    const nuevoPrecio = parseFloat(document.getElementById("precio-nuevo").value);

    if (isNaN(nuevoPrecio)) {
        alert("Ingrese un precio válido.");
        return;
    }

    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === id);

    if (!prod) return;

    prod.precio = nuevoPrecio;

    guardarProductos(productos);
    mostrarPrecios();
    mostrarPrecioActual();
    alert("Precio actualizado.");
}

function mostrarPrecios(lista = null) {
    const productos = lista || obtenerProductos();
    const cont = document.getElementById("lista-precios");

    if (!cont) return;

    if (productos.length === 0) {
        cont.innerHTML = "<p>No hay productos cargados.</p>";
        return;
    }

    // Ordenar por nombre
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

    cont.innerHTML = productos.map(p => `
        <div style="margin-bottom:10px; padding:10px; background:rgba(255,255,255,0.15); border-radius:6px;">
            <strong>${p.nombre}</strong> - $${p.precio} (${p.unidad}) - ${p.estado}
            <br>
            <button onclick="editarProducto(${p.id})"
                style="margin-top:5px; padding:5px 10px; background:white; color:#007bff; border:none; border-radius:4px; cursor:pointer;">
                Editar
            </button>
        </div>
    `).join("");
}

function buscarPrecios() {
    const texto = document.getElementById("buscar-precio").value.toLowerCase();
    const productos = obtenerProductos();

    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.unidad.toLowerCase().includes(texto) ||
        p.estado.toLowerCase().includes(texto)
    );

    mostrarPrecios(filtrados);
}


/* ============================================================
   VENTAS
   ============================================================ */

function cargarClientesEnVentas() {
    const clientes = obtenerClientes();
    const select = document.getElementById("venta-cliente");

    if (!select) return;

    select.innerHTML = clientes.map(c =>
        `<option value="${c.id}">${c.apellido}, ${c.nombre}</option>`
    ).join("");
}

function cargarProductosEnVentas() {
    const productos = obtenerProductos().filter(p => p.estado === "Activo");
    const select = document.getElementById("venta-producto");

    if (!select) return;

    select.innerHTML = productos.map(p =>
        `<option value="${p.id}">${p.nombre} - $${p.precio}</option>`
    ).join("");
}

let itemsVenta = [];

function agregarItemVenta() {
    const idProd = parseInt(document.getElementById("venta-producto").value);
    const cantidad = parseFloat(document.getElementById("venta-cantidad").value);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Cantidad inválida.");
        return;
    }

    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === idProd);

    if (!prod) {
        alert("Producto inválido.");
        return;
    }

    itemsVenta.push({
        producto: prod.nombre,
        precio: prod.precio,
        cantidad,
        subtotal: prod.precio * cantidad
    });

    mostrarItemsVenta();
}

function mostrarItemsVenta() {
    const cont = document.getElementById("items-venta");

    if (!cont) return;

    if (itemsVenta.length === 0) {
        cont.innerHTML = "<p>No hay items cargados.</p>";
        return;
    }

    cont.innerHTML = itemsVenta.map(i => `
        <div>
            ${i.producto} - ${i.cantidad} x $${i.precio} = $${i.subtotal}
        </div>
    `).join("");
}

function confirmarVenta() {
    if (itemsVenta.length === 0) {
        alert("No hay items en la venta.");
        return;
    }

    const idCliente = parseInt(document.getElementById("venta-cliente").value);
    const clientes = obtenerClientes();
    const cliente = clientes.find(c => c.id === idCliente);

    if (!cliente) {
        alert("Cliente inválido.");
        return;
    }

    const total = itemsVenta.reduce((t, i) => t + i.subtotal, 0);

    const ventas = obtenerVentas();

    ventas.push({
        id: Date.now(),
        cliente: `${cliente.apellido}, ${cliente.nombre}`,
        items: itemsVenta,
        total
    });

    guardarVentas(ventas);

    itemsVenta = [];
    mostrarItemsVenta();

    alert("Venta registrada.");
}


/* ============================================================
   HISTORIAL (MEJORADO)
   ============================================================ */

function cargarClientesEnHistorial() {
    const clientes = obtenerClientes();
    const select = document.getElementById("historial-cliente");

    if (!select) return;

    clientes.sort((a, b) => a.apellido.localeCompare(b.apellido));

    select.innerHTML = clientes.map(c =>
        `<option value="${c.id}">${c.apellido}, ${c.nombre}</option>`
    ).join("");
}

function mostrarHistorialCliente() {
    const idCliente = parseInt(document.getElementById("historial-cliente").value);
    const clientes = obtenerClientes();
    const cliente = clientes.find(c => c.id === idCliente);

    const ventas = obtenerVentas().filter(v => v.cliente === `${cliente.apellido}, ${cliente.nombre}`);

    const cont = document.getElementById("lista-historial");

    if (!cont) return;

    if (ventas.length === 0) {
        cont.innerHTML = "<p>No hay ventas para este cliente.</p>";
        return;
    }

    // Ordenar por fecha descendente
    ventas.sort((a, b) => b.id - a.id);

    cont.innerHTML = ventas.map(v => `
        <div style="margin-bottom:15px; padding:10px; background:rgba(255,255,255,0.15); border-radius:6px;">
            <strong>Fecha:</strong> ${new Date(v.id).toLocaleDateString()}<br>
            <strong>Total:</strong> $${v.total}<br>
            <strong>Items:</strong>
            <ul>
                ${v.items.map(i => `
                    <li>${i.producto} — ${i.cantidad} x $${i.precio} = $${i.subtotal}</li>
                `).join("")}
            </ul>
        </div>
    `).join("");
}

function buscarEnHistorial() {
    const texto = document.getElementById("buscar-historial").value.toLowerCase();
    const idCliente = parseInt(document.getElementById("historial-cliente").value);

    const clientes = obtenerClientes();
    const cliente = clientes.find(c => c.id === idCliente);

    const ventas = obtenerVentas().filter(v => v.cliente === `${cliente.apellido}, ${cliente.nombre}`);

    const filtradas = ventas.filter(v =>
        v.items.some(i => i.producto.toLowerCase().includes(texto))
    );

    mostrarHistorialCliente(filtradas);
}

function exportarHistorial() {
    const cont = document.getElementById("lista-historial").innerText;

    if (!cont.trim()) {
        alert("No hay historial para exportar.");
        return;
    }

    navigator.clipboard.writeText(cont);
    alert("Historial copiado al portapapeles.");
}



/* ============================================================
   REPORTES
   ============================================================ */

function generarReporteMensual() {
    const mes = parseInt(document.getElementById("reporte-mes").value);
    const anio = parseInt(document.getElementById("reporte-anio-mes").value);

    const ventas = obtenerVentas().filter(v => {
        const fecha = new Date(v.id);
        return fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio;
    });

    const total = ventas.reduce((t, v) => t + v.total, 0);

    document.getElementById("resultado-mensual").innerHTML =
        `<p>Total facturado: $${total}</p>`;
}

function generarReporteAnual() {
    const anio = parseInt(document.getElementById("reporte-anio").value);

    const ventas = obtenerVentas().filter(v => {
        const fecha = new Date(v.id);
        return fecha.getFullYear() === anio;
    });

    const total = ventas.reduce((t, v) => t + v.total, 0);

    document.getElementById("resultado-anual").innerHTML =
        `<p>Total facturado: $${total}</p>`;
}

function generarReporteCliente() {
    const idCliente = parseInt(document.getElementById("reporte-cliente").value);
    const clientes = obtenerClientes();
    const cliente = clientes.find(c => c.id === idCliente);

    const ventas = obtenerVentas().filter(v => v.cliente === `${cliente.apellido}, ${cliente.nombre}`);

    const total = ventas.reduce((t, v) => t + v.total, 0);

    document.getElementById("resultado-cliente").innerHTML =
        `<p>Total facturado por ${cliente.apellido}, ${cliente.nombre}: $${total}</p>`;
}



