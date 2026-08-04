from rest_framework import viewsets
from .models import Producto
from .serializers import ProductoSerializer

# CAMBIO CRUD PRODUCTOS: endpoint para listar, crear, actualizar y eliminar productos
# CAMBIO CRUD PRODUCTOS: vista principal del módulo
# CAMBIO CRUD PRODUCTOS: utilizar el serializador del modelo
# CAMBIO CRUD PRODUCTOS: consultar todos los productos disponibles
# CAMBIO CRUD PRODUCTOS: manejar creación de nuevos productos
# CAMBIO CRUD PRODUCTOS: manejar actualización de productos
# CAMBIO CRUD PRODUCTOS: manejar eliminación de productos
# CAMBIO CRUD PRODUCTOS: exponer la API de productos
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
