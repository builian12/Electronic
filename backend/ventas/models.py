from django.db import models
from django.contrib.auth.models import User
from productos.models import Producto

class Venta(models.Model):
    ESTADOS = (
        ('Completado', 'Completado'),
        ('Pendiente', 'Pendiente'),
    )
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ventas')
    fecha_venta = models.DateTimeField(auto_now_add=True)
    total_venta = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Pendiente')

    def __str__(self):
        return f'Venta #{self.id}'

class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, related_name='detalles_venta')
    cantidad = models.IntegerField(default=1)
    precio_unitario_historico = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.cantidad} x {self.producto.nombre}'
