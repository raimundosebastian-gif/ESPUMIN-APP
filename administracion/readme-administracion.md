# Módulo Administración — ESPUMIN ERP

El módulo Administración centraliza la gestión del sistema: usuarios, roles, permisos y auditoría.  
Es el núcleo de control interno del ERP, asegurando orden, seguridad y trazabilidad.

---

## 📂 Estructura del módulo

administracion/
├── administracion-usuarios.html
├── administracion-roles.html
├── administracion-permisos.html
├── administracion-auditoria.html
└── readme-administracion.md

---

## 🧩 Submódulos incluidos

### 1. Usuarios

Gestión de cuentas, datos personales, correos, estados y roles asignados.

### 2. Roles

Definición de perfiles del sistema, niveles de acceso y responsabilidades.

### 3. Permisos

Control granular de acciones permitidas por módulo y por rol.

### 4. Auditoría

Registro histórico de acciones realizadas en el sistema para trazabilidad.

---

## 🎨 Estándares visuales

- Sidebar corporativo
- Header con saludo y avatar
- Tablas `.table`
- Botones `.btn` y `.btn-small`
- Estilos unificados con el resto del ERP
- Rutas relativas limpias

---

## 🔧 Estándares técnicos

- HTML modular
- Preparado para backend (IDs, nombres de campos, estructura lista)
- Sin dependencias cruzadas
- Compatible con el futuro sistema de autenticación
- Tablas listas para carga dinámica vía API

---

## ✔️ Estado del módulo

[✔] Usuarios
[✔] Roles
[✔] Permisos
[✔] Auditoría
[✔] Integración con sidebar
[✔] Integración con header
[✔] Estilos unificados
[✔] Datos de ejemplo en todas las pantallas

---

## 📌 Notas de integración

- Se relaciona con todos los módulos del ERP
- Es el punto central para seguridad y control
- Preparado para integrarse con autenticación y backend en la próxima versión

---

## 🏷 Versión

Versión: 1.1  
Autor: Meñarg SAS
