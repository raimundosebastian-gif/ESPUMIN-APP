/* ============================================
   LOGIN DEL SISTEMA - ESPUMIN ERP
   Conexión directa al core y auditoría
============================================ */

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("btnLogin");
    if (!btn) return; // Seguridad por si el botón no existe

    btn.addEventListener("click", () => {
        const usuario = document.getElementById("usuario").value.trim();
        const clave = document.getElementById("clave").value.trim();

        if (!usuario || !clave) {
            alert("Por favor complete usuario y contraseña");
            return;
        }

        // Llama a la función login() del core
        if (login(usuario, clave)) {
            location.href = "dashboard.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });

});
