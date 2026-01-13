// =========================
// LOGIN Y SESIÓN
// =========================

const empleados = [
    { usuario: "admin", password: "1234", rol: "admin" },
    { usuario: "empleado1", password: "abcd", rol: "empleado" },
    { usuario: "EU", password: "villatita", rol: "admin" }
];

function iniciarSesion() {
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    const encontrado = empleados.find(e => e.usuario === usuario && e.password === password);

    if (!encontrado) {
        alert("Usuario o contraseña incorrectos");
        return;
    }

    localStorage.setItem("usuario", encontrado.usuario);
    localStorage.setItem("rol", encontrado.rol);

    location.href = "menu.html";
}

function verificarSesion() {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) location.href = "index.html";
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    location.href = "index.html";
}

function aplicarPermisos() {
    const rol = localStorage.getItem("rol");
    const adminElements = document.querySelectorAll(".solo-admin");
    const empleadoElements = document.querySelectorAll(".solo-empleado");

    if (rol === "admin") {
        adminElements.forEach(e => e.style.display = "block");
        empleadoElements.forEach(e => e.style.display = "none");
    } else {
        adminElements.forEach(e => e.style.display = "none");
        empleadoElements.forEach(e => e.style.display = "block");
    }
}



// =========================
// CLIENTES - DATOS INICIALES
// =========================

let clientesGuardados = JSON.parse(localStorage.getItem("clientes") || "[]");

if (clientesGuardados.length === 0) {
    const clientesEjemplo = [
        { id: Date.now(), nombre: "Juan", apellido: "Pérez", telefono: "1145678901" },
        { id: Date.now() + 1, nombre: "María", apellido: "López", telefono: "1178901234" }
    ];

    localStorage.setItem("clientes", JSON.stringify(clientesEjemplo));
}



// =========================
// CRUD CLIENTES
// =========================

function obtenerClientes() {
    const lista = JSON.parse(localStorage.getItem("clientes") || "[]");

    return lista.sort((a, b) => {
        const ap = a.apellido.localeCompare(b.apellido);
        return ap !== 0 ? ap : a.nombre.localeCompare(b.nombre);
    });
}

function guardarListaClientes(lista) {
    localStorage.setItem("clientes", JSON.stringify(lista));
}

function normalizarTexto(txt) {
    txt = txt.trim().toLowerCase();
    return txt.charAt(0).toUpperCase() + txt.slice(1);
}

function guardarCliente() {
    const nombre = normalizarTexto(document.getElementById("cliente-nombre").value);
    const apellido = normalizarTexto(document.getElementById("cliente-apellido").value);
    const telefono = document.getElementById("cliente-telefono").value.trim();

    if (!nombre || !apellido) {
        alert("Nombre y apellido son obligatorios");
        return;
    }

    if (!/^\d{10}$/.test(telefono)) {
        alert("El teléfono debe tener exactamente 10 dígitos numéricos");
        return;
    }

    const lista = obtenerClientes();
    const editId = Number(localStorage.getItem("clienteEditando"));

    const telefonoRepetido = lista.some(c => c.telefono === telefono && c.id !== editId);
    if (telefonoRepetido) {
        alert("El teléfono ya está registrado en otro cliente");
        return;
    }

    if (editId) {
        const cliente = lista.find(c => c.id === editId);
        cliente.nombre = nombre;
        cliente.apellido = apellido;
        cliente.telefono = telefono;

        localStorage.removeItem("clienteEditando");
    } else {
        lista.push({
            id: Date.now(),
            nombre,
            apellido,
            telefono
        });
    }

    guardarListaClientes(lista);

    document.getElementById("cliente-nombre").value = "";
    document.getElementById("cliente-apellido").value = "";
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
            <strong>${cliente.apellido}, ${cliente.nombre}</strong> - ${cliente.telefono}

            <button onclick="editarCliente(${cliente.id})"
                style="margin-left:10px; padding:5px 10px; background:white; color:#0275d8; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">
                EDITAR
            </button>

            <button onclick="eliminarCliente(${cliente.id})"
                style="margin-left:10px; padding:5px 10px; background:white; color:#d9534f; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">
                ELIMINAR
            </button>
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

function editarCliente(id) {
    const lista = obtenerClientes();
    const cliente = lista.find(c => c.id === id);

    if (!cliente) return;

    document.getElementById("cliente-nombre").value = cliente.nombre;
    document.getElementById("cliente-apellido").value = cliente.apellido;
    document.getElementById("cliente-telefono").value = cliente.telefono;

    localStorage.setItem("clienteEditando", id);
}



// =========================
// REINICIAR CLIENTES
// =========================

function reiniciarClientes() {
    if (!confirm("¿Seguro que querés borrar todos los clientes y cargar los de ejemplo?")) return;

    const clientesEjemplo = [
        { id: Date.now(), nombre: "Juan", apellido: "Pérez", telefono: "1145678901" },
        { id: Date.now() + 1, nombre: "María", apellido: "López", telefono: "1178901234" }
    ];

    localStorage.setItem("clientes", JSON.stringify(clientesEjemplo));
    localStorage.removeItem("clienteEditando");

    mostrarClientes();

    alert("Clientes reiniciados correctamente.");
}



// =========================
// PRODUCTOS
// =========================

function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos") || "[]");
}



// =========================
// VENTAS
// =========================

function obtenerVentas() {
    return JSON.parse(localStorage.getItem("ventas") || "[]");
}

function cargarClientesEnVentas() {
    const clientes = obtenerClientes();
    const select = document.getElementById("venta-cliente");
    if (!select) return;

    select.innerHTML = clientes.map(c =>
        `<option value="${c.apellido}, ${c.nombre}">${c.apellido}, ${c.nombre}</option>`
    ).join("");
}

function cargarProductosEnVentas() {
    const productos = obtenerProductos();
    const select = document.getElementById("venta-producto");
    if (!select) return;

    select.innerHTML = productos.map(p =>
        `<option value="${p.nombre}">${p.nombre}</option>`
    ).join("");
}

let itemsVenta = [];

function agregarItemVenta() {
    const producto = document.getElementById("venta-producto").value;
    const cantidad = Number(document.getElementById("venta-cantidad").value);

    if (!producto || cantidad <= 0) {
        alert("Debe seleccionar un producto y una cantidad válida.");
        return;
    }

    const productos = obtenerProductos();
    const prod = productos.find(p => p.nombre === producto);

    if (!prod) {
        alert("Producto no encontrado.");
        return;
    }

    const subtotal = prod.precio * cantidad;

    itemsVenta.push({
        producto,
        cantidad,
        subtotal
    });

    mostrarItemsVenta();
}

function mostrarItemsVenta() {
    const cont = document.getElementById("items-venta");
    if (!cont) return;

    cont.innerHTML = itemsVenta.map(i =>
        `<p>${i.producto} x ${i.cantidad} = $${i.subtotal}</p>`
    ).join("");
}

function confirmarVenta() {
    if (itemsVenta.length === 0) {
        alert("Debe agregar al menos un item.");
        return;
    }

    const cliente = document.getElementById("venta-cliente").value;

    const total = itemsVenta.reduce((t, i) => t + i.subtotal, 0);

    const ventas = obtenerVentas();

    ventas.push({
        id: Date.now(),
        cliente,
        items: itemsVenta,
        total
    });

    localStorage.setItem("ventas", JSON.stringify(ventas));

    itemsVenta = [];
    mostrarItemsVenta();

    alert("Venta registrada correctamente.");
}



// =========================
// REPORTES
// =========================

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

function generarReporteCliente() {
    const clienteId = Number(document.getElementById("reporte-cliente").value);
    const cont = document.getElementById("resultado-cliente");

    const clientes = obtenerClientes();
    const cliente = clientes.find(c => c.id === clienteId);

    const ventas = obtenerVentas();

    const filtradas = ventas.filter(v => v.cliente === `${cliente.apellido}, ${cliente.nombre}`);

    const total = filtradas.reduce((t, v) => t + v.total, 0);

    cont.innerHTML = `
        <p><strong>Ventas realizadas:</strong> ${filtradas.length}</p>
        <p><strong>Total facturado:</strong> $${total}</p>
    `;
}



// =========================
// HISTORIAL POR CLIENTE
// =========================

function generarHistorialCliente() {
    const clienteId = Number(document.getElementById("historial-cliente").value);
    const cont = document.getElementById("resultado-historial");

    const clientes = obtenerClientes();
    const cliente = clientes.find(c => c.id === clienteId);

    const ventas = obtenerVentas();

    const filtradas = ventas.filter(v => v.cliente === `${cliente.apellido}, ${cliente.nombre}`);

    if (filtradas.length === 0) {
        cont.innerHTML = `<p>No hay ventas registradas para este cliente.</p>`;
        return;
    }

    let totalGeneral = 0;

    let html = `<h4>Cliente: ${cliente.apellido}, ${cliente.nombre}</h4>`;

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



// =========================
// DASHBOARD ADMIN
// =========================

function cargarDashboard() {
    const clientes = obtenerClientes();
    const productos = obtenerProductos();
    const ventas = obtenerVentas();

    const totalFacturado = ventas.reduce((t, v) => t + v.total, 0);

    const c = id => document.getElementById(id);

    if (c("dash-clientes")) c("dash-clientes").textContent = clientes.length;
    if (c("dash-productos")) c("dash-productos").textContent = productos.length;
    if (c("dash-ventas")) c("dash-ventas").textContent = ventas.length;
    if (c("dash-facturado")) c("dash-facturado").textContent = totalFacturado;
}
