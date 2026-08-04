const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');

const apps = [
  { 
    name: 'disquera', 
    cap: 'Disquera', 
    title: 'Disqueras',
    fields: [
      { id: 'nombre', label: 'Nombre' },
      { id: 'pais_origen', label: 'País de Origen' },
      { id: 'anio_fundacion', label: 'Año de Fundación' },
      { id: 'email_contacto', label: 'Email' }
    ]
  },
  { 
    name: 'artista', 
    cap: 'Artista', 
    title: 'Artistas',
    fields: [
      { id: 'nombre_artistico', label: 'Nombre Artístico' },
      { id: 'genero_principal', label: 'Género' },
      { id: 'anio_inicio', label: 'Año de Inicio' }
    ]
  },
  { 
    name: 'album', 
    cap: 'Album', 
    title: 'Álbumes',
    fields: [
      { id: 'titulo', label: 'Título' },
      { id: 'fecha_lanzamiento', label: 'Fecha Lanzamiento' }
    ]
  },
  { 
    name: 'cancion', 
    cap: 'Cancion', 
    title: 'Canciones',
    fields: [
      { id: 'titulo', label: 'Título' },
      { id: 'duracion_segundos', label: 'Duración (seg)' },
      { id: 'precio', label: 'Precio' }
    ]
  },
  { 
    name: 'genero', 
    cap: 'Genero', 
    title: 'Géneros',
    fields: [
      { id: 'nombre', label: 'Nombre' },
      { id: 'descripcion', label: 'Descripción' }
    ]
  }
];

apps.forEach(app => {
  const pageFolderPath = path.join(pagesDir, app.name);
  
  const theadFields = app.fields.map(f => `                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-gray-800 text-gray-300 border-gray-700">${f.label}</th>`).join('\n');
  const tbodyFields = app.fields.map(f => `                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 border-gray-700">{item.${f.id}}</td>`).join('\n');
  
  const formFields = app.fields.map(f => `                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-gray-400 text-xs font-bold mb-2">
                        ${f.label}
                      </label>
                      <input
                        type="text"
                        name="${f.id}"
                        value={formData.${f.id} || ""}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-gray-500 text-white bg-gray-800 rounded-lg text-sm shadow focus:outline-none focus:ring-2 focus:ring-green-400 w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>`).join('\n');

  // ----- List Component -----
  const listCode = `import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { get${app.cap}s, delete${app.cap} } from "../../services/${app.name}/${app.name}Service";

export default function ${app.cap}s() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await get${app.cap}s();
      if (Array.isArray(res)) setData(res);
      else if (res && res.results) setData(res.results);
      else setData([]);
    } catch (error) {
      console.error("Error al cargar ${app.name}s:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      try {
        await delete${app.cap}(id);
        fetchData();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-xl rounded-lg bg-gray-900 text-white">
            <div className="rounded-t mb-0 px-4 py-4 border-0 bg-gray-800">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-bold text-xl text-green-400">
                    <i className="fas fa-music mr-2"></i> Módulo de ${app.title}
                  </h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <Link
                    to="/dashboard/${app.name}s/crear"
                    className="bg-green-500 hover:bg-green-400 text-gray-900 text-sm font-bold uppercase px-4 py-2 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >
                    Crear Nuevo
                  </Link>
                </div>
              </div>
            </div>
            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-gray-800 text-gray-300 border-gray-700">
                      ID
                    </th>
${theadFields}
                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-gray-800 text-gray-300 border-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800 transition-colors">
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 border-gray-700">
                        {item.id}
                      </td>
${tbodyFields}
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 border-gray-700">
                        <Link
                          to={\`/dashboard/${app.name}s/editar/\${item.id}\`}
                          className="text-indigo-400 hover:text-indigo-300 mr-4 transition-colors"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length === 0 && (
                <div className="w-full p-6 text-center text-gray-400">
                  No hay registros disponibles.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
`;
  fs.writeFileSync(path.join(pageFolderPath, `${app.cap}s.jsx`), listCode);

  // ----- Form Component -----
  const formCode = `import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { create${app.cap}, get${app.cap}, update${app.cap} } from "../../services/${app.name}/${app.name}Service";

export default function ${app.cap}Form() {
  const [formData, setFormData] = useState({});
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const data = await get${app.cap}(id);
      setFormData(data);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await update${app.cap}(id, formData);
      } else {
        await create${app.cap}(formData);
      }
      history.push("/dashboard/${app.name}s");
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <>
      <div className="flex content-center items-center justify-center h-full mt-8">
        <div className="w-full lg:w-8/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-2xl rounded-lg bg-gray-900 border-0 text-white">
            <div className="rounded-t mb-0 px-6 py-6 bg-gray-800">
              <div className="text-center flex justify-between">
                <h6 className="text-green-400 text-xl font-bold">
                  {id ? "Editar ${app.cap}" : "Crear ${app.cap}"}
                </h6>
                <Link
                  to="/dashboard/${app.name}s"
                  className="bg-gray-700 text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                >
                  Volver
                </Link>
              </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={handleSubmit} className="mt-8">
                <div className="flex flex-wrap">
${formFields}
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    className="bg-green-500 text-gray-900 active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
`;
  fs.writeFileSync(path.join(pageFolderPath, `${app.cap}Form.jsx`), formCode);
});

console.log("Componentes React con Temática Musical generados con éxito!");
