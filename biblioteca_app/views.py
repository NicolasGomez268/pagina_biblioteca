from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from .models import Socio, Libro, Prestamo, Multa

# Socio Views
def agregar_socio(request):
    mensaje = None
    if request.method == 'POST':
        dni = request.POST.get('dni')
        nro_socio = request.POST.get('nro_socio')
        nombre_completo = request.POST.get('nombre_completo')
        
        # Verificar si el socio ya existe
        if Socio.objects.filter(dni=dni).exists():
            socio_existente = Socio.objects.get(dni=dni)
            mensaje = f'El socio con DNI {dni} ya está registrado: {socio_existente.nombre_completo}'
        else:
            Socio.objects.create(dni=dni, nro_socio=nro_socio, nombre_completo=nombre_completo)
            mensaje = 'Socio agregado exitosamente.'
            
    return render(request, 'biblioteca_app/agregar_socio.html', {'mensaje': mensaje})

def buscar_socio(request):
    socios = None
    mensaje = None
    if request.method == 'POST':
        filtro = request.POST.get('filtro')
        busqueda = request.POST.get('busqueda')
        
        if filtro == 'dni':
            socios = Socio.objects.filter(dni__icontains=busqueda)
        elif filtro == 'nro_socio':
            socios = Socio.objects.filter(nro_socio__icontains=busqueda)
        elif filtro == 'nombre':
            socios = Socio.objects.filter(nombre_completo__icontains=busqueda)
        
        if not socios:
            mensaje = f'No se encontraron socios con el criterio de búsqueda: {busqueda}'
    
    return render(request, 'biblioteca_app/buscar_socio.html', {'socios': socios, 'mensaje': mensaje})

# Libro Views
def agregar_libro(request):
    mensaje = None
    if request.method == 'POST':
        isbn = request.POST.get('isbn')
        titulo = request.POST.get('titulo')
        autor = request.POST.get('autor')
        estado = request.POST.get('estado', 'Disponible')
        
        # Verificar si el libro ya existe
        if Libro.objects.filter(isbn=isbn).exists():
            libro_existente = Libro.objects.get(isbn=isbn)
            mensaje = f'El libro con ISBN {isbn} ya está registrado: {libro_existente.titulo}'
        else:
            Libro.objects.create(isbn=isbn, titulo=titulo, autor=autor, estado=estado)
            mensaje = 'Libro agregado exitosamente.'
            
    return render(request, 'biblioteca_app/agregar_libro.html', {'mensaje': mensaje})

def buscar_libro(request):
    libros = None
    mensaje = None
    if request.method == 'POST':
        filtro = request.POST.get('filtro')
        busqueda = request.POST.get('busqueda')
        
        if filtro == 'isbn':
            libros = Libro.objects.filter(isbn__icontains=busqueda)
        elif filtro == 'titulo':
            libros = Libro.objects.filter(titulo__icontains=busqueda)
        elif filtro == 'autor':
            libros = Libro.objects.filter(autor__icontains=busqueda)
        
        if not libros:
            mensaje = f'No se encontraron libros con el criterio de búsqueda: {busqueda}'
    
    return render(request, 'biblioteca_app/buscar_libro.html', {'libros': libros, 'mensaje': mensaje})

# Prestamo Views
def manejar_prestamo(request):
    from datetime import date
    mensaje = None
    prestamo_info = None
    
    if request.method == 'POST':
        socio_id = request.POST.get('socio_id')
        libro_id = request.POST.get('libro_id')
        socio = get_object_or_404(Socio, id=socio_id)
        libro = get_object_or_404(Libro, id=libro_id)
        
        # Verificar si el libro ya está prestado
        if Prestamo.objects.filter(libro=libro, fecha_devolucion__isnull=True).exists():
            mensaje = f'El libro "{libro.titulo}" ya está en préstamo.'
        else:
            prestamo = Prestamo.objects.create(socio=socio, libro=libro)
            libro.estado = 'Prestado'
            libro.save()
            prestamo_info = {
                'socio': socio.nombre_completo,
                'libro': libro.titulo,
                'fecha_inicio': prestamo.fecha_inicio,
                'fecha_esperada': date.today()
            }
            mensaje = f'Préstamo registrado exitosamente'
            
    socios = Socio.objects.all()
    libros = Libro.objects.filter(estado='Disponible')
    return render(request, 'biblioteca_app/manejar_prestamo.html', {
        'socios': socios, 
        'libros': libros, 
        'mensaje': mensaje,
        'prestamo_info': prestamo_info
    })

def devolver_libro(request):
    from datetime import date
    mensaje = None
    prestamo = None
    
    if request.method == 'POST':
        prestamo_id = request.POST.get('prestamo_id')
        estado_libro = request.POST.get('estado_libro')
        
        prestamo = get_object_or_404(Prestamo, id=prestamo_id)
        prestamo.fecha_devolucion = date.today()
        prestamo.save()
        
        libro = prestamo.libro
        
        # Verificar el estado del libro
        if estado_libro == 'dañado':
            libro.estado = 'Disponible'
            libro.save()
            # Crear multa por daño
            Multa.objects.create(
                prestamo=prestamo,
                monto=50.00,
                motivo='Libro devuelto con daños',
                estado='Pendiente'
            )
            mensaje = f'Libro devuelto. Se ha registrado una multa de $50.00 por daños.'
        elif estado_libro == 'perdido':
            libro.estado = 'Perdido'
            libro.save()
            # Crear multa por pérdida
            Multa.objects.create(
                prestamo=prestamo,
                monto=100.00,
                motivo='Libro perdido',
                estado='Pendiente'
            )
            mensaje = f'Libro marcado como perdido. Se ha registrado una multa de $100.00.'
        else:
            libro.estado = 'Disponible'
            libro.save()
            mensaje = f'Libro devuelto exitosamente en buen estado.'
    
    # Obtener préstamos activos (sin fecha de devolución)
    prestamos_activos = Prestamo.objects.filter(fecha_devolucion__isnull=True).select_related('socio', 'libro')
    
    return render(request, 'biblioteca_app/devolver_libro.html', {'prestamos_activos': prestamos_activos, 'mensaje': mensaje})

def historial_prestamos(request):
    # Obtener todos los préstamos ordenados por fecha de inicio (más recientes primero)
    prestamos = Prestamo.objects.all().select_related('socio', 'libro').prefetch_related('multa_set').order_by('-fecha_inicio')
    busqueda = None
    
    # Filtrar por nombre de libro si se proporciona
    if request.method == 'GET' and 'busqueda' in request.GET:
        busqueda = request.GET.get('busqueda', '').strip()
        if busqueda:
            prestamos = prestamos.filter(libro__titulo__icontains=busqueda)
    
    # Estadísticas
    total_prestamos = prestamos.count()
    prestamos_activos = prestamos.filter(fecha_devolucion__isnull=True).count()
    prestamos_devueltos = prestamos.filter(fecha_devolucion__isnull=False).count()
    
    return render(request, 'biblioteca_app/historial_prestamos.html', {
        'prestamos': prestamos,
        'busqueda': busqueda,
        'total_prestamos': total_prestamos,
        'prestamos_activos': prestamos_activos,
        'prestamos_devueltos': prestamos_devueltos
    })
