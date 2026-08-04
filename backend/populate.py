import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth.models import User
from categorias.models import Categoria
from productos.models import Producto
from ventas.models import Venta, DetalleVenta
from proveedores.models import Proveedor


def populate():
    print("Creando usuarios...")
    admin, _ = User.objects.get_or_create(username='admin')
    admin.set_password('Admin123!')
    admin.is_superuser = True
    admin.is_staff = True
    admin.save()

    cliente, _ = User.objects.get_or_create(username='cliente')
    cliente.set_password('Cliente123!')
    cliente.save()

    print("Creando categorías...")
    categorias = [
        ("Laptops", "Equipos portátiles"),
        ("Desktop", "Computadoras de escritorio"),
        ("Periféricos", "Monitores, teclados y mouse"),
        ("Accesorios", "Mouse, teclados y hubs")
    ]
    for nombre, descripcion in categorias:
        Categoria.objects.get_or_create(nombre=nombre, defaults={"descripcion": descripcion, "estado": True})

    print("Creando proveedores...")
    proveedores = [
        ("Carlos Rivas", "TechPro S.A.", "+56 9 1234 5678", "ventas@techpro.cl", "Santiago"),
        ("María Pérez", "PC Link", "+56 2 3344 5566", "contacto@pclink.cl", "Valparaíso"),
    ]
    for nombre, empresa, telefono, email, direccion in proveedores:
        Proveedor.objects.get_or_create(
            nombre=nombre,
            defaults={
                "empresa": empresa,
                "telefono": telefono,
                "email": email,
                "direccion": direccion,
                "estado": True,
            }
        )

    print("Creando productos...")
    laptops = Categoria.objects.get(nombre='Laptops')
    desktops = Categoria.objects.get(nombre='Desktop')
    perifericos = Categoria.objects.get(nombre='Periféricos')
    accesorios = Categoria.objects.get(nombre='Accesorios')

    productos = [
        ("Laptop Dell Latitude", "Ideal para oficina y negocio", 1299.99, 8, laptops),
        ("PC Gamer Ryzen", "Diseño y gaming", 1799.00, 5, desktops),
        ("Monitor 24", "Pantalla Full HD", 199.50, 15, perifericos),
        ("Teclado Mecánico RGB", "Ideal para productividad y gaming", 129.90, 24, accesorios),
        ("Mouse Logitech G502", "Precisión y ergonomía", 89.99, 30, accesorios),
    ]

    for nombre, descripcion, precio, stock, categoria in productos:
        Producto.objects.get_or_create(
            nombre=nombre,
            defaults={
                "descripcion": descripcion,
                "precio_unitario": precio,
                "stock_disponible": stock,
                "categoria": categoria,
                "estado": True,
            }
        )

    print("Creando ventas de ejemplo...")
    ventas = [
        (1, cliente, 1299.99, 'Completado', 'Laptop Dell Latitude', 1),
        (2, cliente, 329.40, 'Pendiente', 'Monitor 24', 2),
        (3, cliente, 1799.00, 'Completado', 'PC Gamer Ryzen', 1),
    ]
    for venta_id, usuario, total, estado, producto_nombre, cantidad in ventas:
        venta, _ = Venta.objects.get_or_create(
            id=venta_id,
            defaults={
                "usuario": usuario,
                "total_venta": total,
                "estado": estado,
            },
        )
        producto = Producto.objects.get(nombre=producto_nombre)
        DetalleVenta.objects.get_or_create(
            venta=venta,
            producto=producto,
            defaults={
                "cantidad": cantidad,
                "precio_unitario_historico": producto.precio_unitario,
                "subtotal": producto.precio_unitario * cantidad,
            },
        )

    print("Datos de negocio cargados correctamente.")


if __name__ == '__main__':
    populate()
