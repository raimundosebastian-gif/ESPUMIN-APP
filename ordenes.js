// --- ÓRDENES ---

let ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
let numeracionOrdenes = JSON.parse(localStorage.getItem("numeracionOrdenes")) || {};
let editIndexOrden = null; // null = nueva orden, número = edición
let detalleActual = [];

const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
const productos = JSON.parse(localStorage.getItem("productos")) || [];
const empleados = JSON.parse(localStorage.getItem("empleados")) || [];

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  cargarClientesEnSelect();
  cargarEmpleadosEnSelect();
  actualizarFechaIngreso();
  renderOrdenes();
});

// Búsqueda en vivo
document.getElementById("buscarOrden").addEventListener("input", function() {
  const texto = this.value.toLowerCase();

  const filtradas = ordenes.filter(o =>
    o.numero.toLowerCase().includes(texto) ||
    o.cliente.nombre.toLowerCase().includes(texto) ||
    o.estado.toLowerCase().includes(texto)
  );

  renderOrdenes(filtradas);
});

// Tipo de orden → carga productos + limpia numeración visible
document.getElementById("tipoOrden").addEventListener("change", () => {
  cargarProductosPorTipo();
  document.getElementById("numeroOrden").value = ""; // se genera al guardar
});

// Cliente → completa teléfono
document.getElementById("clienteOrden").addEventListener("change", () => {
  const nombre = document.getElementById("clienteOrden").value;
  const cli = clientes.find(c => c.nombre === nombre);

  if (cli) {
    document.getElementById("telefonoClienteOrden").value = cli.telefono;
  } else {
    document.getElementById("telefonoClienteOrden").value = "";
  }
});

// Agregar ítem al detalle
document.getElementById("btnAgregarItem").addEventListener("click", () => {
  const tipoOrden = document.getElementById("tipoOrden").value;
  const prodNombre = document.getElementById("productoOrden").value;
  const cant = parseInt(document.getElementById("cantidadProducto").value, 10) || 0;

  if (!tipoOrden) {
    alert("Seleccionar tipo de orden primero");
    return;
  }

  if (!prodNombre) {
    alert("Seleccionar un producto");
    return;
  }

  if (cant <= 0) {
    alert("La cantidad debe ser mayor a 0");
    return;
  }

  const prod = productos.find(p => p.nombre === prodNombre);
  if (!prod) {
    alert("Producto no encontrado");
    return;
  }

  const subtotal = prod.precio * cant;

  detalleActual.push({
    nombre: prod.nombre,
    categoria: prod.categoria,
    cantidad: cant,
    precioUnit: prod.precio,
    subtotal
  });

  renderDetalle();
  recalcularTotales();
});

// Pago parcial → recalcular saldo
document.getElementById("pagoParcial").addEventListener("input", () => {
  recalcularTotales();
});

// Submit (alta o edición)
document.getElementById("formOrden").addEventListener("submit", function(e) {
  e.preventDefault();

  if (detalleActual.length === 0) {
    alert("Debe agregar al menos un ítem a la orden");
    return;
  }

  const tipoOrden = document.getElementById("tipoOrden").value;
  const clienteNombre = document.getElementById("clienteOrden").value;
  const cli = clientes.find(c => c.nombre === clienteNombre);
  const empleadoNombre = document.getElementById("empleadoOrden").value;
  const fechaIngreso = document.getElementById("fechaIngreso").value;
  const fechaEntrega = document.getElementById("fechaEntrega").value;
  const protocoloMascotas = document.getElementById("protocoloMascotas").value;
  const metodoPago = document.getElementById("metodoPago").value;
  const direccionEntrega = document.getElementById("direccionEntrega").value.trim();
  const obs = document.getElementById("obsOrden").value.trim();

  if (!tipoOrden || !cli || !metodoPago || !fechaEntrega) {
    alert("Completar por favor para poder continuar");
    return;
  }

  const total = calcularTotal();
  let pagoParcial = parseFloat(document.getElementById("pagoParcial").value || "0");
  if (pagoParcial < 0 || pagoParcial > total) {
    alert("Pago parcial inválido");
    return;
  }
  const saldo = total - pagoParcial;

  // Alta de orden
  if (editIndexOrden === null) {
    const numero = generarNumeroOrden(tipoOrden);

    const nuevaOrden = {
      numero,
      tipo: tipoOrden,
      cliente: {
        nombre: cli.nombre,
        telefono: cli.telefono,
        direccion: cli.direccion || ""
      },
      empleado: {
        nombre: empleadoNombre || ""
      },
      fechaIngreso,
      fechaEntrega,
      protocoloMascotas,
      metodoPago,
      direccionEntrega,
      total,
      pagoParcial,
      saldo,
      estado: saldo === 0 ? "Listo para entregar" : "Pendiente",
      obs,
      detalle: JSON.parse(JSON.stringify(detalleActual)),
      historial: []
    };

    ordenes.push(nuevaOrden);
    guardarOrdenes();

    document.getElementById("numeroOrden").value = numero;

    generarPNGOrden(nuevaOrden);
    prepararWhatsApp(nuevaOrden);
  }
  // Edición de orden (incluye detalle, pagos, método, etc.)
  else {
    const o = ordenes[editIndexOrden];

    // Guardamos en historial un snapshot simple
    o.historial.push({
      fechaCambio: new Date().toLocaleString("es-AR"),
      totalAnterior: o.total,
      pagoParcialAnterior: o.pagoParcial,
      saldoAnterior: o.saldo,
      estadoAnterior: o.estado
    });

    o.tipo = tipoOrden;
    o.cliente = {
      nombre: cli.nombre,
      telefono: cli.telefono,
      direccion: cli.direccion || ""
    };
    o.empleado = { nombre: empleadoNombre || "" };
    o.fechaIngreso = fechaIngreso;
    o.fechaEntrega = fechaEntrega;
    o.protocoloMascotas = protocoloMascotas;
    o.metodoPago = metodoPago;
    o.direccionEntrega = direccionEntrega;
    o.obs = obs;
    o.detalle = JSON.parse(JSON.stringify(detalleActual));
    o.total = total;
    o.pagoParcial = pagoParcial;
    o.saldo = saldo;
    if (saldo === 0 && o.estado !== "Entregado") {
      o.estado = "Listo para entregar";
    }

    guardarOrdenes();

    generarPNGOrden(o);
    prepararWhatsApp(o);
  }

  // Reset de formulario
  detalleActual = [];
  renderDetalle();
  document.getElementById("formOrden").reset();
  actualizarFechaIngreso();
  recalcularTotales();
  editIndexOrden = null;
  document.getElementById("tituloFormOrden").textContent = "Nueva Orden";
  document.querySelector("#formOrden button[type='submit']").textContent = "Generar Orden";
  document.getElementById("numeroOrden").value = "";

  renderOrdenes();
});

// -------- Funciones de soporte --------

function cargarClientesEnSelect() {
  const sel = document.getElementById("clienteOrden");
  sel.innerHTML = `<option value="">Seleccionar...</option>`;
  clientes.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.nombre;
    opt.textContent = c.nombre;
    sel.appendChild(opt);
  });
}

function cargarEmpleadosEnSelect() {
  const sel = document.getElementById("empleadoOrden");
  sel.innerHTML = `<option value="">Seleccionar...</option>`;
  empleados.forEach(e => {
    const opt = document.createElement("option");
    opt.value = e.nombre;
    opt.textContent = e.nombre;
    sel.appendChild(opt);
  });
}

function cargarProductosPorTipo() {
  const tipo = document.getElementById("tipoOrden").value;
  const sel = document.getElementById("productoOrden");
  sel.innerHTML = `<option value="">Seleccionar...</option>`;

  if (!tipo) return;

  productos
    .filter(p => p.categoria === tipo)
    .forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.nombre;
      opt.textContent = `${p.nombre} ($${p.precio.toFixed(2)})`;
      sel.appendChild(opt);
    });
}

function actualizarFechaIngreso() {
  const hoy = new Date().toLocaleDateString("es-AR");
  document.getElementById("fechaIngreso").value = hoy;
}

function renderDetalle() {
  const tbody = document.getElementById("detalleOrden");
  tbody.innerHTML = "";

  detalleActual.forEach((item, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.categoria}</td>
      <td>${item.cantidad}</td>
      <td>$${item.precioUnit.toFixed(2)}</td>
      <td>$${item.subtotal.toFixed(2)}</td>
      <td><button class="btn-eliminar" onclick="eliminarItemDetalle(${idx})">Quitar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function eliminarItemDetalle(i) {
  detalleActual.splice(i, 1);
  renderDetalle();
  recalcularTotales();
}

function calcularTotal() {
  return detalleActual.reduce((acc, item) => acc + item.subtotal, 0);
}

function recalcularTotales() {
  const total = calcularTotal();
  const pagoParcial = parseFloat(document.getElementById("pagoParcial").value || "0");
  const saldo = total - (isNaN(pagoParcial) ? 0 : pagoParcial);

  document.getElementById("totalOrden").textContent = total.toFixed(2);
  document.getElementById("saldoOrden").textContent = saldo.toFixed(2);
}

function generarNumeroOrden(tipoOrden) {
  const year = new Date().getFullYear();
  const prefijo = tipoOrden === "Lavandería" ? "OL" : "OT";
  const key = `${prefijo}-${year}`;

  const actual = numeracionOrdenes[key] || 0;
  const siguiente = actual + 1;

  numeracionOrdenes[key] = siguiente;
  localStorage.setItem("numeracionOrdenes", JSON.stringify(numeracionOrdenes));

  return `${prefijo}-${year}-${String(siguiente).padStart(4, "0")}`;
}

function guardarOrdenes() {
  localStorage.setItem("ordenes", JSON.stringify(ordenes));
}

function renderOrdenes(lista = ordenes) {
  const tbody = document.getElementById("listaOrdenes");
  tbody.innerHTML = "";

  lista.forEach((o, idx) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${o.numero}</td>
      <td>${o.tipo}</td>
      <td>${o.cliente.nombre}</td>
      <td>${o.fechaIngreso}</td>
      <td>${o.fechaEntrega}</td>
      <td>${o.estado}</td>
      <td>$${o.total.toFixed(2)}</td>
      <td>$${o.saldo.toFixed(2)}</td>
      <td>
        <button class="btn-editar" onclick="editarOrden(${idx})">Editar / Cobrar</button>
        <button class="btn-editar" onclick="marcarEntregado(${idx})">Entregar</button>
        <button class="btn-eliminar" onclick="eliminarOrden(${idx})">Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Edición completa de orden
function editarOrden(i) {
  const o = ordenes[i];
  editIndexOrden = i;

  document.getElementById("tipoOrden").value = o.tipo;
  cargarProductosPorTipo();

  document.getElementById("numeroOrden").value = o.numero;
  document.getElementById("fechaIngreso").value = o.fechaIngreso;
  document.getElementById("clienteOrden").value = o.cliente.nombre;
  document.getElementById("telefonoClienteOrden").value = o.cliente.telefono;
  document.getElementById("protocoloMascotas").value = o.protocoloMascotas;
  document.getElementById("empleadoOrden").value = o.empleado.nombre;
  document.getElementById("metodoPago").value = o.metodoPago;
  document.getElementById("direccionEntrega").value = o.direccionEntrega;
  document.getElementById("fechaEntrega").value = o.fechaEntrega;
  document.getElementById("obsOrden").value = o.obs;

  detalleActual = JSON.parse(JSON.stringify(o.detalle));
  renderDetalle();

  document.getElementById("pagoParcial").value = o.pagoParcial;
  recalcularTotales();

  document.getElementById("tituloFormOrden").textContent = `Editar ${o.numero}`;
  document.querySelector("#formOrden button[type='submit']").textContent = "Guardar cambios de orden";
}

// Marcar como entregado (saldo debe ser 0)
function marcarEntregado(i) {
  const o = ordenes[i];

  if (o.saldo > 0) {
    alert("No se puede entregar la orden hasta cancelar el saldo pendiente.");
    return;
  }

  o.estado = "Entregado";
  guardarOrdenes();
  renderOrdenes();
}

// Eliminar orden
function eliminarOrden(i) {
  if (!confirm("¿Seguro que deseas eliminar esta orden?")) return;

  ordenes.splice(i, 1);
  guardarOrdenes();
  renderOrdenes();
}

// -------- PNG + WhatsApp (preparado) --------

function generarPNGOrden(orden) {
  const cont = document.getElementById("previewOrden");
  cont.style.display = "block";

  cont.innerHTML = `
    <div class="orden-imprimible">
      <h3>${orden.numero}</h3>
      <p><strong>Tipo:</strong> ${orden.tipo}</p>
      <p><strong>Cliente:</strong> ${orden.cliente.nombre}</p>
      <p><strong>Teléfono:</strong> ${orden.cliente.telefono}</p>
      <p><strong>Recepción:</strong> ${orden.fechaIngreso}</p>
      <p class="fecha-entrega-resaltada"><strong>Entrega estimada:</strong> ${orden.fechaEntrega}</p>
      <p><strong>Protocolo Mascotas:</strong> ${orden.protocoloMascotas}</p>
      <hr>
      <table>
        <thead>
          <tr>
            <th>Producto</th><th>Cant.</th><th>PU</th><th>Subt.</th>
          </tr>
        </thead>
        <tbody>
          ${orden.detalle.map(d => `
            <tr>
              <td>${d.nombre}</td>
              <td>${d.cantidad}</td>
              <td>$${d.precioUnit.toFixed(2)}</td>
              <td>$${d.subtotal.toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <hr>
      <p><strong>Total:</strong> $${orden.total.toFixed(2)}</p>
      <p><strong>Pago parcial:</strong> $${orden.pagoParcial.toFixed(2)}</p>
      <p><strong>Saldo:</strong> $${orden.saldo.toFixed(2)}</p>
      <p><strong>Dirección entrega:</strong> ${orden.direccionEntrega || "-"}</p>
      <p><strong>Observaciones:</strong> ${orden.obs || "-"}</p>
    </div>
  `;

  html2canvas(cont.querySelector(".orden-imprimible")).then(canvas => {
    canvas.toBlob(blob => {
      // Futuro: enviar blob al backend para WhatsApp Business API
      // Por ahora solo se genera internamente
    }, "image/png");
  });

  cont.style.display = "none";
}

function prepararWhatsApp(orden) {
  const tel = orden.cliente.telefono;
  if (!tel) return;

  const texto = encodeURIComponent(
`Hola ${orden.cliente.nombre}, tu orden ${orden.numero} fue generada/actualizada.

📅 Entrega estimada: ${orden.fechaEntrega}
🐾 Protocolo Mascotas: ${orden.protocoloMascotas}
💰 Total: $${orden.total.toFixed(2)}
💵 Pago parcial: $${orden.pagoParcial.toFixed(2)}
💳 Saldo pendiente: $${orden.saldo.toFixed(2)}
📍 Dirección entrega: ${orden.direccionEntrega || "No informado"}

Gracias por elegir ESPUMIN.`
  );

  const url = `https://wa.me/54${tel}?text=${texto}`;
  window.open(url, "_blank");
}
