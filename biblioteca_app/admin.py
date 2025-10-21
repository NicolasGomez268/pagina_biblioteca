from django.contrib import admin
from .models import Socio, Libro, Prestamo, Multa

# Register your models here.

@admin.register(Socio)
class SocioAdmin(admin.ModelAdmin):
    list_display = ('dni', 'nro_socio', 'nombre_completo')
    list_filter = ('dni', 'nro_socio')
    search_fields = ('dni', 'nro_socio', 'nombre_completo')
    ordering = ('nombre_completo',)

@admin.register(Libro)
class LibroAdmin(admin.ModelAdmin):
    list_display = ('isbn', 'titulo', 'autor', 'estado')
    list_filter = ('estado', 'autor')
    search_fields = ('isbn', 'titulo', 'autor')
    ordering = ('titulo',)

@admin.register(Prestamo)
class PrestamoAdmin(admin.ModelAdmin):
    list_display = ('socio', 'libro', 'fecha_inicio', 'fecha_devolucion', 'estado_prestamo')
    list_filter = ('fecha_inicio', 'fecha_devolucion', 'libro__estado')
    search_fields = ('socio__nombre_completo', 'libro__titulo', 'libro__isbn')
    ordering = ('-fecha_inicio',)
    
    def estado_prestamo(self, obj):
        return "Activo" if obj.fecha_devolucion is None else "Devuelto"
    estado_prestamo.short_description = "Estado"

@admin.register(Multa)
class MultaAdmin(admin.ModelAdmin):
    list_display = ('prestamo', 'fecha', 'monto', 'motivo', 'estado')
    list_filter = ('fecha', 'estado', 'monto')
    search_fields = ('prestamo__socio__nombre_completo', 'motivo')
    ordering = ('-fecha',)
