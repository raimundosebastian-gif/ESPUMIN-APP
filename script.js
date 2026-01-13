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

if (!localStorage.getItem("clientes")) {
    const clientesEjemplo = [
        { id: Date.now(), nombre: "Juan Pérez", telefono: "11-4567-8901" },
        { id: Date.now() + 1, nombre: "María López", telefono: "11-7890-1234" }
    ];
    localStorage.setItem("clientes", JSON.stringify(clientesEjemplo));
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

    const filtradas = ventas.filter(v => v.cliente === cliente.nombre);

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
