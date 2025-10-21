from django.urls import path
from . import views

urlpatterns = [
    path('socio/agregar/', views.agregar_socio, name='agregar_socio'),
    path('socio/buscar/', views.buscar_socio, name='buscar_socio'),
    path('libro/agregar/', views.agregar_libro, name='agregar_libro'),
    path('libro/buscar/', views.buscar_libro, name='buscar_libro'),
    path('prestamo/manejar/', views.manejar_prestamo, name='manejar_prestamo'),
    path('prestamo/devolver/', views.devolver_libro, name='devolver_libro'),
    path('prestamo/historial/', views.historial_prestamos, name='historial_prestamos'),
]
