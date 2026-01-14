/* ============================================================
   SISTEMA ESPUMIN APP - SCRIPT PRINCIPAL
   Gestión de Clientes, Productos, Ventas, Precios y Reportes
   ============================================================ */


/* ============================================================
   NAVEGACIÓN CENTRALIZADA ENTRE MÓDULOS
   ============================================================ */

function irAMenu() { location.href = "menu.html"; }
function irAClientes() { location.href = "clientes.html"; }
function irAProductos() { location.href = "productos.html"; }
function irAUsuarios() { location.href = "usuarios.html"; }
function irAPrecios() { location.href = "precios.html"; }
function irAVentas() { location.href = "ventas.html"; }
function irAReportes() { location.href = "reportes.html"; }


/* ============================================================
   UTILIDADES DE LOCALSTORAGE
   ============================================================ */

function obtenerClientes() { return JSON.parse(localStorage.getItem("clientes")) || []; }
function guardarClientes(lista) { localStorage.setItem("clientes", JSON.stringify(lista)); }

function obtenerProductos() { return JSON.parse(localStorage.getItem("productos")) || []; }
function guardarProductos(lista) { localStorage.setItem("productos", JSON.stringify(lista)); }

function obtenerVentas() { return JSON.parse(localStorage.getItem("ventas")) || []; }
function guardarVentas(lista) { localStorage.setItem("ventas", JSON.stringify(lista)); }

function obtenerUsuarios() { return JSON.parse(localStorage.getItem("usuarios")) || []; }
function guardarUsuarios(lista) { localStorage.setItem("usuarios", JSON.stringify(lista)); }


/* ============================================================
   CLIENTES
   ============================================================ */

function guardarCliente() {
    let nombre = document.getElementById("cliente-nombre").value.trim();
    let apellido = document.getElementById("cliente-apellido").value.trim();
    const telefono = document.getElementById("cliente-telefono").value.trim();

    if (!nombre || !apellido || telefono.length !== 10) {
        alert("Complete todos los campos correctamente.");
        return;
    }

    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
    apellido = apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase();

    const clientes = obtenerClientes();

    const existe = clientes.some(c =>
        c.nombre === nombre &&
        c.apellido === apellido &&
        c.telefono === telefono
    );

    if (existe) {
        alert("Este cliente ya existe.");
        return;
    }

    clientes.push({
        id: Date.now(),
        nombre,
        apellido,
        telefono
    });

    guardarClientes(clientes);

    document.getElementById("cliente-nombre").value = "";
    document.getElementById("cliente-apellido").value = "";
    document.getElementById("cliente-telefono").value = "";

    mostrarClientes();
}

function mostrarClientes(lista = null) {
    const clientes = lista || obtenerClientes();
    const rol = localStorage.getItem("userRole");
    const cont = document.getElementById("lista-clientes");

    if (!cont) return;

    if (clientes.length === 0) {
        cont.innerHTML = "<p>No hay clientes cargados.</p>";
        return;
    }

    clientes.sort((a, b) => a.apellido.localeCompare(b.apellido));

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Apellido</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    clientes.forEach(c => {
        html += `
            <tr>
                <td>${c.apellido}</td>
                <td>${c.nombre}</td>
                <td>${c.telefono}</td>
                <td>
                    <button onclick="editarCliente(${c.id})">Editar</button>
                    ${rol === "admin" ? `<button onclick="eliminarCliente(${c.id})">Eliminar</button>` : ""}
                </td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    cont.innerHTML = html;
}

function buscarClientes() {
    const texto = document.getElementById("buscar-cliente").value.toLowerCase();
    const clientes = obtenerClientes();

    const filtrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(texto) ||
        c.apellido.toLowerCase().includes(texto) ||
        c.telefono.includes(texto)
    );

    mostrarClientes(filtrados);
}

function eliminarCliente(id) {
    if (!confirm("¿Eliminar cliente?")) return;

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

    nuevoNombre = nuevoNombre.charAt(0).toUpperCase() + nuevoNombre.slice(1).toLowerCase();
    nuevoApellido = nuevoApellido.charAt(0).toUpperCase() + nuevoApellido.slice(1).toLowerCase();

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

    c.nombre = nuevoNombre;
    c.apellido = nuevoApellido;
    c.telefono = nuevoTelefono;

    guardarClientes(clientes);
    mostrarClientes();
}


/* ============================================================
   PRODUCTOS
   ============================================================ */

function guardarProducto() {
    let nombre = document.getElementById("prod-nombre").value.trim();
    const precio = parseFloat(document.getElementById("prod-precio").value);
    const categoria = document.getElementById("prod-categoria").value;
    const estado = document.getElementById("prod-estado").value;

    if (!nombre || isNaN(precio) || !categoria) {
        alert("Complete todos los campos.");
        return;
    }

    nombre = nombre.toUpperCase();

    const productos = obtenerProductos();

    if (productos.some(p => p.nombre === nombre)) {
        alert("Este producto ya existe.");
        return;
    }

    productos.push({
        id: Date.now(),
        nombre,
        precio,
        categoria,
        estado
    });

    guardarProductos(productos);

    document.getElementById("prod-nombre").value = "";
    document.getElementById("prod-precio").value = "";

    mostrarProductos();
}

function mostrarProductos(lista = null) {
    const productos = lista || obtenerProductos();
    const cont = document.getElementById("lista-productos");

    if (!cont) return;

    if (productos.length === 0) {
        cont.innerHTML = "<p>No hay productos cargados.</p>";
        return;
    }

    const ordenCategorias = ["Lavandería", "Tintorería", "Acolchados", "Otros"];

    productos.sort((a, b) => {
        const idxA = ordenCategorias.indexOf(a.categoria);
        const idxB = ordenCategorias.indexOf(b.categoria);
        if (idxA !== idxB) return idxA - idxB;
        return a.nombre.localeCompare(b.nombre);
    });

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    productos.forEach(p => {
        html += `
            <tr>
                <td>${p.categoria}</td>
                <td>${p.nombre}</td>
                <td>$${p.precio}</td>
                <td>${p.estado}</td>
                <td>
                    <button onclick="editarProducto(${p.id})">Editar</button>
                    <button onclick="eliminarProducto(${p.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    cont.innerHTML = html;
}

function buscarProductos() {
    const texto = document.getElementById("buscar-producto").value.toLowerCase();
    const productos = obtenerProductos();

    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.categoria.toLowerCase().includes(texto) ||
        p.estado.toLowerCase().includes(texto)
    );

    mostrarProductos(filtrados);
}

function eliminarProducto(id) {
    if (!confirm("¿Eliminar producto?")) return;

    const productos = obtenerProductos().filter(p => p.id !== id);
    guardarProductos(productos);
    mostrarProductos();
}

function editarProducto(id) {
    const productos = obtenerProductos();
    const p = productos.find(x => x.id === id);
    if (!p) return;

    let nuevoNombre = prompt("Nuevo nombre:", p.nombre);
    let nuevoPrecio = prompt("Nuevo precio:", p.precio);
    let nuevaCategoria = prompt("Categoría:", p.categoria);
    let nuevoEstado = prompt("Estado:", p.estado);

    if (!nuevoNombre || !nuevoPrecio || !nuevaCategoria || !nuevoEstado) {
        alert("Datos inválidos.");
        return;
    }

    nuevoNombre = nuevoNombre.toUpperCase();

    if (productos.some(x => x.id !== id && x.nombre === nuevoNombre)) {
        alert("Ya existe otro producto con ese nombre.");
        return;
    }

    p.nombre = nuevoNombre;
    p.precio = parseFloat(nuevoPrecio);
    p.categoria = nuevaCategoria;
    p.estado = nuevoEstado;

    guardarProductos(productos);
    mostrarProductos();
}


/* ============================================================
   USUARIOS
   ============================================================ */

function guardarUsuario() {
    const nombre = document.getElementById("user-nombre").value.trim();
    const usuario = document.getElementById("user-usuario").value.trim();
    const pass = document.getElementById("user-pass").value.trim();
    const rol = document.getElementById("user-rol").value;
    const estado = document.getElementById("user-estado").value;

    if (!nombre || !usuario || !pass) {
        alert("Complete todos los campos.");
        return;
    }

    const usuarios = obtenerUsuarios();

    if (usuarios.some(u => u.usuario === usuario)) {
        alert("Ya existe un usuario con ese nombre.");
        return;
    }

    usuarios.push({
        id: Date.now(),
        nombre,
        usuario,
        pass,
        rol,
        estado
    });

    guardarUsuarios(usuarios);

    document.getElementById("user-nombre").value = "";
    document.getElementById("user-usuario").value = "";
    document.getElementById("user-pass").value = "";

    mostrarUsuarios();
}

function mostrarUsuarios(lista = null) {
    const usuarios = lista || obtenerUsuarios();
    const cont = document.getElementById("lista-usuarios");

    if (!cont) return;

    if (usuarios.length === 0) {
        cont.innerHTML = "<p>No hay usuarios cargados.</p>";
        return;
    }

    usuarios.sort((a, b) => a.nombre.localeCompare(b.nombre));

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    usuarios.forEach(u => {
        html += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.usuario}</td>
                <td>${u.rol}</td>
                <td>${u.estado}</td>
                <td>
                    <button onclick="editarUsuario(${u.id})">Editar</button>
                    <button onclick="eliminarUsuario(${u.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    cont.innerHTML = html;
}

function buscarUsuarios() {
    const texto = document.getElementById("buscar-usuario").value.toLowerCase();
    const usuarios = obtenerUsuarios();

    const filtrados = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(texto) ||
        u.usuario.toLowerCase().includes(texto) ||
        u.rol.toLowerCase().includes(texto) ||
        u.estado.toLowerCase().includes(texto)
    );

    mostrarUsuarios(filtrados);
}

function eliminarUsuario(id) {
    if (!confirm("¿Eliminar usuario?")) return;

    const usuarios = obtenerUsuarios().filter(u => u.id !== id);
    guardarUsuarios(usuarios);
    mostrarUsuarios();
}

function editarUsuario(id) {
    const usuarios = obtenerUsuarios();
    const u = usuarios.find(x => x.id === id);
    if (!u) return;

    let nuevoNombre = prompt("Nuevo nombre:", u.nombre);
    let nuevoUsuario = prompt("Nuevo usuario:", u.usuario);
    let nuevoPass = prompt("Nueva contraseña:", u.pass);
    let nuevoRol = prompt("Rol:", u.rol);
    let nuevoEstado = prompt("Estado:", u.estado);

    if (!nuevoNombre || !nuevoUsuario || !nuevoPass || !nuevoRol || !nuevoEstado) {
        alert("Datos inválidos.");
        return;
    }

    if (usuarios.some(x => x.id !== id && x.usuario === nuevoUsuario)) {
        alert("Ya existe otro usuario con ese nombre.");
        return;
    }

    u.nombre = nuevoNombre;
    u.usuario = nuevoUsuario;
    u.pass = nuevoPass;
    u.rol = nuevoRol;
    u.estado = nuevoEstado;

    guardarUsuarios(usuarios);
    mostrarUsuarios();
}


/* ============================================================
   PRECIOS
   ============================================================ */

function cargarProductosEnPrecios() {
    const productos = obtenerProductos();
    const select = document.getElementById("precio-producto");

    if (!select) return;

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

    if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
        alert("Ingrese un precio válido.");
        return;
    }

    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === id);

    if (!prod) return;

    prod.precio = nuevoPrecio;

    guardarProductos(productos);
    mostrarPrecioActual();

    alert("Precio actualizado.");
}

/* ============================================================
   VENTAS — REGISTRO Y LISTADO
   ============================================================ */

function cargarClientesEnVentas() {
    const clientes = obtenerClientes();
    const select = document.getElementById("venta-cliente");

    if (!select) return;

    select.innerHTML = `<option value="">Seleccione un cliente</option>` +
        clientes
            .sort((a, b) => a.apellido.localeCompare(b.apellido))
            .map(c => `<option value="${c.id}">${c.apellido}, ${c.nombre}</option>`)
            .join("");
}

function cargarProductosEnVentas() {
    const productos = obtenerProductos();
    const select = document.getElementById("venta-producto");

    if (!select) return;

    select.innerHTML = `<option value="">Seleccione un producto</option>` +
        productos
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
            .map(p => `<option value="${p.id}">${p.nombre}</option>`)
            .join("");
}

function actualizarPrecioVenta() {
    const id = parseInt(document.getElementById("venta-producto").value);
    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === id);

    const cont = document.getElementById("precio-unitario");

    if (!prod) {
        cont.innerHTML = "";
        return;
    }

    cont.innerHTML = `Precio unitario: <strong>$${prod.precio}</strong>`;
}

function guardarVenta() {
    const clienteId = parseInt(document.getElementById("venta-cliente").value);
    const productoId = parseInt(document.getElementById("venta-producto").value);
    const cantidad = parseInt(document.getElementById("venta-cantidad").value);

    if (!clienteId || !productoId || isNaN(cantidad) || cantidad <= 0) {
        alert("Complete todos los campos correctamente.");
        return;
    }

    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === productoId);

    if (!prod) {
        alert("Producto inválido.");
        return;
    }

    const total = prod.precio * cantidad;

    const ventas = obtenerVentas();

    ventas.push({
        id: Date.now(),
        clienteId,
        productoId,
        cantidad,
        precioUnitario: prod.precio,
        total,
        usuario: localStorage.getItem("loggedUser") || "desconocido",
        fecha: new Date().toLocaleString()
    });

    guardarVentas(ventas);

    document.getElementById("venta-cantidad").value = "";
    document.getElementById("venta-cliente").value = "";
    document.getElementById("venta-producto").value = "";
    actualizarPrecioVenta();
    mostrarVentas();

    alert("Venta registrada.");
}

function mostrarVentas() {
    const ventas = obtenerVentas();
    const clientes = obtenerClientes();
    const productos = obtenerProductos();
    const cont = document.getElementById("lista-ventas");

    if (!cont) return;

    if (ventas.length === 0) {
        cont.innerHTML = "<p>No hay ventas registradas.</p>";
        return;
    }

    ventas.sort((a, b) => b.id - a.id);

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Unitario</th>
                    <th>Total</th>
                    <th>Usuario</th>
                </tr>
            </thead>
            <tbody>
    `;

    ventas.forEach(v => {
        const cliente = clientes.find(c => c.id === v.clienteId);
        const producto = productos.find(p => p.id === v.productoId);

        html += `
            <tr>
                <td>${v.fecha}</td>
                <td>${cliente ? cliente.apellido + ", " + cliente.nombre : "—"}</td>
                <td>${producto ? producto.nombre : "—"}</td>
                <td>${v.cantidad}</td>
                <td>$${v.precioUnitario}</td>
                <td><strong>$${v.total}</strong></td>
                <td>${v.usuario}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    cont.innerHTML = html;
}


/* ============================================================
   REPORTES BÁSICOS — VENTAS, CLIENTES Y PRODUCTOS
   ============================================================ */

function generarReporteVentas() {
    const ventas = obtenerVentas();
    const cont = document.getElementById("reporte-ventas");

    if (!cont) return;

    if (ventas.length === 0) {
        cont.innerHTML = "<p>No hay ventas registradas.</p>";
        return;
    }

    const total = ventas.reduce((sum, v) => sum + v.total, 0);

    cont.innerHTML = `
        <table>
            <thead>
                <tr><th>Total Facturado</th></tr>
            </thead>
            <tbody>
                <tr><td><strong>$${total.toLocaleString("es-AR")}</strong></td></tr>
            </tbody>
        </table>
    `;
}

function generarReporteClientes() {
    const ventas = obtenerVentas();
    const clientes = obtenerClientes();
    const cont = document.getElementById("reporte-clientes");

    if (!cont) return;

    if (ventas.length === 0) {
        cont.innerHTML = "<p>No hay ventas registradas.</p>";
        return;
    }

    const resumen = {};

    ventas.forEach(v => {
        if (!resumen[v.clienteId]) resumen[v.clienteId] = 0;
        resumen[v.clienteId] += v.total;
    });

    const lista = Object.entries(resumen)
        .map(([id, total]) => {
            const c = clientes.find(x => x.id == id);
            return {
                nombre: c ? `${c.apellido}, ${c.nombre}` : "Cliente desconocido",
                total
            };
        })
        .sort((a, b) => b.total - a.total);

    let html = `
        <table>
            <thead>
                <tr><th>Cliente</th><th>Total Gastado</th></tr>
            </thead>
            <tbody>
    `;

    lista.forEach(r => {
        html += `
            <tr>
                <td>${r.nombre}</td>
                <td><strong>$${r.total.toLocaleString("es-AR")}</strong></td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    cont.innerHTML = html;
}

function generarReporteProductos() {
    const ventas = obtenerVentas();
    const productos = obtenerProductos();
    const cont = document.getElementById("reporte-productos");

    if (!cont) return;

    if (ventas.length === 0) {
        cont.innerHTML = "<p>No hay ventas registradas.</p>";
        return;
    }

    const resumen = {};

    ventas.forEach(v => {
        if (!resumen[v.productoId]) resumen[v.productoId] = 0;
        resumen[v.productoId] += v.total;
    });

    const lista = Object.entries(resumen)
        .map(([id, total]) => {
            const p = productos.find(x => x.id == id);
            return {
                nombre: p ? p.nombre : "Producto desconocido",
                total
            };
        })
        .sort((a, b) => b.total - a.total);

    let html = `
        <table>
            <thead>
                <tr><th>Producto</th><th>Total Vendido</th></tr>
            </thead>
            <tbody>
    `;

    lista.forEach(r => {
        html += `
            <tr>
                <td>${r.nombre}</td>
                <td><strong>$${r.total.toLocaleString("es-AR")}</strong></td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    cont.innerHTML = html;
}

/* ============================================================
   PARSEAR FECHA dd/mm/aaaa → Date válido
   ============================================================ */
function parsearFecha(fechaStr) {
    // fechaStr viene como "dd/mm/aaaa"
    const partes = fechaStr.split("/");
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // JS usa 0-11
    const anio = parseInt(partes[2], 10);
    return new Date(anio, mes, dia);
}

/* ============================================================
   REPORTES AVANZADOS
   ============================================================ */

/* ------------------------------
   REPORTE MENSUAL
   ------------------------------ */
function generarReporteMensual(mes, anio) {
    const ventas = obtenerVentas();
    const cont = document.getElementById("reporte-mensual");

    if (!cont) return;

    const filtradas = ventas.filter(v => {
        const f = parsearFecha(v.fecha);
        return f.getMonth() + 1 === mes && f.getFullYear() === anio;
    });

    if (filtradas.length === 0) {
        cont.innerHTML = "<p>No hay ventas en ese mes.</p>";
        return;
    }

    const total = filtradas.reduce((sum, v) => sum + v.total, 0);

    cont.innerHTML = `
        <table>
            <thead><tr><th>Mes</th><th>Total</th></tr></thead>
            <tbody><tr><td>${mes}/${anio}</td><td><strong>$${total.toLocaleString("es-AR")}</strong></td></tr></tbody>
        </table>
    `;
}

/* ------------------------------
   REPORTE ANUAL
   ------------------------------ */
function generarReporteAnual(anio) {
    const ventas = obtenerVentas();
    const cont = document.getElementById("reporte-anual");

    if (!cont) return;

    const filtradas = ventas.filter(v => {
        const f = parsearFecha(v.fecha);
        return f.getFullYear() === anio;
    });

    if (filtradas.length === 0) {
        cont.innerHTML = "<p>No hay ventas en ese año.</p>";
        return;
    }

    const total = filtradas.reduce((sum, v) => sum + v.total, 0);

    cont.innerHTML = `
        <table>
            <thead><tr><th>Año</th><th>Total</th></tr></thead>
            <tbody><tr><td>${anio}</td><td><strong>$${total.toLocaleString("es-AR")}</strong></td></tr></tbody>
        </table>
    `;
}

/* ------------------------------
   REPORTE POR RANGO DE FECHAS
   ------------------------------ */
function generarReporteRango(desde, hasta) {
    const ventas = obtenerVentas();
    const cont = document.getElementById("reporte-rango");

    if (!cont) return;

    const d1 = new Date(desde);
    const d2 = new Date(hasta);

    const filtradas = ventas.filter(v => {
        const f = parsearFecha(v.fecha);
        return f >= d1 && f <= d2;
    });

    if (filtradas.length === 0) {
        cont.innerHTML = "<p>No hay ventas en ese rango.</p>";
        return;
    }

    const total = filtradas.reduce((sum, v) => sum + v.total, 0);

    cont.innerHTML = `
        <table>
            <thead><tr><th>Desde</th><th>Hasta</th><th>Total</th></tr></thead>
            <tbody><tr><td>${desde}</td><td>${hasta}</td><td><strong>$${total.toLocaleString("es-AR")}</strong></td></tr></tbody>
        </table>
    `;
}


/* ------------------------------
   REPORTE POR CATEGORÍA
   ------------------------------ */
function generarReportePorCategoria() {
    const ventas = obtenerVentas();
    const productos = obtenerProductos();
    const cont = document.getElementById("reporte-categorias");

    if (!cont) return;

    const resumen = {};

    ventas.forEach(v => {
        const prod = productos.find(p => p.id === v.productoId);
        if (!prod) return;

        if (!resumen[prod.categoria]) resumen[prod.categoria] = 0;
        resumen[prod.categoria] += v.total;
    });

    let html = `
        <table>
            <thead><tr><th>Categoría</th><th>Total Vendido</th></tr></thead>
            <tbody>
    `;

    Object.entries(resumen).forEach(([cat, total]) => {
        html += `
            <tr>
                <td>${cat}</td>
                <td><strong>$${total.toLocaleString("es-AR")}</strong></td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    cont.innerHTML = html;
}

/* ------------------------------
   REPORTE POR USUARIO
   ------------------------------ */
function generarReportePorUsuario() {
    const ventas = obtenerVentas();
    const cont = document.getElementById("reporte-usuarios");

    if (!cont) return;

    const resumen = {};

    ventas.forEach(v => {
        if (!resumen[v.usuario]) resumen[v.usuario] = 0;
        resumen[v.usuario] += v.total;
    });

    let html = `
        <table>
            <thead><tr><th>Usuario</th><th>Total Vendido</th></tr></thead>
            <tbody>
    `;

    Object.entries(resumen).forEach(([user, total]) => {
        html += `
            <tr>
                <td>${user}</td>
                <td><strong>$${total.toLocaleString("es-AR")}</strong></td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    cont.innerHTML = html;
}


/* ============================================================
   EXPORTACIONES
   ============================================================ */

/* ------------------------------
   EXPORTAR A CSV (Excel)
   ------------------------------ */
function exportarCSV(nombreArchivo, contenido) {
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo + ".csv";
    link.click();
}

/* ------------------------------
   EXPORTAR A PDF (Impresión)
   ------------------------------ */
function exportarPDF() {
    window.print();
}


/* ============================================================
   FIN DEL ARCHIVO
   ============================================================ */


