document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    const validUsers = [
        { username: "admin", password: "1234" },
        { username: "mena", password: "espumin" }
    ];

    const found = validUsers.find(u => u.username === user && u.password === pass);

    if (found) {
        localStorage.setItem("loggedUser", user);
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("loginError").style.display = "block";
    }
});
