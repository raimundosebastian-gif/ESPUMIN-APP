# Módulo Compras — ESPUMIN ERP

El módulo de Compras gestiona proveedores, órdenes de compra y reportes de abastecimiento.  
Es un módulo clave para garantizar la disponibilidad de insumos y materiales necesarios para la operación.

---

## 📂 Estructura del módulo

compras/
├── compras-listado.html
├── compras-nuevo.html
├── compras-editar.html
├── compras-reportes.html
└── readme-compras.md

## 🧩 Submódulos incluidos

### 1. Listado

Visualización de todas las órdenes de compra registradas.

### 2. Nuevo

Alta de nuevas órdenes de compra, con datos de proveedor, ítems y condiciones.

### 3. Editar

Modificación de órdenes existentes antes de su aprobación o recepción.

### 4. Reportes

Análisis de compras por proveedor, por período, por categoría y por monto.

---

## 🎨 Estándares visuales

- Sidebar dinámico
- Header con saludo y avatar
- Estilos corporativos unificados
- Formularios `.form` y `.form-group`
- Tablas `.table`
- Tarjetas `.report-card`

---

## 🔧 Estándares técnicos

- HTML modular
- Rutas relativas limpias
- Independencia total del resto de módulos
- Preparado para backend (IDs y estructura lista)
- Sin dependencias cruzadas
- Compatible con Inventario y Producción a nivel conceptual

---

## ✔️ Estado del módulo

---

## 📌 Notas de integración

- Se relaciona conceptualmente con Producción (insumos)
- Se relaciona con Compras (ingresos de stock)
- Se relaciona con Ventas (egresos de stock)
- No tiene dependencias técnicas directas

---

## 🏷 Versión

Versión: 1.0  
Autor: Meñarg SAS
