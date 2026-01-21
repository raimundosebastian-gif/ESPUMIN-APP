import { $, log } from "../core/utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = $("#logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      log("Cerrando sesión...");
      window.location.href = "login.html";
    });
  }
});
// ===========================
// FOOTER: usuario + avatar + logout
// ===========================

const footerUser = $("#footerUser");
const footerAvatar = $("#footerAvatar");
const footerLogout = $("#footerLogout");

if (usuario && footerUser && footerAvatar) {
  footerUser.textContent = usuario;
  footerAvatar.style.backgroundImage = `url("img/avatar-default.svg")`;
}

if (footerLogout) {
  footerLogout.addEventListener("click", () => {
    clearLocal("usuario");
    window.location.href = "login.html";
  });
}
