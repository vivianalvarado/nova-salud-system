import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';

const ProductoDetalle = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [datos, setDatos] = useState(null);

  useEffect(() => {

    Axios.get(`http://localhost:3001/productoDetalle/${id}`)
      .then((res) => {

        setDatos(res.data);

      });

  }, [id]);

  if (!datos) {

    return (

      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}
      >

        <div className="text-center">

          <div
            className="spinner-border text-primary mb-4"
            style={{ width: '4rem', height: '4rem' }}
          ></div>

          <h4 className="fw-bold text-secondary">
            Cargando información del medicamento...
          </h4>

        </div>

      </div>

    );

  }

  const { info, ventas } = datos;

  const porcentajeStock =
    (info.stock_actual / (info.stock_minimo * 2)) * 100;

  const stockCritico =
    info.stock_actual <= info.stock_minimo;

  return (

    <div
      className="min-vh-100 py-4"
      style={{
        background:
          'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)'
      }}
    >

      <div className="container">

        {/* BOTON */}
        <button
          className="btn btn-light shadow-sm border-0 rounded-pill px-4 mb-4 fw-semibold"
          onClick={() => navigate(-1)}
        >
          ⬅ Volver
        </button>

        <div className="row g-4">

          {/* PANEL IZQUIERDO */}
          <div className="col-lg-4">

            {/* TARJETA PRINCIPAL */}
            <div
              className="card border-0 shadow-lg overflow-hidden mb-4"
              style={{ borderRadius: '24px' }}
            >

              {/* HEADER */}
              <div
                className="text-center text-white p-5"
                style={{
                  background:
                    'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
                }}
              >

                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255,255,255,0.15)',
                    fontSize: '3rem',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  💊
                </div>

                <h2 className="fw-bold mb-2">
                  {info.nombre}
                </h2>

                <span className="badge bg-light text-primary px-3 py-2 rounded-pill fs-6">
                  {info.nombre_categoria}
                </span>

              </div>

              {/* BODY */}
              <div className="card-body p-4">

                <div className="mb-4">

                  <small className="text-muted text-uppercase fw-bold">
                    Laboratorio
                  </small>

                  <h5 className="fw-semibold mt-1">
                    🏭 {info.nombre_laboratorio}
                  </h5>

                </div>

                <div className="row g-3">

                  <div className="col-6">

                    <div
                      className="p-3 rounded-4 h-100"
                      style={{ background: '#f8fafc' }}
                    >

                      <small className="text-muted fw-semibold">
                        Lote
                      </small>

                      <h6 className="fw-bold mt-1 mb-0">
                        {info.lote}
                      </h6>

                    </div>

                  </div>

                  <div className="col-6">

                    <div
                      className="p-3 rounded-4 h-100"
                      style={{ background: '#f8fafc' }}
                    >

                      <small className="text-muted fw-semibold">
                        Vencimiento
                      </small>

                      <h6 className="fw-bold text-danger mt-1 mb-0">
                        {new Date(
                          info.fecha_vencimiento
                        ).toLocaleDateString()}
                      </h6>

                    </div>

                  </div>

                </div>

                {/* PRECIO */}
                <div
                  className="mt-4 p-4 rounded-4 text-center"
                  style={{
                    background:
                      'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                  }}
                >

                  <small className="text-success fw-semibold">
                    Precio de Venta
                  </small>

                  <h1 className="fw-bold text-success mt-2">
                    S/ {info.precio_venta.toFixed(2)}
                  </h1>

                </div>

              </div>

            </div>

            {/* STOCK */}
            <div
              className={`card border-0 shadow-lg overflow-hidden ${
                stockCritico
                  ? 'border-danger'
                  : 'border-success'
              }`}
              style={{ borderRadius: '24px' }}
            >

              <div
                className={`card-body text-center p-5 text-white ${
                  stockCritico ? 'bg-danger' : 'bg-success'
                }`}
              >

                <div className="display-3 mb-2">
                  📦
                </div>

                <h5 className="fw-semibold">
                  Stock Actual
                </h5>

                <h1 className="display-2 fw-bold mb-3">
                  {info.stock_actual}
                </h1>

                <div className="mb-3">

                  <div
                    className="progress"
                    style={{
                      height: '12px',
                      borderRadius: '20px'
                    }}
                  >

                    <div
                      className={`progress-bar ${
                        stockCritico
                          ? 'bg-warning'
                          : 'bg-light'
                      }`}
                      style={{
                        width: `${Math.min(
                          porcentajeStock,
                          100
                        )}%`
                      }}
                    ></div>

                  </div>

                </div>

                <small className="opacity-75">
                  Mínimo requerido:
                  {' '}
                  {info.stock_minimo}
                </small>

              </div>

            </div>

          </div>

          {/* PANEL DERECHO */}
          <div className="col-lg-8">

            <div
              className="card border-0 shadow-lg"
              style={{ borderRadius: '24px' }}
            >

              <div className="card-body p-4">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">

                  <div>

                    <h3 className="fw-bold text-dark mb-1">
                      📈 Trazabilidad del Producto
                    </h3>

                    <p className="text-muted mb-0">
                      Historial completo del medicamento
                    </p>

                  </div>

                  <span
                    className={`badge px-4 py-3 rounded-pill fs-6 ${
                      stockCritico
                        ? 'bg-danger'
                        : 'bg-success'
                    }`}
                  >
                    {stockCritico
                      ? '⚠ Stock Crítico'
                      : '✅ Stock Estable'}
                  </span>

                </div>

                {/* TABS */}
                <ul
                  className="nav nav-pills mb-4 gap-2"
                  role="tablist"
                >

                  <li className="nav-item">

                    <button
                      className="nav-link active rounded-pill px-4 py-2 fw-semibold"
                      data-bs-toggle="tab"
                      data-bs-target="#ventas"
                    >
                      🧾 Últimas Ventas
                    </button>

                  </li>

                  <li className="nav-item">

                    <button
                      className="nav-link rounded-pill px-4 py-2 fw-semibold"
                      data-bs-toggle="tab"
                      data-bs-target="#descripcion"
                    >
                      📝 Descripción
                    </button>

                  </li>

                </ul>

                {/* CONTENIDO */}
                <div className="tab-content">

                  {/* TAB VENTAS */}
                  <div
                    className="tab-pane fade show active"
                    id="ventas"
                  >

                    <div className="table-responsive">

                      <table className="table align-middle">

                        <thead>

                          <tr className="table-light">

                            <th className="py-3">
                              Fecha
                            </th>

                            <th>
                              Cliente
                            </th>

                            <th className="text-center">
                              Cant.
                            </th>

                            <th className="text-end">
                              Total
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {ventas.length > 0 ? (

                            ventas.map((v, i) => (

                              <tr key={i}>

                                <td className="fw-semibold">
                                  {new Date(
                                    v.fecha_hora
                                  ).toLocaleDateString()}
                                </td>

                                <td>
                                  👤 {v.cliente}
                                </td>

                                <td className="text-center">
                                  <span className="badge bg-primary rounded-pill px-3 py-2">
                                    {v.cantidad}
                                  </span>
                                </td>

                                <td className="text-end fw-bold text-success">
                                  S/ {v.total.toFixed(2)}
                                </td>

                              </tr>

                            ))

                          ) : (

                            <tr>

                              <td
                                colSpan="4"
                                className="text-center py-5 text-muted"
                              >

                                <div className="display-5 mb-3">
                                  📭
                                </div>

                                No hay ventas registradas

                              </td>

                            </tr>

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                  {/* TAB DESCRIPCION */}
                  <div
                    className="tab-pane fade"
                    id="descripcion"
                  >

                    <div
                      className="p-4 rounded-4"
                      style={{
                        background: '#f8fafc'
                      }}
                    >

                      <h5 className="fw-bold mb-3">
                        📝 Información Adicional
                      </h5>

                      <p
                        className="text-muted mb-0"
                        style={{
                          lineHeight: '1.8'
                        }}
                      >

                        {info.descripcion ||
                          "Sin descripción adicional registrada."}

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default ProductoDetalle;