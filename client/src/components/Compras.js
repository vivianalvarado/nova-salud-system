import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";

const Compras = () => {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cart, setCart] = useState([]);
  const [idProveedor, setIdProveedor] = useState("");

  const [selectedProd, setSelectedProd] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [lote, setLote] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3001/proveedores")
      .then((res) => setProveedores(res.data));

    Axios.get("http://localhost:3001/productos")
      .then((res) => setProductos(res.data));
  }, []);

  const agregarAlDetalle = () => {
    if (!selectedProd || !cantidad || !precioCompra || !lote) {
      return Swal.fire(
        "Atención",
        "Completa todos los campos del producto",
        "warning"
      );
    }

    const productoEncontrado = productos.find(
      (p) => p.id === parseInt(selectedProd)
    );

    const nuevoItem = {
      id: productoEncontrado.id,
      nombre: productoEncontrado.nombre,
      cantidad: parseInt(cantidad),
      precio_compra: parseFloat(precioCompra),
      lote: lote,
      subtotal: parseInt(cantidad) * parseFloat(precioCompra),
    };

    setCart([...cart, nuevoItem]);

    setSelectedProd("");
    setCantidad("");
    setPrecioCompra("");
    setLote("");
  };

  const eliminarProducto = (index) => {
    const nuevoCart = [...cart];
    nuevoCart.splice(index, 1);
    setCart(nuevoCart);
  };

  const calcularTotal = () =>
    cart.reduce((acc, item) => acc + item.subtotal, 0);

  const guardarCompra = () => {
    if (!idProveedor || cart.length === 0) {
      return Swal.fire(
        "Error",
        "Selecciona un proveedor y agrega al menos un producto",
        "error"
      );
    }

    const datosCompra = {
      id_proveedor: idProveedor,
      id_usuario: 1,
      total: calcularTotal(),
      productos: cart,
    };

    Axios.post("http://localhost:3001/registrarCompra", datosCompra)
      .then((res) => {
        Swal.fire("¡Éxito!", res.data.message, "success");

        setCart([]);
        setIdProveedor("");
      })
      .catch(() => {
        Swal.fire(
          "Error",
          "No se pudo registrar la compra",
          "error"
        );
      });
  };

  return (
    <div
      className="min-vh-100 py-4 px-3"
      style={{
        background:
          "linear-gradient(135deg, #f4f7ff 0%, #eef2ff 50%, #ffffff 100%)",
      }}
    >
      <div className="container-fluid">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">

          <div>
            <h1 className="fw-bold text-dark mb-1">
              🚚 Registro de Compras
            </h1>

            <p className="text-muted mb-0">
              Gestión de ingresos de mercadería al almacén
            </p>
          </div>

          <div
            className="shadow-sm rounded-4 px-4 py-3"
            style={{
              background: "white",
              border: "1px solid #e9ecef",
            }}
          >
            <span className="fw-semibold text-secondary">
              📦 Productos agregados: {cart.length}
            </span>
          </div>

        </div>

        {/* TARJETAS SUPERIORES */}
        <div className="row g-4 mb-4">

          {/* PROVEEDOR */}
          <div className="col-lg-8">

            <div className="card border-0 shadow-lg rounded-4 h-100">
              <div className="card-body p-4">

                <h4 className="fw-bold mb-4 text-dark">
                  🏢 Información del Proveedor
                </h4>

                <label className="form-label fw-semibold text-secondary">
                  Selecciona un proveedor
                </label>

                <select
                  className="form-select form-select-lg rounded-4 border-0 shadow-sm"
                  value={idProveedor}
                  onChange={(e) => setIdProveedor(e.target.value)}
                  style={{
                    background: "#f8f9fa",
                    padding: "15px",
                  }}
                >
                  <option value="">Seleccione Proveedor</option>

                  {proveedores.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.nombre}
                    </option>
                  ))}
                </select>

              </div>
            </div>

          </div>

          {/* TOTAL */}
          <div className="col-lg-4">

            <div
              className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #198754 0%, #20c997 100%)",
              }}
            >
              <div className="card-body text-white p-4 d-flex flex-column justify-content-center">

                <p className="opacity-75 mb-2 fw-semibold">
                  Total de la Compra
                </p>

                <h1 className="fw-bold mb-0">
                  S/ {calcularTotal().toFixed(2)}
                </h1>

              </div>
            </div>

          </div>

        </div>

        {/* FORMULARIO */}
        <div className="card border-0 shadow-lg rounded-4 mb-4">

          <div
            className="px-4 py-4"
            style={{
              background:
                "linear-gradient(135deg, #0d6efd 0%, #6ea8fe 100%)",
            }}
          >
            <h4 className="text-white fw-bold mb-1">
              ➕ Añadir Productos
            </h4>

            <p className="text-white opacity-75 mb-0">
              Ingresa los productos que llegaron al almacén
            </p>
          </div>

          <div className="card-body p-4">

            <div className="row g-3">

              {/* PRODUCTO */}
              <div className="col-lg-4">

                <label className="form-label fw-semibold text-secondary">
                  Producto
                </label>

                <select
                  className="form-select rounded-4 border-0 shadow-sm"
                  value={selectedProd}
                  onChange={(e) => setSelectedProd(e.target.value)}
                  style={{
                    background: "#f8f9fa",
                    padding: "14px",
                  }}
                >
                  <option value="">Seleccione producto...</option>

                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

              </div>

              {/* CANTIDAD */}
              <div className="col-lg-2">

                <label className="form-label fw-semibold text-secondary">
                  Cantidad
                </label>

                <input
                  type="number"
                  className="form-control rounded-4 border-0 shadow-sm"
                  placeholder="0"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  style={{
                    background: "#f8f9fa",
                    padding: "14px",
                  }}
                />

              </div>

              {/* PRECIO */}
              <div className="col-lg-2">

                <label className="form-label fw-semibold text-secondary">
                  Precio Compra
                </label>

                <input
                  type="number"
                  className="form-control rounded-4 border-0 shadow-sm"
                  placeholder="0.00"
                  value={precioCompra}
                  onChange={(e) => setPrecioCompra(e.target.value)}
                  style={{
                    background: "#f8f9fa",
                    padding: "14px",
                  }}
                />

              </div>

              {/* LOTE */}
              <div className="col-lg-2">

                <label className="form-label fw-semibold text-secondary">
                  Lote
                </label>

                <input
                  type="text"
                  className="form-control rounded-4 border-0 shadow-sm"
                  placeholder="Ej: LT-001"
                  value={lote}
                  onChange={(e) => setLote(e.target.value)}
                  style={{
                    background: "#f8f9fa",
                    padding: "14px",
                  }}
                />

              </div>

              {/* BOTON */}
              <div className="col-lg-2 d-flex align-items-end">

                <button
                  className="btn btn-primary rounded-4 w-100 fw-semibold shadow-sm"
                  onClick={agregarAlDetalle}
                  style={{
                    padding: "14px",
                  }}
                >
                  ➕ Añadir
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* TABLA */}
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

          {/* HEADER */}
          <div
            className="px-4 py-4 d-flex justify-content-between align-items-center flex-wrap"
            style={{
              background:
                "linear-gradient(135deg, #212529 0%, #343a40 100%)",
            }}
          >

            <div>
              <h4 className="text-white fw-bold mb-1">
                📋 Detalle de la Compra
              </h4>

              <p className="text-light opacity-75 mb-0">
                Productos agregados al ingreso
              </p>
            </div>

            <div className="text-white fw-bold fs-5 mt-3 mt-md-0">
              Total: S/ {calcularTotal().toFixed(2)}
            </div>

          </div>

          {/* BODY */}
          <div className="card-body p-0">

            {cart.length > 0 ? (

              <div className="table-responsive">

                <table className="table align-middle mb-0">

                  <thead style={{ background: "#f8f9fa" }}>
                    <tr className="text-secondary">
                      <th className="ps-4 py-3">Producto</th>
                      <th className="text-center py-3">Cantidad</th>
                      <th className="text-center py-3">Precio</th>
                      <th className="text-center py-3">Lote</th>
                      <th className="text-center py-3">Subtotal</th>
                      <th className="text-center py-3 pe-4">Acción</th>
                    </tr>
                  </thead>

                  <tbody>

                    {cart.map((item, index) => (

                      <tr
                        key={index}
                        style={{
                          borderBottom: "1px solid #f1f3f5",
                        }}
                      >

                        {/* PRODUCTO */}
                        <td className="ps-4 py-4">

                          <div className="d-flex align-items-center gap-3">

                            <div
                              className="rounded-circle d-flex justify-content-center align-items-center"
                              style={{
                                width: "50px",
                                height: "50px",
                                background: "#e7f1ff",
                                fontSize: "1.4rem",
                              }}
                            >
                              💊
                            </div>

                            <div className="fw-bold text-dark">
                              {item.nombre}
                            </div>

                          </div>

                        </td>

                        {/* CANTIDAD */}
                        <td className="text-center fw-semibold">
                          {item.cantidad}
                        </td>

                        {/* PRECIO */}
                        <td className="text-center">
                          S/ {item.precio_compra.toFixed(2)}
                        </td>

                        {/* LOTE */}
                        <td className="text-center">
                          <span className="badge bg-secondary rounded-pill px-3 py-2">
                            {item.lote}
                          </span>
                        </td>

                        {/* SUBTOTAL */}
                        <td className="text-center fw-bold text-success">
                          S/ {item.subtotal.toFixed(2)}
                        </td>

                        {/* ELIMINAR */}
                        <td className="text-center pe-4">

                          <button
                            className="btn btn-outline-danger rounded-pill px-3"
                            onClick={() => eliminarProducto(index)}
                          >
                            ✖
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="text-center py-5">

                <div
                  className="mx-auto mb-4 d-flex justify-content-center align-items-center rounded-circle"
                  style={{
                    width: "100px",
                    height: "100px",
                    background: "#e9ecef",
                    fontSize: "3rem",
                  }}
                >
                  📦
                </div>

                <h3 className="fw-bold text-dark">
                  No hay productos agregados
                </h3>

                <p className="text-muted">
                  Añade productos para registrar una compra.
                </p>

              </div>

            )}

          </div>

        </div>

        {/* FOOTER */}
        {cart.length > 0 && (
          <div className="text-end mt-4">

            <button
              className="btn btn-success btn-lg rounded-4 px-5 py-3 fw-bold shadow-lg"
              onClick={guardarCompra}
            >
              ✅ Confirmar Ingreso a Almacén
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default Compras;