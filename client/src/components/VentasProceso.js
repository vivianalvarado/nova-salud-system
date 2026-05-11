import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const VentasProceso = () => {
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    listarVentas();
  }, []);

  const listarVentas = () => {
    Axios.get("http://localhost:3001/ventasEnProceso")
      .then((res) => setVentas(res.data))
      .catch((err) => console.log(err));
  };

  const eliminarVenta = (id) => {
    Swal.fire({
      title: "¿Eliminar venta pausada?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/ventas/${id}`)
          .then(() => {
            Swal.fire(
              "Eliminada",
              "La venta pausada fue eliminada correctamente.",
              "success"
            );
            listarVentas();
          })
          .catch(() => {
            Swal.fire(
              "Error",
              "No se pudo eliminar la venta.",
              "error"
            );
          });
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow border-0">
        <div className="card-header bg-warning d-flex justify-content-between align-items-center p-3">
          <h3 className="mb-0 text-dark">
            ⏳ Ventas en Espera
          </h3>

          <span className="badge bg-dark fs-6">
            {ventas.length} Pendientes
          </span>
        </div>

        <div className="card-body">
          {ventas.length > 0 ? (
            <div className="row">
              {ventas.map((v) => (
                <div className="col-md-4 mb-4" key={v.id}>
                  <div className="card h-100 shadow-sm border-0 border-start border-4 border-warning">
                    <div className="card-body d-flex flex-column">
                      
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="fw-bold mb-1">
                            👤 {v.nombre_cliente}
                          </h5>

                          <small className="text-muted">
                            Venta #{v.id}
                          </small>
                        </div>

                        <span className="badge bg-warning text-dark">
                          EN PAUSA
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="mb-2">
                          <strong>Total:</strong>{" "}
                          <span className="text-success fw-bold fs-5">
                            S/ {Number(v.total).toFixed(2)}
                          </span>
                        </p>

                        <p className="mb-1 text-muted">
                          <strong>Fecha:</strong>{" "}
                          {new Date(v.fecha_hora).toLocaleDateString('es-PE')}
                        </p>

                        <p className="text-muted mb-0">
                          <strong>Hora:</strong>{" "}
                          {new Date(v.fecha_hora).toLocaleTimeString('es-PE')}
                        </p>
                      </div>

                      <div className="mt-auto d-grid gap-2">
                        <button
                          className="btn btn-warning fw-bold"
                          onClick={() =>
                            navigate(`/ventas?continuar=${v.id}`)
                          }
                        >
                          ▶️ Continuar Venta
                        </button>

                        <button
                          className="btn btn-outline-danger"
                          onClick={() => eliminarVenta(v.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="display-5 mb-3">🛒</div>

              <h4 className="text-success">
                No hay ventas pausadas
              </h4>

              <p className="text-muted">
                Todas las ventas han sido finalizadas correctamente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VentasProceso; 