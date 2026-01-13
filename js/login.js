document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    // Usuarios fijos
    const baseUsers = [
        { username: "admin", password: "1234", role: "admin" },
        { username: "mena", password: "espumin", role: "operador" }
    ];

    // Usuarios creados desde la app
    const storedUsers = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Unimos ambas listas
    const validUsers = [...baseUsers, ...storedUsers];

    // Buscar usuario válido
    const found = validUsers.find(u => u.username === user && u.password === pass);

    if (found) {
        localStorage.setItem("loggedUser", found.username);
        localStorage.setItem("userRole", found.role);
        window.location.href = "menu.html";
    } else {
        document.getElementById("loginError").style.display = "block";
    }
});
