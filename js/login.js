document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    // 🔐 Usuarios con roles
    const validUsers = [
        { username: "admin", password: "1234", role: "admin" },
        { username: "mena", password: "espumin", role: "operador" }
    ];

    // Buscar usuario válido
    const found = validUsers.find(u => u.username === user && u.password === pass);

    if (found) {
        // Guardar sesión completa
        localStorage.setItem("loggedUser", found.username);
        localStorage.setItem("userRole", found.role);

        // Redirigir al menú principal
        window.location.href = "menu.html";
    } else {
        document.getElementById("loginError").style.display = "block";
    }
});
