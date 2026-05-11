import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import Swal from 'sweetalert2';

const Ventas = () => {
  const location = useLocation();

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  const [documentoBusqueda, setDocumentoBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState({
    id: 1,
    nombre: "Cliente General"
  });

  useEffect(() => {
    listarProductos();
  }, []);

  // RECUPERAR VENTA PAUSADA
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ventaId = params.get("continuar");

    if (ventaId) {
      Axios.get(`http://localhost:3001/detalleVenta/${ventaId}`)
        .then((res) => {

          const productosRecuperados = res.data.map(item => ({
            id: item.id_producto,
            nombre: item.nombre,
            precio_venta: item.precio_venta,
            cantidad: item.cantidad
          }));

          setCarrito(productosRecuperados);

          Axios.delete(`http://localhost:3001/deleteVenta/${ventaId}`);

          Swal.fire({
            title: "Venta Recuperada",
            text: "Los productos fueron cargados nuevamente.",
            icon: "success",
            confirmButtonColor: "#198754"
          });

        })
        .catch(() => {
          Swal.fire("Error", "No se pudo recuperar la venta", "error");
        });
    }
  }, [location]);

  const listarProductos = () => {
    Axios.get("http://localhost:3001/productos")
      .then((res) => setProductos(res.data));
  };

  // BUSCAR CLIENTE
  const buscarCliente = () => {
    if (!documentoBusqueda) return;

    Axios.get(`http://localhost:3001/buscarCliente/${documentoBusqueda}`)
      .then((res) => {

        if (res.data.length > 0) {
          setClienteSeleccionado(res.data[0]);

          Swal.fire({
            title: "Cliente Encontrado",
            text: res.data[0].nombre,
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });

        } else {
          Swal.fire({
            title: "No encontrado",
            text: "El cliente no existe en la base de datos",
            icon: "warning"
          });
        }
      });
  };

  // AGREGAR PRODUCTOS
  const agregarAlCarrito = (producto) => {

    if (producto.stock_actual <= 0) {
      return Swal.fire(
        "Sin stock",
        "No hay unidades disponibles",
        "error"
      );
    }

    const existe = carrito.find((x) => x.id === producto.id);

    if (existe) {

      if (existe.cantidad >= producto.stock_actual) {
        return Swal.fire(
          "Límite alcanzado",
          "No puedes vender más unidades",
          "warning"
        );
      }

      setCarrito(
        carrito.map((x) =>
          x.id === producto.id
            ? { ...x, cantidad: x.cantidad + 1 }
            : x
        )
      );

    } else {

      setCarrito([
        ...carrito,
        {
          ...producto,
          cantidad: 1
        }
      ]);
    }

    setBusqueda("");
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((p) => p.id !== id));
  };

  useEffect(() => {
    const t = carrito.reduce(
      (acc, p) => acc + (p.precio_venta * p.cantidad),
      0
    );

    setTotal(t);
  }, [carrito]);

  // CANCELAR
  const cancelarVenta = () => {

    Swal.fire({
      title: '¿Cancelar venta?',
      text: "Se eliminarán todos los productos.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: "Continuar",
      confirmButtonText: 'Sí, cancelar'
    }).then((result) => {

      if (result.isConfirmed) {

        setCarrito([]);
        setDocumentoBusqueda("");
        setBusqueda("");

        setClienteSeleccionado({
          id: 1,
          nombre: "Cliente General"
        });
      }
    });
  };

  // FINALIZAR
  const finalizarVenta = () => {

    if (carrito.length === 0) {
      return Swal.fire(
        "Carrito vacío",
        "Agrega productos antes de vender",
        "info"
      );
    }

    Axios.post("http://localhost:3001/registrarVenta", {
      id_cliente: clienteSeleccionado.id,
      id_usuario: 1,
      total: total,
      productos: carrito
    }).then(() => {

      Swal.fire({
        title: "¡Venta Exitosa!",
        text: "La venta fue registrada correctamente",
        icon: "success",
        confirmButtonColor: "#198754"
      });

      setCarrito([]);
      setDocumentoBusqueda("");

      setClienteSeleccionado({
        id: 1,
        nombre: "Cliente General"
      });

      listarProductos();
    });
  };

  // PAUSAR
  const pausarVenta = () => {

    if (carrito.length === 0) {
      return Swal.fire(
        "Carrito vacío",
        "No hay nada que pausar",
        "info"
      );
    }

    Axios.post("http://localhost:3001/pausarVenta", {
      id_cliente: clienteSeleccionado.id,
      id_usuario: 1,
      total: total,
      productos: carrito
    }).then(() => {

      Swal.fire({
        title: "Venta Pausada",
        text: "La venta fue guardada en pendientes",
        icon: "warning",
        confirmButtonColor: "#f59e0b"
      });

      setCarrito([]);
      setDocumentoBusqueda("");

      setClienteSeleccionado({
        id: 1,
        nombre: "Cliente General"
      });
    });
  };

  // AUMENTAR
  const aumentarCantidad = (id) => {

    const productoOriginal = productos.find(p => p.id === id);

    setCarrito(carrito.map((p) => {

      if (p.id === id) {

        if (
          productoOriginal &&
          p.cantidad >= productoOriginal.stock_actual
        ) {

          Swal.fire(
            "Stock insuficiente",
            "No hay más unidades disponibles",
            "warning"
          );

          return p;
        }

        return {
          ...p,
          cantidad: p.cantidad + 1
        };
      }

      return p;
    }));
  };

  // DISMINUIR
  const disminuirCantidad = (id) => {

    setCarrito(carrito.map((p) => {

      if (p.id === id && p.cantidad > 1) {

        return {
          ...p,
          cantidad: p.cantidad - 1
        };
      }

      return p;
    }));
  };

  return (
    <div
      className="container-fluid py-4 px-3"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef4ff 0%, #f8fbff 100%)"
      }}
    >

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold text-primary mb-1">
          💳 Punto de Venta
        </h2>

        <p className="text-muted mb-0">
          Gestión rápida de ventas y atención al cliente.
        </p>
      </div>

      <div className="row g-4">

        {/* IZQUIERDA */}
        <div className="col-lg-7">

          {/* BUSCADOR */}
          <div
            className="card border-0 shadow-lg mb-4"
            style={{
              borderRadius: "24px"
            }}
          >

            <div
              className="card-header border-0 text-white p-4"
              style={{
                borderRadius: "24px 24px 0 0",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)"
              }}
            >
              <h4 className="fw-bold mb-1">
                🔍 Buscar Medicamentos
              </h4>

              <small className="opacity-75">
                Busca rápidamente productos disponibles.
              </small>
            </div>

            <div className="card-body p-4">

              <div className="position-relative">

                <input
                  type="text"
                  className="form-control form-control-lg border-0 shadow-sm"
                  placeholder="Escribe el nombre del medicamento..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{
                    borderRadius: "16px",
                    backgroundColor: "#f8f9fc",
                    padding: "14px"
                  }}
                />

                {busqueda && (
                  <div
                    className="list-group position-absolute w-100 shadow-lg mt-2"
                    style={{
                      zIndex: 1000,
                      borderRadius: "16px",
                      overflow: "hidden"
                    }}
                  >

                    {productos
                      .filter((p) =>
                        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
                      )
                      .slice(0, 6)
                      .map((p) => (

                        <button
                          key={p.id}
                          className="list-group-item list-group-item-action border-0 py-3"
                          onClick={() => agregarAlCarrito(p)}
                        >

                          <div className="d-flex justify-content-between align-items-center">

                            <div className="text-start">
                              <div className="fw-bold text-dark">
                                {p.nombre}
                              </div>

                              <small className="text-muted">
                                {p.nombre_laboratorio}
                              </small>
                            </div>

                            <div className="text-end">

                              <span className="badge bg-primary px-3 py-2">
                                S/ {Number(p.precio_venta).toFixed(2)}
                              </span>

                              <div className="small text-muted mt-1">
                                Stock: {p.stock_actual}
                              </div>

                            </div>

                          </div>

                        </button>
                      ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* CLIENTE */}
          <div
            className="card border-0 shadow-lg"
            style={{
              borderRadius: "24px"
            }}
          >

            <div className="card-body p-4">

              <div className="d-flex align-items-center mb-3">
                <div
                  className="me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "18px",
                    background: "#dbeafe",
                    fontSize: "24px"
                  }}
                >
                  👤
                </div>

                <div>
                  <h4 className="fw-bold mb-0">
                    Cliente
                  </h4>

                  <small className="text-muted">
                    Buscar por DNI o RUC
                  </small>
                </div>
              </div>

              <div className="input-group">

                <input
                  type="text"
                  className="form-control form-control-lg border-0 shadow-sm"
                  placeholder="Ingrese documento..."
                  value={documentoBusqueda}
                  onChange={(e) => setDocumentoBusqueda(e.target.value)}
                  style={{
                    backgroundColor: "#f8f9fc",
                    borderRadius: "14px 0 0 14px"
                  }}
                />

                <button
                  className="btn btn-dark px-4 fw-bold"
                  onClick={buscarCliente}
                  style={{
                    borderRadius: "0 14px 14px 0"
                  }}
                >
                  Buscar
                </button>

              </div>

              <div
                className="mt-4 p-3"
                style={{
                  background: "#f8fafc",
                  borderRadius: "16px"
                }}
              >

                <small className="text-muted">
                  Cliente seleccionado
                </small>

                <h5 className="fw-bold text-success mb-0">
                  {clienteSeleccionado.nombre}
                </h5>

              </div>

            </div>
          </div>

        </div>

        {/* DERECHA */}
        <div className="col-lg-5">

          <div
            className="card border-0 shadow-lg h-100"
            style={{
              borderRadius: "24px",
              overflow: "hidden"
            }}
          >

            {/* HEADER */}
            <div
              className="p-4 text-white"
              style={{
                background: "linear-gradient(135deg, #111827, #1f2937)"
              }}
            >

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <h4 className="fw-bold mb-1">
                    🛒 Detalle de Venta
                  </h4>

                  <small className="opacity-75">
                    Productos agregados al carrito.
                  </small>
                </div>

                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={cancelarVenta}
                >
                  Cancelar
                </button>

              </div>

            </div>

            {/* BODY */}
            <div className="card-body d-flex flex-column p-4">

              <div
                className="table-responsive mb-4"
                style={{
                  minHeight: "260px"
                }}
              >

                <table className="table align-middle">

                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-end">Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>

                    {carrito.map((p) => (

                      <tr key={p.id}>

                        <td>
                          <div className="fw-semibold">
                            {p.nombre}
                          </div>

                          <small className="text-muted">
                            S/ {Number(p.precio_venta).toFixed(2)} c/u
                          </small>
                        </td>

                        <td className="text-center">

                          <div className="d-flex align-items-center justify-content-center">

                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => disminuirCantidad(p.id)}
                            >
                              −
                            </button>

                            <span className="mx-3 fw-bold">
                              {p.cantidad}
                            </span>

                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => aumentarCantidad(p.id)}
                            >
                              +
                            </button>

                          </div>

                        </td>

                        <td className="text-end fw-bold text-success">
                          S/ {(p.precio_venta * p.cantidad).toFixed(2)}
                        </td>

                        <td className="text-end">

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarDelCarrito(p.id)}
                          >
                            ✕
                          </button>

                        </td>

                      </tr>
                    ))}

                    {carrito.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center text-muted py-5"
                        >
                          El carrito está vacío
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

              {/* FOOTER */}
              <div className="mt-auto">

                <div
                  className="p-4 mb-3"
                  style={{
                    background: "#f0fdf4",
                    borderRadius: "18px",
                    border: "2px dashed #22c55e"
                  }}
                >

                  <div className="d-flex justify-content-between align-items-center">

                    <div>
                      <small className="text-muted">
                        Total a pagar
                      </small>

                      <h2 className="fw-bold text-success mb-0">
                        S/ {total.toFixed(2)}
                      </h2>
                    </div>

                    <div
                      className="bg-success text-white px-3 py-2"
                      style={{
                        borderRadius: "12px"
                      }}
                    >
                      {carrito.length} items
                    </div>

                  </div>

                </div>

                <button
                  className="btn btn-success btn-lg w-100 fw-bold shadow-sm py-3"
                  onClick={finalizarVenta}
                  style={{
                    borderRadius: "16px"
                  }}
                >
                  ✅ GENERAR VENTA
                </button>

                <button
                  className="btn btn-warning btn-lg w-100 fw-bold mt-3 py-3"
                  onClick={pausarVenta}
                  style={{
                    borderRadius: "16px"
                  }}
                >
                  ⏳ PAUSAR VENTA
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Ventas;