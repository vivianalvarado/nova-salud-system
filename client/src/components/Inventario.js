import React, { useEffect, useState } from "react";
import Axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const Inventario = () => {

  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stockActual, setStockActual] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [lote, setLote] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [idLaboratorio, setIdLaboratorio] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);

  const [editando, setEditando] = useState(false);
  const [idProducto, setIdProducto] = useState(null);

  const [productosList, setProductosList] = useState([]);

  useEffect(() => {

    listarProductos();
    cargarListas();

  }, []);

  const listarProductos = () => {

    Axios.get("http://localhost:3001/productos")
      .then((res) => setProductosList(res.data));

  };

  const cargarListas = () => {

    Axios.get("http://localhost:3001/categorias")
      .then((res) => setCategorias(res.data));

    Axios.get("http://localhost:3001/laboratorios")
      .then((res) => setLaboratorios(res.data));

  };

  const limpiarCampos = () => {

    setNombre("");
    setDescripcion("");
    setPrecio("");
    setStockActual("");
    setStockMinimo("");
    setLote("");
    setFechaVencimiento("");
    setIdCategoria("");
    setIdLaboratorio("");

    setEditando(false);
    setIdProducto(null);

  };

  const enviarDatos = (e) => {

    if (e) e.preventDefault();

    const url = editando
      ? "http://localhost:3001/updateProducto"
      : "http://localhost:3001/createProducto";

    const metodo = editando
      ? Axios.put
      : Axios.post;

    metodo(url, {

      id: idProducto,

      nombre,
      descripcion,

      precio_venta: precio,
      stock_actual: stockActual,
      stock_minimo: stockMinimo,

      lote,
      fecha_vencimiento: fechaVencimiento,

      id_categoria: idCategoria,
      id_laboratorio: idLaboratorio

    }).then(() => {

      listarProductos();
      limpiarCampos();

      MySwal.fire({

        title: "¡Éxito!",
        text: editando
          ? "Producto actualizado correctamente"
          : "Producto registrado en Nova Salud",

        icon: "success",
        confirmButtonColor: "#198754",
        borderRadius: "20px"

      });

    }).catch(() => {

      MySwal.fire({

        title: "Error",
        text: "No se pudo procesar la solicitud",
        icon: "error"

      });

    });

  };

  const editarProducto = (val) => {

    setEditando(true);

    setIdProducto(val.id);

    setNombre(val.nombre);
    setDescripcion(val.descripcion);

    setPrecio(val.precio_venta);

    setStockActual(val.stock_actual);
    setStockMinimo(val.stock_minimo);

    setLote(val.lote);

    setFechaVencimiento(
      val.fecha_vencimiento
        ? val.fecha_vencimiento.split('T')[0]
        : ""
    );

    setIdCategoria(val.id_categoria);
    setIdLaboratorio(val.id_laboratorio);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  };

  const eliminarProducto = (id) => {

    Swal.fire({

      title: '¿Eliminar producto?',
      text: "Esta acción no se puede deshacer",

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',

      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',

      borderRadius: '20px'

    }).then((result) => {

      if (result.isConfirmed) {

        Axios.delete(`http://localhost:3001/deleteProducto/${id}`)
          .then(() => {

            listarProductos();

            Swal.fire({

              title: 'Eliminado',
              text: 'El producto fue eliminado correctamente',

              icon: 'success',

              confirmButtonColor: '#198754',
              borderRadius: '20px'

            });

          });

      }

    });

  };

  const stockCritico = productosList.filter(
    p => p.stock_actual <= p.stock_minimo
  ).length;

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
              💊 Gestión de Inventario
            </h1>

            <p className="text-muted mb-0">
              Control y administración de medicamentos
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
              Productos Registrados
            </div>

            <div className="fw-bold fs-4 text-primary">
              {productosList.length}
            </div>

          </div>

        </div>

        {/* TARJETAS */}
        <div className="row g-4 mb-4">

          {/* TOTAL */}
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
                      Productos
                    </p>

                    <h2 className="fw-bold mb-0">
                      {productosList.length}
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
                    💊
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* STOCK BAJO */}
          <div className="col-md-4">

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

                    <p className="opacity-75 mb-2 fw-semibold">
                      Stock Crítico
                    </p>

                    <h2 className="fw-bold mb-0">
                      {stockCritico}
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
                    ⚠️
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* CATEGORIAS */}
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
                      Categorías
                    </p>

                    <h2 className="fw-bold mb-0">
                      {categorias.length}
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

        </div>

        {/* FORMULARIO */}
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">

          {/* HEADER */}
          <div
            className="px-4 py-4"
            style={{
              background: editando
                ? "linear-gradient(135deg, #ffc107 0%, #ffda6a 100%)"
                : "linear-gradient(135deg, #212529 0%, #343a40 100%)",
            }}
          >

            <h4 className="text-white fw-bold mb-1">
              {editando
                ? "✏️ Editar Medicamento"
                : "➕ Registrar Medicamento"}
            </h4>

            <p className="text-light opacity-75 mb-0">
              Completa la información del producto
            </p>

          </div>

          {/* BODY */}
          <form
            onSubmit={enviarDatos}
            className="card-body p-4"
          >

            <div className="row g-4">

              {/* NOMBRE */}
              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Nombre
                </label>

                <input
                  type="text"
                  className="form-control rounded-4 py-3"
                  value={nombre}
                  onChange={(e)=>setNombre(e.target.value)}
                  required
                />

              </div>

              {/* DESCRIPCION */}
              <div className="col-md-6">

                <label className="form-label fw-semibold">
                  Descripción
                </label>

                <input
                  type="text"
                  className="form-control rounded-4 py-3"
                  value={descripcion}
                  onChange={(e)=>setDescripcion(e.target.value)}
                />

              </div>

              {/* PRECIO */}
              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Precio Venta
                </label>

                <input
                  type="number"
                  step="0.01"
                  className="form-control rounded-4 py-3"
                  value={precio}
                  onChange={(e)=>setPrecio(e.target.value)}
                  required
                />

              </div>

              {/* STOCK */}
              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Stock Actual
                </label>

                <input
                  type="number"
                  className="form-control rounded-4 py-3"
                  value={stockActual}
                  onChange={(e)=>setStockActual(e.target.value)}
                  required
                />

              </div>

              {/* STOCK MINIMO */}
              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Stock Mínimo
                </label>

                <input
                  type="number"
                  className="form-control rounded-4 py-3"
                  value={stockMinimo}
                  onChange={(e)=>setStockMinimo(e.target.value)}
                  required
                />

              </div>

              {/* LOTE */}
              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Lote
                </label>

                <input
                  type="text"
                  className="form-control rounded-4 py-3"
                  value={lote}
                  onChange={(e)=>setLote(e.target.value)}
                />

              </div>

              {/* VENCIMIENTO */}
              <div className="col-md-4">

                <label className="form-label fw-semibold">
                  Vencimiento
                </label>

                <input
                  type="date"
                  className="form-control rounded-4 py-3"
                  value={fechaVencimiento}
                  onChange={(e)=>setFechaVencimiento(e.target.value)}
                  required
                />

              </div>

              {/* CATEGORIA */}
              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Categoría
                </label>

                <select
                  className="form-select rounded-4 py-3"
                  value={idCategoria}
                  onChange={(e)=>setIdCategoria(e.target.value)}
                  required
                >

                  <option value="">
                    Seleccionar
                  </option>

                  {categorias.map(c => (

                    <option
                      key={c.id}
                      value={c.id}
                    >
                      {c.nombre}
                    </option>

                  ))}

                </select>

              </div>

              {/* LAB */}
              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  Laboratorio
                </label>

                <select
                  className="form-select rounded-4 py-3"
                  value={idLaboratorio}
                  onChange={(e)=>setIdLaboratorio(e.target.value)}
                  required
                >

                  <option value="">
                    Seleccionar
                  </option>

                  {laboratorios.map(l => (

                    <option
                      key={l.id}
                      value={l.id}
                    >
                      {l.nombre}
                    </option>

                  ))}

                </select>

              </div>

            </div>

            {/* BOTONES */}
            <div className="d-flex gap-3 mt-4">

              <button
                type="submit"
                className={`btn ${
                  editando
                    ? 'btn-warning'
                    : 'btn-success'
                } rounded-pill px-4 py-3 fw-semibold shadow-sm w-100`}
              >

                {editando
                  ? "Actualizar Producto"
                  : "Guardar Producto"}

              </button>

              {editando && (

                <button
                  type="button"
                  className="btn btn-secondary rounded-pill px-4 py-3 fw-semibold shadow-sm w-100"
                  onClick={limpiarCampos}
                >
                  Cancelar
                </button>

              )}

            </div>

          </form>

        </div>

        {/* TABLA */}
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

          {/* HEADER */}
          <div
            className="px-4 py-4"
            style={{
              background:
                "linear-gradient(135deg, #212529 0%, #343a40 100%)",
            }}
          >

            <h4 className="text-white fw-bold mb-1">
              📋 Lista de Medicamentos
            </h4>

            <p className="text-light opacity-75 mb-0">
              Inventario completo registrado
            </p>

          </div>

          {/* BODY */}
          <div className="card-body p-0">

            <div className="table-responsive">

              <table className="table align-middle mb-0">

                <thead style={{ background: "#f8f9fa" }}>

                  <tr className="text-secondary">

                    <th className="ps-4 py-3">
                      Medicamento
                    </th>

                    <th className="py-3">
                      Precio
                    </th>

                    <th className="py-3">
                      Stock
                    </th>

                    <th className="py-3">
                      Lote
                    </th>

                    <th className="py-3">
                      Vence
                    </th>

                    <th className="py-3">
                      Categoría
                    </th>

                    <th className="py-3">
                      Lab
                    </th>

                    <th className="text-center py-3 pe-4">
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {productosList.map((val) => (

                    <tr
                      key={val.id}
                      style={{
                        borderBottom: "1px solid #f1f3f5",
                      }}
                    >

                      {/* NOMBRE */}
                      <td className="ps-4 py-4">

                        <div className="d-flex align-items-center gap-3">

                          <div
                            className="rounded-circle d-flex justify-content-center align-items-center"
                            style={{
                              width: "50px",
                              height: "50px",
                              background: "#e7f1ff",
                              fontSize: "1.2rem",
                            }}
                          >
                            💊
                          </div>

                          <div>

                            <div className="fw-bold text-dark">
                              {val.nombre}
                            </div>

                            <small className="text-muted">
                              {val.descripcion}
                            </small>

                          </div>

                        </div>

                      </td>

                      {/* PRECIO */}
                      <td>

                        <span className="fw-bold text-success">
                          S/ {val.precio_venta}
                        </span>

                      </td>

                      {/* STOCK */}
                      <td>

                        <span
                          className={`fw-bold ${
                            val.stock_actual <= val.stock_minimo
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {val.stock_actual}
                        </span>

                      </td>

                      {/* LOTE */}
                      <td>

                        <span className="badge bg-secondary rounded-pill px-3 py-2">
                          {val.lote}
                        </span>

                      </td>

                      {/* VENCE */}
                      <td>

                        <span className="fw-semibold">
                          {new Date(
                            val.fecha_vencimiento
                          ).toLocaleDateString()}
                        </span>

                      </td>

                      {/* CATEGORIA */}
                      <td>

                        <span className="badge bg-primary rounded-pill px-3 py-2">
                          {val.nombre_categoria}
                        </span>

                      </td>

                      {/* LAB */}
                      <td>

                        <span className="fw-semibold text-secondary">
                          {val.nombre_laboratorio}
                        </span>

                      </td>

                      {/* ACCIONES */}
                      <td className="text-center pe-4">

                        <div className="d-flex justify-content-center gap-2">

                          {/* VER */}
                          <button
                            className="btn btn-secondary btn-sm rounded-pill px-3"
                            title="Ver trazabilidad"
                            onClick={() =>
                              navigate(`/producto-detalle/${val.id}`)
                            }
                          >
                            👁️
                          </button>

                          {/* EDITAR */}
                          <button
                            className="btn btn-info btn-sm rounded-pill px-3 text-white"
                            onClick={() => editarProducto(val)}
                          >
                            ✏️
                          </button>

                          {/* ELIMINAR */}
                          <button
                            className="btn btn-danger btn-sm rounded-pill px-3"
                            onClick={() => eliminarProducto(val.id)}
                          >
                            🗑️
                          </button>

                        </div>

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

export default Inventario;