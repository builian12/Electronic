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
        ("Laptops", "Equipos portátiles para oficina y gaming"),
        ("Desktop", "Computadoras de escritorio y torres"),
        ("Periféricos", "Monitores, teclados, mouse y más"),
        ("Componentes", "Procesadores, RAM, discos y tarjetas"),
        ("Redes", "Routers, Switches y access points"),
        ("Impresoras", "Impresoras láser y de tinta"),
    ]
    for nombre, descripcion in categorias:
        Categoria.objects.get_or_create(nombre=nombre, defaults={"descripcion": descripcion, "estado": True})

    print("Creando proveedores...")
    proveedores = [
        ("Carlos Rivas", "TechPro S.A.", "+56 9 1234 5678", "ventas@techpro.cl", "Santiago"),
        ("María Pérez", "PC Link", "+56 2 3344 5566", "contacto@pclink.cl", "Valparaíso"),
        ("Andrés López", "DigitalWorld Ltda.", "+56 9 8765 4321", "ventas@digitalworld.cl", "Concepción"),
        ("Laura Gómez", "Insumos Tech", "+56 2 9988 7766", "info@insumostech.cl", "Antofagasta"),
        ("Pedro Muñoz", "Hardware Express", "+56 9 5544 3322", "pedro@hardwareexpress.cl", "La Serena"),
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
    componentes = Categoria.objects.get(nombre='Componentes')
    redes = Categoria.objects.get(nombre='Redes')
    impresoras = Categoria.objects.get(nombre='Impresoras')

    productos = [
        ("Laptop Dell Latitude", "Ideal para oficina y negocio", 1299.99, 8, laptops),
        ("PC Gamer Ryzen", "Diseño y gaming", 1799.00, 5, desktops),
        ("Monitor 24", "Pantalla Full HD 24 pulgadas", 199.50, 15, perifericos),
        ("Teclado Mecánico RGB", "Ideal para productividad y gaming", 129.90, 24, perifericos),
        ("Mouse Logitech G502", "Precisión y ergonomía", 89.99, 30, perifericos),
        ("MacBook Air M2", "Ligera y potente", 1499.00, 6, laptops),
        ("Lenovo ThinkPad X1", "Empresarial de alto rendimiento", 1599.99, 4, laptops),
        ("PC Escritorio HP ProDesk", "Torre para oficina", 899.00, 10, desktops),
        ("Disco SSD 1TB NVMe", "Velocidad de lectura 3500MB/s", 149.99, 20, componentes),
        ("Memoria RAM 16GB DDR4", "3200MHz CL16", 79.99, 18, componentes),
        ("Procesador Intel i7-13700K", "16 núcleos 5.4GHz", 419.99, 7, componentes),
        ("Router WiFi 6 AX3000", "Doble banda", 89.90, 12, redes),
        ("Switch Gigabit 8 Puertos", "No administrable", 39.99, 15, redes),
        ("Impresora Láser HP", "Blanco y negro dúplex", 249.99, 5, impresoras),
        ("Audífonos Bluetooth Sony", "Cancelación de ruido", 199.99, 14, perifericos),
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
        (4, admin, 499.98, 'Completado', 'Audífonos Bluetooth Sony', 3),
        (5, cliente, 309.98, 'Pendiente', 'Teclado Mecánico RGB', 3),
        (6, admin, 279.97, 'Completado', 'Router WiFi 6 AX3000', 3),
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

    # Detalles adicionales para ventas con más variedad
    v4 = Venta.objects.get(id=4)
    for prod_name, cant in [('MacBook Air M2', 1), ('Memoria RAM 16GB DDR4', 1)]:
        p = Producto.objects.get(nombre=prod_name)
        DetalleVenta.objects.get_or_create(
            venta=v4, producto=p,
            defaults={"cantidad": cant, "precio_unitario_historico": p.precio_unitario, "subtotal": p.precio_unitario * cant},
        )

    v6 = Venta.objects.get(id=6)
    for prod_name, cant in [('Mouse Logitech G502', 1), ('Disco SSD 1TB NVMe', 1)]:
        p = Producto.objects.get(nombre=prod_name)
        DetalleVenta.objects.get_or_create(
            venta=v6, producto=p,
            defaults={"cantidad": cant, "precio_unitario_historico": p.precio_unitario, "subtotal": p.precio_unitario * cant},
        )

    print("Datos de negocio guardados correctamente.")


if __name__ == '__main__':
    populate()
