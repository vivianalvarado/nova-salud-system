import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const HistorialVentas = () => {

  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = () => {

    Axios.get("http://localhost:3001/historialVentas")
      .then((res) => setVentas(res.data));

  };

  const anularVenta = (id) => {

    Swal.fire({
      title: '¿Anular esta venta?',
      text: "El stock será devuelto al inventario",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      borderRadius: '20px'
    }).then((result) => {

      if (result.isConfirmed) {

        Axios.put(`http://localhost:3001/anularVenta/${id}`)
          .then(() => {

            cargarHistorial();

            Swal.fire({
              icon: 'success',
              title: 'Venta anulada',
              text: 'La venta fue anulada correctamente',
              confirmButtonColor: '#198754',
              borderRadius: '20px'
            });

          });

      }

    });

  };

  const verDetalle = (id) => {

    Axios.get(`http://localhost:3001/detalleVentaHistorial/${id}`)
      .then((res) => {

        const productos = res.data;

        let tablaHTML = `
          <div style="padding-top:10px">

            <table 
              class="table align-middle"
              style="
                border-radius:15px;
                overflow:hidden;
              "
            >

              <thead style="background:#0d6efd;color:white;">
                <tr>
                  <th style="padding:14px;">Producto</th>
                  <th class="text-center">Cant.</th>
                  <th class="text-center">Precio</th>
                  <th class="text-end pe-3">Subtotal</th>
                </tr>
              </thead>

              <tbody>

                ${productos.map(p => `

                  <tr style="border-bottom:1px solid #f1f3f5;">

                    <td style="padding:14px;font-weight:600;">
                      💊 ${p.nombre}
                    </td>

                    <td class="text-center">
                      ${p.cantidad}
                    </td>

                    <td class="text-center">
                      S/ ${p.precio_unitario.toFixed(2)}
                    </td>

                    <td class="text-end pe-3 fw-bold text-success">
                      S/ ${p.subtotal.toFixed(2)}
                    </td>

                  </tr>

                `).join('')}

              </tbody>

            </table>

          </div>
        `;

        Swal.fire({
          title: `🧾 Detalle Venta #${id}`,
          html: tablaHTML,
          width: '750px',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#0d6efd',
          background: '#fff',
          borderRadius: '20px'
        });

      });

  };

  const totalVentas = ventas.reduce(
    (acc, item) =>
      item.estado === "completada"
        ? acc + Number(item.total)
        : acc,
    0
  );

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
              🧾 Historial de Ventas
            </h1>

            <p className="text-muted mb-0">
              Registro y control de todas las ventas realizadas
            </p>

          </div>

          <div
            className="shadow-sm rounded-4 px-4 py-3"
            style={{
              background: "white",
              border: "1px solid #e9ecef",
            }}
          >

            <div className="small text-muted">
              Total Vendido
            </div>

            <div className="fw-bold fs-4 text-success">
              S/ {totalVentas.toFixed(2)}
            </div>

          </div>

        </div>

        {/* TARJETAS */}
        <div className="row g-4 mb-4">

          {/* VENTAS */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-lg rounded-4 overflow-hidden h-100"
              style={{
                background:
                  "linear-gradient(135deg, #0d6efd 0%, #6ea8fe 100%)",
              }}
            >

              <div className="card-body text-white p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="opacity-75 mb-2 fw-semibold">
                      Ventas Registradas
                    </p>

                    <h2 className="fw-bold mb-0">
                      {ventas.length}
                    </h2>

                  </div>

                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "rgba(255,255,255,0.2)",
                      fontSize: "2rem",
                    }}
                  >
                    🛒
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* COMPLETADAS */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-lg rounded-4 overflow-hidden h-100"
              style={{
                background:
                  "linear-gradient(135deg, #198754 0%, #20c997 100%)",
              }}
            >

              <div className="card-body text-white p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="opacity-75 mb-2 fw-semibold">
                      Ventas Completadas
                    </p>

                    <h2 className="fw-bold mb-0">
                      {
                        ventas.filter(
                          v => v.estado === "completada"
                        ).length
                      }
                    </h2>

                  </div>

                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "rgba(255,255,255,0.2)",
                      fontSize: "2rem",
                    }}
                  >
                    ✅
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ANULADAS */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-lg rounded-4 overflow-hidden h-100"
              style={{
                background:
                  "linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%)",
              }}
            >

              <div className="card-body text-white p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="opacity-75 mb-2 fw-semibold">
                      Ventas Anuladas
                    </p>

                    <h2 className="fw-bold mb-0">
                      {
                        ventas.filter(
                          v => v.estado === "anulada"
                        ).length
                      }
                    </h2>

                  </div>

                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "rgba(255,255,255,0.2)",
                      fontSize: "2rem",
                    }}
                  >
                    🚫
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* TABLA */}
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

          {/* HEADER TABLA */}
          <div
            className="px-4 py-4 d-flex justify-content-between align-items-center flex-wrap gap-3"
            style={{
              background:
                "linear-gradient(135deg, #212529 0%, #343a40 100%)",
            }}
          >

            <div>

              <h4 className="text-white fw-bold mb-1">
                📋 Historial de Ventas
              </h4>

              <p className="text-light opacity-75 mb-0">
                Consulta y administra las ventas registradas
              </p>

            </div>

            {/* BUSCADOR */}
            <input
              type="text"
              className="form-control rounded-pill border-0 shadow-sm"
              placeholder="🔍 Buscar cliente..."
              style={{
                width: "280px",
                padding: "12px 18px",
              }}
              onChange={(e) => setBusqueda(e.target.value)}
            />

          </div>

          {/* BODY */}
          <div className="card-body p-0">

            {ventas.length > 0 ? (

              <div className="table-responsive">

                <table className="table align-middle mb-0">

                  <thead style={{ background: "#f8f9fa" }}>

                    <tr className="text-secondary">

                      <th className="ps-4 py-3">
                        Fecha / Hora
                      </th>

                      <th className="py-3">
                        Cliente
                      </th>

                      <th className="py-3">
                        Usuario
                      </th>

                      <th className="text-center py-3">
                        Total
                      </th>

                      <th className="text-center py-3">
                        Estado
                      </th>

                      <th className="text-center py-3 pe-4">
                        Acciones
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {ventas
                      .filter(v =>
                        v.nombre_cliente
                          .toLowerCase()
                          .includes(busqueda.toLowerCase())
                      )
                      .map((v) => (

                      <tr
                        key={v.id}
                        style={{
                          borderBottom: "1px solid #f1f3f5",
                        }}
                      >

                        {/* FECHA */}
                        <td className="ps-4 py-4">

                          <div>

                            <div className="fw-bold text-dark">
                              {new Date(
                                v.fecha_hora
                              ).toLocaleDateString("es-PE")}
                            </div>

                            <small className="text-muted">
                              {new Date(
                                v.fecha_hora
                              ).toLocaleTimeString("es-PE")}
                            </small>

                          </div>

                        </td>

                        {/* CLIENTE */}
                        <td>

                          <div className="d-flex align-items-center gap-3">

                            <div
                              className="rounded-circle d-flex justify-content-center align-items-center"
                              style={{
                                width: "50px",
                                height: "50px",
                                background: "#e7f1ff",
                                fontSize: "1.2rem",
                              }}
                            >
                              👤
                            </div>

                            <div className="fw-semibold text-dark">
                              {v.nombre_cliente}
                            </div>

                          </div>

                        </td>

                        {/* USUARIO */}
                        <td>

                          <span className="fw-semibold text-secondary">
                            {v.nombre_usuario}
                          </span>

                        </td>

                        {/* TOTAL */}
                        <td className="text-center">

                          <span className="fw-bold fs-5 text-success">
                            S/ {v.total.toFixed(2)}
                          </span>

                        </td>

                        {/* ESTADO */}
                        <td className="text-center">

                          <span
                            className={`badge rounded-pill px-3 py-2 ${
                              v.estado === 'completada'
                                ? 'bg-success'
                                : 'bg-danger'
                            }`}
                          >
                            {v.estado.toUpperCase()}
                          </span>

                        </td>

                        {/* ACCIONES */}
                        <td className="text-center pe-4">

                          <div className="d-flex justify-content-center gap-2 flex-wrap">

                            {/* VER */}
                            <button
                              className="btn btn-info btn-sm rounded-pill px-3 text-white fw-semibold"
                              onClick={() => verDetalle(v.id)}
                            >
                              👀 Ver
                            </button>

                            {/* TICKET */}
                            <button
                              className="btn btn-dark btn-sm rounded-pill px-3 fw-semibold"
                              onClick={() =>
                                navigate(`/comprobante/${v.id}`)
                              }
                            >
                              🖨️ Ticket
                            </button>

                            {/* ANULAR */}
                            {v.estado !== 'anulada' && (
                              <button
                                className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold"
                                onClick={() => anularVenta(v.id)}
                              >
                                🚫 Anular
                              </button>
                            )}

                          </div>

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
                  🧾
                </div>

                <h3 className="fw-bold text-dark">
                  No hay ventas registradas
                </h3>

                <p className="text-muted">
                  Las ventas aparecerán aquí automáticamente.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default HistorialVentas;