# ESPUMIN ERP  
Sistema de gestión integral para pequeñas y medianas empresas  
Versión 1.0

ESPUMIN ERP es un sistema modular, simple, sólido y eficaz, diseñado para gestionar las operaciones centrales de una empresa: ventas, compras, inventario, producción, cuentas corrientes, caja, impuestos, reportes y más.

El sistema funciona completamente en entorno local (navegador), sin necesidad de servidor ni base de datos externa. Toda la información se almacena en `localStorage`, permitiendo una instalación rápida, liviana y portable.

---

## 🚀 Características principales

- **Arquitectura modular**  
- **Interfaz simple y consistente**  
- **Auditoría completa de acciones**  
- **Sistema de usuarios y roles**  
- **Parámetros globales del sistema**  
- **Reportes e informes con gráficos opcionales**  
- **Backups locales**  
- **Producción y control de stock**  
- **Cuentas corrientes de clientes y proveedores**  
- **Agenda y notificaciones**  
- **Totalmente offline**

---

## 📦 Módulos incluidos

- Dashboard  
- Productos  
- Precios  
- Clientes  
- Proveedores  
- Inventario  
- Compras  
- Ventas  
- Logística  
- Caja  
- Cuentas Clientes  
- Cuentas Proveedores  
- Impuestos  
- Producción  
- Agenda  
- Notificaciones  
- Auditoría  
- Configuración  
- Parámetros del Sistema  
- Usuarios y Roles  
- Reportes e Informes  
- Backups  

---

## 🔐 Sistema de usuarios y roles

Roles disponibles:

- Administrador  
- Ventas  
- Compras  
- Producción  
- Logística  
- Caja  
- Auditoría  

Cada módulo valida acceso mediante `protegerModulo()` y el menú se adapta automáticamente según el rol.

---

## 📊 Reportes e Informes

Incluye:

- Ventas por mes  
- Compras por mes  
- Rentabilidad  
- Stock crítico  
- Producción finalizada  
- Cuentas corrientes  
- Impuestos próximos a vencer  
- Gráfico comparativo (si está habilitado en Parámetros)

---

## ⚙️ Instalación

1. Descargar o clonar el repositorio  
2. Abrir `index.html` o `login.html` en cualquier navegador moderno  
3. Iniciar sesión con el usuario administrador  
4. Configurar parámetros del sistema  
5. Comenzar a operar

No requiere servidor, base de datos ni dependencias externas.

---

## 🔧 Requisitos

- Navegador moderno (Chrome, Edge, Firefox, Brave)  
- Habilitación de `localStorage`  

---

## 🧪 Usuario inicial (instalador base cero)

- **Usuario:** admin  
- **Clave:** 1234  
- **Rol:** Administrador  

---

## 🗂 Estructura del proyecto

