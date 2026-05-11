import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';

const Reportes = () => {

  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {

    Axios.get("http://localhost:3001/reporte-ventas")
      .then(res => setVentas(res.data));

    Axios.get("http://localhost:3001/top-productos")
      .then(res => setProductos(res.data));

    Axios.get("http://localhost:3001/clientes-frecuentes")
      .then(res => setClientes(res.data));

  }, []);

  // TOTAL INGRESOS
  const totalIngresos = ventas.reduce(
    (acc, item) => acc + Number(item.ingresos),
    0
  );

  // TOTAL VENTAS
  const totalVentas = ventas.reduce(
    (acc, item) => acc + Number(item.num_ventas),
    0
  );

  // CLIENTE TOP
  const clienteTop =
    clientes.length > 0 ? clientes[0].nombre : "-";

  // COLORES
  const COLORS = [
    '#0d6efd',
    '#198754',
    '#ffc107',
    '#dc3545',
    '#6610f2',
    '#20c997'
  ];

  return (

    <div
      className="min-vh-100 py-4"
      style={{
        background:
          'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)'
      }}
    >

      <div className="container-fluid px-4">

        {/* HEADER */}
        <div className="mb-4">

          <h1 className="fw-bold text-dark mb-1">
            📈 Centro de Reportes
          </h1>

          <p className="text-muted fs-5">
            Estadísticas y análisis del sistema Nova Salud
          </p>

        </div>

        {/* TARJETAS */}
        <div className="row g-4 mb-4">

          {/* INGRESOS */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-lg text-white h-100"
              style={{
                borderRadius: '24px',
                background:
                  'linear-gradient(135deg, #198754 0%, #20c997 100%)'
              }}
            >

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="opacity-75 mb-1">
                      Ingresos Totales
                    </p>

                    <h2 className="fw-bold">
                      S/ {totalIngresos.toFixed(2)}
                    </h2>

                  </div>

                  <div
                    style={{
                      fontSize: '3rem'
                    }}
                  >
                    💰
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* VENTAS */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-lg text-white h-100"
              style={{
                borderRadius: '24px',
                background:
                  'linear-gradient(135deg, #0d6efd 0%, #3b82f6 100%)'
              }}
            >

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="opacity-75 mb-1">
                      Ventas Registradas
                    </p>

                    <h2 className="fw-bold">
                      {totalVentas}
                    </h2>

                  </div>

                  <div style={{ fontSize: '3rem' }}>
                    🧾
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* CLIENTE TOP */}
          <div className="col-md-4">

            <div
              className="card border-0 shadow-lg text-white h-100"
              style={{
                borderRadius: '24px',
                background:
                  'linear-gradient(135deg, #6610f2 0%, #8b5cf6 100%)'
              }}
            >

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="opacity-75 mb-1">
                      Cliente Destacado
                    </p>

                    <h4 className="fw-bold">
                      {clienteTop}
                    </h4>

                  </div>

                  <div style={{ fontSize: '3rem' }}>
                    ⭐
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* GRAFICOS */}
        <div className="row g-4 mb-4">

          {/* GRAFICO INGRESOS */}
          <div className="col-lg-8">

            <div
              className="card border-0 shadow-lg h-100"
              style={{ borderRadius: '24px' }}
            >

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div>

                    <h4 className="fw-bold mb-1">
                      📅 Tendencia de Ingresos
                    </h4>

                    <p className="text-muted mb-0">
                      Últimos 30 días
                    </p>

                  </div>

                </div>

                <div style={{ width: '100%', height: 350 }}>

                  <ResponsiveContainer>

                    <AreaChart data={ventas}>

                      <defs>

                        <linearGradient
                          id="colorIngresos"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >

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
                      />

                      <XAxis
                        dataKey="fecha"
                        tickFormatter={(v) =>
                          new Date(v).toLocaleDateString(
                            'es-PE',
                            {
                              day: '2-digit',
                              month: 'short'
                            }
                          )
                        }
                      />

                      <YAxis />

                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="ingresos"
                        stroke="#198754"
                        fillOpacity={1}
                        fill="url(#colorIngresos)"
                        strokeWidth={4}
                      />

                    </AreaChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>

          </div>

          {/* PIE PRODUCTOS */}
          <div className="col-lg-4">

            <div
              className="card border-0 shadow-lg h-100"
              style={{ borderRadius: '24px' }}
            >

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  🏆 Top Productos
                </h4>

                <div style={{ width: '100%', height: 350 }}>

                  <ResponsiveContainer>

                    <PieChart>

                      <Pie
                        data={productos}
                        dataKey="total_vendido"
                        nameKey="nombre"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label
                      >

                        {productos.map((entry, index) => (

                          <Cell
                            key={index}
                            fill={
                              COLORS[
                                index % COLORS.length
                              ]
                            }
                          />

                        ))}

                      </Pie>

                      <Tooltip />

                      <Legend />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* TABLAS */}
        <div className="row g-4">

          {/* PRODUCTOS */}
          <div className="col-lg-6">

            <div
              className="card border-0 shadow-lg h-100"
              style={{ borderRadius: '24px' }}
            >

              <div
                className="card-header border-0 text-white p-4"
                style={{
                  background:
                    'linear-gradient(135deg, #212529 0%, #343a40 100%)',
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px'
                }}
              >

                <h4 className="mb-0 fw-bold">
                  🏆 Productos Más Vendidos
                </h4>

              </div>

              <div className="card-body p-0">

                <div className="table-responsive">

                  <table className="table align-middle mb-0">

                    <thead className="table-light">

                      <tr>

                        <th className="ps-4">
                          Producto
                        </th>

                        <th className="text-end pe-4">
                          Unidades
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {productos.map((p, i) => (

                        <tr key={i}>

                          <td className="ps-4 fw-semibold">
                            💊 {p.nombre}
                          </td>

                          <td className="text-end pe-4">

                            <span className="badge bg-primary rounded-pill px-3 py-2">
                              {p.total_vendido}
                            </span>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>

          {/* CLIENTES */}
          <div className="col-lg-6">

            <div
              className="card border-0 shadow-lg h-100"
              style={{ borderRadius: '24px' }}
            >

              <div
                className="card-header border-0 text-white p-4"
                style={{
                  background:
                    'linear-gradient(135deg, #0dcaf0 0%, #3dd5f3 100%)',
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px'
                }}
              >

                <h4 className="mb-0 fw-bold">
                  ⭐ Clientes VIP
                </h4>

              </div>

              <div className="card-body p-0">

                <div className="table-responsive">

                  <table className="table align-middle mb-0">

                    <thead className="table-light">

                      <tr>

                        <th className="ps-4">
                          Cliente
                        </th>

                        <th>
                          Visitas
                        </th>

                        <th className="text-end pe-4">
                          Inversión
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {clientes.map((c, i) => (

                        <tr key={i}>

                          <td className="ps-4 fw-semibold">
                            👤 {c.nombre}
                          </td>

                          <td>

                            <span className="badge bg-info text-dark rounded-pill px-3 py-2">
                              {c.visitas}
                            </span>

                          </td>

                          <td className="text-end pe-4 fw-bold text-success">

                            S/ {Number(
                              c.total_gastado
                            ).toFixed(2)}

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* TABLA INGRESOS */}
        <div className="card border-0 shadow-lg mt-4"
          style={{ borderRadius: '24px' }}
        >

          <div
            className="card-header border-0 text-white p-4"
            style={{
              background:
                'linear-gradient(135deg, #198754 0%, #20c997 100%)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px'
            }}
          >

            <h4 className="mb-0 fw-bold">
              📊 Historial de Ingresos
            </h4>

          </div>

          <div className="card-body p-0">

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>

                    <th className="ps-4">
                      Fecha
                    </th>

                    <th className="text-center">
                      N° Ventas
                    </th>

                    <th className="text-end pe-4">
                      Total Recaudado
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {ventas.map((v, i) => (

                    <tr key={i}>

                      <td className="ps-4 fw-semibold">

                        📅 {new Date(
                          v.fecha
                        ).toLocaleDateString('es-PE')}

                      </td>

                      <td className="text-center">

                        <span className="badge bg-dark rounded-pill px-3 py-2">
                          {v.num_ventas}
                        </span>

                      </td>

                      <td className="text-end pe-4 fw-bold text-success">

                        S/ {Number(
                          v.ingresos
                        ).toFixed(2)}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Reportes;