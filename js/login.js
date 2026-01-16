document.getElementById("btnLogin").addEventListener("click", () => {
    const usuario = document.getElementById("usuario").value;
    const clave = document.getElementById("clave").value;

    if (login(usuario, clave)) {
        location.href = "dashboard.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});
