import React, { useEffect, useState } from "react";
import Axios from "axios";
import Swal from 'sweetalert2';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [pass, setPass] = useState("");
  const [rolSel, setRolSel] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    Axios.get("http://localhost:3001/usuarios")
      .then(res => setUsuarios(res.data));

    Axios.get("http://localhost:3001/roles")
      .then(res => setRoles(res.data));
  };

  const guardarUsuario = (e) => {
    e.preventDefault();

    Axios.post("http://localhost:3001/createUsuario", {
      nombre,
      credenciales: pass,
      id_rol: rolSel
    }).then(() => {
      Swal.fire({
        title: "¡Usuario Registrado!",
        text: "El miembro fue agregado correctamente.",
        icon: "success",
        confirmButtonColor: "#0d6efd"
      });

      setNombre("");
      setPass("");
      setRolSel("");

      cargarDatos();
    }).catch(() => {
      Swal.fire({
        title: "Error",
        text: "No se pudo registrar el usuario.",
        icon: "error"
      });
    });
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
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">
            👨‍⚕️ Gestión de Usuarios
          </h2>
          <p className="text-muted mb-0">
            Administración del equipo y accesos del sistema.
          </p>
        </div>

        <div
          className="card border-0 shadow-sm px-4 py-3"
          style={{
            borderRadius: "18px",
            minWidth: "220px"
          }}
        >
          <small className="text-muted">Usuarios registrados</small>
          <h3 className="fw-bold text-dark mb-0">
            {usuarios.length}
          </h3>
        </div>
      </div>

      <div className="row g-4">

        {/* FORMULARIO */}
        <div className="col-lg-4">
          <div
            className="card border-0 shadow-lg h-100"
            style={{
              borderRadius: "24px",
              overflow: "hidden"
            }}
          >

            <div
              className="p-4 text-white"
              style={{
                background: "linear-gradient(135deg, #0d6efd, #3b82f6)"
              }}
            >
              <h4 className="fw-bold mb-1">
                ➕ Nuevo Usuario
              </h4>
              <small className="opacity-75">
                Registra nuevos miembros al sistema.
              </small>
            </div>

            <div className="card-body p-4">

              <form onSubmit={guardarUsuario}>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Nombre Completo
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-lg border-0 shadow-sm"
                    placeholder="Ingrese nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    style={{
                      borderRadius: "14px",
                      backgroundColor: "#f8f9fc"
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Contraseña
                  </label>

                  <input
                    type="password"
                    className="form-control form-control-lg border-0 shadow-sm"
                    placeholder="Ingrese contraseña"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                    style={{
                      borderRadius: "14px",
                      backgroundColor: "#f8f9fc"
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Rol del Usuario
                  </label>

                  <select
                    className="form-select form-select-lg border-0 shadow-sm"
                    value={rolSel}
                    onChange={(e) => setRolSel(e.target.value)}
                    required
                    style={{
                      borderRadius: "14px",
                      backgroundColor: "#f8f9fc"
                    }}
                  >
                    <option value="">Seleccionar rol</option>

                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.rol.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                  style={{
                    borderRadius: "14px",
                    padding: "12px"
                  }}
                >
                  Registrar Miembro
                </button>

              </form>

            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="col-lg-8">
          <div
            className="card border-0 shadow-lg"
            style={{
              borderRadius: "24px",
              overflow: "hidden"
            }}
          >

            <div
              className="d-flex justify-content-between align-items-center p-4"
              style={{
                background: "linear-gradient(135deg, #111827, #1f2937)",
                color: "white"
              }}
            >
              <div>
                <h4 className="fw-bold mb-1">
                  🏥 Equipo Nova Salud
                </h4>

                <small className="opacity-75">
                  Personal autorizado del sistema.
                </small>
              </div>

              <div
                className="px-3 py-2"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "12px"
                }}
              >
                <strong>{usuarios.length}</strong> miembros
              </div>
            </div>

            <div className="card-body p-0">

              <div className="table-responsive">

                <table className="table align-middle mb-0">

                  <thead
                    style={{
                      backgroundColor: "#f8fafc"
                    }}
                  >
                    <tr>
                      <th className="py-3 px-4 text-muted">Usuario</th>
                      <th className="py-3 text-muted">Rol</th>
                      <th className="py-3 text-center text-muted">Estado</th>
                      <th className="py-3 text-center text-muted">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>

                    {usuarios.map((u) => (
                      <tr
                        key={u.id}
                        style={{
                          transition: "0.2s"
                        }}
                      >

                        <td className="px-4 py-3">

                          <div className="d-flex align-items-center gap-3">

                            <div
                              className="d-flex align-items-center justify-content-center text-white fw-bold"
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #0d6efd, #3b82f6)",
                                fontSize: "18px"
                              }}
                            >
                              {u.nombre.charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <div className="fw-bold text-dark">
                                {u.nombre}
                              </div>

                              <small className="text-muted">
                                ID Usuario: {u.id}
                              </small>
                            </div>

                          </div>

                        </td>

                        <td>

                          <span
                            className={`badge px-3 py-2 fw-semibold ${
                              u.rol === 'admin'
                                ? 'bg-danger'
                                : 'bg-info text-dark'
                            }`}
                            style={{
                              borderRadius: "10px",
                              fontSize: "13px"
                            }}
                          >
                            {u.rol.toUpperCase()}
                          </span>

                        </td>

                        <td className="text-center">

                          <span
                            className="badge bg-success-subtle text-success px-3 py-2"
                            style={{
                              borderRadius: "10px"
                            }}
                          >
                            ● ACTIVO
                          </span>

                        </td>

                        <td className="text-center">

                          <button
                            className="btn btn-outline-danger btn-sm fw-semibold"
                            style={{
                              borderRadius: "10px",
                              padding: "8px 14px"
                            }}
                          >
                            🗑️ Eliminar
                          </button>

                        </td>

                      </tr>
                    ))}

                    {usuarios.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-5 text-muted"
                        >
                          No hay usuarios registrados.
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
  );
};

export default Usuarios;