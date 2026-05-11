import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [rol, setRol] = useState('');
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const rolGuardado = localStorage.getItem('rol') || '';
    setRol(rolGuardado.toLowerCase().trim());
    setNombre(localStorage.getItem('usuario') || '');
  }, [location]);

  const cerrarSesion = () => {
    localStorage.clear();
    setRol('');
    navigate('/');
  };

  if (!rol) return null;

  const esAdmin = rol === 'admin';
  const esCajero = rol === 'cajero';
  const esFarmaceutico = rol === 'farmaceutico';
  const esAlmacenero = rol === 'almacenero';

  const puedeVentas = esAdmin || esCajero;
  const puedeInventario = esAdmin || esFarmaceutico || esAlmacenero;
  const puedeReportes = esAdmin || esFarmaceutico;
  const puedeUsuarios = esAdmin;

  const isActive = (basePath) => {
    if (basePath === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(basePath);
  };

  const inicial = (nombre || 'U').charAt(0).toUpperCase();

  return (
    <>
      {/* GOOGLE FONT */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ESTILOS */}
      <style>{`
        body{
          font-family: 'Poppins', sans-serif;
        }

        .nova-navbar {
          background: linear-gradient(135deg, #0f172a, #111827, #1e293b);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 0.8rem 1.5rem;
          box-shadow: 0 8px 30px rgba(0,0,0,0.25);
          position: sticky;
          top: 0;
          z-index: 999;
        }

        /* LOGO */
        .navbar-brand {
          font-size: 1.4rem;
          font-weight: 800;
          color: #fff !important;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: 0.3s ease;
        }

        .navbar-brand:hover {
          transform: scale(1.03);
          color: #38bdf8 !important;
        }

        .heartbeat-icon {
          font-size: 1.5rem;
          animation: heartbeat 1.8s infinite;
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.15);
          }
          50% {
            transform: scale(0.95);
          }
          75% {
            transform: scale(1.12);
          }
        }

        /* LINKS */
        .nav-link-custom {
          color: rgba(255,255,255,0.75) !important;
          font-weight: 600;
          padding: 10px 18px !important;
          border-radius: 12px;
          margin: 0 4px;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link-custom:hover {
          color: white !important;
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
        }

        .nav-link-custom.active {
          background: linear-gradient(135deg, #0ea5e9, #2563eb);
          color: white !important;
          box-shadow: 0 0 18px rgba(59,130,246,0.5);
        }

        .neon-glow {
          animation: glowPulse 2s infinite;
        }

        @keyframes glowPulse {
          0% {
            box-shadow: 0 0 8px rgba(59,130,246,0.4);
          }
          50% {
            box-shadow: 0 0 18px rgba(59,130,246,0.8);
          }
          100% {
            box-shadow: 0 0 8px rgba(59,130,246,0.4);
          }
        }

        /* DROPDOWN */
        .dropdown-menu {
          background: rgba(15,23,42,0.98);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 10px;
          min-width: 240px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.35);
          animation: dropdownFade 0.25s ease;
        }

        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          color: rgba(255,255,255,0.85);
          border-radius: 10px;
          padding: 10px 14px;
          transition: 0.25s ease;
          font-weight: 500;
        }

        .dropdown-item:hover {
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          color: white;
          transform: translateX(4px);
        }

        .dropdown-divider {
          border-color: rgba(255,255,255,0.08);
        }

        /* USER SECTION */
        .user-pill {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 8px 14px;
          border-radius: 18px;
          transition: 0.3s ease;
        }

        .user-pill:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .user-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #38bdf8, #2563eb);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 1rem;
          margin-right: 12px;
          box-shadow: 0 0 12px rgba(56,189,248,0.6);
        }

        .user-name-badge {
          color: white;
          font-weight: 700;
          display: block;
          line-height: 1;
        }

        .user-role-tag {
          font-size: 0.72rem;
          background: rgba(59,130,246,0.2);
          color: #93c5fd;
          padding: 3px 8px;
          border-radius: 20px;
          text-transform: uppercase;
          font-weight: 700;
        }

        /* LOGOUT */
        .logout-btn {
          color: #f87171 !important;
          font-weight: 700;
          transition: 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(248,113,113,0.15);
          color: #ef4444 !important;
        }

        /* TOGGLER */
        .navbar-toggler {
          border: none;
          background: rgba(255,255,255,0.08);
          padding: 8px 12px;
          border-radius: 10px;
        }

        .navbar-toggler:focus {
          box-shadow: none;
        }

        .navbar-toggler-icon {
          filter: invert(1);
        }

        /* MOBILE */
        @media (max-width: 991px) {
          .navbar-collapse {
            margin-top: 1rem;
            background: rgba(15,23,42,0.98);
            padding: 1rem;
            border-radius: 16px;
          }

          .nav-link-custom {
            margin-bottom: 8px;
          }

          .user-pill {
            width: 100%;
            justify-content: center;
            margin-top: 12px;
          }
        }
      `}</style>

      <nav className="navbar navbar-expand-lg nova-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/dashboard">
            <span className="heartbeat-icon">💊</span>
            Nova Salud
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
            aria-controls="navbarMain"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
              
              <li className="nav-item">
                <Link
                  className={`nav-link nav-link-custom ${
                    isActive('/dashboard') ? 'active neon-glow' : ''
                  }`}
                  to="/dashboard"
                >
                  <i className="fas fa-clinic-medical me-1"></i>
                  Dashboard
                </Link>
              </li>

              {puedeVentas && (
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link nav-link-custom dropdown-toggle ${
                      isActive('/ventas') ? 'active neon-glow' : ''
                    }`}
                    href="/#"
                    id="ventasDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-cash-register me-1"></i>
                    Ventas
                  </a>

                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/ventas">
                        <i className="fas fa-shopping-cart me-2"></i>
                        Nueva Venta
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/ventas-proceso">
                        <i className="fas fa-clock me-2"></i>
                        En Proceso
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/historial">
                        <i className="fas fa-history me-2"></i>
                        Historial
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

              {puedeInventario && (
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link nav-link-custom dropdown-toggle ${
                      isActive('/inventario') ? 'active neon-glow' : ''
                    }`}
                    href="/#"
                    id="inventarioDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-boxes me-1"></i>
                    Inventario
                  </a>

                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/inventario">
                        <i className="fas fa-warehouse me-2"></i>
                        Productos
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/kardex">
                        <i className="fas fa-book me-2"></i>
                        Kardex
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/alertas">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Alertas
                      </Link>
                    </li>

                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <Link className="dropdown-item" to="/compras">
                        <i className="fas fa-truck me-2"></i>
                        Compras
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/historial-compras">
                        <i className="fas fa-truck me-2"></i>
                        Historial de Compras
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

              {puedeReportes && (
                <li className="nav-item">
                  <Link
                    className={`nav-link nav-link-custom ${
                      isActive('/reportes') ? 'active neon-glow' : ''
                    }`}
                    to="/reportes"
                  >
                    <i className="fas fa-chart-bar me-1"></i>
                    Reportes
                  </Link>
                </li>
              )}

              {puedeUsuarios && (
                <li className="nav-item">
                  <Link
                    className={`nav-link nav-link-custom ${
                      isActive('/usuarios') ? 'active neon-glow' : ''
                    }`}
                    to="/usuarios"
                  >
                    <i className="fas fa-users-cog me-1"></i>
                    Usuarios
                  </Link>
                </li>
              )}
            </ul>

            {/* USER */}
            <div className="d-flex align-items-center">
              <div className="user-pill dropdown">
                <a
                  className="d-flex align-items-center text-decoration-none"
                  href="/#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="user-avatar">
                    {inicial}
                  </div>

                  <div className="d-none d-md-block">
                    <span className="user-name-badge">
                      {nombre}
                    </span>

                    <span className="user-role-tag ms-2">
                      {rol}
                    </span>
                  </div>

                  <i className="fas fa-chevron-down ms-2 text-light opacity-50"></i>
                </a>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li className="dropdown-item-text">
                    <div className="text-center">
                      <div
                        className="user-avatar mx-auto mb-2"
                        style={{
                          width: '55px',
                          height: '55px',
                          fontSize: '1.5rem'
                        }}
                      >
                        {inicial}
                      </div>

                      <strong className="text-white">
                        {nombre}
                      </strong>

                      <br />

                      <span className="badge bg-primary mt-2">
                        {rol.toUpperCase()}
                      </span>
                    </div>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      className="dropdown-item logout-btn text-center"
                      onClick={cerrarSesion}
                    >
                      <i className="fas fa-power-off me-2"></i>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;