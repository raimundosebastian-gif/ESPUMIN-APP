// ===============================
//   SUBMENÚ DE REPORTES
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const botones = {
      mensual: document.getElementById("btnMensual"),
      anual: document.getElementById("btnAnual"),
      cliente: document.getElementById("btnCliente"),
      empleado: document.getElementById("btnEmpleado"),
      exportar: document.getElementById("btnExportar")
    };

    if (!botones.mensual) return; // evita error si el menú aún no cargó

    botones.mensual.addEventListener("click", () => activarSeccion("mensual"));
    botones.anual.addEventListener("click", () => activarSeccion("anual"));
    botones.cliente.addEventListener("click", () => activarSeccion("cliente"));
    botones.empleado.addEventListener("click", () => activarSeccion("empleado"));
    botones.exportar.addEventListener("click", () => activarSeccion("exportar"));
  }, 200);
});

function activarSeccion(seccion) {
  document.querySelectorAll(".subbanner a").forEach(a => a.classList.remove("activo"));
  document.getElementById("btn" + capitalizar(seccion)).classList.add("activo");

  document.querySelectorAll(".seccion-reporte").forEach(div => div.style.display = "none");
  document.getElementById("seccion-" + seccion).style.display = "block";
}

function capitalizar(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}



// ===============================
//   REPORTE MENSUAL
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnGenerarReporte");
  if (btn) btn.addEventListener("click", generarReporteMensual);
});

function generarReporteMensual() {
  const mes = parseInt(document.getElementById("mesReporte").value);
  const anio = parseInt(document.getElementById("anioReporte").value);

  const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];

  // Filtrar órdenes del mes/año
  const filtradas = ordenes.filter(o => {
    const partes = o.fecha.split("/"); // dd/mm/yyyy
    const d = parseInt(partes[0]);
    const m = parseInt(partes[1]) - 1;
    const y = parseInt(partes[2]);
    return m === mes && y === anio;
  });

  if (filtradas.length === 0) {
    document.getElementById("tablaReporte").innerHTML =
      "<p>No hay órdenes para este mes.</p>";
    return;
  }

  // Obtener lista de productos
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const nombresProductos = productos.map(p => p.nombre);

  // Crear matriz vacía
  const diasMes = new Date(anio, mes + 1, 0).getDate();
  const matriz = {};

  nombresProductos.forEach(prod => {
    matriz[prod] = Array(diasMes).fill(0);
  });

  // Llenar matriz
  filtradas.forEach(o => {
    const partes = o.fecha.split("/");
    const dia = parseInt(partes[0]) - 1;

    o.items.forEach(item => {
      if (matriz[item.producto] !== undefined) {
        matriz[item.producto][dia] += parseInt(item.cantidad);
      }
    });
  });

  renderTablaMensual(matriz, diasMes);
}

function renderTablaMensual(matriz, diasMes) {
  let html = "<table class='tabla'><thead><tr><th>Producto</th>";

  for (let d = 1; d <= diasMes; d++) html += `<th>${d}</th>`;
  html += "<th>Total</th></tr></thead><tbody>";

  for (const prod in matriz) {
    let total = matriz[prod].reduce((a, b) => a + b, 0);

    html += `<tr><td>${prod}</td>`;
    matriz[prod].forEach(v => html += `<td>${v}</td>`);
    html += `<td><b>${total}</b></td></tr>`;
  }

  html += "</tbody></table>";

  document.getElementById("tablaReporte").innerHTML = html;
}



// ===============================
//   EXPORTAR REPORTE MENSUAL
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnExportarMensual");
  if (btn) btn.addEventListener("click", exportarMensual);
});

function exportarMensual() {
  const tabla = document.querySelector("#tablaReporte table");
  if (!tabla) {
    alert("No hay reporte generado.");
    return;
  }

  let csv = "";
  const filas = tabla.querySelectorAll("tr");

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll("th, td");
    const filaCSV = Array.from(celdas).map(c => c.innerText).join(",");
    csv += filaCSV + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "reporte_mensual.csv";
  a.click();

  URL.revokeObjectURL(url);
}
