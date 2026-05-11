import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const HistorialCompras = () => {

  const [compras, setCompras] = useState([]);
  const [show, setShow] = useState(false);
  const [detalle, setDetalle] = useState([]);
  const [compraSel, setCompraSel] = useState(null);

  useEffect(() => {
    listarCompras();
  }, []);

  const listarCompras = () => {

    Axios.get("http://localhost:3001/historialCompras")
      .then((res) => setCompras(res.data));

  };

  const verDetalle = (compra) => {

    setCompraSel(compra);

    Axios.get(`http://localhost:3001/detalleCompra/${compra.id}`)
      .then((res) => {

        setDetalle(res.data);
        setShow(true);

      });

  };

  const calcularTotalGeneral = () => {
    return compras.reduce((acc, item) => acc + Number(item.total), 0);
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
              🧾 Historial de Compras
            </h1>

            <p className="text-muted mb-0">
              Registro completo de abastecimientos realizados
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
              Total Registrado
            </div>

            <div className="fw-bold fs-4 text-success">
              S/ {calcularTotalGeneral().toFixed(2)}
            </div>

          </div>

        </div>

        {/* TARJETAS */}
        <div className="row g-4 mb-4">

          {/* TOTAL COMPRAS */}
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
                      Compras Registradas
                    </p>

                    <h2 className="fw-bold mb-0">
                      {compras.length}
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

          {/* TOTAL MONTO */}
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
                      Total Invertido
                    </p>

                    <h2 className="fw-bold mb-0">
                      S/ {calcularTotalGeneral().toFixed(2)}
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
                    💰
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ULTIMA COMPRA */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-lg rounded-4 overflow-hidden h-100"
              style={{
                background:
                  "linear-gradient(135deg, #212529 0%, #495057 100%)",
              }}
            >

              <div className="card-body text-white p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="opacity-75 mb-2 fw-semibold">
                      Última Compra
                    </p>

                    <h5 className="fw-bold mb-0">
                      {compras.length > 0
                        ? new Date(
                            compras[0].fecha_hora
                          ).toLocaleDateString("es-PE")
                        : "--"}
                    </h5>

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
                    📅
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
            className="px-4 py-4"
            style={{
              background:
                "linear-gradient(135deg, #212529 0%, #343a40 100%)",
            }}
          >

            <h4 className="text-white fw-bold mb-1">
              📋 Historial de Abastecimiento
            </h4>

            <p className="text-light opacity-75 mb-0">
              Todas las compras registradas en el sistema
            </p>

          </div>

          {/* BODY */}
          <div className="card-body p-0">

            {compras.length > 0 ? (

              <div className="table-responsive">

                <table className="table align-middle mb-0">

                  <thead style={{ background: "#f8f9fa" }}>

                    <tr className="text-secondary">

                      <th className="ps-4 py-3">
                        Fecha y Hora
                      </th>

                      <th className="py-3">
                        Proveedor
                      </th>

                      <th className="py-3">
                        Comprado por
                      </th>

                      <th className="text-center py-3">
                        Total
                      </th>

                      <th className="text-end py-3 pe-4">
                        Acción
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {compras.map((c) => (

                      <tr
                        key={c.id}
                        style={{
                          borderBottom: "1px solid #f1f3f5",
                        }}
                      >

                        {/* FECHA */}
                        <td className="ps-4 py-4">

                          <div>

                            <div className="fw-bold text-dark">
                              {new Date(
                                c.fecha_hora
                              ).toLocaleDateString("es-PE")}
                            </div>

                            <small className="text-muted">
                              {new Date(
                                c.fecha_hora
                              ).toLocaleTimeString("es-PE")}
                            </small>

                          </div>

                        </td>

                        {/* PROVEEDOR */}
                        <td>

                          <div className="d-flex align-items-center gap-3">

                            <div
                              className="rounded-circle d-flex justify-content-center align-items-center"
                              style={{
                                width: "50px",
                                height: "50px",
                                background: "#e7f1ff",
                                fontSize: "1.3rem",
                              }}
                            >
                              🏢
                            </div>

                            <div className="fw-bold text-dark">
                              {c.proveedor}
                            </div>

                          </div>

                        </td>

                        {/* USUARIO */}
                        <td>

                          <span className="fw-semibold text-secondary">
                            👤 {c.usuario}
                          </span>

                        </td>

                        {/* TOTAL */}
                        <td className="text-center">

                          <span className="fw-bold fs-5 text-success">
                            S/ {Number(c.total).toFixed(2)}
                          </span>

                        </td>

                        {/* BOTON */}
                        <td className="text-end pe-4">

                          <button
                            className="btn btn-outline-primary rounded-pill px-4 fw-semibold"
                            onClick={() => verDetalle(c)}
                          >
                            👁️ Ver Detalle
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
                  No hay compras registradas
                </h3>

                <p className="text-muted">
                  Aún no se han realizado abastecimientos.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* MODAL */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="lg"
        centered
      >

        {/* HEADER */}
        <Modal.Header
          closeButton
          style={{
            background:
              "linear-gradient(135deg, #0d6efd 0%, #6ea8fe 100%)",
            color: "white",
            borderBottom: "none",
          }}
        >

          <Modal.Title className="fw-bold">
            🧾 Detalle de Compra #{compraSel?.id}
          </Modal.Title>

        </Modal.Header>

        {/* BODY */}
        <Modal.Body className="p-4">

          {/* INFO */}
          <div
            className="rounded-4 p-4 mb-4"
            style={{
              background: "#f8f9fa",
            }}
          >

            <div className="row">

              <div className="col-md-6">

                <p className="mb-2">
                  <strong>🏢 Proveedor:</strong>
                </p>

                <div className="fw-semibold text-dark">
                  {compraSel?.proveedor}
                </div>

              </div>

              <div className="col-md-6 text-md-end mt-3 mt-md-0">

                <p className="mb-2">
                  <strong>📅 Fecha:</strong>
                </p>

                <div className="fw-semibold text-dark">
                  {compraSel &&
                    new Date(
                      compraSel.fecha_hora
                    ).toLocaleDateString("es-PE")}
                </div>

              </div>

            </div>

          </div>

          {/* TABLA DETALLE */}
          <div className="table-responsive">

            <table className="table align-middle">

              <thead style={{ background: "#212529" }}>

                <tr>

                  <th className="text-white py-3">
                    Producto
                  </th>

                  <th className="text-white text-center py-3">
                    Cant.
                  </th>

                  <th className="text-white text-center py-3">
                    P. Compra
                  </th>

                  <th className="text-white text-center py-3">
                    Lote
                  </th>

                  <th className="text-white text-end py-3">
                    Subtotal
                  </th>

                </tr>

              </thead>

              <tbody>

                {detalle.map((d, i) => (

                  <tr key={i}>

                    <td className="fw-semibold">
                      💊 {d.producto}
                    </td>

                    <td className="text-center">
                      {d.cantidad}
                    </td>

                    <td className="text-center">
                      S/ {Number(d.precio_compra).toFixed(2)}
                    </td>

                    <td className="text-center">

                      <span className="badge bg-secondary rounded-pill px-3 py-2">
                        {d.lote}
                      </span>

                    </td>

                    <td className="text-end fw-bold text-success">
                      S/ {Number(d.subtotal).toFixed(2)}
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

                <div className="text-success fw-semibold">
                  TOTAL FACTURA
                </div>

                <small className="text-muted">
                  Compra registrada
                </small>

              </div>

              <h2 className="fw-bold text-success mb-0">
                S/ {Number(compraSel?.total).toFixed(2)}
              </h2>

            </div>

          </div>

        </Modal.Body>

        {/* FOOTER */}
        <Modal.Footer
          style={{
            borderTop: "none",
            background: "#f8f9fa",
          }}
        >

          <Button
            variant="secondary"
            className="rounded-pill px-4"
            onClick={() => setShow(false)}
          >
            Cerrar
          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
};

export default HistorialCompras;