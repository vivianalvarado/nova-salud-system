import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AlertasReposicion = () => {
  const [alertas, setAlertas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get("http://localhost:3001/alertasDetalladas")
      .then((res) => {
        setAlertas(res.data);
      })
      .catch((err) => console.error("Error cargando alertas:", err));
  }, []);

  return (
    <div
      className="min-vh-100 py-4 px-3"
      style={{
        background:
          "linear-gradient(135deg, #f8f9ff 0%, #eef2ff 50%, #ffffff 100%)",
      }}
    >
      <div className="container-fluid">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">

          <div>
            <h1 className="fw-bold text-dark mb-1">
              ⚠️ Gestión de Alertas
            </h1>

            <p className="text-muted mb-0">
              Control de productos críticos y próximos a vencer
            </p>
          </div>

          <div
            className="shadow-sm rounded-4 px-4 py-3 d-flex align-items-center gap-3"
            style={{
              background: "white",
              border: "1px solid #e9ecef",
            }}
          >
            <div
              className="rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "50px",
                height: "50px",
                background: "#ffe5e5",
                fontSize: "1.4rem",
              }}
            >
              🚨
            </div>

            <div>
              <div className="text-muted small">Alertas Pendientes</div>
              <div className="fw-bold fs-4 text-danger">
                {alertas.length}
              </div>
            </div>
          </div>

        </div>

        {/* RESUMEN */}
        <div className="row g-4 mb-4">

          {/* STOCK BAJO */}
          <div className="col-md-6">
            <div
              className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%)",
              }}
            >
              <div className="card-body text-white p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <p className="opacity-75 mb-2 fw-semibold">
                      Productos con Stock Bajo
                    </p>

                    <h2 className="fw-bold mb-0">
                      {
                        alertas.filter(
                          (a) => a.stock_actual <= a.stock_minimo
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
                    📦
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* POR VENCER */}
          <div className="col-md-6">
            <div
              className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #ffb703 0%, #ffd166 100%)",
              }}
            >
              <div className="card-body text-dark p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <p className="opacity-75 mb-2 fw-semibold">
                      Productos Próximos a Vencer
                    </p>

                    <h2 className="fw-bold mb-0">
                      {
                        alertas.filter(
                          (a) =>
                            new Date(a.fecha_vencimiento) <=
                            new Date(
                              new Date().getTime() +
                              30 * 24 * 60 * 60 * 1000
                            )
                        ).length
                      }
                    </h2>
                  </div>

                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "rgba(255,255,255,0.35)",
                      fontSize: "2rem",
                    }}
                  >
                    ⏳
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
            className="px-4 py-4 d-flex justify-content-between align-items-center flex-wrap"
            style={{
              background:
                "linear-gradient(135deg, #212529 0%, #343a40 100%)",
            }}
          >

            <div>
              <h4 className="text-white fw-bold mb-1">
                🔔 Alertas Críticas
              </h4>

              <p className="text-light mb-0 opacity-75">
                Productos que requieren atención inmediata
              </p>
            </div>

            <button
              className="btn btn-light rounded-pill px-4 fw-semibold mt-3 mt-md-0"
              onClick={() => navigate('/inventario')}
            >
              📦 Ir a Inventario
            </button>

          </div>

          {/* BODY */}
          <div className="card-body p-0">

            {alertas.length > 0 ? (

              <div className="table-responsive">

                <table className="table align-middle mb-0">

                  <thead
                    style={{
                      background: "#f8f9fa",
                    }}
                  >
                    <tr className="text-secondary">
                      <th className="ps-4 py-3">Producto</th>
                      <th className="py-3">Estado</th>
                      <th className="text-center py-3">Stock</th>
                      <th className="text-center py-3">Vencimiento</th>
                      <th className="text-center py-3 pe-4">Acción</th>
                    </tr>
                  </thead>

                  <tbody>

                    {alertas.map((p, index) => {

                      const esStockBajo =
                        p.stock_actual <= p.stock_minimo;

                      const esVencimiento =
                        new Date(p.fecha_vencimiento) <=
                        new Date(
                          new Date().getTime() +
                          30 * 24 * 60 * 60 * 1000
                        );

                      return (
                        <tr
                          key={p.id}
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
                                  background: esStockBajo
                                    ? "#ffe5e5"
                                    : "#fff3cd",
                                  fontSize: "1.3rem",
                                }}
                              >
                                💊
                              </div>

                              <div>
                                <div className="fw-bold text-dark">
                                  {p.nombre}
                                </div>

                                <small className="text-muted">
                                  Stock mínimo: {p.stock_minimo}
                                </small>
                              </div>

                            </div>

                          </td>

                          {/* ESTADO */}
                          <td>

                            <div className="d-flex flex-column gap-2">

                              {esStockBajo && (
                                <span className="badge bg-danger rounded-pill px-3 py-2">
                                  STOCK BAJO
                                </span>
                              )}

                              {esVencimiento && (
                                <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                                  PRÓXIMO A VENCER
                                </span>
                              )}

                            </div>

                          </td>

                          {/* STOCK */}
                          <td className="text-center">

                            <span
                              className={`fw-bold fs-5 ${
                                esStockBajo
                                  ? "text-danger"
                                  : "text-success"
                              }`}
                            >
                              {p.stock_actual}
                            </span>

                          </td>

                          {/* VENCIMIENTO */}
                          <td className="text-center">

                            <span
                              className={
                                esVencimiento
                                  ? "text-danger fw-bold"
                                  : "text-secondary fw-semibold"
                              }
                            >
                              {new Date(
                                p.fecha_vencimiento
                              ).toLocaleDateString("es-PE")}
                            </span>

                          </td>

                          {/* BOTON */}
                          <td className="text-center pe-4">

                            <button
                              className="btn btn-dark rounded-pill px-4 fw-semibold"
                              onClick={() => navigate(`/kardex`)}
                            >
                              Ver Kardex
                            </button>

                          </td>

                        </tr>
                      );
                    })}

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
                    background: "#d1e7dd",
                    fontSize: "3rem",
                  }}
                >
                  ✅
                </div>

                <h3 className="text-success fw-bold">
                  Todo está en orden
                </h3>

                <p className="text-muted">
                  No existen alertas críticas actualmente.
                </p>

              </div>

            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertasReposicion;