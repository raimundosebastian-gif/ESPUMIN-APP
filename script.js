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
   PRODUCTOS (MEJORADO PARA LAVANDERÍA/TINTORERÍA)
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

    // 🔠 Nombre en MAYÚSCULAS
    nombre = nombre.toUpperCase();

    const productos = obtenerProductos();

    // ❌ Evitar duplicados por nombre
    const existe = productos.some(p => p.nombre === nombre);
    if (existe) {
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
    alert("Producto guardado.");
}

function mostrarProductos(lista = null) {
    const productos = lista || obtenerProductos();
    const cont = document.getElementById("lista-productos");

    if (!cont) return;

    if (productos.length === 0) {
        cont.innerHTML = "<p>No hay productos cargados.</p>";
        return;
    }

    // 🧹 Ordenar por categoría → nombre → precio
    const ordenCategorias = ["Lavandería", "Tintorería", "Acolchados", "Otros"];

    productos.sort((a, b) => {
        const idxA = ordenCategorias.indexOf(a.categoria);
        const idxB = ordenCategorias.indexOf(b.categoria);

        if (idxA !== idxB) return idxA - idxB;
        if (a.nombre !== b.nombre) return a.nombre.localeCompare(b.nombre);
        return a.precio - b.precio;
    });

    // 🧱 TABLA COMPLETA
    cont.innerHTML = `
        <table style="width:100%; border-collapse:collapse; background:rgba(255,255,255,0.15); border-radius:6px;">
            <thead>
                <tr style="background:rgba(255,255,255,0.25);">
                    <th style="padding:8px; text-align:left;">Categoría</th>
                    <th style="padding:8px; text-align:left;">Nombre</th>
                    <th style="padding:8px; text-align:right;">Precio</th>
                    <th style="padding:8px; text-align:left;">Estado</th>
                    <th style="padding:8px; text-align:center;">Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${productos.map(p => `
                    <tr>
                        <td style="padding:8px;">${p.categoria}</td>
                        <td style="padding:8px;">${p.nombre}</td>
                        <td style="padding:8px; text-align:right;">${p.precio.toLocaleString("es-AR")}</td>
                        <td style="padding:8px;">${p.estado}</td>
                        <td style="padding:8px; text-align:center;">
                            <button onclick="editarProducto(${p.id})"
                                style="padding:5px 10px; background:white; color:#007bff; border:none; border-radius:4px; cursor:pointer;">
                                Editar
                            </button>
                            <button onclick="eliminarProducto(${p.id})"
                                style="padding:5px 10px; background:white; color:#ff4444; border:none; border-radius:4px; cursor:pointer;">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function eliminarProducto(id) {
    if (!confirm("¿Seguro que desea eliminar este producto?")) return;

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
    let nuevaCategoria = prompt("Categoría (Lavandería / Tintorería / Acolchados / Otros):", p.categoria);
    let nuevoEstado = prompt("Estado (Activo/Inactivo):", p.estado);

    if (!nuevoNombre || !nuevoPrecio || !nuevaCategoria || !nuevoEstado) {
        alert("Datos inválidos.");
        return;
    }

    // 🔠 Nombre en MAYÚSCULAS
    nuevoNombre = nuevoNombre.toUpperCase();

    // ❌ Evitar duplicados al editar
    const existe = productos.some(x =>
        x.id !== id && x.nombre === nuevoNombre
    );
    if (existe) {
        alert("Ya existe otro producto con ese nombre.");
        return;
    }

    p.nombre = nuevoNombre.trim();
    p.precio = parseFloat(nuevoPrecio);
    p.categoria = nuevaCategoria.trim();
    p.estado = nuevoEstado.trim();

    guardarProductos(productos);
    mostrarProductos();
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

/* ============================================================
   USUARIOS (ADMINISTRACIÓN COMPLETA)
   ============================================================ */

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function guardarUsuarios(lista) {
    localStorage.setItem("usuarios", JSON.stringify(lista));
}

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

    // ❌ Evitar duplicados por nombre de usuario
    const existe = usuarios.some(u => u.usuario === usuario);
    if (existe) {
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
    alert("Usuario guardado.");
}

function mostrarUsuarios(lista = null) {
    const usuarios = lista || obtenerUsuarios();
    const cont = document.getElementById("lista-usuarios");

    if (!cont) return;

    if (usuarios.length === 0) {
        cont.innerHTML = "<p>No hay usuarios cargados.</p>";
        return;
    }

    // Ordenar por rol → nombre
    const ordenRoles = ["admin", "operador", "cajero", "supervisor"];
    usuarios.sort((a, b) => {
        const idxA = ordenRoles.indexOf(a.rol);
        const idxB = ordenRoles.indexOf(b.rol);
        if (idxA !== idxB) return idxA - idxB;
        return a.nombre.localeCompare(b.nombre);
    });

    cont.innerHTML = `
        <table style="width:100%; border-collapse:collapse; background:rgba(255,255,255,0.15); border-radius:6px;">
            <thead>
                <tr style="background:rgba(255,255,255,0.25);">
                    <th style="padding:8px; text-align:left;">Nombre</th>
                    <th style="padding:8px; text-align:left;">Usuario</th>
                    <th style="padding:8px; text-align:left;">Rol</th>
                    <th style="padding:8px; text-align:left;">Estado</th>
                    <th style="padding:8px; text-align:center;">Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${usuarios.map(u => `
                    <tr>
                        <td style="padding:8px;">${u.nombre}</td>
                        <td style="padding:8px;">${u.usuario}</td>
                        <td style="padding:8px;">${u.rol}</td>
                        <td style="padding:8px;">${u.estado}</td>
                        <td style="padding:8px; text-align:center;">
                            <button onclick="editarUsuario(${u.id})"
                                style="padding:5px 10px; background:white; color:#007bff; border:none; border-radius:4px; cursor:pointer;">
                                Editar
                            </button>
                            <button onclick="eliminarUsuario(${u.id})"
                                style="padding:5px 10px; background:white; color:#ff4444; border:none; border-radius:4px; cursor:pointer;">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function eliminarUsuario(id) {
    if (!confirm("¿Seguro que desea eliminar este usuario?")) return;

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
    let nuevoRol = prompt("Rol (admin / operador / cajero / supervisor):", u.rol);
    let nuevoEstado = prompt("Estado (Activo/Inactivo):", u.estado);

    if (!nuevoNombre || !nuevoUsuario || !nuevoPass || !nuevoRol || !nuevoEstado) {
        alert("Datos inválidos.");
        return;
    }

    // ❌ Evitar duplicados al editar
    const existe = usuarios.some(x =>
        x.id !== id && x.usuario === nuevoUsuario
    );
    if (existe) {
        alert("Ya existe otro usuario con ese nombre.");
        return;
    }

    u.nombre = nuevoNombre.trim();
    u.usuario = nuevoUsuario.trim();
    u.pass = nuevoPass.trim();
    u.rol = nuevoRol.trim();
    u.estado = nuevoEstado.trim();

    guardarUsuarios(usuarios);
    mostrarUsuarios();
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
   VENTAS / ÓRDENES (OL / OT)
   ============================================================ */

function obtenerOrdenes() {
    return JSON.parse(localStorage.getItem("ordenes")) || [];
}

function guardarOrdenes(lista) {
    localStorage.setItem("ordenes", JSON.stringify(lista));
}

function inicializarVentas() {
    cargarClientesEnSelect();
    cargarProductosEnSelectVenta();
}

function formatearMilesEntero(valor) {
    const n = Number(valor) || 0;
    return n.toLocaleString("es-AR", { maximumFractionDigits: 0 });
}

function desformatearEntero(txt) {
    if (!txt) return 0;
    return parseInt(txt.toString().replace(/\./g, ""), 10) || 0;
}

function generarNumeroOrden(tipo) {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    const ordenes = obtenerOrdenes().filter(o => o.tipo === tipo);
    let correlativo = 1;
    if (ordenes.length > 0) {
        ordenes.sort((a, b) => a.correlativo - b.correlativo);
        correlativo = ordenes[ordenes.length - 1].correlativo + 1;
    }

    const correlativoStr = String(correlativo).padStart(4, "0");
    const numero = `${tipo} - ${anio} ${mes} ${dia} - ${correlativoStr}`;

    return { numero, anio, mes, dia, correlativo };
}

let ventaActual = {
    tipo: null,
    numero: null,
    anio: null,
    mes: null,
    dia: null,
    correlativo: null,
    clienteId: null,
    clienteNombre: "",
    telefono: "",
    fechaEntrega: "",
    protocoloMascota: false,
    lineas: [],
    total: 0,
    sena: 0,
    saldo: 0,
    estado: "Recibido"
};

function nuevaOrden(tipo) {
    ventaActual = {
        tipo,
        numero: null,
        anio: null,
        mes: null,
        dia: null,
        correlativo: null,
        clienteId: null,
        clienteNombre: "",
        telefono: "",
        fechaEntrega: "",
        protocoloMascota: false,
        lineas: [],
        total: 0,
        sena: 0,
        saldo: 0,
        estado: "Recibido"
    };

    const datosNum = generarNumeroOrden(tipo);
    ventaActual.numero = datosNum.numero;
    ventaActual.anio = datosNum.anio;
    ventaActual.mes = datosNum.mes;
    ventaActual.dia = datosNum.dia;
    ventaActual.correlativo = datosNum.correlativo;

    document.getElementById("titulo-orden").textContent = ventaActual.numero;
    document.getElementById("contenedor-orden").style.display = "block";

    document.getElementById("buscar-cliente").value = "";
    cargarClientesEnSelect();
    document.getElementById("telefono-cliente").value = "";
    document.getElementById("fecha-entrega").value = "";
    document.getElementById("protocolo-mascota").checked = false;

    document.getElementById("venta-cantidad").value = 1;
    document.getElementById("buscar-producto-venta").value = "";
    cargarProductosEnSelectVenta();
    document.getElementById("venta-precio").value = "";
    document.getElementById("venta-subtotal").value = "";

    ventaActual.lineas = [];
    actualizarTablaVentas();
    actualizarTotalesVenta();
    document.getElementById("venta-estado").value = "Recibido";
}

function cargarClientesEnSelect() {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const sel = document.getElementById("select-cliente");
    if (!sel) return;

    sel.innerHTML = "";
    clientes.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.nombre;
        sel.appendChild(opt);
    });
}

function filtrarClientes() {
    const texto = document.getElementById("buscar-cliente").value.toLowerCase();
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const sel = document.getElementById("select-cliente");
    if (!sel) return;

    sel.innerHTML = "";
    clientes
        .filter(c => c.nombre.toLowerCase().includes(texto))
        .forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.nombre;
            sel.appendChild(opt);
        });
}

function seleccionarCliente() {
    const id = document.getElementById("select-cliente").value;
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const cli = clientes.find(c => String(c.id) === String(id));
    if (!cli) return;

    ventaActual.clienteId = cli.id;
    ventaActual.clienteNombre = cli.nombre;
    ventaActual.telefono = cli.telefono || "";

    document.getElementById("telefono-cliente").value = ventaActual.telefono;
}

function cargarProductosEnSelectVenta() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const sel = document.getElementById("select-producto-venta");
    if (!sel) return;

    sel.innerHTML = "";
    productos.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.nombre;
        opt.setAttribute("data-precio", p.precio || 0);
        sel.appendChild(opt);
    });

    actualizarPrecioVenta();
}

function filtrarProductosVenta() {
    const texto = document.getElementById("buscar-producto-venta").value.toLowerCase();
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const sel = document.getElementById("select-producto-venta");
    if (!sel) return;

    sel.innerHTML = "";
    productos
        .filter(p => p.nombre.toLowerCase().includes(texto))
        .forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.nombre;
            opt.setAttribute("data-precio", p.precio || 0);
            sel.appendChild(opt);
        });

    actualizarPrecioVenta();
}

function actualizarPrecioVenta() {
    const sel = document.getElementById("select-producto-venta");
    if (!sel || sel.options.length === 0) {
        document.getElementById("venta-precio").value = "";
        document.getElementById("venta-subtotal").value = "";
        return;
    }

    const opt = sel.options[sel.selectedIndex];
    const precio = Number(opt.getAttribute("data-precio")) || 0;
    const cant = Number(document.getElementById("venta-cantidad").value) || 1;

    const subtotal = precio * cant;

    document.getElementById("venta-precio").value = formatearMilesEntero(precio);
    document.getElementById("venta-subtotal").value = formatearMilesEntero(subtotal);
}

function agregarLineaVenta() {
    let cant = Number(document.getElementById("venta-cantidad").value);
    if (!cant || cant < 1) {
        alert("La cantidad debe ser al menos 1.");
        return;
    }

    const sel = document.getElementById("select-producto-venta");
    if (!sel || sel.options.length === 0) {
        alert("Seleccione un producto.");
        return;
    }

    const opt = sel.options[sel.selectedIndex];
    const productoId = opt.value;
    const productoNombre = opt.textContent;
    const precio = Number(opt.getAttribute("data-precio")) || 0;
    const subtotal = precio * cant;

    ventaActual.lineas.push({
        id: Date.now(),
        productoId,
        productoNombre,
        cantidad: cant,
        precio,
        subtotal
    });

    document.getElementById("venta-cantidad").value = 1;
    actualizarPrecioVenta();
    actualizarTablaVentas();
    actualizarTotalesVenta();
}

function actualizarTablaVentas() {
    const cont = document.getElementById("tabla-ventas-contenedor");
    if (!cont) return;

    if (ventaActual.lineas.length === 0) {
        cont.innerHTML = "<p>No hay prendas cargadas.</p>";
        return;
    }

    cont.innerHTML = `
        <table style="width:100%; border-collapse:collapse;">
            <thead>
                <tr>
                    <th style="border-bottom:1px solid #ccc; padding:4px; text-align:left;">Cant.</th>
                    <th style="border-bottom:1px solid #ccc; padding:4px; text-align:left;">Producto</th>
                    <th style="border-bottom:1px solid #ccc; padding:4px; text-align:right;">Precio</th>
                    <th style="border-bottom:1px solid #ccc; padding:4px; text-align:right;">Subtotal</th>
                    <th style="border-bottom:1px solid #ccc; padding:4px; text-align:center;">Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${ventaActual.lineas.map(l => `
                    <tr>
                        <td style="padding:4px;">${l.cantidad}</td>
                        <td style="padding:4px;">${l.productoNombre}</td>
                        <td style="padding:4px; text-align:right;">${formatearMilesEntero(l.precio)}</td>
                        <td style="padding:4px; text-align:right;">${formatearMilesEntero(l.subtotal)}</td>
                        <td style="padding:4px; text-align:center;">
                            <button onclick="editarLineaVenta(${l.id})"
                                style="padding:3px 6px; margin-right:4px; border:none; border-radius:3px; cursor:pointer;">
                                Editar
                            </button>
                            <button onclick="eliminarLineaVenta(${l.id})"
                                style="padding:3px 6px; border:none; border-radius:3px; cursor:pointer; color:#ff4444;">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function editarLineaVenta(id) {
    const linea = ventaActual.lineas.find(l => l.id === id);
    if (!linea) return;

    let nuevaCant = prompt("Nueva cantidad:", linea.cantidad);
    if (nuevaCant === null) return;
    nuevaCant = Number(nuevaCant);
    if (!nuevaCant || nuevaCant < 1) {
        alert("Cantidad inválida.");
        return;
    }

    linea.cantidad = nuevaCant;
    linea.subtotal = linea.precio * nuevaCant;

    actualizarTablaVentas();
    actualizarTotalesVenta();
}

function eliminarLineaVenta(id) {
    ventaActual.lineas = ventaActual.lineas.filter(l => l.id !== id);
    actualizarTablaVentas();
    actualizarTotalesVenta();
}

function actualizarTotalesVenta() {
    let total = 0;
    ventaActual.lineas.forEach(l => total += l.subtotal);
    ventaActual.total = total;

    const senaTxt = document.getElementById("venta-sena").value;
    const sena = desformatearEntero(senaTxt);
    ventaActual.sena = sena;

    const saldo = total - sena;
    ventaActual.saldo = saldo;

    document.getElementById("venta-total").value = formatearMilesEntero(total);
    document.getElementById("venta-sena").value = sena ? formatearMilesEntero(sena) : "";
    document.getElementById("venta-saldo").value = formatearMilesEntero(saldo);

    validarEstadoEntregado();
}

function actualizarSaldoVenta() {
    actualizarTotalesVenta();
}

function validarEstadoEntregado() {
    const selEstado = document.getElementById("venta-estado");
    if (!selEstado) return;

    if (ventaActual.saldo > 0 && selEstado.value === "Entregado") {
        alert("No se puede marcar como ENTREGADO si hay saldo pendiente.");
        selEstado.value = "Listo";
        ventaActual.estado = "Listo";
        return;
    }

    ventaActual.estado = selEstado.value;
}

function guardarOrden() {
    if (!ventaActual.tipo) {
        alert("Primero genere una orden (OL u OT).");
        return;
    }

    if (!ventaActual.clienteId) {
        alert("Seleccione un cliente.");
        return;
    }

    if (!ventaActual.fechaEntrega) {
        const f = document.getElementById("fecha-entrega").value;
        if (!f) {
            alert("Seleccione la fecha de entrega.");
            return;
        }
        ventaActual.fechaEntrega = f;
    }

    if (ventaActual.lineas.length === 0) {
        alert("Agregue al menos una prenda.");
        return;
    }

    ventaActual.protocoloMascota = document.getElementById("protocolo-mascota").checked;
    ventaActual.fechaEntrega = document.getElementById("fecha-entrega").value;

    actualizarTotalesVenta();
    validarEstadoEntregado();

    const ordenes = obtenerOrdenes();
    ordenes.push({
        ...ventaActual,
        id: Date.now()
    });
    guardarOrdenes(ordenes);

    alert("Orden guardada correctamente.");
    document.getElementById("contenedor-orden").style.display = "none";
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






