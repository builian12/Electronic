from rest_framework import viewsets
from productos.models import Producto
from .models import Venta, DetalleVenta
from .serializers import VentaSerializer, DetalleVentaSerializer, VentaCreateSerializer

class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return VentaCreateSerializer
        return VentaSerializer

    def perform_create(self, serializer):
        venta = serializer.save(usuario=self.request.user)
        # Descontar stock de cada producto vendido
        for detalle in venta.detalles.all():
            producto = detalle.producto
            producto.stock_disponible = max(0, producto.stock_disponible - detalle.cantidad)
            producto.save()

    def perform_destroy(self, instance):
        # Devolver stock al eliminar venta
        for detalle in instance.detalles.all():
            producto = detalle.producto
            producto.stock_disponible = producto.stock_disponible + detalle.cantidad
            producto.save()
        instance.delete()

class DetalleVentaViewSet(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer