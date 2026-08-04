# 📋 Guía para el Equipo - Presentación Proyecto Electronic

## Tabla de IPs

| Compañero | IP en SU laptop | Rol |
|---|---|---|
| **William (Fedora)** | **192.168.1.10** | Servidor: backend + PostgreSQL + frontend |
| Compañero 1 | 192.168.1.11 | Cliente: solo frontend |
| Compañero 2 | 192.168.1.12 | Cliente: solo frontend |
| Compañero 3 | 192.168.1.13 | Cliente: solo frontend |
| Compañero 4 | 192.168.1.14 | Cliente: solo frontend |

---

## 1. Configurar la IP estática en cada laptop

1. Conectar el **cable Ethernet al switch**
2. Ir a Configuración de Red → Ethernet → IPv4 → Manual
3. Cada uno pone SU IP (ver tabla)
4. Máscara de subred: `255.255.255.0`
5. Gateway: `192.168.1.1` o dejarlo vacío

---

## 2. Clonar el proyecto (los 4 hacen lo mismo)

```bash
git clone https://github.com/builian12/Electronic.git
cd Electronic/frontend
```

---

## 3. Verificar la URL de la API

Abrir el archivo: `frontend/src/services/api.jsx`

Debe tener:
```javascript
const API_URL = 'http://192.168.1.10:8000/api/';
```

⚠️ **IMPORTANTE**: Todos apuntan a `192.168.1.10` (IP del servidor de William). NO cambiar esta IP.

---

## 4. Instalar y ejecutar el frontend

```bash
npm install
npm run dev
```

Abrir en el navegador: `http://localhost:5173`

---

## 5. ¿Quién ejecuta qué?

| Componente | Quién lo ejecuta |
|---|---|
| **Backend Django** (puerto 8000) | SOLO William (192.168.1.10) |
| **PostgreSQL** | SOLO William (192.168.1.10) |
| **Frontend React** (puerto 5173) | TODOS (en cada laptop) |
| **App Flutter** (celular) | OPCIONAL, desde el celular de William |

### Backend SOLO en Fedora de William:
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

### Los 4 NUNCA ejecutan el backend en sus laptops.

---

## 6. ¿Qué pasa cuando todos corren el frontend?

- Cada persona ve la app en **su propio navegador** (`localhost:5173`)
- **Todos los datos vienen de PostgreSQL** de William (192.168.1.10)
- Si alguien agrega un producto, **todos lo ven** al recargar
- Si alguien hace una compra, **se registra en la BD** y descuenta stock

---

## 7. Hacer commits de los CRUDs

Cada integrante puede hacer commits desde su repo clonado:

```bash
git add -A
git commit -m "feat: implementar CRUD de [su módulo]"
git push origin main
```

---

## 8. Credenciales de acceso

- **Admin**: `admin` / `Admin123!`
- **Cliente**: `cliente` / `Cliente123!`

---

## 9. URLs de referencia

| Recurso | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://127.0.0.1:8000/api/` |
| Swagger | `http://127.0.0.1:8000/api/docs/` |
| Redoc | `http://127.0.0.1:8000/api/redoc/` |

---

## 10. Proceso de la defensa (20 minutos)

1. **Mostrar el login** (admin o cliente)
2. **Mostrar la tienda** con productos de PostgreSQL
3. **Mostrar los CRUDs** (categorías, productos, ventas, proveedores, clientes, usuarios)
4. **Mostrar Swagger** documentación de la API
5. **Mostrar la App Flutter** en el celular
6. **Mostrar que todos los equipos ven los mismos datos** en tiempo real