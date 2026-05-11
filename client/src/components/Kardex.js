import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const Kardex = () => {

  const [productos, setProductos] = useState([]);
  const [productoSel, setProductoSel] = useState("");
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {

    Axios.get("http://localhost:3001/productos")
      .then((res) => setProductos(res.data));

  }, []);

  const consultarKardex = (id) => {

    setProductoSel(id);

    if (!id) return;

    Axios.get(`http://localhost:3001/kardex/${id}`)
      .then((res) => {

        setMovimientos(res.data);

      });

  };

  const totalEntradas = movimientos
    .filter(m => m.cantidad > 0)
    .reduce((acc, item) => acc + item.cantidad, 0);

  const totalSalidas = movimientos
    .filter(m => m.cantidad < 0)
    .reduce((acc, item) => acc + Math.abs(item.cantidad), 0);

  return (

    <div
      className="min-vh-100 py-4 px-3"
      style={{
        background:
          "linear-gradient(135deg, #f5f7ff 0%, #eef2ff 50%, #ffffff 100%)"
      }}
    >

      <div className="container-fluid">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">

          <div>

            <h1 className="fw-bold text-dark mb-1">
              📊 Kardex de Inventario
            </h1>

            <p className="text-muted mb-0">
              Historial completo de entradas y salidas de stock
            </p>

          </div>

          <div
            className="shadow-sm rounded-4 px-4 py-3"
            style={{
              background: "white",
              border: "1px solid #e9ecef"
            }}
          >

            <div className="small text-muted">
              Movimientos Registrados
            </div>

            <div className="fw-bold fs-4 text-primary">
              {movimientos.length}
            </div>

          </div>

        </div>

        {/* TARJETAS */}
        <div className="row g-4 mb-4">

          {/* ENTRADAS */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-lg rounded-4 overflow-hidden h-100"
              style={{
                background:
                  "linear-gradient(135deg, #198754 0%, #20c997 100%)"
              }}
            >

              <div className="card-body text-white p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="opacity-75 mb-2 fw-semibold">
                      Entradas
                    </p>

                    <h2 className="fw-bold mb-0">
                      +{totalEntradas}
                    </h2>

                  </div>

                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "rgba(255,255,255,0.2)",
                      fontSize: "2rem"
                    }}
                  >
                    📥
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* SALIDAS */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-lg rounded-4 overflow-hidden h-100"
              style={{
                background:
                  "linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%)"
              }}
            >

              <div className="card-body text-white p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="opacity-75 mb-2 fw-semibold">
                      Salidas
                    </p>

                    <h2 className="fw-bold mb-0">
                      -{totalSalidas}
                    </h2>

                  </div>

                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "rgba(255,255,255,0.2)",
                      fontSize: "2rem"
                    }}
                  >
                    📤
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* TOTAL */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-lg rounded-4 overflow-hidden h-100"
              style={{
                background:
                  "linear-gradient(135deg, #0d6efd 0%, #6ea8fe 100%)"
              }}
            >

              <div className="card-body text-white p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="opacity-75 mb-2 fw-semibold">
                      Registros
                    </p>

                    <h2 className="fw-bold mb-0">
                      {movimientos.length}
                    </h2>

                  </div>

                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "rgba(255,255,255,0.2)",
                      fontSize: "2rem"
                    }}
                  >
                    📋
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* CARD PRINCIPAL */}
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

          {/* HEADER */}
          <div
            className="px-4 py-4"
            style={{
              background:
                "linear-gradient(135deg, #212529 0%, #343a40 100%)"
            }}
          >

            <h4 className="text-white fw-bold mb-1">
              📦 Historial de Movimientos
            </h4>

            <p className="text-light opacity-75 mb-0">
              Consulta la trazabilidad completa de cada medicamento
            </p>

          </div>

          {/* BODY */}
          <div className="card-body p-4">

            {/* SELECT */}
            <div className="row mb-4">

              <div className="col-md-6">

                <label className="form-label fw-semibold text-secondary">
                  Seleccionar Medicamento
                </label>

                <select
                  className="form-select form-select-lg rounded-4 shadow-sm border-0 py-3"
                  style={{
                    backgroundColor: "#f8f9fa"
                  }}
                  value={productoSel}
                  onChange={(e) => consultarKardex(e.target.value)}
                >

                  <option value="">
                    -- Seleccione un producto --
                  </option>

                  {productos.map(p => (

                    <option
                      key={p.id}
                      value={p.id}
                    >
                      {p.nombre} (Lote: {p.lote})
                    </option>

                  ))}

                </select>

              </div>

            </div>

            {/* TABLA */}
            <div className="table-responsive">

              <table className="table align-middle">

                <thead style={{ background: "#f8f9fa" }}>

                  <tr className="text-secondary text-center">

                    <th className="py-3">
                      Fecha / Hora
                    </th>

                    <th className="py-3">
                      Movimiento
                    </th>

                    <th className="py-3">
                      Referencia
                    </th>

                    <th className="py-3">
                      Cantidad
                    </th>

                    <th className="py-3">
                      Stock Resultante
                    </th>

                  </tr>

                </thead>

                <tbody className="text-center">

                  {movimientos.length > 0 ? (

                    movimientos.map((m, index) => (

                      <tr
                        key={index}
                        style={{
                          borderBottom: "1px solid #f1f3f5"
                        }}
                      >

                        {/* FECHA */}
                        <td className="fw-semibold text-dark py-4">

                          {new Date(m.fecha).toLocaleString()}

                        </td>

                        {/* TIPO */}
                        <td>

                          <span
                            className={`badge rounded-pill px-4 py-2 ${
                              m.tipo === 'VENTA'
                                ? 'bg-danger'
                                : 'bg-primary'
                            }`}
                            style={{
                              fontSize: "0.85rem"
                            }}
                          >

                            {m.tipo === 'VENTA'
                              ? '📤 VENTA'
                              : '📥 COMPRA'}

                          </span>

                        </td>

                        {/* REFERENCIA */}
                        <td>

                          <span className="badge bg-secondary rounded-pill px-3 py-2">

                            #{m.referencia}

                          </span>

                        </td>

                        {/* CANTIDAD */}
                        <td>

                          <span
                            className={`fw-bold fs-5 ${
                              m.cantidad < 0
                                ? 'text-danger'
                                : 'text-success'
                            }`}
                          >

                            {m.cantidad > 0
                              ? `+${m.cantidad}`
                              : m.cantidad}

                          </span>

                        </td>

                        {/* STOCK */}
                        <td>

                          <div
                            className="mx-auto rounded-pill px-3 py-2 fw-bold text-white"
                            style={{
                              background:
                                "linear-gradient(135deg, #212529 0%, #495057 100%)",
                              width: "fit-content",
                              minWidth: "90px"
                            }}
                          >

                            {m.stock_resultante}

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="5"
                        className="text-center py-5"
                      >

                        <div className="d-flex flex-column align-items-center">

                          <div
                            className="rounded-circle d-flex justify-content-center align-items-center mb-3"
                            style={{
                              width: "90px",
                              height: "90px",
                              background: "#f1f3f5",
                              fontSize: "2.5rem"
                            }}
                          >
                            📋
                          </div>

                          <h5 className="fw-bold text-secondary">
                            {productoSel
                              ? "No hay movimientos registrados"
                              : "Seleccione un producto"}
                          </h5>

                          <p className="text-muted mb-0">
                            {productoSel
                              ? "Este medicamento aún no tiene historial."
                              : "El historial aparecerá aquí automáticamente."}
                          </p>

                        </div>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Kardex;