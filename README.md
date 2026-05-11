# 💊 Nova Salud - Sistema de Gestión Farmacéutica

**Nova Salud** es una aplicación web integral diseñada para optimizar la administración de farmacias y boticas. El sistema permite gestionar el ciclo completo del negocio: desde el abastecimiento con proveedores hasta la venta final al cliente, garantizando la trazabilidad mediante un Kardex de inventario y un control estricto de roles.

---

## 🚀 Características Principales

### 🔐 Seguridad y Roles de Usuario
El sistema implementa una arquitectura de permisos basada en roles para asegurar la integridad de los datos:
* **Administrador:** Acceso total a reportes, gestión de usuarios y configuración.
* **Cajero:** Especializado en el flujo de ventas, historial de transacciones y registro de clientes.
* **Farmacéutico:** Control sanitario, supervisión de stock, vencimientos y compras.
* **Almacenero:** Gestión física de stock, ingresos de mercadería y auditoría de lotes.

### 📦 Gestión de Inventario Inteligente
* **Kardex Detallado:** Trazabilidad completa de entradas y salidas por cada producto.
* **Alertas Críticas:** Notificaciones automáticas de stock mínimo y productos próximos a vencer (30 días).
* **Control de Lotes:** Registro de lotes y fechas de vencimiento en cada ingreso de mercadería.

### 📈 Inteligencia de Negocio
* **Dashboard Dinámico:** Visualización de ventas diarias y tendencias semanales mediante gráficos interactivos.
* **Reportes:** Análisis de productos más vendidos y ranking de clientes frecuentes.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React.js, Bootstrap 5, Axios, Recharts (Gráficos), SweetAlert2.
* **Backend:** Node.js, Express.js.
* **Base de Datos:** MySQL.
* **Control de Versiones:** Git & GitHub.

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone [https://github.com/vivianalvarado/nova-salud-system.git](https://github.com/vivianalvarado/nova-salud-system.git)
cd nova-salud-system
