// server/index.js
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Conexión a la base de datos de Nova Salud
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "novasaludbd"
});

db.connect((err) => {
  if (err) {
    console.log("❌ Error de conexión a la BD:", err.code);
    console.log("❌ Revisa tu contraseña o si MySQL está encendido.");
  } else {
    console.log("✅ ¡Conectado exitosamente a la base de datos de Nova Salud!");
  }
});

// Ruta para el Login (Estilo SENATI)
app.post("/login", (req, res) => {
  const nombre = req.body.nombre;
  const credenciales = req.body.credenciales;

  // Hacemos un JOIN con la tabla roles para traer el nombre del rol
  const sql = `
    SELECT u.id, u.nombre, u.id_rol, r.rol 
    FROM usuario u 
    JOIN roles r ON u.id_rol = r.id 
    WHERE u.nombre = ? AND u.credenciales = ?`;

  db.query(sql, [nombre, credenciales], (err, result) => {
    if (err) {
      console.log(err);
      res.send({ error: err });
    } else {
      if (result.length > 0) {
        // Ahora enviamos el objeto con el campo 'rol' incluido
        res.send({ mensaje: "Login exitoso", usuario: result[0] });
      } else {
        res.send({ mensaje: "Usuario o contraseña incorrectos" });
      }
    }
  });
});

// crear / registrar un nuevo producto
app.post("/createProducto", (req, res) => {
  const { nombre, descripcion, precio_venta, stock_actual, stock_minimo, lote, fecha_vencimiento, id_categoria, id_laboratorio } = req.body;

  db.query(
    'INSERT INTO producto (nombre, descripcion, precio_venta, stock_actual, stock_minimo, lote, fecha_vencimiento, id_categoria, id_laboratorio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nombre, descripcion, precio_venta, stock_actual, stock_minimo, lote, fecha_vencimiento, id_categoria, id_laboratorio],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ error: "Error al registrar el producto" });
      } else {
        res.send({ mensaje: "Producto registrado exitosamente" });
      }
    }
  );
});

// Leer / listar todos los productos
app.get("/productos", (req, res) => {
  const sql = `
    SELECT p.*, 
           c.nombre as nombre_categoria, 
           l.nombre as nombre_laboratorio 
    FROM producto p 
    LEFT JOIN categoria c ON p.id_categoria = c.id 
    LEFT JOIN laboratorio l ON p.id_laboratorio = l.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//actualizar / editar un producto
app.put("/updateProducto", (req, res) => {
  const { id, nombre, descripcion, precio_venta, stock_actual, stock_minimo, lote, fecha_vencimiento, id_categoria, id_laboratorio } = req.body;

  db.query(
    'UPDATE producto SET nombre=?, descripcion=?, precio_venta=?, stock_actual=?, stock_minimo=?, lote=?, fecha_vencimiento=?, id_categoria=?, id_laboratorio=? WHERE id=?',
    [nombre, descripcion, precio_venta, stock_actual, stock_minimo, lote, fecha_vencimiento, id_categoria, id_laboratorio, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Producto actualizado con éxito!!");
      }
    }
  );
});

// eliminar un producto
app.delete("/deleteProducto/:id", (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM producto WHERE id=?', id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/categorias", (req, res) => {
  db.query("SELECT * FROM categoria", (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

app.get("/laboratorios", (req, res) => {
  db.query("SELECT * FROM laboratorio", (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

app.get("/ventasHoy", (req, res) => {
  const sql = "SELECT SUM(total) AS total_dia FROM venta WHERE DATE(fecha_hora) = CURDATE() AND estado = 'completada'";
  
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      const total = result[0].total_dia || 0;
      res.send({ total_dia: total });
    }
  });
});

app.get("/stockBajoCount", (req, res) => {
  // La consulta debe ser idéntica a la que ejecutaste en phpMyAdmin
  const sql = "SELECT COUNT(*) AS total_alertas FROM producto WHERE stock_actual <= stock_minimo";
  
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Enviamos el número real
      res.send({ total_alertas: result[0].total_alertas });
    }
  });
});

app.get("/totalClientes", (req, res) => {
  const sql = "SELECT COUNT(*) AS total FROM cliente";
  
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send({ total: result[0].total });
    }
  });
});

app.get("/ventasSemanales", (req, res) => {
  // Esta consulta agrupa las ventas por los últimos 7 días
  const sql = `
    SELECT DATE(fecha_hora) as fecha, SUM(total) as total 
    FROM venta 
    WHERE fecha_hora >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(fecha_hora)
    ORDER BY fecha ASC
  `;
  
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/alertasDetalladas", (req, res) => {
  // Esta consulta busca stock bajo O vencimiento en menos de 30 días
  const sql = `
    SELECT id, nombre, stock_actual, stock_minimo, fecha_vencimiento 
    FROM producto 
    WHERE stock_actual <= stock_minimo 
    OR fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
  `;
  db.query(sql, (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

app.post("/registrarVenta", (req, res) => {
  const { id_cliente, id_usuario, total, productos } = req.body;

  const sqlVenta = "INSERT INTO venta (fecha_hora, total, estado, id_cliente, id_usuario) VALUES (NOW(), ?, 'completada', ?, ?)";
  
  db.query(sqlVenta, [total, id_cliente, id_usuario], (err, result) => {
    if (err) return res.status(500).send(err);

    const id_venta = result.insertId;

    productos.forEach((p) => {
      const sqlDetalle = "INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)";
      db.query(sqlDetalle, [id_venta, p.id, p.cantidad, p.precio_venta, (p.cantidad * p.precio_venta)], (err) => {
        if (err) console.log("Error en detalle:", err);

        db.query("UPDATE producto SET stock_actual = stock_actual - ? WHERE id = ?", [p.cantidad, p.id]);
      });
    });

    res.send({ mensaje: "Venta realizada con éxito", id_venta });
  });
});

app.post("/pausarVenta", (req, res) => {
  const { id_cliente, id_usuario, total, productos } = req.body;

  // Grabamos con estado 'proceso'
  const sqlVenta = "INSERT INTO venta (fecha_hora, total, estado, id_cliente, id_usuario) VALUES (NOW(), ?, 'en proceso', ?, ?)";
  
  db.query(sqlVenta, [total, id_cliente, id_usuario], (err, result) => {
    if (err) return res.status(500).send(err);

    const id_venta = result.insertId;

    // Guardamos el detalle para no perder qué productos eligió el cliente
    productos.forEach((p) => {
      const sqlDetalle = "INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)";
      db.query(sqlDetalle, [id_venta, p.id, p.cantidad, p.precio_venta, (p.cantidad * p.precio_venta)], (err) => {
        if (err) console.log("Error en detalle pausado:", err);
        // NOTA: Aquí NO descontamos stock aún.
      });
    });

    res.send({ mensaje: "Venta guardada en proceso", id_venta });
  });
});

// 1. OBTENER VENTAS EN PROCESO (Faltaba en tu código)
app.get("/ventasEnProceso", (req, res) => {
  const sql = `
    SELECT v.*, c.nombre as nombre_cliente 
    FROM venta v 
    JOIN cliente c ON v.id_cliente = c.id 
    WHERE v.estado = 'en proceso'
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

// 2. OBTENER EL DETALLE DE UNA VENTA ESPECÍFICA (Para "Continuar Venta")
app.get("/detalleVenta/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT dv.*, p.nombre, p.precio_venta 
    FROM detalle_venta dv
    JOIN producto p ON dv.id_producto = p.id
    WHERE dv.id_venta = ?
  `;
  db.query(sql, [id], (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// 3. ELIMINAR VENTA (Para cancelar o al recuperar una pendiente)
app.delete("/deleteVenta/:id", (req, res) => {
  const id = req.params.id;
  
  // Primero borramos el detalle (por la llave foránea)
  db.query('DELETE FROM detalle_venta WHERE id_venta = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    
    // Luego borramos la venta
    db.query('DELETE FROM venta WHERE id = ?', [id], (err, result) => {
      if (err) res.status(500).send(err);
      else res.send(result);
    });
  });
});

app.get("/buscarCliente/:documento", (req, res) => {
  const documento = req.params.documento;
  const sql = "SELECT id, nombre, dni_ruc AS documento FROM cliente WHERE dni_ruc = ?";
  
  db.query(sql, [documento], (err, result) => {
    if (err) {
      console.error("❌ ERROR AL BUSCAR CLIENTE:", err.message);
      return res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

// 1. Obtener historial de ventas (con filtros de fecha si se requiere)
app.get("/historialVentas", (req, res) => {
  const sql = `
    SELECT v.*, c.nombre as nombre_cliente, u.nombre as nombre_usuario 
    FROM venta v 
    JOIN cliente c ON v.id_cliente = c.id 
    JOIN usuario u ON v.id_usuario = u.id 
    ORDER BY v.fecha_hora DESC
  `;
  db.query(sql, (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// 2. Anular una venta (No la borramos, cambiamos su estado)
app.put("/anularVenta/:id", (req, res) => {
  const id = req.params.id;
  
  // 1. Cambiamos el estado a 'anulada'
  db.query("UPDATE venta SET estado = 'anulada' WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);

    // 2. IMPORTANTE: Devolver el stock de los productos al inventario
    const sqlDetalle = "SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta = ?";
    db.query(sqlDetalle, [id], (err, productos) => {
      if (!err) {
        productos.forEach(p => {
          db.query("UPDATE producto SET stock_actual = stock_actual + ? WHERE id = ?", [p.cantidad, p.id_producto]);
        });
      }
    });
    res.send({ mensaje: "Venta anulada y stock devuelto" });
  });
});

app.get("/detalleVentaHistorial/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT dv.cantidad, dv.precio_unitario, dv.subtotal, p.nombre 
    FROM detalle_venta dv
    JOIN producto p ON dv.id_producto = p.id
    WHERE dv.id_venta = ?
  `;
  db.query(sql, [id], (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// Actualizar producto
app.put("/updateProducto", (req, res) => {
  const { id, nombre, descripcion, precio_venta, stock_actual, stock_minimo, lote, fecha_vencimiento, id_categoria, id_laboratorio } = req.body;

  db.query(
    'UPDATE producto SET nombre=?, descripcion=?, precio_venta=?, stock_actual=?, stock_minimo=?, lote=?, fecha_vencimiento=?, id_categoria=?, id_laboratorio=? WHERE id=?',
    [nombre, descripcion, precio_venta, stock_actual, stock_minimo, lote, fecha_vencimiento, id_categoria, id_laboratorio, id],
    (err, result) => {
      if (err) res.status(500).send(err);
      else res.send("Producto actualizado");
    }
  );
});

// Eliminar producto
app.delete("/deleteProducto/:id", (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM producto WHERE id=?', id, (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

app.get("/productoDetalle/:id", (req, res) => {
  const id = req.params.id;
  
  // Consulta 1: Datos Técnicos
  const sqlInfo = `
    SELECT p.*, c.nombre as nombre_categoria, l.nombre as nombre_laboratorio 
    FROM producto p 
    LEFT JOIN categoria c ON p.id_categoria = c.id 
    LEFT JOIN laboratorio l ON p.id_laboratorio = l.id
    WHERE p.id = ?`;

  // Consulta 2: Historial de Ventas
  const sqlVentas = `
    SELECT v.fecha_hora, dv.cantidad, v.total, c.nombre as cliente
    FROM detalle_venta dv
    JOIN venta v ON dv.id_venta = v.id
    JOIN cliente c ON v.id_cliente = c.id
    WHERE dv.id_producto = ?
    ORDER BY v.fecha_hora DESC LIMIT 10`;

  db.query(sqlInfo, [id], (err, info) => {
    if (err) return res.status(500).send(err);
    
    db.query(sqlVentas, [id], (err, ventas) => {
      if (err) return res.status(500).send(err);
      
      // Enviamos todo en un solo objeto
      res.send({
        info: info[0],
        ventas: ventas
      });
    });
  });
});

app.get("/kardex/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    /* SALIDAS POR VENTAS */
    SELECT 
        v.fecha_hora AS fecha, 
        'VENTA' AS tipo, 
        -dv.cantidad AS cantidad,
        v.id AS referencia
    FROM detalle_venta dv
    JOIN venta v ON dv.id_venta = v.id
    WHERE dv.id_producto = ? AND v.estado = 'completada'

    UNION ALL

    /* ENTRADAS POR COMPRAS */
    SELECT 
        c.fecha_hora AS fecha, 
        'COMPRA' AS tipo, 
        dc.cantidad AS cantidad,
        c.id AS referencia
    FROM detalle_compra dc
    JOIN compras_ingresos c ON dc.id_compra = c.id
    WHERE dc.id_producto = ?

    ORDER BY fecha ASC
  `;

  db.query(sql, [id, id], (err, result) => {
    if (err) return res.status(500).send(err);

    let stockAcumulado = 0;
    const kardexConStock = result.map((mov) => {
      stockAcumulado += mov.cantidad;
      return { ...mov, stock_resultante: stockAcumulado };
    });

    res.send(kardexConStock);
  });
});

app.get("/alertasStock", (req, res) => {
  const sql = `
    SELECT p.*, l.nombre as nombre_laboratorio 
    FROM producto p 
    LEFT JOIN laboratorio l ON p.id_laboratorio = l.id
    WHERE p.stock_actual <= p.stock_minimo 
       OR p.fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    ORDER BY p.fecha_vencimiento ASC
  `;
  db.query(sql, (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// A. Obtener lista de proveedores para el select
app.get("/proveedores", (req, res) => {
  db.query("SELECT * FROM proveedores", (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// B. Registrar la Compra (Lógica Maestra)
app.post("/registrarCompra", (req, res) => {
  const { id_proveedor, id_usuario, total, productos } = req.body;
  const fecha_hora = new Date();

  // Iniciamos Transacción
  db.beginTransaction((err) => {
    if (err) throw err;

    // 1. Insertar en compras_ingresos
    const sqlCompra = "INSERT INTO compras_ingresos (fecha_hora, total, id_proveedor, id_usuario) VALUES (?, ?, ?, ?)";
    db.query(sqlCompra, [fecha_hora, total, id_proveedor, id_usuario], (err, result) => {
      if (err) {
        return db.rollback(() => { res.status(500).send(err); });
      }

      const id_compra = result.insertId;

      // 2. Insertar detalles y actualizar stock
      // Usamos un bucle para procesar cada producto que llegó
      productos.forEach((p) => {
        const sqlDetalle = "INSERT INTO detalle_compra (id_compra, id_producto, cantidad, precio_compra, subtotal, lote) VALUES (?, ?, ?, ?, ?, ?)";
        const subtotal = p.cantidad * p.precio_compra;

        db.query(sqlDetalle, [id_compra, p.id, p.cantidad, p.precio_compra, subtotal, p.lote], (err) => {
          if (err) {
            return db.rollback(() => { res.status(500).send(err); });
          }

          // 3. ¡LA MAGIA!: Aumentar stock_actual en la tabla producto
          const sqlUpdateStock = "UPDATE producto SET stock_actual = stock_actual + ?, lote = ? WHERE id = ?";
          db.query(sqlUpdateStock, [p.cantidad, p.lote, p.id], (err) => {
            if (err) {
              return db.rollback(() => { res.status(500).send(err); });
            }
          });
        });
      });

      // Si todo salió bien, confirmamos
      db.commit((err) => {
        if (err) {
          return db.rollback(() => { res.status(500).send(err); });
        }
        res.send({ message: "Compra registrada y stock actualizado con éxito" });
      });
    });
  });
});

// A. Obtener lista general de compras
app.get("/historialCompras", (req, res) => {
  const sql = `
    SELECT c.id, c.fecha_hora, c.total, p.nombre AS proveedor, u.nombre AS usuario
    FROM compras_ingresos c
    JOIN proveedores p ON c.id_proveedor = p.id
    JOIN usuario u ON c.id_usuario = u.id
    ORDER BY c.fecha_hora DESC
  `;
  db.query(sql, (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// B. Obtener el detalle de una compra específica
app.get("/detalleCompra/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT dc.*, p.nombre AS producto
    FROM detalle_compra dc
    JOIN producto p ON dc.id_producto = p.id
    WHERE dc.id_compra = ?
  `;
  db.query(sql, [id], (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// A. Ventas por Fecha (Diario y Mensual)
app.get("/reporte-ventas", (req, res) => {
  const sql = `
    SELECT 
      DATE(fecha_hora) as fecha, 
      SUM(total) as ingresos, 
      COUNT(id) as num_ventas 
    FROM venta 
    WHERE estado = 'completada'
    GROUP BY DATE(fecha_hora) 
    ORDER BY fecha DESC LIMIT 30`;
  db.query(sql, (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// B. Ranking de Productos Más Vendidos
app.get("/top-productos", (req, res) => {
  const sql = `
    SELECT p.nombre, SUM(dv.cantidad) as total_vendido
    FROM detalle_venta dv
    JOIN producto p ON dv.id_producto = p.id
    JOIN venta v ON dv.id_venta = v.id
    WHERE v.estado = 'completada'
    GROUP BY p.id
    ORDER BY total_vendido DESC LIMIT 10`;
  db.query(sql, (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// C. Clientes Frecuentes
app.get("/clientes-frecuentes", (req, res) => {
  const sql = `
    SELECT c.nombre, COUNT(v.id) as visitas, SUM(v.total) as total_gastado
    FROM venta v
    JOIN cliente c ON v.id_cliente = c.id
    WHERE v.estado = 'completada'
    GROUP BY c.id
    ORDER BY total_gastado DESC LIMIT 10`;
  db.query(sql, (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// --- USUARIOS ---
app.get("/usuarios", (req, res) => {
  const sql = "SELECT u.id, u.nombre, u.credenciales, u.id_rol, r.rol FROM usuario u JOIN roles r ON u.id_rol = r.id";
  db.query(sql, (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

app.post("/createUsuario", (req, res) => {
  const { nombre, credenciales, id_rol } = req.body;
  db.query("INSERT INTO usuario (nombre, credenciales, id_rol) VALUES (?, ?, ?)", [nombre, credenciales, id_rol], (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// --- ROLES (Solo lectura para el select) ---
app.get("/roles", (req, res) => {
  db.query("SELECT * FROM roles", (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// --- PROVEEDORES (CRUD) ---
app.get("/proveedoresFull", (req, res) => {
  db.query("SELECT * FROM proveedores", (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

app.listen(3001, () => {
  console.log("corriendo el puerto 3001");
});