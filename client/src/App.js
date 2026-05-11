import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importación de componentes
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Ventas from './components/Ventas';
import Inventario from './components/Inventario';
import VentasProceso from './components/VentasProceso';
import Navbar from './components/Navbar';
import HistorialVentas from './components/HistorialVentas';
import ComprobanteVenta from './components/ComprobanteVenta';
import ProductoDetalle from './components/ProductoDetalle';
import Kardex from './components/Kardex';
import AlertasReposicion from './components/AlertasReposicion';
import Compras from './components/Compras';
import HistorialCompras from './components/HistorialCompras';
import Reportes from './components/Reportes';
import Usuarios from './components/Usuarios';

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      {/* Navbar condicional */}
      {location.pathname !== "/" && <Navbar />}
      
      {/* Contenedor principal con margen superior */}
      <div className="container-fluid mt-3">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/ventas-proceso" element={<VentasProceso />} />
          <Route path="/historial" element={<HistorialVentas />} />
          <Route path="/comprobante/:id" element={<ComprobanteVenta />} />
          <Route path="/producto-detalle/:id" element={<ProductoDetalle />} />
          <Route path="/kardex" element={<Kardex />} />
          <Route path="/kardex/:id" element={<Kardex />} />
          <Route path="/alertas" element={<AlertasReposicion />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/historial-compras" element={<HistorialCompras />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;