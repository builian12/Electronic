from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VentaViewSet, DetalleVentaViewSet

router = DefaultRouter()
router.register(r'', VentaViewSet, basename='venta')
router.register(r'detalles', DetalleVentaViewSet, basename='detalleventa')

urlpatterns = [
    path('', include(router.urls)),
]
