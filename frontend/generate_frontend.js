const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const servicesDir = path.join(srcDir, 'services');
const pagesDir = path.join(srcDir, 'pages');

const apps = [
    { name: 'disquera', url: 'disqueras', model: 'Disquera' },
    { name: 'artista', url: 'artistas', model: 'Artista' },
    { name: 'album', url: 'albumes', model: 'Album' },
    { name: 'cancion', url: 'canciones', model: 'Cancion' },
    { name: 'genero', url: 'generos', model: 'Genero' },
];

apps.forEach(app => {
    // 1. Create Services
    const serviceFolderPath = path.join(servicesDir, app.name);
    if (!fs.existsSync(serviceFolderPath)) fs.mkdirSync(serviceFolderPath, { recursive: true });
    
    const capName = app.name.charAt(0).toUpperCase() + app.name.slice(1);
    const serviceContent = `import api from "../api";

export const get${capName}s = async () => {
  const response = await api.get("${app.url}/");
  return response.data;
};

export const get${capName} = async (id) => {
  const response = await api.get(\`${app.url}/\${id}/\`);
  return response.data;
};

export const create${capName} = async (data) => {
  const response = await api.post("${app.url}/", data);
  return response.data;
};

export const update${capName} = async (id, data) => {
  const response = await api.put(\`${app.url}/\${id}/\`, data);
  return response.data;
};

export const delete${capName} = async (id) => {
  const response = await api.delete(\`${app.url}/\${id}/\`);
  return response.data;
};
`;
    fs.writeFileSync(path.join(serviceFolderPath, `${app.name}Service.js`), serviceContent);

    // 2. Create Pages Folders
    const pageFolderPath = path.join(pagesDir, app.name);
    if (!fs.existsSync(pageFolderPath)) fs.mkdirSync(pageFolderPath, { recursive: true });
    
    // We will generate empty or basic React components for now, which I will replace properly
    fs.writeFileSync(path.join(pageFolderPath, `${capName}s.jsx`), `import React from 'react';\nexport default function ${capName}s() { return <div>Listado de ${capName}s</div>; }`);
    fs.writeFileSync(path.join(pageFolderPath, `${capName}Form.jsx`), `import React from 'react';\nexport default function ${capName}Form() { return <div>Formulario de ${capName}</div>; }`);
});

console.log("Archivos base generados.");
