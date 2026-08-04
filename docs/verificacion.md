# Cómo comprobar que todo funciona

## 1. Backend

Ejecutar:

```bash
cd backend
export PATH="$HOME/.local/nodejs/bin:$PATH"
python3 manage.py runserver 0.0.0.0:8000
```

Luego abrir:
- http://127.0.0.1:8000/admin/
- http://127.0.0.1:8000/api/categorias/
- http://127.0.0.1:8000/api/productos/
- http://127.0.0.1:8000/api/ventas/

## 2. Frontend

Ejecutar:

```bash
cd frontend
npm install
npm run dev
```

Abrir:
- http://127.0.0.1:5173/

## 3. Probar login

Credenciales de prueba:
- admin / Admin123!
- cliente / Cliente123!

## 4. Verificar que la base tenga solo datos nuevos

Ejecutar:

```bash
cd backend
python3 manage.py shell -c "from django.contrib.auth.models import User; from categorias.models import Categoria; from productos.models import Producto; from ventas.models import Venta; print('usuarios', User.objects.count()); print('categorias', Categoria.objects.count()); print('productos', Producto.objects.count()); print('ventas', Venta.objects.count())"
```

## 5. Comprobar que el proyecto compila

```bash
cd frontend
npm run build
```
