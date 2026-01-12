document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnMensual").addEventListener("click", () => activarSeccion("mensual"));
  document.getElementById("btnAnual").addEventListener("click", () => activarSeccion("anual"));
  document.getElementById("btnCliente").addEventListener("click", () => activarSeccion("cliente"));
  document.getElementById("btnEmpleado").addEventListener("click", () => activarSeccion("empleado"));
  document.getElementById("btnExportar").addEventListener("click", () => activarSeccion("exportar"));
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
