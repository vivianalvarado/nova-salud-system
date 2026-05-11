import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();

  const [ventasHoy, setVentasHoy] = useState(0);
  const [stockBajo, setStockBajo] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [dataGrafico, setDataGrafico] = useState([]);
  const [listaAlertas, setListaAlertas] = useState([]);

  const cargarDatos = () => {
    Axios.get("http://localhost:3001/ventasHoy")
      .then((res) => {
        setVentasHoy(res.data.total_dia || 0);
      })
      .catch((err) => console.log(err));

    Axios.get("http://localhost:3001/stockBajoCount")
      .then((res) => {
        setStockBajo(res.data.total_alertas || 0);
      })
      .catch((err) => console.log(err));

    Axios.get("http://localhost:3001/totalClientes")
      .then((res) => {
        setTotalClientes(res.data.total || 0);
      })
      .catch((err) => console.log(err));

    Axios.get("http://localhost:3001/ventasSemanales")
      .then((res) => {
        const formateado = res.data.map((item) => ({
          ...item,
          fecha: new Date(item.fecha).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "short",
          }),
        }));

        setDataGrafico(formateado);
      })
      .catch((err) => console.log(err));

    Axios.get("http://localhost:3001/alertasDetalladas")
      .then((res) => {
        setListaAlertas(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div
      className="min-vh-100 py-4 px-3"
      style={{
        background:
          "linear-gradient(135deg, #f4f7ff 0%, #eef2ff 40%, #ffffff 100%)",
      }}
    >
      <div className="container-fluid">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
          <div>
            <h1 className="fw-bold text-dark mb-1">
              👋 Bienvenido a Nova Salud
            </h1>
            <p className="text-muted mb-0">
              Panel principal de monitoreo y gestión
            </p>
          </div>

          <div
            className="px-4 py-3 rounded-4 shadow-sm"
            style={{
              background: "white",
              border: "1px solid #e9ecef",
            }}
          >
            <span className="fw-semibold text-secondary">
              📅 {new Date().toLocaleDateString("es-PE")}
            </span>
          </div>
        </div>

        {/* ALERTA */}
        {listaAlertas.length > 0 && (
          <div
            className="mb-4 p-4 rounded-4 shadow-sm d-flex justify-content-between align-items-center flex-wrap"
            style={{
              background:
                "linear-gradient(135deg, #fff4d6 0%, #ffe69c 100%)",
              borderLeft: "6px solid #ffb703",
            }}
          >
            <div>
              <h5 className="fw-bold text-dark mb-1">
                ⚠️ Alertas de Inventario
              </h5>

              <span className="text-dark">
                Hay <strong>{stockBajo}</strong> productos con stock crítico y{" "}
                <strong>{listaAlertas.length - stockBajo}</strong> próximos a
                vencer.
              </span>
            </div>

            <button
              className="btn btn-dark rounded-pill px-4 fw-semibold mt-3 mt-md-0"
              onClick={() => navigate("/alertas")}
            >
              Ver Alertas
            </button>
          </div>
        )}

        {/* TARJETAS */}
        <div className="row g-4 mb-4">

          {/* VENTAS */}
          <div className="col-lg-4 col-md-6">
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
                    <p className="mb-2 opacity-75 fw-semibold">
                      Ventas de Hoy
                    </p>

                    <h2 className="fw-bold mb-0">
                      S/{" "}
                      {Number(ventasHoy).toLocaleString("es-PE", {
                        minimumFractionDigits: 2,
                      })}
                    </h2>
                  </div>

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "rgba(255,255,255,0.2)",
                      fontSize: "2rem",
                    }}
                  >
                    💰
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STOCK */}
          <div className="col-lg-4 col-md-6">
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
                    <p className="mb-2 opacity-75 fw-semibold">
                      Stock Bajo
                    </p>

                    <h2 className="fw-bold mb-0">
                      {stockBajo} Productos
                    </h2>
                  </div>

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
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

          {/* CLIENTES */}
          <div className="col-lg-4 col-md-12">
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
                    <p className="mb-2 opacity-75 fw-semibold">
                      Clientes Registrados
                    </p>

                    <h2 className="fw-bold mb-0">
                      {totalClientes}
                    </h2>
                  </div>

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "rgba(255,255,255,0.2)",
                      fontSize: "2rem",
                    }}
                  >
                    👥
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GRAFICO */}
        <div className="card border-0 shadow-lg rounded-4 mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold text-dark mb-1">
                  📈 Tendencia de Ventas
                </h4>

                <p className="text-muted mb-0">
                  Últimos 7 días registrados
                </p>
              </div>
            </div>

            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <AreaChart data={dataGrafico}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#198754"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="#198754"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e9ecef"
                  />

                  <XAxis dataKey="fecha" stroke="#6c757d" />

                  <YAxis stroke="#6c757d" />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#198754"
                    fillOpacity={1}
                    fill="url(#colorVentas)"
                    strokeWidth={4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ACCESOS + ALERTAS */}
        <div className="row g-4">

          {/* ACCESOS */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 h-100">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4 text-dark">
                  ⚡ Accesos Rápidos
                </h4>

                <div className="d-grid gap-3">

                  <button
                    className="btn btn-primary btn-lg rounded-4 py-3 fw-semibold shadow-sm"
                    onClick={() => navigate("/ventas")}
                  >
                    🛒 Nueva Venta
                  </button>

                  <button
                    className="btn btn-outline-primary btn-lg rounded-4 py-3 fw-semibold"
                    onClick={() => navigate("/inventario")}
                  >
                    📦 Gestionar Inventario
                  </button>

                  <button
                    className="btn btn-dark btn-lg rounded-4 py-3 fw-semibold"
                    onClick={() => navigate("/kardex")}
                  >
                    📑 Ver Kardex
                  </button>

                </div>
              </div>
            </div>
          </div>

          {/* TABLA ALERTAS */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 h-100">
              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="fw-bold text-danger mb-1">
                      🔔 Alertas Críticas
                    </h4>

                    <p className="text-muted mb-0">
                      Productos con problemas de stock o vencimiento
                    </p>
                  </div>
                </div>

                <div className="table-responsive">

                  <table className="table align-middle">

                    <thead>
                      <tr className="text-secondary">
                        <th>Medicamento</th>
                        <th>Estado</th>
                        <th>Vencimiento</th>
                      </tr>
                    </thead>

                    <tbody>

                      {listaAlertas.map((alerta, index) => {
                        const esVencimiento =
                          new Date(alerta.fecha_vencimiento) <=
                          new Date(
                            new Date().getTime() +
                              30 * 24 * 60 * 60 * 1000
                          );

                        return (
                          <tr key={index}>

                            <td className="fw-semibold">
                              {alerta.nombre}
                            </td>

                            <td>
                              {alerta.stock_actual <=
                              alerta.stock_minimo ? (
                                <span className="badge bg-danger rounded-pill px-3 py-2">
                                  Stock Crítico ({alerta.stock_actual})
                                </span>
                              ) : (
                                <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                                  Próximo a Vencer
                                </span>
                              )}
                            </td>

                            <td>
                              <span
                                className={
                                  esVencimiento
                                    ? "text-danger fw-bold"
                                    : "text-secondary"
                                }
                              >
                                {new Date(
                                  alerta.fecha_vencimiento
                                ).toLocaleDateString("es-PE")}
                              </span>
                            </td>

                          </tr>
                        );
                      })}

                      {listaAlertas.length === 0 && (
                        <tr>
                          <td
                            colSpan="3"
                            className="text-center py-5 text-muted"
                          >
                            ✅ No hay alertas críticas actualmente
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

      </div>
    </div>
  );
};

export default Dashboard;