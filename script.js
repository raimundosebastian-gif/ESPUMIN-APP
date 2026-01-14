/* ===============================
      UTILIDADES
=============================== */
function capitalizar(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

/* ===============================
      GUARDAR CLIENTE
=============================== */
function guardarCliente() {
    const nombre = document.getElementById("cliente-nombre").value.trim();
    const apellido = document.getElementById("cliente-apellido").value.trim();
    const telefono = document.getElementById("cliente-telefono").value.trim();

    if (!nombre || !apellido || telefono.length !== 10) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    clientes.push({
        nombre: capitalizar(nombre),
        apellido: capitalizar(apellido),
        telefono
    });

    localStorage.setItem("clientes", JSON.stringify(clientes));

    alert("Cliente guardado correctamente.");

    document.getElementById("cliente-nombre").value = "";
    document.getElementById("cliente-apellido").value = "";
    document.getElementById("cliente-telefono").value = "";

    mostrarClientes();
}

/* ===============================
      MOSTRAR CLIENTES
=============================== */
function mostrarClientes() {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const contenedor = document.getElementById("lista-clientes");

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

    clientes.forEach((c, index) => {
        html += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.apellido}</td>
                <td>${c.telefono}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarCliente(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarCliente(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      BUSCAR CLIENTES
=============================== */
function buscarClientes() {
    const texto = document.getElementById("buscar-cliente").value.toLowerCase();
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

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

    filtrados.forEach((c, index) => {
        html += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.apellido}</td>
                <td>${c.telefono}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarCliente(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarCliente(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      ELIMINAR CLIENTE
=============================== */
function eliminarCliente(index) {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    if (!confirm("¿Eliminar este cliente?")) return;

    clientes.splice(index, 1);
    localStorage.setItem("clientes", JSON.stringify(clientes));

    mostrarClientes();
}

/* ===============================
      EDITAR CLIENTE
=============================== */
function editarCliente(index) {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const cliente = clientes[index];

    const nuevoNombre = prompt("Nuevo nombre:", cliente.nombre);
    const nuevoApellido = prompt("Nuevo apellido:", cliente.apellido);
    const nuevoTelefono = prompt("Nuevo teléfono (10 dígitos):", cliente.telefono);

    if (!nuevoNombre || !nuevoApellido || nuevoTelefono.length !== 10) {
        alert("Datos inválidos.");
        return;
    }

    clientes[index] = {
        nombre: capitalizar(nuevoNombre),
        apellido: capitalizar(nuevoApellido),
        telefono: nuevoTelefono
    };

    localStorage.setItem("clientes", JSON.stringify(clientes));
    mostrarClientes();
}

/* ===============================
      VOLVER AL MENÚ
=============================== */
function irAMenu() {
    window.location.href = "menu.html";
}

/* ===============================
      GUARDAR USUARIO
=============================== */
function guardarUsuario() {
    const nombre = document.getElementById("usuario-nombre").value.trim();
    const apellido = document.getElementById("usuario-apellido").value.trim();
    const usuario = document.getElementById("usuario-usuario").value.trim();
    const password = document.getElementById("usuario-password").value.trim();
    const rol = document.getElementById("usuario-rol").value;

    if (!nombre || !apellido || !usuario || !password || !rol) {
        alert("Completa todos los campos.");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Evitar duplicados
    if (usuarios.some(u => u.usuario === usuario)) {
        alert("El nombre de usuario ya existe.");
        return;
    }

    usuarios.push({
        nombre: capitalizar(nombre),
        apellido: capitalizar(apellido),
        usuario,
        password,
        rol
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario guardado correctamente.");

    document.getElementById("usuario-nombre").value = "";
    document.getElementById("usuario-apellido").value = "";
    document.getElementById("usuario-usuario").value = "";
    document.getElementById("usuario-password").value = "";
    document.getElementById("usuario-rol").value = "";

    mostrarUsuarios();
}

/* ===============================
      MOSTRAR USUARIOS
=============================== */
function mostrarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const contenedor = document.getElementById("lista-usuarios");

    if (usuarios.length === 0) {
        contenedor.innerHTML = "<p>No hay usuarios cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
    `;

    usuarios.forEach((u, index) => {
        html += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.apellido}</td>
                <td>${u.usuario}</td>
                <td>${u.rol}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarUsuario(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarUsuario(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      BUSCAR USUARIOS
=============================== */
function buscarUsuarios() {
    const texto = document.getElementById("buscar-usuario").value.toLowerCase();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const filtrados = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(texto) ||
        u.apellido.toLowerCase().includes(texto) ||
        u.usuario.toLowerCase().includes(texto) ||
        u.rol.toLowerCase().includes(texto)
    );

    const contenedor = document.getElementById("lista-usuarios");

    if (filtrados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
    `;

    filtrados.forEach((u, index) => {
        html += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.apellido}</td>
                <td>${u.usuario}</td>
                <td>${u.rol}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarUsuario(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarUsuario(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      ELIMINAR USUARIO
=============================== */
function eliminarUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (!confirm("¿Eliminar este usuario?")) return;

    usuarios.splice(index, 1);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarUsuarios();
}

/* ===============================
      EDITAR USUARIO
=============================== */
function editarUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const u = usuarios[index];

    const nuevoNombre = prompt("Nuevo nombre:", u.nombre);
    const nuevoApellido = prompt("Nuevo apellido:", u.apellido);
    const nuevoUsuario = prompt("Nuevo usuario:", u.usuario);
    const nuevoRol = prompt("Nuevo rol (admin/empleado):", u.rol);

    if (!nuevoNombre || !nuevoApellido || !nuevoUsuario || !nuevoRol) {
        alert("Datos inválidos.");
        return;
    }

    usuarios[index] = {
        nombre: capitalizar(nuevoNombre),
        apellido: capitalizar(nuevoApellido),
        usuario: nuevoUsuario,
        password: u.password, // no se edita aquí
        rol: nuevoRol
    };

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mostrarUsuarios();
}

/* ===============================
      VOLVER AL MENÚ
=============================== */
function irAMenu() {
    window.location.href = "menu.html";
}

/* ===============================
      VALIDAR SESIÓN AL ENTRAR
=============================== */
document.addEventListener("DOMContentLoaded", () => {
    const usuario = localStorage.getItem("loggedUser");
    const rol = localStorage.getItem("userRole");

    if (!usuario) {
        location.href = "index.html";
        return;
    }

    // Mostrar nombre del usuario
    const spanUsuario = document.getElementById("usuario-log");
    if (spanUsuario) spanUsuario.textContent = usuario;

    // Control de roles: solo admin ve Usuarios, Reportes y Backups
    if (rol !== "admin") {
        const adminButtons = [
            "btn-usuarios",
            "btn-reportes",
            "btn-backups"
        ];

        adminButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.style.display = "none";
        });
    }
});

/* ===============================
      CERRAR SESIÓN
=============================== */
function cerrarSesion() {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole");
    location.href = "index.html";
}

/* ===============================
      NAVEGACIÓN DEL MENÚ
=============================== */
function irAClientes() {
    window.location.href = "clientes.html";
}

function irAProductos() {
    window.location.href = "productos.html";
}

function irAPrecios() {
    window.location.href = "precios.html";
}

function irAVentas() {
    window.location.href = "ventas.html";
}

function irAUsuarios() {
    window.location.href = "usuarios.html";
}

function irAReportes() {
    window.location.href = "reportes.html";
}

function irABackups() {
    window.location.href = "backups.html";
}

/* ===============================
      GUARDAR PRODUCTO
=============================== */
function guardarProducto() {
    const nombre = document.getElementById("producto-nombre").value.trim();
    const descripcion = document.getElementById("producto-descripcion").value.trim();
    const precio = parseFloat(document.getElementById("producto-precio").value.trim());
    const stock = parseInt(document.getElementById("producto-stock").value.trim());

    if (!nombre || !descripcion || isNaN(precio) || isNaN(stock)) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    if (precio <= 0) {
        alert("El precio debe ser mayor a 0.");
        return;
    }

    if (stock < 0) {
        alert("El stock no puede ser negativo.");
        return;
    }

    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    productos.push({
        nombre: capitalizar(nombre),
        descripcion,
        precio,
        stock
    });

    localStorage.setItem("productos", JSON.stringify(productos));

    alert("Producto guardado correctamente.");

    document.getElementById("producto-nombre").value = "";
    document.getElementById("producto-descripcion").value = "";
    document.getElementById("producto-precio").value = "";
    document.getElementById("producto-stock").value = "";

    mostrarProductos();
}

/* ===============================
      MOSTRAR PRODUCTOS
=============================== */
function mostrarProductos() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const contenedor = document.getElementById("lista-productos");

    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No hay productos cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
            </tr>
    `;

    productos.forEach((p, index) => {
        html += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarProducto(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      BUSCAR PRODUCTOS
=============================== */
function buscarProductos() {
    const texto = document.getElementById("buscar-producto").value.toLowerCase();
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
    );

    const contenedor = document.getElementById("lista-productos");

    if (filtrados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
            </tr>
    `;

    filtrados.forEach((p, index) => {
        html += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarProducto(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      ELIMINAR PRODUCTO
=============================== */
function eliminarProducto(index) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    if (!confirm("¿Eliminar este producto?")) return;

    productos.splice(index, 1);
    localStorage.setItem("productos", JSON.stringify(productos));

    mostrarProductos();
}

/* ===============================
      EDITAR PRODUCTO
=============================== */
function editarProducto(index) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const p = productos[index];

    const nuevoNombre = prompt("Nuevo nombre:", p.nombre);
    const nuevaDescripcion = prompt("Nueva descripción:", p.descripcion);
    const nuevoPrecio = parseFloat(prompt("Nuevo precio:", p.precio));
    const nuevoStock = parseInt(prompt("Nuevo stock:", p.stock));

    if (!nuevoNombre || !nuevaDescripcion || isNaN(nuevoPrecio) || isNaN(nuevoStock)) {
        alert("Datos inválidos.");
        return;
    }

    productos[index] = {
        nombre: capitalizar(nuevoNombre),
        descripcion: nuevaDescripcion,
        precio: nuevoPrecio,
        stock: nuevoStock
    };

    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
}

/* ===============================
      VOLVER AL MENÚ
=============================== */
function irAMenu() {
    window.location.href = "menu.html";
}

/* ===============================
      GUARDAR PRECIO
=============================== */
function guardarPrecio() {
    const producto = document.getElementById("precio-producto").value.trim();
    const costo = parseFloat(document.getElementById("precio-costo").value.trim());
    const venta = parseFloat(document.getElementById("precio-venta").value.trim());

    if (!producto || isNaN(costo) || isNaN(venta)) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    if (costo <= 0 || venta <= 0) {
        alert("Los valores deben ser mayores a 0.");
        return;
    }

    if (venta < costo) {
        alert("El precio de venta no puede ser menor al costo.");
        return;
    }

    const precios = JSON.parse(localStorage.getItem("precios")) || [];

    precios.push({
        producto: capitalizar(producto),
        costo,
        venta
    });

    localStorage.setItem("precios", JSON.stringify(precios));

    alert("Precio guardado correctamente.");

    document.getElementById("precio-producto").value = "";
    document.getElementById("precio-costo").value = "";
    document.getElementById("precio-venta").value = "";

    mostrarPrecios();
}

/* ===============================
      MOSTRAR PRECIOS
=============================== */
function mostrarPrecios() {
    const precios = JSON.parse(localStorage.getItem("precios")) || [];
    const contenedor = document.getElementById("lista-precios");

    if (precios.length === 0) {
        contenedor.innerHTML = "<p>No hay precios cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Producto</th>
                <th>Costo</th>
                <th>Venta</th>
                <th>Acciones</th>
            </tr>
    `;

    precios.forEach((p, index) => {
        html += `
            <tr>
                <td>${p.producto}</td>
                <td>$${p.costo.toFixed(2)}</td>
                <td>$${p.venta.toFixed(2)}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarPrecio(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarPrecio(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      BUSCAR PRECIOS
=============================== */
function buscarPrecios() {
    const texto = document.getElementById("buscar-precio").value.toLowerCase();
    const precios = JSON.parse(localStorage.getItem("precios")) || [];

    const filtrados = precios.filter(p =>
        p.producto.toLowerCase().includes(texto)
    );

    const contenedor = document.getElementById("lista-precios");

    if (filtrados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Producto</th>
                <th>Costo</th>
                <th>Venta</th>
                <th>Acciones</th>
            </tr>
    `;

    filtrados.forEach((p, index) => {
        html += `
            <tr>
                <td>${p.producto}</td>
                <td>$${p.costo.toFixed(2)}</td>
                <td>$${p.venta.toFixed(2)}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarPrecio(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarPrecio(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      ELIMINAR PRECIO
=============================== */
function eliminarPrecio(index) {
    const precios = JSON.parse(localStorage.getItem("precios")) || [];

    if (!confirm("¿Eliminar este precio?")) return;

    precios.splice(index, 1);
    localStorage.setItem("precios", JSON.stringify(precios));

    mostrarPrecios();
}

/* ===============================
      EDITAR PRECIO
=============================== */
function editarPrecio(index) {
    const precios = JSON.parse(localStorage.getItem("precios")) || [];
    const p = precios[index];

    const nuevoProducto = prompt("Nuevo producto:", p.producto);
    const nuevoCosto = parseFloat(prompt("Nuevo costo:", p.costo));
    const nuevoVenta = parseFloat(prompt("Nuevo precio de venta:", p.venta));

    if (!nuevoProducto || isNaN(nuevoCosto) || isNaN(nuevoVenta)) {
        alert("Datos inválidos.");
        return;
    }

    if (nuevoVenta < nuevoCosto) {
        alert("El precio de venta no puede ser menor al costo.");
        return;
    }

    precios[index] = {
        producto: capitalizar(nuevoProducto),
        costo: nuevoCosto,
        venta: nuevoVenta
    };

    localStorage.setItem("precios", JSON.stringify(precios));
    mostrarPrecios();
}

/* ===============================
      VOLVER AL MENÚ
=============================== */
function irAMenu() {
    window.location.href = "menu.html";
}

/* ===============================
      AGREGAR VENTA
=============================== */
function agregarVenta() {
    const cliente = document.getElementById("venta-cliente").value.trim();
    const producto = document.getElementById("venta-producto").value.trim();
    const cantidad = parseInt(document.getElementById("venta-cantidad").value.trim());

    if (!cliente || !producto || isNaN(cantidad) || cantidad <= 0) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const precios = JSON.parse(localStorage.getItem("precios")) || [];

    const prod = productos.find(p => p.nombre === producto);
    const precioProd = precios.find(p => p.producto === producto);

    if (!prod) {
        alert("El producto no existe.");
        return;
    }

    if (!precioProd) {
        alert("No hay precio cargado para este producto.");
        return;
    }

    if (cantidad > prod.stock) {
        alert("No hay stock suficiente.");
        return;
    }

    const total = precioProd.venta * cantidad;

    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    ventas.push({
        cliente,
        producto,
        cantidad,
        precioUnitario: precioProd.venta,
        total,
        fecha: new Date().toLocaleString()
    });

    localStorage.setItem("ventas", JSON.stringify(ventas));

    // Descontar stock
    prod.stock -= cantidad;
    localStorage.setItem("productos", JSON.stringify(productos));

    alert("Venta registrada correctamente.");

    document.getElementById("venta-cliente").value = "";
    document.getElementById("venta-producto").value = "";
    document.getElementById("venta-cantidad").value = "";

    mostrarVentas();
}

/* ===============================
      MOSTRAR VENTAS
=============================== */
function mostrarVentas() {
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    const contenedor = document.getElementById("lista-ventas");

    if (ventas.length === 0) {
        contenedor.innerHTML = "<p>No hay ventas registradas.</p>";
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

    ventas.forEach((v, index) => {
        html += `
            <tr>
                <td>${v.cliente}</td>
                <td>${v.producto}</td>
                <td>${v.cantidad}</td>
                <td>$${v.precioUnitario.toFixed(2)}</td>
                <td>$${v.total.toFixed(2)}</td>
                <td>${v.fecha}</td>
                <td>
                    <button class="btn-accion btn-eliminar" onclick="eliminarVenta(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      BUSCAR VENTAS
=============================== */
function buscarVentas() {
    const texto = document.getElementById("buscar-venta").value.toLowerCase();
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    const filtradas = ventas.filter(v =>
        v.cliente.toLowerCase().includes(texto) ||
        v.producto.toLowerCase().includes(texto)
    );

    const contenedor = document.getElementById("lista-ventas");

    if (filtradas.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron coincidencias.</p>";
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

    filtradas.forEach((v, index) => {
        html += `
            <tr>
                <td>${v.cliente}</td>
                <td>${v.producto}</td>
                <td>${v.cantidad}</td>
                <td>$${v.precioUnitario.toFixed(2)}</td>
                <td>$${v.total.toFixed(2)}</td>
                <td>${v.fecha}</td>
                <td>
                    <button class="btn-accion btn-eliminar" onclick="eliminarVenta(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      ELIMINAR VENTA
=============================== */
function eliminarVenta(index) {
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    const venta = ventas[index];

    if (!confirm("¿Eliminar esta venta?")) return;

    // Devolver stock
    const prod = productos.find(p => p.nombre === venta.producto);
    if (prod) {
        prod.stock += venta.cantidad;
        localStorage.setItem("productos", JSON.stringify(productos));
    }

    ventas.splice(index, 1);
    localStorage.setItem("ventas", JSON.stringify(ventas));

    mostrarVentas();
}

/* ===============================
      VOLVER AL MENÚ
=============================== */
function irAMenu() {
    window.location.href = "menu.html";
}

/* ===============================
      REPORTE: CLIENTES
=============================== */
function reporteClientes() {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const cont = document.getElementById("reporte-clientes");

    if (clientes.length === 0) {
        cont.innerHTML = "<p>No hay clientes cargados.</p>";
        return;
    }

    let html = `
        <h3>Listado de Clientes</h3>
        <table>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
            </tr>
    `;

    clientes.forEach(c => {
        html += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.apellido}</td>
                <td>${c.telefono}</td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

/* ===============================
      REPORTE: PRODUCTOS
=============================== */
function reporteProductos() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const cont = document.getElementById("reporte-productos");

    if (productos.length === 0) {
        cont.innerHTML = "<p>No hay productos cargados.</p>";
        return;
    }

    let html = `
        <h3>Listado de Productos</h3>
        <table>
            <tr>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
            </tr>
    `;

    productos.forEach(p => {
        html += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.stock}</td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

/* ===============================
      REPORTE: PRECIOS
=============================== */
function reportePrecios() {
    const precios = JSON.parse(localStorage.getItem("precios")) || [];
    const cont = document.getElementById("reporte-precios");

    if (precios.length === 0) {
        cont.innerHTML = "<p>No hay precios cargados.</p>";
        return;
    }

    let html = `
        <h3>Listado de Precios</h3>
        <table>
            <tr>
                <th>Producto</th>
                <th>Costo</th>
                <th>Venta</th>
            </tr>
    `;

    precios.forEach(p => {
        html += `
            <tr>
                <td>${p.producto}</td>
                <td>$${p.costo.toFixed(2)}</td>
                <td>$${p.venta.toFixed(2)}</td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

/* ===============================
      REPORTE: VENTAS
=============================== */
function reporteVentas() {
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    const cont = document.getElementById("reporte-ventas");

    if (ventas.length === 0) {
        cont.innerHTML = "<p>No hay ventas registradas.</p>";
        return;
    }

    let totalGeneral = 0;

    let html = `
        <h3>Listado de Ventas</h3>
        <table>
            <tr>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Fecha</th>
            </tr>
    `;

    ventas.forEach(v => {
        totalGeneral += v.total;

        html += `
            <tr>
                <td>${v.cliente}</td>
                <td>${v.producto}</td>
                <td>${v.cantidad}</td>
                <td>$${v.total.toFixed(2)}</td>
                <td>${v.fecha}</td>
            </tr>
        `;
    });

    html += `
        </table>
        <h3>Total General: $${totalGeneral.toFixed(2)}</h3>
    `;

    cont.innerHTML = html;
}

/* ===============================
      VOLVER AL MENÚ
=============================== */
function irAMenu() {
    window.location.href = "menu.html";
}

/* ===============================
      CREAR BACKUP
=============================== */
function crearBackup() {
    const fecha = new Date().toLocaleString();

    const datos = {
        clientes: JSON.parse(localStorage.getItem("clientes")) || [],
        productos: JSON.parse(localStorage.getItem("productos")) || [],
        precios: JSON.parse(localStorage.getItem("precios")) || [],
        ventas: JSON.parse(localStorage.getItem("ventas")) || [],
        usuarios: JSON.parse(localStorage.getItem("usuarios")) || []
    };

    const backups = JSON.parse(localStorage.getItem("backups")) || [];

    // Límite de 10 backups
    if (backups.length >= 10) {
        backups.shift(); // elimina el más viejo
    }

    backups.push({
        fecha,
        datos
    });

    localStorage.setItem("backups", JSON.stringify(backups));

    alert("Backup creado correctamente.");
    mostrarBackups();
}

/* ===============================
      MOSTRAR BACKUPS
=============================== */
function mostrarBackups() {
    const backups = JSON.parse(localStorage.getItem("backups")) || [];
    const cont = document.getElementById("lista-backups");

    if (backups.length === 0) {
        cont.innerHTML = "<p>No hay backups creados.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
    `;

    backups.forEach((b, index) => {
        html += `
            <tr>
                <td>${b.fecha}</td>
                <td>
                    <button class="btn-accion" onclick="descargarBackup(${index})">Descargar</button>
                    <button class="btn-accion" onclick="restaurarBackup(${index})">Restaurar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarBackup(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    cont.innerHTML = html;
}

/* ===============================
      DESCARGAR BACKUP (ZIP)
=============================== */
function descargarBackup(index) {
    const backups = JSON.parse(localStorage.getItem("backups")) || [];
    const backup = backups[index];

    const contenido = JSON.stringify(backup, null, 2);

    const blob = new Blob([contenido], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_${backup.fecha.replace(/[/ :]/g, "_")}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

/* ===============================
      RESTAURAR BACKUP
=============================== */
function restaurarBackup(index) {
    if (!confirm("¿Restaurar este backup? Se sobrescribirán todos los datos.")) return;

    const backups = JSON.parse(localStorage.getItem("backups")) || [];
    const backup = backups[index];

    localStorage.setItem("clientes", JSON.stringify(backup.datos.clientes));
    localStorage.setItem("productos", JSON.stringify(backup.datos.productos));
    localStorage.setItem("precios", JSON.stringify(backup.datos.precios));
    localStorage.setItem("ventas", JSON.stringify(backup.datos.ventas));
    localStorage.setItem("usuarios", JSON.stringify(backup.datos.usuarios));

    alert("Backup restaurado correctamente.");
}

/* ===============================
      ELIMINAR BACKUP
=============================== */
function eliminarBackup(index) {
    if (!confirm("¿Eliminar este backup?")) return;

    const backups = JSON.parse(localStorage.getItem("backups")) || [];
    backups.splice(index, 1);

    localStorage.setItem("backups", JSON.stringify(backups));

    mostrarBackups();
}

/* ===============================
      VOLVER AL MENÚ
=============================== */
function irAMenu() {
    window.location.href = "menu.html";
}
