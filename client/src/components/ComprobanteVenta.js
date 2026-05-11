import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';

const ComprobanteVenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venta, setVenta] = useState(null);
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {

    Axios.get(`http://localhost:3001/historialVentas`)
      .then((res) => {

        const v = res.data.find(
          item => item.id === parseInt(id)
        );

        setVenta(v);
      });

    Axios.get(`http://localhost:3001/detalleVentaHistorial/${id}`)
      .then((res) => {
        setDetalles(res.data);
      });

  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!venta) {
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center"
        style={{
          background:
            "linear-gradient(135deg, #f4f7ff 0%, #eef2ff 50%, #ffffff 100%)",
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" />
          <h5 className="text-secondary">
            Cargando comprobante...
          </h5>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-4 px-3"
      style={{
        background:
          "linear-gradient(135deg, #f4f7ff 0%, #eef2ff 50%, #ffffff 100%)",
      }}
    >
      <div className="container">

        {/* BOTONES */}
        <div className="d-print-none mb-4 d-flex justify-content-between flex-wrap gap-3">

          <button
            className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold shadow-sm"
            onClick={() => navigate(-1)}
          >
            ⬅️ Volver
          </button>

          <button
            className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
            onClick={handlePrint}
          >
            🖨️ Imprimir / Exportar PDF
          </button>

        </div>

        {/* COMPROBANTE */}
        <div
          className="card border-0 shadow-lg mx-auto overflow-hidden comprobante-print"
          style={{
            maxWidth: '550px',
            borderRadius: '25px',
            background: '#fff',
          }}
        >

          {/* HEADER */}
          <div
            className="text-center text-white p-4"
            style={{
              background:
                "linear-gradient(135deg, #0d6efd 0%, #6ea8fe 100%)",
            }}
          >

            <div
              className="mx-auto mb-3 d-flex justify-content-center align-items-center rounded-circle"
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255,255,255,0.2)",
                fontSize: "2rem",
              }}
            >
              💊
            </div>

            <h1 className="fw-bold mb-1">
              NOVA SALUD
            </h1>

            <p className="mb-0 opacity-75">
              Botica & Salud
            </p>

            <p className="small opacity-75 mb-0">
              Trujillo, Perú • RUC: 20123456789
            </p>

          </div>

          {/* BODY */}
          <div className="card-body p-4">

            {/* TITULO */}
            <div className="text-center mb-4">

              <h4 className="fw-bold text-dark mb-2">
                COMPROBANTE DE VENTA
              </h4>

              <span className="badge bg-dark rounded-pill px-4 py-2 fs-6">
                N° 000 - {venta.id}
              </span>

            </div>

            {/* INFO */}
            <div
              className="rounded-4 p-4 mb-4"
              style={{
                background: "#f8f9fa",
              }}
            >

              <div className="row">

                <div className="col-6 small">

                  <p className="mb-2">
                    <strong>📅 Fecha:</strong><br />
                    {new Date(
                      venta.fecha_hora
                    ).toLocaleDateString("es-PE")}
                  </p>

                  <p className="mb-0">
                    <strong>⏰ Hora:</strong><br />
                    {new Date(
                      venta.fecha_hora
                    ).toLocaleTimeString("es-PE")}
                  </p>

                </div>

                <div className="col-6 text-end small">

                  <p className="mb-2">
                    <strong>👤 Usuario:</strong><br />
                    {venta.nombre_usuario}
                  </p>

                  <p className="mb-0">
                    <strong>🧾 Cliente:</strong><br />
                    {venta.nombre_cliente}
                  </p>

                </div>

              </div>

            </div>

            {/* TABLA */}
            <div className="table-responsive">

              <table className="table align-middle">

                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    <th className="pb-3 text-secondary">
                      Producto
                    </th>

                    <th className="pb-3 text-center text-secondary">
                      Cant.
                    </th>

                    <th className="pb-3 text-end text-secondary">
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {detalles.map((d, index) => (

                    <tr
                      key={index}
                      style={{
                        borderBottom: "1px solid #f1f3f5",
                      }}
                    >

                      <td className="py-3">

                        <div className="d-flex align-items-center gap-3">

                          <div
                            className="rounded-circle d-flex justify-content-center align-items-center"
                            style={{
                              width: "45px",
                              height: "45px",
                              background: "#e7f1ff",
                              fontSize: "1.2rem",
                            }}
                          >
                            💊
                          </div>

                          <div className="fw-semibold">
                            {d.nombre}
                          </div>

                        </div>

                      </td>

                      <td className="text-center fw-semibold">
                        {d.cantidad}
                      </td>

                      <td className="text-end fw-bold">
                        S/ {d.subtotal.toFixed(2)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* TOTAL */}
            <div
              className="rounded-4 p-4 mt-4"
              style={{
                background:
                  "linear-gradient(135deg, #d1e7dd 0%, #e9f7ef 100%)",
              }}
            >

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p className="text-success fw-semibold mb-1">
                    TOTAL A PAGAR
                  </p>

                  <small className="text-muted">
                    Incluye impuestos
                  </small>

                </div>

                <h2 className="fw-bold text-success mb-0">
                  S/ {venta.total.toFixed(2)}
                </h2>

              </div>

            </div>

            {/* FOOTER */}
            <div className="text-center mt-5">

              <div
                className="mx-auto mb-3 d-flex justify-content-center align-items-center rounded-circle"
                style={{
                  width: "70px",
                  height: "70px",
                  background: "#f1f3f5",
                  fontSize: "2rem",
                }}
              >
                ❤️
              </div>

              <h5 className="fw-bold text-dark">
                ¡Gracias por su compra!
              </h5>

              <p className="text-muted small mb-0">
                Conserve su comprobante para cualquier consulta.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ESTILOS PRINT */}
      <style>{`

        @media print {

          body * {
            visibility: hidden;
          }

          .comprobante-print,
          .comprobante-print * {
            visibility: visible;
          }

          .comprobante-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100% !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .d-print-none {
            display: none !important;
          }

          body {
            background: white !important;
          }

        }

      `}</style>

    </div>
  );
};

export default ComprobanteVenta;