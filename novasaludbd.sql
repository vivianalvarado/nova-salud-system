-- CREAR BASE DE DATOS
CREATE DATABASE IF NOT EXISTS novasaludbd;
USE novasaludbd;

-- TABLAS
CREATE TABLE categoria (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE roles (
	id INT AUTO_INCREMENT PRIMARY KEY,
	rol VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE laboratorio (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(250)
);

CREATE TABLE usuario (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150),
    credenciales VARCHAR(300),
    id_rol INT,
    FOREIGN KEY(id_rol) REFERENCES roles(id)
);

CREATE TABLE cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dni_ruc VARCHAR(20) UNIQUE,
  nombre VARCHAR(150),
  telefono VARCHAR(20)
);

CREATE TABLE producto (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150),
    descripcion VARCHAR(250),
    precio_venta DECIMAL(10,2),
    stock_actual INT,
    stock_minimo INT,
    lote VARCHAR(50),
    fecha_vencimiento DATE,
    id_categoria INT,
    id_laboratorio INT,
    FOREIGN KEY (id_laboratorio) REFERENCES laboratorio(id),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id)
);

CREATE TABLE venta (
	id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hora DATETIME,
    total DECIMAL(10,2),
    estado ENUM('en proceso', 'completada', 'anulada') DEFAULT 'en proceso',
    id_usuario INT,
    id_cliente INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id)
);

CREATE TABLE detalle_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT,
    id_producto INT,
    cantidad INT,
    precio_unitario DECIMAL(10, 2),
    subtotal DECIMAL(10, 2),
    FOREIGN KEY (id_venta) REFERENCES venta(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id)
);

CREATE TABLE proveedores(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(250),
    contacto VARCHAR(150),
    telefono VARCHAR(20)
);

CREATE TABLE compras_ingresos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hora DATETIME,
    total DECIMAL(10,2),
    id_proveedor INT,
    id_usuario INT,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

CREATE TABLE detalle_compra(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT,
    id_producto INT,
    cantidad INT,
    precio_compra DECIMAL(10, 2),
    subtotal DECIMAL(10, 2),
    lote VARCHAR(50),
    FOREIGN KEY (id_compra) REFERENCES compras_ingresos(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id)
);

-- =========================
-- INSERTS
-- =========================

-- ROLES (INCLUYE ADMIN)
INSERT INTO roles (rol) VALUES 
('admin'),
('cajero'),
('farmaceutico'),
('almacenero');

-- CATEGORIAS
INSERT INTO categoria (nombre) VALUES
('Analgésicos'),
('Antibióticos'),
('Vitaminas'),
('Jarabes'),
('Dermatológicos');

-- LABORATORIOS
INSERT INTO laboratorio (nombre, descripcion) VALUES
('Bayer', 'Laboratorio farmacéutico internacional'),
('Pfizer', 'Especialistas en medicamentos innovadores'),
('Genfar', 'Medicamentos genéricos'),
('Roemmers', 'Productos farmacéuticos de calidad');

-- USUARIOS (INCLUYE ADMIN)
INSERT INTO usuario (nombre, credenciales, id_rol) VALUES
('Administrador', 'admin123', 1),
('Carlos Pérez', '123456', 2),
('María López', 'abcdef', 3),
('Luis Torres', 'pass123', 4);

-- CLIENTES
INSERT INTO cliente (dni_ruc, nombre, telefono) VALUES
('12345678', 'Juan García', '987654321'),
('87654321', 'Ana Torres', '912345678'),
('11223344', 'Pedro Ruiz', '998877665');

-- PRODUCTOS
INSERT INTO producto 
(nombre, descripcion, precio_venta, stock_actual, stock_minimo, lote, fecha_vencimiento, id_categoria, id_laboratorio)
VALUES
('Paracetamol 500mg', 'Alivio del dolor y fiebre', 1.50, 100, 20, 'L001', '2027-05-10', 1, 1),
('Amoxicilina 500mg', 'Antibiótico de amplio espectro', 2.80, 80, 15, 'L002', '2026-12-01', 2, 2),
('Vitamina C', 'Refuerzo del sistema inmune', 0.90, 150, 30, 'L003', '2027-03-15', 3, 3),
('Jarabe para la tos', 'Alivio de tos seca', 5.50, 60, 10, 'L004', '2026-08-20', 4, 4),
('Crema dermatológica', 'Tratamiento para la piel', 8.00, 40, 8, 'L005', '2027-01-01', 5, 1);

-- PROVEEDORES
INSERT INTO proveedores (nombre, contacto, telefono) VALUES
('Distribuidora Salud SAC', 'Miguel Ramos', '999888777'),
('Farmalogic Perú', 'Lucía Castro', '988776655');

-- COMPRAS
INSERT INTO compras_ingresos (fecha_hora, total, id_proveedor, id_usuario) VALUES
(NOW(), 200.00, 1, 4),
(NOW(), 150.00, 2, 4);

-- DETALLE COMPRA
INSERT INTO detalle_compra (id_compra, id_producto, cantidad, precio_compra, subtotal, lote) VALUES
(1, 1, 50, 1.00, 50.00, 'L001'),
(1, 2, 30, 2.00, 60.00, 'L002'),
(2, 3, 100, 0.50, 50.00, 'L003'),
(2, 4, 20, 4.00, 80.00, 'L004');

-- VENTAS
INSERT INTO venta (fecha_hora, total, estado, id_usuario, id_cliente) VALUES
(NOW(), 10.50, 'completada', 2, 1),
(NOW(), 5.50, 'completada', 2, 2);

-- DETALLE VENTA
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 3, 1.50, 4.50),
(1, 3, 2, 0.90, 1.80),
(1, 4, 1, 5.50, 5.50),
(2, 4, 1, 5.50, 5.50);