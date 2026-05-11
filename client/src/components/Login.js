// client/src/components/Login.js

import React, { useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const Login = () => {

  const [nombre, setNombre] = useState("");
  const [credenciales, setCredenciales] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const iniciarSesion = (e) => {

    e.preventDefault();

    Axios.post("http://localhost:3001/login", {

      nombre: nombre,
      credenciales: credenciales

    }).then((response) => {

      if (response.data.usuario) {

        localStorage.setItem(
          "usuario",
          response.data.usuario.nombre
        );

        localStorage.setItem(
          "rol",
          response.data.usuario.rol
        );

        localStorage.setItem(
          "id_usuario",
          response.data.usuario.id
        );

        MySwal.fire({

          title: '¡Acceso Concedido!',
          text: `Bienvenido ${response.data.usuario.nombre}`,

          icon: 'success',

          timer: 2000,
          showConfirmButton: false,

          background: '#ffffff',
          borderRadius: '20px'

        });

        setTimeout(() => {

          navigate('/dashboard');

        }, 2000);

      } else {

        MySwal.fire({

          title: '¡Error!',
          text: response.data.mensaje,

          icon: 'error',

          confirmButtonColor: '#dc3545',
          borderRadius: '20px'

        });

      }

    }).catch(() => {

      MySwal.fire({

        title: 'Error de Servidor',

        text: 'No se pudo conectar con la base de datos.',

        icon: 'warning',

        confirmButtonColor: '#ffc107',
        borderRadius: '20px'

      });

    });

  };

  return (

    <div
      className="min-vh-100 d-flex justify-content-center align-items-center position-relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0d6efd 0%, #3b82f6 40%, #6ea8fe 100%)"
      }}
    >

      {/* EFECTOS */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "350px",
          height: "350px",
          background: "rgba(255,255,255,0.08)",
          top: "-100px",
          left: "-100px",
          filter: "blur(10px)"
        }}
      />

      <div
        className="position-absolute rounded-circle"
        style={{
          width: "250px",
          height: "250px",
          background: "rgba(255,255,255,0.08)",
          bottom: "-80px",
          right: "-50px",
          filter: "blur(10px)"
        }}
      />

      {/* CARD */}
      <div
        className="card border-0 shadow-lg overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '430px',
          borderRadius: '28px',
          backdropFilter: 'blur(15px)',
          background: 'rgba(255,255,255,0.97)',
          zIndex: 10
        }}
      >

        {/* HEADER */}
        <div
          className="text-center text-white py-5 px-4"
          style={{
            background:
              "linear-gradient(135deg, #212529 0%, #343a40 100%)"
          }}
        >

          {/* ICON */}
          <div
            className="mx-auto mb-3 rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "90px",
              height: "90px",
              background: "rgba(255,255,255,0.12)",
              border: "2px solid rgba(255,255,255,0.2)",
              fontSize: "2.5rem"
            }}
          >
            💊
          </div>

          <h2 className="fw-bold mb-1">
            Nova Salud
          </h2>

          <p className="mb-0 opacity-75">
            Sistema de Gestión Farmacéutica
          </p>

        </div>

        {/* BODY */}
        <div className="card-body p-5">

          <div className="text-center mb-4">

            <h3 className="fw-bold text-dark">
              Bienvenido
            </h3>

            <p className="text-muted mb-0">
              Inicia sesión para continuar
            </p>

          </div>

          <form onSubmit={iniciarSesion}>

            {/* USUARIO */}
            <div className="mb-4">

              <label className="form-label fw-semibold text-secondary">
                Usuario
              </label>

              <div className="input-group">

                <span
                  className="input-group-text border-0 px-3"
                  style={{
                    background: "#f1f3f5",
                    borderTopLeftRadius: "16px",
                    borderBottomLeftRadius: "16px"
                  }}
                >
                  👤
                </span>

                <input
                  type="text"
                  className="form-control border-0 py-3 shadow-none"
                  placeholder="Ingrese su usuario"
                  value={nombre}
                  onChange={(event) =>
                    setNombre(event.target.value)
                  }
                  required
                  style={{
                    background: "#f1f3f5",
                    borderTopRightRadius: "16px",
                    borderBottomRightRadius: "16px"
                  }}
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="mb-4">

              <label className="form-label fw-semibold text-secondary">
                Contraseña
              </label>

              <div className="input-group">

                <span
                  className="input-group-text border-0 px-3"
                  style={{
                    background: "#f1f3f5",
                    borderTopLeftRadius: "16px",
                    borderBottomLeftRadius: "16px"
                  }}
                >
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control border-0 py-3 shadow-none"
                  placeholder="Ingrese su contraseña"
                  value={credenciales}
                  onChange={(event) =>
                    setCredenciales(event.target.value)
                  }
                  required
                  style={{
                    background: "#f1f3f5"
                  }}
                />

                <button
                  type="button"
                  className="input-group-text border-0"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={{
                    background: "#f1f3f5",
                    cursor: "pointer",
                    borderTopRightRadius: "16px",
                    borderBottomRightRadius: "16px"
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>

            {/* BOTON */}
            <button
              type="submit"
              className="btn w-100 text-white fw-bold py-3 rounded-pill shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, #198754 0%, #20c997 100%)",
                border: "none",
                fontSize: "1rem",
                transition: "0.3s"
              }}
            >
              🚀 Ingresar al Sistema
            </button>

          </form>

        </div>

        {/* FOOTER */}
        <div
          className="text-center py-3 text-muted small"
          style={{
            background: "#f8f9fa"
          }}
        >

          © 2026 Nova Salud · Todos los derechos reservados

        </div>

      </div>

    </div>

  );

};

export default Login;