from django.db import models

# Create your models here.

class Socio(models.Model):
    dni = models.CharField(max_length=12, unique=True)
    nro_socio = models.CharField(max_length=15, unique=True)
    nombre_completo = models.CharField(max_length=100)

class Libro(models.Model):
    isbn = models.CharField(max_length=13, unique=True)
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=100)
    estado = models.CharField(max_length=20)

class Prestamo(models.Model):
    socio = models.ForeignKey(Socio, on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    fecha_inicio = models.DateField(auto_now_add=True)
    fecha_devolucion = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.socio.nombre_completo} - {self.libro.titulo}"

class Multa(models.Model):
    prestamo = models.ForeignKey(Prestamo, on_delete=models.CASCADE)
    fecha = models.DateField(auto_now_add=True)
    monto = models.DecimalField(max_digits=6, decimal_places=2)
    motivo = models.CharField(max_length=100)
    estado = models.CharField(max_length=20)