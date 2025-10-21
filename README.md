# Sistema de Gestión de Biblioteca

Sistema de gestión de biblioteca desarrollado con Django y SQLite3.

## 🚀 Características

- Gestión de socios (agregar, buscar)
- Catálogo de libros con búsqueda y filtros
- Sistema de préstamos y devoluciones
- Gestión automática de multas por daños/pérdidas
- Control de disponibilidad de libros
- Historial completo de préstamos
- Interfaz administrativa con Django Admin

## 📋 Requisitos

- Python 3.12+
- Django 5.2
- SQLite3 (incluido en Python)

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/NicolasGomez268/pagina_biblioteca.git
cd pagina_biblioteca
```

2. Crear entorno virtual:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Ejecutar migraciones:
```bash
python manage.py migrate
```

5. Crear superusuario:
```bash
python manage.py createsuperuser
```

## 🏃 Ejecutar el proyecto

Modo desarrollo:
```bash
python manage.py runserver
```

Acceder a:
- Aplicación: http://127.0.0.1:8000/
- Admin: http://127.0.0.1:8000/admin/

## 📚 Estructura del Proyecto

```
proyecto_biblioteca/
├── manage.py
├── requirements.txt
├── biblioteca/          # Configuración del proyecto
│   ├── settings.py
│   ├── urls.py
│   └── ...
├── biblioteca_app/      # Aplicación principal
│   ├── models.py       # Modelos de datos
│   ├── views.py        # Lógica de negocio
│   ├── urls.py         # Rutas
│   ├── admin.py        # Configuración admin
│   └── migrations/     # Migraciones DB
└── templates/          # Plantillas HTML
    └── biblioteca_app/
        ├── base.html
        ├── index.html
        └── ...
```

## 🗄️ Modelos de Datos

- **Socio**: DNI, número de socio, nombre completo
- **Libro**: ISBN, título, autor, estado
- **Prestamo**: Relación socio-libro, fechas automáticas
- **Multa**: Relación con préstamo, monto, motivo

## 🎯 Funcionalidades

### Gestión de Socios
- Agregar nuevos socios
- Buscar socios por DNI, número o nombre
- Validación de DNI único

### Gestión de Libros
- Agregar nuevos libros
- Buscar libros por ISBN, título o autor
- Estados: Disponible, Prestado, Perdido

### Gestión de Préstamos
- Registrar préstamos con fechas automáticas
- Devolver libros con verificación de estado
- Multas automáticas por daños ($50) o pérdidas ($100)

### Historial
- Vista completa de todos los préstamos
- Filtros por nombre de libro
- Estadísticas en tiempo real

## 🛠️ Tecnologías Utilizadas

- **Django 5.2** - Framework web
- **Python 3.12** - Lenguaje de programación
- **SQLite3** - Base de datos
- **Bootstrap 5.3.0** - Framework CSS
- **Bootstrap Icons** - Iconografía
- **Google Fonts** - Tipografías

## 📝 Notas

- El sistema utiliza arquitectura en capas (MVC)
- Interfaz responsive con Bootstrap
- Validaciones robustas de datos
- Fechas automáticas en préstamos
- Sistema de multas integrado

## 👨‍💻 Desarrollo

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear una rama para tu feature
3. Hacer commit de los cambios
4. Push a la rama
5. Crear un Pull Request

## 📄 Licencia

ISC
