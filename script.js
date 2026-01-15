/* ============================================================
   LOGIN — VERSIÓN DEFINITIVA
============================================================ */

function iniciarSesion(event) {
    if (event) event.preventDefault();

    const usuario = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuario || !password) {
        alert("Completa usuario y contraseña.");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const encontrado = usuarios.find(u =>
        u.usuario.toLowerCase() === usuario.toLowerCase() &&
        u.password === password
    );

    if (!encontrado) {
        const error = document.getElementById("loginError");
        if (error) error.style.display = "block";
        return;
    }

    localStorage.setItem("loggedUser", encontrado.usuario);
    localStorage.setItem("userRole", encontrado.rol);

    window.location.href = "menu.html";
}

/* ============================================================
   UTILIDADES GENERALES
============================================================ */
function capitalizar(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

/* ============================================================
   CREAR ADMIN POR DEFECTO (EU / villatita)
============================================================ */
(function crearAdminPorDefecto() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.some(u => u.usuario === "EU");

    if (!existe) {
        usuarios.push({
            nombre: "Administrador",
            apellido: "Principal",
            usuario: "EU",
            password: "villatita",
            rol: "admin"
        });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
})();

/* ============================================================
   LOGIN
============================================================ */
function iniciarSesion(event) {
    if (event) event.preventDefault();

    const usuario = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuario || !password) {
        alert("Completa usuario y contraseña.");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const encontrado = usuarios.find(u => u.usuario === usuario && u.password === password);

    if (!encontrado) {
        alert("Usuario o contraseña incorrectos.");
        return;
    }

    localStorage.setItem("loggedUser", encontrado.usuario);
    localStorage.setItem("userRole", encontrado.rol);

    window.location.href = "menu.html";
}   // ← ESTE } FALTABA

/* ============================================================
   CONTROL DE SESIÓN Y MENÚ
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const usuario = localStorage.getItem("loggedUser");
    const rol = localStorage.getItem("userRole");

    const span = document.getElementById("usuario-log");
    if (span && usuario) span.textContent = usuario;

    if (window.location.pathname.includes("menu.html")) {
        if (!usuario) {
            location.href = "index.html";
            return;
        }

        if (rol !== "admin") {
            ["btn-usuarios", "btn-reportes", "btn-backups"].forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.style.display = "none";
            });
        }
    }
});

function cerrarSesion() {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole");
    location.href = "index.html";
}

/* ============================================================
   NAVEGACIÓN GENERAL
============================================================ */
function irAMenu() { window.location.href = "menu.html"; }
function irAClientes() { window.location.href = "clientes.html"; }
function irAProductos() { window.location.href = "productos.html"; }
function irAPrecios() { window.location.href = "precios.html"; }
function irAVentas() { window.location.href = "ventas.html"; }
function irAUsuarios() { window.location.href = "usuarios.html"; }
function irAReportes() { window.location.href = "reportes.html"; }
function irABackups() { window.location.href = "backups.html"; }

/* ============================================================
   CLIENTES — MÓDULO COMPLETO Y ESTABLE
============================================================ */

/* Capitalizar cada palabra */
function capitalizar(texto) {
    if (!texto) return "";
    return texto
        .trim()
        .split(/\s+/)
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(" ");
}

/* Obtener lista de clientes */
function obtenerClientes() {
    return JSON.parse(localStorage.getItem("clientes")) || [];
}

/* Guardar lista de clientes */
function guardarListaClientes(lista) {
    localStorage.setItem("clientes", JSON.stringify(lista));
}

/* Guardar un cliente nuevo */
function guardarCliente() {
    const nombre = capitalizar(document.getElementById("cliente-nombre").value);
    const apellido = capitalizar(document.getElementById("cliente-apellido").value);
    const telefono = document.getElementById("cliente-telefono").value.trim();

    if (!nombre || !apellido || !telefono) {
        alert("Completa todos los campos.");
        return;
    }

    if (!/^\d{10}$/.test(telefono)) {
        alert("El teléfono debe tener 10 dígitos.");
        return;
    }

    const clientes = obtenerClientes();

    clientes.push({
        id: Date.now(),
        nombre,
        apellido,
        telefono
    });

    guardarListaClientes(clientes);

    document.getElementById("cliente-nombre").value = "";
    document.getElementById("cliente-apellido").value = "";
    document.getElementById("cliente-telefono").value = "";

    mostrarClientes();
}

/* Mostrar clientes en tabla */
function mostrarClientes() {
    const clientes = obtenerClientes();
    const contenedor = document.getElementById("lista-clientes");

    if (!contenedor) return;

    if (clientes.length === 0) {
        contenedor.innerHTML = "<p>No hay clientes cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Acciones</th>
            </tr>
    `;

    clientes.forEach(c => {
        html += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.apellido}</td>
                <td>${c.telefono}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarCliente(${c.id})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarCliente(${c.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* Buscar clientes */
function buscarClientes() {
    const texto = document.getElementById("buscar-cliente").value.toLowerCase();
    const clientes = obtenerClientes();

    const filtrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(texto) ||
        c.apellido.toLowerCase().includes(texto) ||
        c.telefono.includes(texto)
    );

    const contenedor = document.getElementById("lista-clientes");

    if (filtrados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Acciones</th>
            </tr>
    `;

    filtrados.forEach(c => {
        html += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.apellido}</td>
                <td>${c.telefono}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarCliente(${c.id})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarCliente(${c.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* Editar cliente */
function editarCliente(id) {
    const clientes = obtenerClientes();
    const cliente = clientes.find(c => c.id === id);

    if (!cliente) return;

    const nuevoNombre = prompt("Nuevo nombre:", cliente.nombre);
    const nuevoApellido = prompt("Nuevo apellido:", cliente.apellido);
    const nuevoTelefono = prompt("Nuevo teléfono (10 dígitos):", cliente.telefono);

    if (!nuevoNombre || !nuevoApellido || !nuevoTelefono) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    if (!/^\d{10}$/.test(nuevoTelefono)) {
        alert("El teléfono debe tener 10 dígitos.");
        return;
    }

    cliente.nombre = capitalizar(nuevoNombre);
    cliente.apellido = capitalizar(nuevoApellido);
    cliente.telefono = nuevoTelefono;

    guardarListaClientes(clientes);
    mostrarClientes();
}

/* Eliminar cliente */
function eliminarCliente(id) {
    if (!confirm("¿Eliminar este cliente?")) return;

    let clientes = obtenerClientes();
    clientes = clientes.filter(c => c.id !== id);

    guardarListaClientes(clientes);
    mostrarClientes();
}

/* Volver al menú */
function irAMenu() {
    window.location.href = "menu.html";
}

/* ============================================================
   USUARIOS — MÓDULO COMPLETO Y PROFESIONAL
============================================================ */

/* Crear admin por defecto */
(function crearAdminPorDefecto() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.some(u => u.usuario === "EU");

    if (!existe) {
        usuarios.push({
            id: Date.now(),
            nombre: "Administrador Principal",
            usuario: "EU",
            password: "villatita",
            rol: "admin",
            estado: "Activo"
        });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
})();

/* Capitalizar cada palabra */
function capitalizar(texto) {
    if (!texto) return "";
    return texto
        .trim()
        .split(/\s+/)
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(" ");
}

/* Obtener lista */
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

/* Guardar lista */
function guardarListaUsuarios(lista) {
    localStorage.setItem("usuarios", JSON.stringify(lista));
}

/* Guardar usuario nuevo */
function guardarUsuario() {
    const nombre = capitalizar(document.getElementById("user-nombre").value);
    const usuario = document.getElementById("user-usuario").value.trim();
    const pass = document.getElementById("user-pass").value.trim();
    const rol = document.getElementById("user-rol").value;
    const estado = document.getElementById("user-estado").value;

    if (!nombre || !usuario || !pass) {
        alert("Completa todos los campos obligatorios.");
        return;
    }

    const usuarios = obtenerUsuarios();

    if (usuarios.some(u => u.usuario.toLowerCase() === usuario.toLowerCase())) {
        alert("Ese nombre de usuario ya existe.");
        return;
    }

    usuarios.push({
        id: Date.now(),
        nombre,
        usuario,
        password: pass,
        rol,
        estado
    });

    guardarListaUsuarios(usuarios);

    document.getElementById("user-nombre").value = "";
    document.getElementById("user-usuario").value = "";
    document.getElementById("user-pass").value = "";
    document.getElementById("user-rol").value = "operador";
    document.getElementById("user-estado").value = "Activo";

    mostrarUsuarios();
}

/* Mostrar usuarios */
function mostrarUsuarios() {
    const usuarios = obtenerUsuarios();
    const cont = document.getElementById("lista-usuarios");

    if (!cont) return;

    if (usuarios.length === 0) {
        cont.innerHTML = "<p>No hay usuarios cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
    `;

    usuarios.forEach(u => {
        html += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.usuario}</td>
                <td>${u.rol}</td>
                <td>${u.estado}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarUsuario(${u.id})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarUsuario(${u.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    cont.innerHTML = html;
}

/* Buscar usuarios */
function buscarUsuarios() {
    const texto = document.getElementById("buscar-usuario").value.toLowerCase();
    const usuarios = obtenerUsuarios();
    const cont = document.getElementById("lista-usuarios");

    const filtrados = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(texto) ||
        u.usuario.toLowerCase().includes(texto) ||
        u.rol.toLowerCase().includes(texto) ||
        u.estado.toLowerCase().includes(texto)
    );

    if (filtrados.length === 0) {
        cont.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
    `;

    filtrados.forEach(u => {
        html += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.usuario}</td>
                <td>${u.rol}</td>
                <td>${u.estado}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarUsuario(${u.id})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarUsuario(${u.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    cont.innerHTML = html;
}

/* Editar usuario */
function editarUsuario(id) {
    const usuarios = obtenerUsuarios();
    const u = usuarios.find(x => x.id === id);
    if (!u) return;

    const nuevoNombre = prompt("Nuevo nombre:", u.nombre);
    const nuevoUsuario = prompt("Nuevo usuario:", u.usuario);
    const nuevoPass = prompt("Nueva contraseña:", u.password);
    const nuevoRol = prompt("Nuevo rol (admin/operador/cajero/supervisor):", u.rol);
    const nuevoEstado = prompt("Nuevo estado (Activo/Inactivo):", u.estado);

    if (!nuevoNombre || !nuevoUsuario || !nuevoPass || !nuevoRol || !nuevoEstado) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    u.nombre = capitalizar(nuevoNombre);
    u.usuario = nuevoUsuario.trim();
    u.password = nuevoPass.trim();
    u.rol = nuevoRol.trim();
    u.estado = capitalizar(nuevoEstado.trim());

    guardarListaUsuarios(usuarios);
    mostrarUsuarios();
}

/* Eliminar usuario */
function eliminarUsuario(id) {
    if (!confirm("¿Eliminar este usuario?")) return;

    let usuarios = obtenerUsuarios();
    usuarios = usuarios.filter(u => u.id !== id);

    guardarListaUsuarios(usuarios);
    mostrarUsuarios();
}

/* Volver al menú */
function irAMenu() {
    window.location.href = "menu.html";
}

/* ============================================================
   PRODUCTOS — MÓDULO COMPLETO Y PROFESIONAL
============================================================ */

/* Obtener lista */
function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

/* Guardar lista */
function guardarListaProductos(lista) {
    localStorage.setItem("productos", JSON.stringify(lista));
}

/* Guardar producto nuevo */
function guardarProducto() {
    const nombre = capitalizar(document.getElementById("prod-nombre").value);
    const precio = parseFloat(document.getElementById("prod-precio").value.trim());
    const categoria = capitalizar(document.getElementById("prod-categoria").value.trim());
    const estado = capitalizar(document.getElementById("prod-estado").value.trim());

    if (!nombre || isNaN(precio) || precio < 0 || !categoria || !estado) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    const productos = obtenerProductos();

    if (productos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())) {
        alert("Ya existe un producto con ese nombre.");
        return;
    }

    productos.push({
        id: Date.now(),
        nombre,
        precio,
        categoria,
        estado
    });

    guardarListaProductos(productos);

    document.getElementById("prod-nombre").value = "";
    document.getElementById("prod-precio").value = "";
    document.getElementById("prod-categoria").value = "";
    document.getElementById("prod-estado").value = "Activo";

    mostrarProductos();
}

/* Mostrar productos */
function mostrarProductos() {
    const cont = document.getElementById("lista-productos");
    if (!cont) return;

    const productos = obtenerProductos();

    if (productos.length === 0) {
        cont.innerHTML = "<p>No hay productos cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
    `;

    productos.forEach(p => {
        html += `
            <tr>
                <td>${p.nombre}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.categoria}</td>
                <td>${p.estado}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarProducto(${p.id})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarProducto(${p.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

/* Buscar productos */
function buscarProductos() {
    const texto = document.getElementById("buscar-producto").value.toLowerCase();
    const cont = document.getElementById("lista-productos");
    const productos = obtenerProductos();

    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.categoria.toLowerCase().includes(texto) ||
        p.estado.toLowerCase().includes(texto)
    );

    if (filtrados.length === 0) {
        cont.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
    `;

    filtrados.forEach(p => {
        html += `
            <tr>
                <td>${p.nombre}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.categoria}</td>
                <td>${p.estado}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarProducto(${p.id})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarProducto(${p.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

/* Eliminar producto */
function eliminarProducto(id) {
    let productos = obtenerProductos();
    if (!confirm("¿Eliminar este producto?")) return;

    productos = productos.filter(p => p.id !== id);

    guardarListaProductos(productos);
    mostrarProductos();
}

/* Editar producto */
function editarProducto(id) {
    const productos = obtenerProductos();
    const p = productos.find(x => x.id === id);
    if (!p) return;

    const nombre = prompt("Nuevo nombre:", p.nombre);
    const precio = parseFloat(prompt("Nuevo precio:", p.precio));
    const categoria = prompt("Nueva categoría:", p.categoria);
    const estado = prompt("Nuevo estado (Activo/Inactivo):", p.estado);

    if (!nombre || isNaN(precio) || precio < 0 || !categoria || !estado) {
        alert("Datos inválidos.");
        return;
    }

    p.nombre = capitalizar(nombre);
    p.precio = precio;
    p.categoria = capitalizar(categoria);
    p.estado = capitalizar(estado);

    guardarListaProductos(productos);
    mostrarProductos();
}

/* ============================================================
   PRECIOS — MÓDULO UNIFICADO Y OPTIMIZADO
============================================================ */

/* Cargar productos en el selector */
function cargarProductosEnPrecios() {
    const productos = obtenerProductos();
    const select = document.getElementById("precio-producto");

    if (!select) return;

    select.innerHTML = `<option value="">Seleccione un producto</option>`;

    productos.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.nombre;
        select.appendChild(option);
    });
}

/* Mostrar precio actual del producto seleccionado */
function mostrarPrecioActual() {
    const select = document.getElementById("precio-producto");
    const div = document.getElementById("precio-actual");

    if (!select || !div) return;

    const id = parseInt(select.value);

    if (!id) {
        div.textContent = "";
        return;
    }

    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === id);

    if (!prod) {
        div.textContent = "";
        return;
    }

    div.textContent = `Precio actual: $${prod.precio.toFixed(2)}`;
}

/* Guardar nuevo precio */
function guardarPrecio() {
    const id = parseInt(document.getElementById("precio-producto").value);
    const nuevoPrecio = parseFloat(document.getElementById("precio-nuevo").value.trim());

    if (!id) {
        alert("Seleccione un producto.");
        return;
    }

    if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
        alert("Ingrese un precio válido.");
        return;
    }

    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === id);

    if (!prod) {
        alert("Producto no encontrado.");
        return;
    }

    prod.precio = nuevoPrecio;

    guardarListaProductos(productos);

    document.getElementById("precio-nuevo").value = "";
    mostrarPrecioActual();

    alert("Precio actualizado correctamente.");
}

/* Volver al menú */
function irAMenu() {
    window.location.href = "menu.html";
}


/* ============================================================
   VENTAS — MÓDULO COMPLETO Y PROFESIONAL
============================================================ */

/* Obtener ventas */
function obtenerVentas() {
    return JSON.parse(localStorage.getItem("ventas")) || [];
}

/* Guardar ventas */
function guardarListaVentas(lista) {
    localStorage.setItem("ventas", JSON.stringify(lista));
}

/* Cargar clientes en selector */
function cargarClientesEnVentas() {
    const clientes = obtenerClientes();
    const select = document.getElementById("venta-cliente");

    if (!select) return;

    select.innerHTML = `<option value="">Seleccione un cliente</option>`;

    clientes.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = `${c.nombre} ${c.apellido}`;
        select.appendChild(option);
    });
}

/* Cargar productos en selector */
function cargarProductosEnVentas() {
    const productos = obtenerProductos();
    const select = document.getElementById("venta-producto");

    if (!select) return;

    select.innerHTML = `<option value="">Seleccione un producto</option>`;

    productos.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.nombre;
        select.appendChild(option);
    });
}

/* Mostrar precio unitario */
function actualizarPrecioVenta() {
    const id = parseInt(document.getElementById("venta-producto").value);
    const div = document.getElementById("precio-unitario");

    if (!id) {
        div.textContent = "";
        return;
    }

    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === id);

    if (!prod) {
        div.textContent = "";
        return;
    }

    div.textContent = `Precio unitario: $${prod.precio.toFixed(2)}`;
}

/* Registrar venta */
function guardarVenta() {
    const clienteId = parseInt(document.getElementById("venta-cliente").value);
    const productoId = parseInt(document.getElementById("venta-producto").value);
    const cantidad = parseInt(document.getElementById("venta-cantidad").value);

    if (!clienteId || !productoId || isNaN(cantidad) || cantidad <= 0) {
        alert("Complete todos los campos correctamente.");
        return;
    }

    const clientes = obtenerClientes();
    const productos = obtenerProductos();
    const ventas = obtenerVentas();

    const cliente = clientes.find(c => c.id === clienteId);
    const producto = productos.find(p => p.id === productoId);

    if (!cliente || !producto) {
        alert("Cliente o producto no encontrado.");
        return;
    }

    const total = producto.precio * cantidad;

    ventas.push({
        id: Date.now(),
        cliente: `${cliente.nombre} ${cliente.apellido}`,
        producto: producto.nombre,
        cantidad,
        precioUnitario: producto.precio,
        total,
        fecha: new Date().toLocaleString()
    });

    guardarListaVentas(ventas);

    document.getElementById("venta-cantidad").value = "";
    actualizarPrecioVenta();
    mostrarVentas();

    alert("Venta registrada correctamente.");
}

/* Mostrar historial de ventas */
function mostrarVentas() {
    const cont = document.getElementById("lista-ventas");
    if (!cont) return;

    const ventas = obtenerVentas();

    if (ventas.length === 0) {
        cont.innerHTML = "<p>No hay ventas registradas.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
    `;

    ventas.forEach(v => {
        html += `
            <tr>
                <td>${v.cliente}</td>
                <td>${v.producto}</td>
                <td>${v.cantidad}</td>
                <td>$${v.precioUnitario.toFixed(2)}</td>
                <td>$${v.total.toFixed(2)}</td>
                <td>${v.fecha}</td>
                <td>
                    <button class="btn-accion btn-eliminar" onclick="eliminarVenta(${v.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

/* Eliminar venta */
function eliminarVenta(id) {
    let ventas = obtenerVentas();
    if (!confirm("¿Eliminar esta venta?")) return;

    ventas = ventas.filter(v => v.id !== id);

    guardarListaVentas(ventas);
    mostrarVentas();
}

/* Volver al menú */
function irAMenu() {
    window.location.href = "menu.html";
}

/* ============================================================
   REPORTES — MÓDULO COMPLETO Y PROFESIONAL
============================================================ */

/* Obtener datos */
function obtenerReporteVentas() {
    return JSON.parse(localStorage.getItem("ventas")) || [];
}

function obtenerReporteProductos() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

function obtenerReporteClientes() {
    return JSON.parse(localStorage.getItem("clientes")) || [];
}

/* Render principal */
function mostrarReportes() {
    const cont = document.getElementById("lista-reportes");
    if (!cont) return;

    const ventas = obtenerReporteVentas();
    const productos = obtenerReporteProductos();
    const clientes = obtenerReporteClientes();

    /* ============================
       A) REPORTE DE VENTAS
    ============================ */

    const totalVentas = ventas.length;
    const totalFacturado = ventas.reduce((acc, v) => acc + v.total, 0);

    /* Producto más vendido */
    let rankingProductos = {};
    ventas.forEach(v => {
        rankingProductos[v.producto] = (rankingProductos[v.producto] || 0) + v.cantidad;
    });

    let productoMasVendido = "Sin datos";
    if (Object.keys(rankingProductos).length > 0) {
        productoMasVendido = Object.entries(rankingProductos)
            .sort((a, b) => b[1] - a[1])[0][0];
    }

    /* Cliente que más compra */
    let rankingClientes = {};
    ventas.forEach(v => {
        rankingClientes[v.cliente] = (rankingClientes[v.cliente] || 0) + v.total;
    });

    let mejorCliente = "Sin datos";
    if (Object.keys(rankingClientes).length > 0) {
        mejorCliente = Object.entries(rankingClientes)
            .sort((a, b) => b[1] - a[1])[0][0];
    }

    /* ============================
       B) REPORTE DE PRODUCTOS
    ============================ */

    const productosActivos = productos.filter(p => p.estado === "Activo").length;
    const productosInactivos = productos.filter(p => p.estado === "Inactivo").length;

    /* ============================
       C) REPORTE DE CLIENTES
    ============================ */

    const clientesActivos = clientes.length;

    /* ============================
       D) REPORTE ECONÓMICO
    ============================ */

    /* Total por producto */
    let totalPorProducto = {};
    ventas.forEach(v => {
        totalPorProducto[v.producto] = (totalPorProducto[v.producto] || 0) + v.total;
    });

    /* Total por cliente */
    let totalPorCliente = {};
    ventas.forEach(v => {
        totalPorCliente[v.cliente] = (totalPorCliente[v.cliente] || 0) + v.total;
    });

    /* ============================
       RENDER HTML
    ============================ */

    let html = `
        <h3>Resumen General</h3>
        <p><strong>Total de ventas:</strong> ${totalVentas}</p>
        <p><strong>Total facturado:</strong> $${totalFacturado.toFixed(2)}</p>
        <p><strong>Producto más vendido:</strong> ${productoMasVendido}</p>
        <p><strong>Cliente que más compra:</strong> ${mejorCliente}</p>

        <hr>

        <h3>Productos</h3>
        <p><strong>Activos:</strong> ${productosActivos}</p>
        <p><strong>Inactivos:</strong> ${productosInactivos}</p>

        <hr>

        <h3>Clientes</h3>
        <p><strong>Total de clientes registrados:</strong> ${clientesActivos}</p>

        <hr>

        <h3>Total por Producto</h3>
        <table>
            <tr><th>Producto</th><th>Total Vendido</th></tr>
    `;

    for (let prod in totalPorProducto) {
        html += `
            <tr>
                <td>${prod}</td>
                <td>$${totalPorProducto[prod].toFixed(2)}</td>
            </tr>
        `;
    }

    html += `
        </table>

        <hr>

        <h3>Total por Cliente</h3>
        <table>
            <tr><th>Cliente</th><th>Total Gastado</th></tr>
    `;

    for (let cli in totalPorCliente) {
        html += `
            <tr>
                <td>${cli}</td>
                <td>$${totalPorCliente[cli].toFixed(2)}</td>
            </tr>
        `;
    }

    html += `</table>`;

    cont.innerHTML = html;
}

/* Volver al menú */
function irAMenu() {
    window.location.href = "menu.html";
}

/* ============================================================
   BACKUPS — MÓDULO COMPLETO Y PROFESIONAL
============================================================ */

/* Obtener backups */
function obtenerBackups() {
    return JSON.parse(localStorage.getItem("backups")) || [];
}

/* Guardar backups */
function guardarListaBackups(lista) {
    localStorage.setItem("backups", JSON.stringify(lista));
}

/* Crear backup manual */
function crearBackup() {
    const fecha = new Date().toLocaleString();

    const data = {
        fecha,
        usuarios: JSON.parse(localStorage.getItem("usuarios")) || [],
        clientes: JSON.parse(localStorage.getItem("clientes")) || [],
        productos: JSON.parse(localStorage.getItem("productos")) || [],
        ventas: JSON.parse(localStorage.getItem("ventas")) || [],
        precios: JSON.parse(localStorage.getItem("precios")) || []
    };

    let backups = obtenerBackups();

    backups.push({
        id: Date.now(),
        fecha,
        data
    });

    /* Mantener máximo 10 backups */
    if (backups.length > 10) {
        backups = backups.slice(backups.length - 10);
    }

    guardarListaBackups(backups);
    mostrarBackups();

    alert("Backup creado correctamente.");
}

/* Backup automático diario */
function backupAutomatico() {
    const hoy = new Date().toLocaleDateString();
    const backups = obtenerBackups();

    const existe = backups.some(b => b.fecha.startsWith(hoy));

    if (!existe) {
        crearBackup();
    }
}

/* Mostrar backups */
function mostrarBackups() {
    const cont = document.getElementById("lista-backups");
    if (!cont) return;

    const backups = obtenerBackups();

    if (backups.length === 0) {
        cont.innerHTML = "<p>No hay backups guardados.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
    `;

    backups.forEach(b => {
        html += `
            <tr>
                <td>${b.fecha}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="descargarBackup(${b.id})">Descargar</button>
                    <button class="btn-accion btn-editar" onclick="restaurarBackup(${b.id})">Restaurar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarBackup(${b.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

/* Descargar backup */
function descargarBackup(id) {
    const backups = obtenerBackups();
    const b = backups.find(x => x.id === id);
    if (!b) return;

    const contenido = JSON.stringify(b.data, null, 2);
    const blob = new Blob([contenido], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `backup_${b.fecha.replace(/[/ :]/g, "-")}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

/* Restaurar backup */
function restaurarBackup(id) {
    if (!confirm("¿Restaurar este backup? Se reemplazarán todos los datos.")) return;

    const backups = obtenerBackups();
    const b = backups.find(x => x.id === id);
    if (!b) return;

    localStorage.setItem("usuarios", JSON.stringify(b.data.usuarios));
    localStorage.setItem("clientes", JSON.stringify(b.data.clientes));
    localStorage.setItem("productos", JSON.stringify(b.data.productos));
    localStorage.setItem("ventas", JSON.stringify(b.data.ventas));
    localStorage.setItem("precios", JSON.stringify(b.data.precios));

    alert("Backup restaurado correctamente.");
    location.reload();
}

/* Eliminar backup */
function eliminarBackup(id) {
    if (!confirm("¿Eliminar este backup?")) return;

    let backups = obtenerBackups();
    backups = backups.filter(b => b.id !== id);

    guardarListaBackups(backups);
    mostrarBackups();
}

/* Volver al menú */
function irAMenu() {
    window.location.href = "menu.html";
}

