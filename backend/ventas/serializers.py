from rest_framework import serializers
from .models import Venta, DetalleVenta

class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleVenta
        fields = '__all__'
        read_only_fields = ['venta']

class VentaSerializer(serializers.ModelSerializer):
    detalles = DetalleVentaSerializer(many=True, read_only=True)

    class Meta:
        model = Venta
        fields = '__all__'

class VentaCreateSerializer(serializers.ModelSerializer):
    detalles = DetalleVentaSerializer(many=True, required=False)

    class Meta:
        model = Venta
        fields = ['id', 'usuario', 'total_venta', 'estado', 'fecha_venta', 'detalles']
        read_only_fields = ['id', 'usuario', 'fecha_venta']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles', [])
        venta = Venta.objects.create(**validated_data)
        for detalle_data in detalles_data:
            DetalleVenta.objects.create(venta=venta, **detalle_data)
        return venta