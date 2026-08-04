# Electronic 🛒⚡

Sistema de gestión de inventario y ventas de productos electrónicos.

## Arquitectura
- **Backend**: Django 6 + Django REST Framework + PostgreSQL (Fedora Linux)
- **Frontend Web**: React 18 + Vite 5 + Axios + Tailwind CSS
- **App Móvil**: Flutter + Dart
- **Documentación API**: Swagger UI / Redoc (drf-spectacular)
- **Base de datos**: PostgreSQL `Electronic_bdd` (localhost:5432)

## Requisitos cumplidos del proyecto

| # | Requisito | Cumplido |
|---|-----------|----------|
| 1 | Lógica de negocio propia (tienda de electrónicos) | ✅ |
| 2 | Mínimo 1 CRUD por integrante (6 CRUDs: usuarios, categorías, productos, ventas, proveedores, clientes) | ✅ |
| 3 | SGBD PostgreSQL alojado en Fedora | ✅ |
| 4 | Documentación de APIs con Swagger | ✅ |
| 5 | Consumir APIs con React + axios | ✅ |
| 6 | Consumir APIs con Flutter + Dart | ✅ |
| 7 | Configuración Cliente-Servidor | ✅ |
| 8 | Login con JWT | ✅ |

## Estructura

```
Electronic/
├── backend/          # Django REST Framework
│   ├── usuarios/     # CRUD usuarios + JWT login
│   ├── categorias/   # CRUD categorías
│   ├── productos/    # CRUD productos
│   ├── ventas/       # CRUD ventas + detalles
│   ├── proveedores/  # CRUD proveedores
│   └── clientes/     # CRUD clientes
├── frontend/         # React 18 + Vite + Tailwind
│   └── src/views/
│       ├── admin/    # Panel admin (7 vistas)
│       ├── auth/     # Login/Register
│       └── store/    # Tienda con carrito y compra
├── mobile/           # Flutter + Dart (app móvil)
└── GUIA/             # Guías de cliente-servidor y red local
```

## Credenciales
- **Admin**: `admin` / `Admin123!`
- **Cliente**: `cliente` / `Cliente123!`

## URLs del sistema
- Frontend Web: `http://localhost:5173`
- Backend API: `http://127.0.0.1:8000/api/`
- Swagger: `http://127.0.0.1:8000/api/docs/`
- Redoc: `http://127.0.0.1:8000/api/redoc/`

## Endpoints principales
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/token/` | Login JWT |
| GET/POST | `/api/categorias/` | Listar/Crear categorías |
| GET/PUT/DELETE | `/api/categorias/{id}/` | CRUD categoría |
| GET/POST | `/api/productos/` | Listar/Crear productos |
| GET/POST | `/api/ventas/` | Listar/Crear ventas |
| GET/POST | `/api/proveedores/` | Listar/Crear proveedores |
| GET/POST | `/api/clientes/` | Listar/Crear clientes |
| GET/POST | `/api/users/` | Listar/Crear usuarios |

## Cómo ejecutar

### Backend (Fedora)
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

### Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```

### App Móvil (Flutter)
```bash
cd mobile
flutter pub get
flutter run
```

## Base de datos (PostgreSQL)
```sql
-- Configuración en backend/backend/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'Electronic_bdd',
        'USER': 'grupo3',
        'PASSWORD': 'Admin',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}