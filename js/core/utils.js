// Funciones utilitarias globales

export function $(selector) {
  return document.querySelector(selector);
}

export function $all(selector) {
  return document.querySelectorAll(selector);
}

export function log(msg) {
  console.log("[ERP]", msg);
}
