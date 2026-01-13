// LOGIN
function loginEmpleado() {
    const user = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("password").value.trim();
    const error = document.getElementById("login-error");

    const empleados = [
        { usuario: "admin", password: "1234", rol: "admin" },
        { usuario: "empleado1", password: "abcd", rol: "empleado" }
    ];

    const encontrado = empleados.find(e => e.usuario === user && e.password === pass);

    if (encontrado) {
        localStorage.setItem("usuario", encontrado.usuario);
        localStorage.setItem("rol", encontrado.rol);
        window.location.href = "menu.html";
    } else {
        error.style.display = "block";
    }
}



// VERIFICAR SESIÓN
function verificarSesion() {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) {
        window.location.href = "index.html";
    }
}



// PERMISOS
function aplicarPermisos() {
    const rol = localStorage.getItem("rol");

    if (rol === "empleado") {
        document.querySelectorAll(".solo-admin").forEach(el => {
            el.style.display = "none";
        });
    }
}



// CERRAR SESIÓN
function cerrarSesion() {
    localStorage.clear();
    window.location.href = "index.html";
}



// =========================
// CRUD CLIENTES
// =========================

function obtenerClientes() {
    return JSON.parse(localStorage.getItem("clientes") || "[]");
}

function guardarListaClientes(lista) {
    localStorage.setItem("clientes", JSON.stringify(lista));
}

function guardarCliente() {
    const nombre = document.getElementById("cliente-nombre").value.trim();
    const telefono = document.getElementById("cliente-telefono").value.trim();

    if (!nombre) {
        alert("El nombre es obligatorio");
        return;
    }

    const lista = obtenerClientes();

    lista.push({
        id: Date.now(),
        nombre,
        telefono
    });

    guardarListaClientes(lista);

    document.getElementById("cliente-nombre").value = "";
    document.getElementById("cliente-telefono").value = "";

    mostrarClientes();
}

function mostrarClientes() {
    const lista = obtenerClientes();
    const contenedor = document.getElementById("lista-clientes");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    lista.forEach(cliente => {
        const div = document.createElement("div");
        div.style.margin = "10px 0";
        div.innerHTML = `
            <strong>${cliente.nombre}</strong> - ${cliente.telefono || "Sin teléfono"}
            <button onclick="eliminarCliente(${cliente.id})">Eliminar</button>
        `;
        contenedor.appendChild(div);
    });
}

function eliminarCliente(id) {
    let lista = obtenerClientes();
    lista = lista.filter(c => c.id !== id);
    guardarListaClientes(lista);
    mostrarClientes();
}



// =========================
// CRUD PRODUCTOS
// =========================

function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos") || "[]");
}

function guardarListaProductos(lista) {
    localStorage.setItem("productos", JSON.stringify(lista));
}

function guardarProducto() {
    const nombre = document.getElementById("prod-nombre").value.trim();
    const precio = document.getElementById("prod-precio").value.trim();

    if (!nombre || !precio) {
        alert("Nombre y precio son obligatorios");
        return;
    }

    const lista = obtenerProductos();

    lista.push({
        id: Date.now(),
        nombre,
        precio: Number(precio)
    });

    guardarListaProductos(lista);

    document.getElementById("prod-nombre").value = "";
    document.getElementById("prod-precio").value = "";

    mostrarProductos();
}

function mostrarProductos() {
    const lista = obtenerProductos();
    const contenedor = document.getElementById("lista-productos");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    lista.forEach(prod => {
        const div = document.createElement("div");
        div.style.margin = "10px 0";
        div.innerHTML = `
            <strong>${prod.nombre}</strong> - $${prod.precio}
            <button onclick="eliminarProducto(${prod.id})">Eliminar</button>
        `;
        contenedor.appendChild(div);
    });
}

function eliminarProducto(id) {
    let lista = obtenerProductos();
    lista = lista.filter(p => p.id !== id);
    guardarListaProductos(lista);
    mostrarProductos();
}



// =========================
// VENTAS
// =========================

let itemsVenta = [];

// Cargar clientes en select
function cargarClientesEnVentas() {
    const clientes = obtenerClientes();
    const select = document.getElementById("venta-cliente");

    if (!select) return;

    select.innerHTML = "";

    clientes.forEach(c => {
        const op = document.createElement("option");
        op.value = c.id;
        op.textContent = c.nombre;
        select.appendChild(op);
    });
}

// Cargar productos en select
function cargarProductosEnVentas() {
    const productos = obtenerProductos();
    const select = document.getElementById("venta-producto");

    if (!select) return;

    select.innerHTML = "";

    productos.forEach(p => {
        const op = document.createElement("option");
        op.value = p.id;
        op.textContent = `${p.nombre} ($${p.precio})`;
        select.appendChild(op);
    });
}

// Agregar item a la venta
function agregarItemVenta() {
    const prodId = Number(document.getElementById("venta-producto").value);
    const cantidad = Number(document.getElementById("venta-cantidad").value);

    if (!cantidad || cantidad <= 0) {
        alert("Cantidad inválida");
        return;
    }

    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === prodId);

    itemsVenta.push({
        id: Date.now(),
        producto: prod.nombre,
        precio: prod.precio,
        cantidad,
        subtotal: prod.precio * cantidad
    });

    mostrarItemsVenta();
}

// Mostrar items
function mostrarItemsVenta() {
    const cont = document.getElementById("venta-items");
    const totalSpan = document.getElementById("venta-total");

    cont.innerHTML = "";

    let total = 0;

    itemsVenta.forEach(item => {
        total += item.subtotal;

        const div = document.createElement("div");
        div.style.margin = "8px 0";
        div.innerHTML = `
            ${item.producto} x ${item.cantidad} = $${item.subtotal}
            <button onclick="eliminarItemVenta(${item.id})">X</button>
        `;
        cont.appendChild(div);
    });

    totalSpan.textContent = total;
}

// Eliminar item
function eliminarItemVenta(id) {
    itemsVenta = itemsVenta.filter(i => i.id !== id);
    mostrarItemsVenta();
}

// Guardar venta
function guardarVenta() {
    if (itemsVenta.length === 0) {
        alert("No hay items en la venta");
        return;
    }

    const clienteId = Number(document.getElementById("venta-cliente").value);
    const clientes = obtenerClientes();
    const cliente = clientes.find(c => c.id === clienteId);

    const ventas = JSON.parse(localStorage.getItem("ventas") || "[]");

    ventas.push({
        id: Date.now(),
        cliente: cliente.nombre,
        items: itemsVenta,
        total: itemsVenta.reduce((t, i) => t + i.subtotal, 0)
    });

    localStorage.setItem("ventas", JSON.stringify(ventas));

    itemsVenta = [];
    mostrarItemsVenta();
    mostrarVentas();

    alert("Venta guardada");
}

// Mostrar ventas realizadas
function mostrarVentas() {
    const ventas = JSON.parse(localStorage.getItem("ventas") || "[]");
    const cont = document.getElementById("lista-ventas");

    if (!cont) return;

    cont.innerHTML = "";

    ventas.forEach(v => {
        const div = document.createElement("div");
        div.style.margin = "10px 0";
        div.innerHTML = `
            <strong>Cliente:</strong> ${v.cliente}<br>
            <strong>Total:</strong> $${v.total}<br>
            <strong>Items:</strong>
            <ul>
                ${v.items.map(i => `<li>${i.producto} x ${i.cantidad} = $${i.subtotal}</li>`).join("")}
            </ul>
            <hr>
        `;
        cont.appendChild(div);
    });
}

// =========================
// GESTIÓN DE PRECIOS
// =========================

// Cargar productos en la pantalla de precios
function cargarProductosParaPrecios() {
    const cont = document.getElementById("lista-precios");
    if (!cont) return;

    const productos = obtenerProductos();

    cont.innerHTML = "";

    productos.forEach(prod => {
        const div = document.createElement("div");
        div.style.margin = "10px 0";

        div.innerHTML = `
            <strong>${prod.nombre}</strong><br>
            Precio actual: $${prod.precio}<br>
            <input id="precio-${prod.id}" type="number" value="${prod.precio}" style="margin:5px; width:100px;">
            <button onclick="actualizarPrecio(${prod.id})">Actualizar</button>
            <hr>
        `;

        cont.appendChild(div);
    });
}

// Actualizar precio de un producto
function actualizarPrecio(id) {
    const lista = obtenerProductos();
    const nuevoPrecio = Number(document.getElementById(`precio-${id}`).value);

    if (!nuevoPrecio || nuevoPrecio <= 0) {
        alert("Precio inválido");
        return;
    }

    const prod = lista.find(p => p.id === id);
    prod.precio = nuevoPrecio;

    guardarListaProductos(lista);

    alert("Precio actualizado");

    cargarProductosParaPrecios();
}

// =========================
// REPORTES
// =========================

// Cargar clientes en el select de reportes
function cargarClientesEnReporte() {
    const clientes = obtenerClientes();
    const select = document.getElementById("reporte-cliente");

    if (!select) return;

    select.innerHTML = "";

    clientes.forEach(c => {
        const op = document.createElement("option");
        op.value = c.id;
        op.textContent = c.nombre;
        select.appendChild(op);
    });
}

// Obtener ventas
function obtenerVentas() {
    return JSON.parse(localStorage.getItem("ventas") || "[]");
}



// -------------------------
// REPORTE MENSUAL
// -------------------------
function generarReporteMensual() {
    const mes = Number(document.getElementById("reporte-mes").value);
    const anio = Number(document.getElementById("reporte-anio-mes").value);
    const cont = document.getElementById("resultado-mensual");

    if (!anio) {
        cont.innerHTML = "Debe ingresar un año.";
        return;
    }

    const ventas = obtenerVentas();

    const filtradas = ventas.filter(v => {
        const fecha = new Date(v.id);
        return fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio;
    });

    const total = filtradas.reduce((t, v) => t + v.total, 0);

    cont.innerHTML = `
        <p><strong>Ventas del mes:</strong> ${filtradas.length}</p>
        <p><strong>Total facturado:</strong> $${total}</p>
    `;
}



// -------------------------
// REPORTE ANUAL
// -------------------------
function generarReporteAnual() {
    const anio = Number(document.getElementById("reporte-anio").value);
    const cont = document.getElementById("resultado-anual");

    if (!anio) {
        cont.innerHTML = "Debe ingresar un año.";
        return;
    }

    const ventas = obtenerVentas();

    const filtradas = ventas.filter(v => {
        const fecha = new Date(v.id);
        return fecha.getFullYear() === anio;
    });

    const total = filtradas.reduce((t, v) => t + v.total, 0);

    cont.innerHTML = `
        <p><strong>Ventas del año:</strong> ${filtradas.length}</p>
        <p><strong>Total facturado:</strong> $${total}</p>
    `;
}



// -------------------------
// REPORTE POR CLIENTE
// -------------------------
function generarReporteCliente() {
    const clienteId = Number(document.getElementById("reporte-cliente").value);
    const cont = document.getElementById("resultado-cliente");

    const ventas = obtenerVentas();

    const filtradas = ventas.filter(v => v.items && v.cliente && v.cliente !== "" && v.cliente !== null)
                            .filter(v => {
                                const clientes = obtenerClientes();
                                const cliente = clientes.find(c => c.id === clienteId);
                                return v.cliente === cliente.nombre;
                            });

    const total = filtradas.reduce((t, v) => t + v.total, 0);

    cont.innerHTML = `
        <p><strong>Ventas realizadas:</strong> ${filtradas.length}</p>
        <p><strong>Total facturado:</strong> $${total}</p>
    `;
}

// =========================
// HISTORIAL POR CLIENTE
// =========================

// Cargar clientes en el select
function cargarClientesEnHistorial() {
    const clientes = obtenerClientes();
    const select = document.getElementById("historial-cliente");

    if (!select) return;

    select.innerHTML = "";

    clientes.forEach(c => {
        const op = document.createElement("option");
        op.value = c.id;
        op.textContent = c.nombre;
        select.appendChild(op);
    });
}

// Generar historial
function generarHistorialCliente() {
    const clienteId = Number(document.getElementById("historial-cliente").value);
    const cont = document.getElementById("resultado-historial");

    const clientes = obtenerClientes();
    const cliente = clientes.find(c => c.id === clienteId);

    const ventas = JSON.parse(localStorage.getItem("ventas") || "[]");

    const filtradas = ventas.filter(v => v.cliente === cliente.nombre);

    if (filtradas.length === 0) {
        cont.innerHTML = `<p>No hay ventas registradas para este cliente.</p>`;
        return;
    }

    let totalGeneral = 0;

    let html = `<h4>Cliente: ${cliente.nombre}</h4>`;

    filtradas.forEach(v => {
        const fecha = new Date(v.id);
        const fechaStr = fecha.toLocaleDateString();

        totalGeneral += v.total;

        html += `
            <div style="margin-bottom:10px;">
                <strong>Fecha:</strong> ${fechaStr}<br>
                <strong>Total:</strong> $${v.total}<br>
                <strong>Items:</strong>
                <ul>
                    ${v.items.map(i => `<li>${i.producto} x ${i.cantidad} = $${i.subtotal}</li>`).join("")}
                </ul>
                <hr>
            </div>
        `;
    });

    html += `<h3>Total acumulado: $${totalGeneral}</h3>`;

    cont.innerHTML = html;
}
