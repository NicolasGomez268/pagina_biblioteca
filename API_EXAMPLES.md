# Ejemplos de uso de la API

Este archivo contiene ejemplos de cómo usar los endpoints de la API del Sistema de Biblioteca.

## 🔧 Configuración Inicial

1. Asegúrate de tener el servidor corriendo:

```bash
npm run dev
```

2. La API estará disponible en: `http://localhost:3000`

---

## 👥 Socios

### Crear un nuevo socio

```bash
POST http://localhost:3000/api/socios
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "dni": "12345678",
  "email": "juan.perez@email.com",
  "telefono": "1234567890",
  "direccion": "Calle Falsa 123"
}
```

### Listar todos los socios

```bash
GET http://localhost:3000/api/socios
```

### Buscar socios

```bash
GET http://localhost:3000/api/socios?busqueda=juan
```

### Filtrar socios por estado

```bash
GET http://localhost:3000/api/socios?estado=activo
```

### Obtener un socio específico

```bash
GET http://localhost:3000/api/socios/{id}
```

### Actualizar un socio

```bash
PUT http://localhost:3000/api/socios/{id}
Content-Type: application/json

{
  "telefono": "0987654321",
  "email": "nuevo.email@example.com"
}
```

### Suspender un socio

```bash
PATCH http://localhost:3000/api/socios/{id}/suspender
```

### Activar un socio

```bash
PATCH http://localhost:3000/api/socios/{id}/activar
```

---

## 📚 Libros

### Crear un nuevo libro

```bash
POST http://localhost:3000/api/libros
Content-Type: application/json

{
  "titulo": "Cien años de soledad",
  "autor": "Gabriel García Márquez",
  "isbn": "978-0307474728",
  "editorial": "Sudamericana",
  "anioPublicacion": 1967,
  "categoria": "Novela",
  "cantidad": 3,
  "cantidadDisponible": 3,
  "ubicacion": "Estante A-12"
}
```

### Listar todos los libros

```bash
GET http://localhost:3000/api/libros
```

### Listar libros disponibles

```bash
GET http://localhost:3000/api/libros/disponibles
```

### Buscar libros

```bash
GET http://localhost:3000/api/libros?busqueda=garcia marquez
```

### Filtrar por categoría

```bash
GET http://localhost:3000/api/libros?categoria=Novela
```

### Verificar disponibilidad de un libro

```bash
GET http://localhost:3000/api/libros/{id}/disponibilidad
```

---

## 📖 Préstamos

### Crear un nuevo préstamo

```bash
POST http://localhost:3000/api/prestamos
Content-Type: application/json

{
  "socioId": "uuid-del-socio",
  "libroId": "uuid-del-libro",
  "diasPrestamo": 14,
  "observaciones": "Primera vez que solicita este libro"
}
```

### Listar todos los préstamos

```bash
GET http://localhost:3000/api/prestamos
```

### Listar préstamos activos

```bash
GET http://localhost:3000/api/prestamos?estado=activo
```

### Listar préstamos vencidos

```bash
GET http://localhost:3000/api/prestamos/vencidos
```

### Obtener préstamos de un socio

```bash
GET http://localhost:3000/api/prestamos/socio/{socioId}
```

### Registrar devolución de un libro

```bash
POST http://localhost:3000/api/prestamos/{id}/devolver
Content-Type: application/json

{
  "estadoLibro": "bueno",
  "observaciones": "Devuelto en buen estado"
}
```

### Renovar un préstamo

```bash
PATCH http://localhost:3000/api/prestamos/{id}/renovar
Content-Type: application/json

{
  "diasExtension": 7
}
```

### Verificar vencimientos (tarea manual)

```bash
POST http://localhost:3000/api/prestamos/verificar-vencimientos
```

---

## 💰 Multas

### Listar todas las multas

```bash
GET http://localhost:3000/api/multas
```

### Listar multas pendientes

```bash
GET http://localhost:3000/api/multas/pendientes
```

### Listar multas vencidas

```bash
GET http://localhost:3000/api/multas/vencidas
```

### Obtener multas de un socio

```bash
GET http://localhost:3000/api/multas/socio/{socioId}
```

### Obtener total de multas pendientes de un socio

```bash
GET http://localhost:3000/api/multas/socio/{socioId}/total
```

### Registrar pago de una multa

```bash
PATCH http://localhost:3000/api/multas/{id}/pagar
```

### Cancelar una multa

```bash
PATCH http://localhost:3000/api/multas/{id}/cancelar
Content-Type: application/json

{
  "motivo": "Error en el cálculo de días"
}
```

---

## 🔄 Flujo Completo de Ejemplo

### 1. Crear un socio

```json
POST /api/socios
{
  "nombre": "María",
  "apellido": "González",
  "dni": "87654321",
  "email": "maria.gonzalez@email.com"
}
```

### 2. Crear un libro

```json
POST /api/libros
{
  "titulo": "El principito",
  "autor": "Antoine de Saint-Exupéry",
  "isbn": "978-0156012195",
  "cantidad": 2
}
```

### 3. Crear un préstamo

```json
POST /api/prestamos
{
  "socioId": "uuid-de-maria",
  "libroId": "uuid-del-principito",
  "diasPrestamo": 14
}
```

### 4. Devolver el libro (con retraso)

```json
POST /api/prestamos/{prestamoId}/devolver
{
  "estadoLibro": "bueno"
}
```

_Nota: Si hay retraso, se generará automáticamente una multa_

### 5. Verificar multas del socio

```bash
GET /api/multas/socio/{socioId}
```

### 6. Pagar la multa

```bash
PATCH /api/multas/{multaId}/pagar
```

---

## 📝 Notas

- Reemplaza `{id}`, `{socioId}`, `{libroId}`, etc. con los UUIDs reales
- Los UUIDs se generan automáticamente en Supabase
- Las fechas se manejan automáticamente en el servidor
- Las multas se generan automáticamente al devolver un préstamo con retraso
- El monto de multa por defecto es $50 por día de retraso

## 🧪 Testing con cURL

Ejemplo con cURL para crear un socio:

```bash
curl -X POST http://localhost:3000/api/socios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Pedro","apellido":"Ramírez","dni":"11223344","email":"pedro@email.com"}'
```

## 🔍 Herramientas Recomendadas

- **Postman** - Para testing de API
- **Thunder Client** - Extensión de VS Code
- **curl** - Desde la terminal
- **HTTPie** - Cliente HTTP amigable
