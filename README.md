# Sistema de Biblioteca Edna

Sistema de gestión de biblioteca desarrollado con Node.js, Express y Supabase/PostgreSQL.

## 🚀 Características

- Gestión de socios (altas, bajas, suspensiones)
- Catálogo de libros con búsqueda y filtros
- Sistema de préstamos y devoluciones
- Gestión automática de multas por retraso
- Control de disponibilidad de libros
- API RESTful completa

## 📋 Requisitos

- Node.js (v14 o superior)
- PostgreSQL (mediante Supabase)
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

   - Copiar `.env.example` a `.env`
   - Completar con tus credenciales de Supabase

4. Crear las tablas en Supabase (ver sección Schema de Base de Datos)

## 🏃 Ejecutar el proyecto

Modo desarrollo (con nodemon):

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

## 📚 Estructura del Proyecto

```
src/
├── domain/         # Clases de dominio (entidades)
├── repos/          # Repositorios (acceso a datos)
├── services/       # Lógica de negocio
├── api/            # Rutas y controladores de API
├── config/         # Configuración (Supabase, etc.)
└── index.js        # Punto de entrada de la aplicación
```

## 🗄️ Schema de Base de Datos

Ejecutar estos comandos en el SQL Editor de Supabase:

### Tabla Socios

```sql
CREATE TABLE socios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  dni VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(20),
  direccion TEXT,
  fecha_inscripcion TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla Libros

```sql
CREATE TABLE libros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(255) NOT NULL,
  isbn VARCHAR(50) UNIQUE,
  editorial VARCHAR(100),
  anio_publicacion INTEGER,
  categoria VARCHAR(100),
  cantidad INTEGER DEFAULT 1,
  cantidad_disponible INTEGER DEFAULT 1,
  ubicacion VARCHAR(100),
  estado VARCHAR(20) DEFAULT 'disponible',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla Préstamos

```sql
CREATE TABLE prestamos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id UUID REFERENCES socios(id) ON DELETE CASCADE,
  libro_id UUID REFERENCES libros(id) ON DELETE CASCADE,
  fecha_prestamo TIMESTAMP DEFAULT NOW(),
  fecha_devolucion_estimada TIMESTAMP NOT NULL,
  dias_prestamo INTEGER DEFAULT 14,
  estado VARCHAR(20) DEFAULT 'activo',
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla Devoluciones

```sql
CREATE TABLE devoluciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestamo_id UUID REFERENCES prestamos(id) ON DELETE CASCADE,
  socio_id UUID REFERENCES socios(id),
  libro_id UUID REFERENCES libros(id),
  fecha_devolucion TIMESTAMP DEFAULT NOW(),
  estado_libro VARCHAR(20) DEFAULT 'bueno',
  observaciones TEXT,
  multa_generada BOOLEAN DEFAULT FALSE,
  multa_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla Multas

```sql
CREATE TABLE multas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id UUID REFERENCES socios(id) ON DELETE CASCADE,
  prestamo_id UUID REFERENCES prestamos(id),
  devolucion_id UUID REFERENCES devoluciones(id),
  tipo VARCHAR(20) DEFAULT 'retraso',
  monto DECIMAL(10, 2) NOT NULL,
  descripcion TEXT,
  fecha_emision TIMESTAMP DEFAULT NOW(),
  fecha_vencimiento TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha_pago TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Endpoints

### Socios

- `GET /api/socios` - Listar todos los socios
- `GET /api/socios/:id` - Obtener socio por ID
- `POST /api/socios` - Crear nuevo socio
- `PUT /api/socios/:id` - Actualizar socio
- `PATCH /api/socios/:id/suspender` - Suspender socio
- `PATCH /api/socios/:id/activar` - Activar socio
- `DELETE /api/socios/:id` - Eliminar socio

### Libros

- `GET /api/libros` - Listar todos los libros
- `GET /api/libros/disponibles` - Listar libros disponibles
- `GET /api/libros/:id` - Obtener libro por ID
- `GET /api/libros/:id/disponibilidad` - Verificar disponibilidad
- `POST /api/libros` - Crear nuevo libro
- `PUT /api/libros/:id` - Actualizar libro
- `DELETE /api/libros/:id` - Eliminar libro

### Préstamos

- `GET /api/prestamos` - Listar todos los préstamos
- `GET /api/prestamos/vencidos` - Listar préstamos vencidos
- `GET /api/prestamos/:id` - Obtener préstamo por ID
- `GET /api/prestamos/socio/:socioId` - Préstamos de un socio
- `POST /api/prestamos` - Crear nuevo préstamo
- `POST /api/prestamos/:id/devolver` - Registrar devolución
- `PATCH /api/prestamos/:id/renovar` - Renovar préstamo

### Multas

- `GET /api/multas` - Listar todas las multas
- `GET /api/multas/pendientes` - Listar multas pendientes
- `GET /api/multas/vencidas` - Listar multas vencidas
- `GET /api/multas/:id` - Obtener multa por ID
- `GET /api/multas/socio/:socioId` - Multas de un socio
- `GET /api/multas/socio/:socioId/total` - Total pendiente de un socio
- `PATCH /api/multas/:id/pagar` - Registrar pago
- `PATCH /api/multas/:id/cancelar` - Cancelar multa

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **Supabase** - Backend como servicio (PostgreSQL)
- **dotenv** - Gestión de variables de entorno
- **ES Modules** - Sistema de módulos moderno

## 📝 Notas

- El código utiliza nomenclatura en español según requerimiento
- Preparado para expansión con funcionalidades adicionales
- Arquitectura limpia con separación de responsabilidades
- Utiliza ES Modules (import/export)

## 👨‍💻 Desarrollo

Para ejecutar en modo desarrollo con recarga automática:

```bash
npm run dev
```

## 📄 Licencia

ISC
