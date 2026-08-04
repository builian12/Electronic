import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth.models import User
from categorias.models import Categoria
from productos.models import Producto
from ventas.models import Venta, DetalleVenta


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
        ("Periféricos", "Monitores, teclados y mouse")
    ]
    for nombre, descripcion in categorias:
        Categoria.objects.get_or_create(nombre=nombre, defaults={"descripcion": descripcion, "estado": True})

    print("Creando productos...")
    laptops = Categoria.objects.get(nombre='Laptops')
    desktops = Categoria.objects.get(nombre='Desktop')
    perifericos = Categoria.objects.get(nombre='Periféricos')

    productos = [
        ("Laptop Dell Latitude", "Ideal para oficina y negocio", 1299.99, 8, laptops),
        ("PC Gamer Ryzen", "Diseño y gaming", 1799.00, 5, desktops),
        ("Monitor 24", "Pantalla Full HD", 199.50, 15, perifericos),
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
    venta, _ = Venta.objects.get_or_create(
        id=1,
        defaults={
            "usuario": cliente,
            "total_venta": 1299.99,
            "estado": "Completado",
        },
    )
    producto = Producto.objects.get(nombre='Laptop Dell Latitude')
    DetalleVenta.objects.get_or_create(
        venta=venta,
        producto=producto,
        defaults={
            "cantidad": 1,
            "precio_unitario_historico": 1299.99,
            "subtotal": 1299.99,
        },
    )

    print("Datos de negocio cargados correctamente.")


if __name__ == '__main__':
    populate()
