# Flujo de trabajo para el equipo

## 1. Requisitos previos

Cada compañero debe tener instalado:
- Python 3.12+ o 3.13+
- Git
- PostgreSQL
- VS Code

## 2. Clonar y preparar el proyecto

```bash
cd ~
git clone https://github.com/builian12/Electronic.git
cd Electronic/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 3. Configurar la base de datos

Asegurarse de que exista la base de datos:

```sql
CREATE DATABASE Electronic_bdd;
CREATE USER grupo3 WITH PASSWORD 'Admin';
alter role grupo3 with superuser;
```

## 4. Migrar y cargar datos base

```bash
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py shell < ../populate.py
```

## 5. Reglas de commits

Cada persona debe trabajar en una rama propia:

```bash
git checkout -b feature/categorias
git checkout -b feature/productos
git checkout -b feature/ventas
git checkout -b feature/usuarios
```

### Nombres recomendados para los commits

- `feat(categorias): agregar CRUD de categorías`
- `feat(productos): crear modelo y vistas de productos`
- `feat(ventas): implementar ventas y detalles`
- `feat(usuarios): mejorar autenticación y gestión de usuarios`
- `fix(auth): corregir login y permisos`
- `refactor(ui): mejorar panel administrativo`
- `docs: agregar guía de colaboración`

### Regla simple
- Un commit por cambio claro.
- No mezclar frontend y backend en el mismo commit si se puede evitar.
- Antes de hacer push, revisar que todo funcione.

## 6. Flujo de trabajo diario

```bash
git pull origin main
git checkout -b feature/nombre
# trabajar
git add .
git commit -m "feat(productos): agregar CRUD"
git push origin feature/nombre
```

## 7. Para revisar cambios

Cuando un compañero termine, debe abrir un Pull Request en GitHub y explicar:
- Qué cambió
- Qué probó
- Qué necesita revisar el equipo

## 8. Conexión con el proyecto

Cada compañero debe usar el mismo repositorio y la misma configuración de base de datos.
Si alguien tiene problemas con el login, debe verificar:
- que el servidor backend esté corriendo
- que el frontend esté corriendo
- que las credenciales de PostgreSQL sean correctas
