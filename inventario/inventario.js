// =======================================
//  MÓDULO ÚNICO DE INVENTARIO
//  - Compatible GitHub Pages y local
//  - Sin dependencias externas
//  - Escalable a otros módulos
// =======================================

// ---------- Utilidades de almacenamiento ----------

function getInventario() {
    return JSON.parse(localStorage.getItem("inventario")) || [];
}

function setInventario(data) {
    localStorage.setItem("inventario", JSON.stringify(data));
}

function getMovimientos() {
    return JSON.parse(localStorage.getItem("movimientos")) || [];
}

function setMovimientos(data) {
    localStorage.setItem("movimientos", JSON.stringify(data));
}

// ---------- Lógica de negocio ----------

function registrarIngreso(producto, categoria, cantidad) {
    const inventario = getInventario();
    const movimientos = getMovimientos();

    let item = inventario.find(
        x => x.producto === producto && x.categoria === categoria
    );

    if (!item) {
        item = {
            id: Date.now(),
            producto,
            categoria,
            cantidad: 0,
            fecha: ""
        };
        inventario.push(item);
    }

    item.cantidad += cantidad;
    item.fecha = new Date().toLocaleString();

    movimientos.push({
        fecha: item.fecha,
        producto,
        categoria,
        tipo: "INGRESO",
        cantidad
    });

    setInventario(inventario);
    setMovimientos(movimientos);
}

function registrarSalida(producto, categoria, cantidad) {
    const inventario = getInventario();
    const movimientos = getMovimientos();

    const item = inventario.find(
        x => x.producto === producto && x.categoria === categoria
    );

    if (!item) {
        throw new Error("El producto no existe en el inventario.");
    }

    if (item.cantidad < cantidad) {
        throw new Error("No hay suficiente stock para retirar.");
    }

    item.cantidad -= cantidad;
    item.fecha = new Date().toLocaleString();

    movimientos.push({
        fecha: item.fecha,
        producto,
        categoria,
        tipo: "SALIDA",
        cantidad
    });

    setInventario(inventario);
    setMovimientos(movimientos);
}

// ---------- Páginas: Listado de inventario ----------

function initListadoInventario() {
    const tabla = document.getElementById("tablaInventario");
    if (!tabla) return;

    function cargarInventario() {
        tabla.innerHTML = `
            <tr><td colspan="5" class="sin-datos">Cargando...</td></tr>
        `;

        try {
            const inventario = getInventario();

            if (inventario.length === 0) {
                tabla.innerHTML = `
                    <tr><td colspan="5" class="sin-datos">No hay productos registrados</td></tr>
                `;
                return;
            }

            tabla.innerHTML = "";
            inventario.forEach(item => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.producto}</td>
                    <td>${item.categoria}</td>
                    <td>${item.cantidad}</td>
                    <td>${item.fecha}</td>
                `;
                tabla.appendChild(fila);
            });
        } catch (error) {
            console.error("Error cargando inventario:", error);
            tabla.innerHTML = `
                <tr><td colspan="5" class="sin-datos">Error al cargar inventario</td></tr>
            `;
        }
    }

    // Exponer función si el botón "Actualizar" la llama
    window.cargarInventario = cargarInventario;
    cargarInventario();
}

// ---------- Páginas: Ingreso de inventario ----------

function initIngresoInventario() {
    const form = document.getElementById("formIngreso");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const producto = document.getElementById("producto").value.trim();
        const categoria = document.getElementById("categoria").value.trim();
        const cantidad = parseInt(document.getElementById("cantidad").value);

        if (!producto || !categoria || isNaN(cantidad) || cantidad <= 0) {
            alert("Por favor complete todos los campos correctamente.");
            return;
        }

        try {
            registrarIngreso(producto, categoria, cantidad);
            alert("Ingreso registrado correctamente.");
            form.reset();
        } catch (error) {
            alert(error.message || "Error al registrar ingreso.");
        }
    });
}

// ---------- Páginas: Salida de inventario ----------

function initSalidaInventario() {
    const form = document.getElementById("formSalida");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const producto = document.getElementById("producto").value.trim();
        const categoria = document.getElementById("categoria").value.trim();
        const cantidad = parseInt(document.getElementById("cantidad").value);

        if (!producto || !categoria || isNaN(cantidad) || cantidad <= 0) {
            alert("Por favor complete todos los campos correctamente.");
            return;
        }

        try {
            registrarSalida(producto, categoria, cantidad);
            alert("Salida registrada correctamente.");
            form.reset();
        } catch (error) {
            alert(error.message || "Error al registrar salida.");
        }
    });
}

// ---------- Páginas: Listado de movimientos ----------

function initListadoMovimientos() {
    const tabla = document.getElementById("tablaMovimientos");
    if (!tabla) return;

    const movimientos = getMovimientos();

    if (movimientos.length === 0) {
        tabla.innerHTML = `<tr><td colspan="5" class="sin-datos">No hay movimientos registrados</td></tr>`;
        return;
    }

    tabla.innerHTML = "";
    movimientos.forEach(m => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${m.fecha}</td>
            <td>${m.producto}</td>
            <td>${m.categoria}</td>
            <td>${m.tipo}</td>
            <td>${m.cantidad}</td>
        `;
        tabla.appendChild(fila);
    });
}

// ---------- Páginas: Kardex ----------

function initKardex() {
    const select = document.getElementById("productoSelect");
    const tabla = document.getElementById("tablaKardex");
    if (!select || !tabla) return;

    const movimientos = getMovimientos();
    const productos = [...new Set(movimientos.map(m => m.producto))];

    productos.forEach(p => {
        const option = document.createElement("option");
        option.value = p;
        option.textContent = p;
        select.appendChild(option);
    });

    window.generarKardex = function () {
        const producto = select.value;
        const todosMovimientos = getMovimientos();
        const filtrados = todosMovimientos.filter(m => m.producto === producto);

        if (!producto || filtrados.length === 0) {
            tabla.innerHTML = `<tr><td colspan="5" class="sin-datos">No hay movimientos para este producto</td></tr>`;
            return;
        }

        tabla.innerHTML = "";
        let saldo = 0;

        filtrados.forEach(m => {
            if (m.tipo === "INGRESO") saldo += m.cantidad;
            if (m.tipo === "SALIDA") saldo -= m.cantidad;

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${m.fecha}</td>
                <td>${m.tipo}</td>
                <td>${m.tipo === "INGRESO" ? m.cantidad : "-"}</td>
                <td>${m.tipo === "SALIDA" ? m.cantidad : "-"}</td>
                <td>${saldo}</td>
            `;
            tabla.appendChild(fila);
        });
    };
}

// ---------- Inicialización automática por página ----------

document.addEventListener("DOMContentLoaded", () => {
    initListadoInventario();
    initIngresoInventario();
    initSalidaInventario();
    initListadoMovimientos();
    initKardex();
});
