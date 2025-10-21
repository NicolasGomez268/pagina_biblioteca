# 📋 PARTE 2/3 - CASOS DE USO IMPLEMENTADOS

## ✅ IMPLEMENTACIÓN COMPLETADA CON ÉXITO

### 🎯 Casos de Uso Implementados

#### 1️⃣ Alta de Socio (`altaSocioService.js`)

**Funcionalidad:**

- Registra un nuevo socio en el sistema
- Valida campos obligatorios (nombre, apellido, DNI)
- Implementa regla de negocio: **DNI único**
- Retorna objeto Result estandarizado

**Reglas de Negocio:**

- ✅ DNI debe ser único en el sistema
- ✅ Campos obligatorios: nombre, apellido, DNI
- ✅ El socio se crea con estado "activo"

**Ejemplo de Uso:**

```javascript
const altaSocio = new AltaSocioService();
const resultado = await altaSocio.ejecutar({
  nombre: "Juan",
  apellido: "Pérez",
  dni: "12345678",
  email: "juan@mail.com",
});
```

---

#### 2️⃣ Prestar Libro (`prestarLibroService.js`)

**Funcionalidad:**

- Registra un nuevo préstamo
- Verifica que el socio existe y está activo
- Verifica que el libro existe y está disponible
- Actualiza la disponibilidad del libro
- Previene préstamos duplicados

**Reglas de Negocio del MER/MR:**

- ✅ **Un préstamo activo por libro** (según capacidad de ejemplares)
- ✅ El socio debe estar activo
- ✅ El libro debe estar disponible
- ✅ No se puede prestar el mismo libro dos veces al mismo socio
- ✅ Se disminuye la cantidad disponible del libro

**Ejemplo de Uso:**

```javascript
const prestarLibro = new PrestarLibroService();
const resultado = await prestarLibro.ejecutar({
  socioId: "uuid-socio",
  libroId: "uuid-libro",
  diasPrestamo: 14,
});
```

---

#### 3️⃣ Devolver Libro (`devolverLibroService.js`)

**Funcionalidad:**

- Registra la devolución de un préstamo
- Actualiza el estado del préstamo a "devuelto"
- Incrementa la disponibilidad del libro
- **Genera multa automática si el libro está dañado o perdido**
- Normaliza el estado físico del libro

**Reglas de Negocio del MER/MR:**

- ✅ **Una devolución por préstamo** (relación 1:1)
- ✅ **Multa automática por daño** (según MR: devolucion ||--o| multa)
- ✅ Monto de multa por daño: $1000 (configurable en .env)
- ✅ Monto de multa por pérdida: $5000 (configurable en .env)
- ✅ Se actualiza disponibilidad del libro

**Estados Físicos Permitidos:**

- `bueno` - Sin multa
- `dañado` / `danado` - Genera multa de $1000
- `perdido` - Genera multa de $5000

**Ejemplo de Uso:**

```javascript
const devolverLibro = new DevolverLibroService();
const resultado = await devolverLibro.ejecutar({
  prestamoId: "uuid-prestamo",
  estadoLibro: "dañado",
  observaciones: "Cubierta rota",
});
```

---

## 🏗️ ARQUITECTURA IMPLEMENTADA

### Principios SOLID Aplicados

#### ✅ Single Responsibility Principle (SRP)

- Cada servicio tiene **una única responsabilidad**
- `AltaSocioService` - Solo registra socios
- `PrestarLibroService` - Solo gestiona préstamos
- `DevolverLibroService` - Solo gestiona devoluciones

#### ✅ Open/Closed Principle (OCP)

- Servicios abiertos a extensión, cerrados a modificación
- Se pueden extender con nuevas validaciones sin modificar el core

#### ✅ Liskov Substitution Principle (LSP)

- Todas las clases de error heredan de `ErrorDeAplicacion`
- Se pueden sustituir sin romper el código

#### ✅ Interface Segregation Principle (ISP)

- Cada servicio usa solo los repositorios que necesita
- Inyección de dependencias en constructores

#### ✅ Dependency Inversion Principle (DIP)

- Servicios dependen de abstracciones (repos inyectados)
- No de implementaciones concretas

---

## 📦 ESTRUCTURA DE ARCHIVOS

```
src/services/
├── errors.js                    # Clases de error personalizadas
├── result.js                    # Helper para respuestas estandarizadas
├── altaSocioService.js          # Caso de uso 1
├── prestarLibroService.js       # Caso de uso 2
├── devolverLibroService.js      # Caso de uso 3
├── SocioService.js             # Servicio general (existente)
├── LibroService.js             # Servicio general (existente)
├── PrestamoService.js          # Servicio general (existente)
└── MultaService.js             # Servicio general (existente)
```

---

## 🎨 CLASES DE ERROR PERSONALIZADAS

### Jerarquía de Errores

```
ErrorDeAplicacion (base)
├── ErrorDeValidacion       # Datos inválidos
├── ErrorDeNegocio         # Reglas de negocio violadas
└── ErrorDeInfraestructura # Problemas de BD/red
```

### Ejemplos de Uso

```javascript
// Error de validación
throw new ErrorDeValidacion("El campo DNI es obligatorio");

// Error de negocio
throw new ErrorDeNegocio("Ya existe un socio con ese DNI", {
  regla: "DNI_UNICO",
});

// Error de infraestructura
throw new ErrorDeInfraestructura("Error al conectar con la BD", error);
```

---

## 📊 RESULTADO ESTANDARIZADO

### Formato de Respuesta

Todos los servicios retornan un objeto Result:

```javascript
// Éxito
{
  "exito": true,
  "mensaje": "Operación exitosa",
  "datos": { /* objeto con datos */ }
}

// Error
{
  "exito": false,
  "mensaje": "Descripción del error",
  "codigo": "BUSINESS_RULE_VIOLATION",
  "detalles": { /* información adicional */ }
}
```

### Helpers de Result

```javascript
import { ok, fail } from "./result.js";

// Éxito
return ok("Socio registrado con éxito", socio);

// Error
return fail("No se pudo registrar", "ERROR_CODE", detalles);
```

---

## 🧪 PRUEBAS EJECUTADAS

### Test de Casos de Uso (`test-casos-uso.js`)

El script de prueba ejecuta el flujo completo:

1. **Alta de Socio** ✅

   - Crea socio con DNI único
   - Resultado: Socio creado exitosamente

2. **Prestar Libro** ✅

   - Toma primer libro disponible
   - Verifica disponibilidad
   - Registra préstamo
   - Resultado: Préstamo registrado exitosamente

3. **Devolver Libro (con daño)** ✅
   - Registra devolución
   - Estado: "dañado"
   - **Genera multa automática de $1000**
   - Resultado: Devolución y multa registradas

### Comando para Ejecutar

```bash
npm run demo:casos
```

### Resultado Esperado

```
=== Alta Socio ===
{
  "exito": true,
  "mensaje": "Socio registrado con éxito",
  "datos": { /* socio creado */ }
}

=== Prestar Libro ===
{
  "exito": true,
  "mensaje": "Préstamo registrado con éxito",
  "datos": { /* préstamo creado */ }
}

=== Devolver Libro (dañado) ===
{
  "exito": true,
  "mensaje": "Devolución registrada con éxito",
  "datos": {
    "devolucion": { /* devolución */ },
    "multa": { /* multa de $1000 */ }
  }
}
```

---

## 📝 LOGGING IMPLEMENTADO

Cada servicio incluye logs básicos:

```javascript
console.log("[AltaSocioService] Iniciando alta de socio");
console.log("[AltaSocioService] Socio creado", { id, dni });
console.error("[AltaSocioService] Error", error);
```

### Niveles de Log

- `console.log()` - Operaciones exitosas
- `console.error()` - Errores y excepciones

---

## 🔒 VALIDACIONES IMPLEMENTADAS

### Validaciones de Entrada

- ✅ Campos obligatorios
- ✅ Tipos de datos correctos
- ✅ Formato de DNI

### Validaciones de Negocio

- ✅ DNI único (no duplicados)
- ✅ Socio activo para préstamo
- ✅ Libro disponible
- ✅ Un préstamo activo por libro
- ✅ Una devolución por préstamo
- ✅ Generación automática de multas

### Validaciones de Estado

- ✅ Préstamo no devuelto previamente
- ✅ Socio existe en el sistema
- ✅ Libro existe en el sistema

---

## 🎯 REGLAS DEL MER/MR IMPLEMENTADAS

Según `modelo.puml` y `READMEe.md`:

### Relaciones 1:1

- ✅ **prestamo ||--o| devolucion**

  - Un préstamo puede tener una devolución
  - Implementado en `devolverLibroService.js`

- ✅ **devolucion ||--o| multa**
  - Una devolución puede generar una multa
  - Implementado en `devolverLibroService.js`

### Relaciones 1:N

- ✅ **socio ||--o{ prestamo**

  - Un socio puede tener múltiples préstamos
  - Implementado en `prestarLibroService.js`

- ✅ **libro ||--o{ prestamo**
  - Un libro puede tener múltiples préstamos
  - Implementado en `prestarLibroService.js`

### Restricciones

- ✅ **DNI único** en socio
- ✅ **ISBN único** en libro (ya existente)
- ✅ **id_prestamo UNIQUE** en devolucion
- ✅ **id_devolucion UNIQUE** en multa

---

## 🚀 COMANDOS DISPONIBLES

```bash
# Ejecutar test de casos de uso
npm run demo:casos

# Iniciar servidor
npm run dev

# Test general del sistema
npm test

# Verificar conexión con Supabase
node test-api.js
```

---

## 📊 VARIABLES DE ENTORNO

Agregadas en `.env`:

```env
# Configuración de préstamos
DIAS_PRESTAMO_DEFAULT=14

# Configuración de multas
MONTO_MULTA_POR_DIA=50
MONTO_MULTA_DANO=1000
MONTO_MULTA_PERDIDA=5000
```

---

## 🎉 CARACTERÍSTICAS DESTACADAS

### ✨ Inyección de Dependencias

```javascript
constructor({ prestamoRepo, libroRepo, socioRepo } = {}) {
  this.prestamoRepo = prestamoRepo || new PrestamoRepository();
  // ...
}
```

### ✨ Manejo de Errores Robusto

```javascript
try {
  // lógica de negocio
} catch (err) {
  if (err instanceof ErrorDeNegocio) {
    return fail(err.message, err.codigo, err.reglas);
  }
  return fail("Error inesperado", "UNEXPECTED_ERROR");
}
```

### ✨ Respuestas Estandarizadas

```javascript
return ok("Operación exitosa", datos);
return fail("Error", "CODIGO", detalles);
```

### ✨ Validaciones Granulares

```javascript
const requeridos = ["campo1", "campo2"];
for (const campo of requeridos) {
  if (!payload?.[campo]) throw new ErrorDeValidacion(`${campo} es obligatorio`);
}
```

---

## 📖 PRÓXIMOS PASOS (PARTE 3/3)

La siguiente fase incluirá:

- [ ] Integración con las rutas API
- [ ] Tests unitarios completos
- [ ] Tests de integración
- [ ] Documentación Swagger/OpenAPI
- [ ] Frontend básico (opcional)

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] Clases de error personalizadas
- [x] Helper de Result estandarizado
- [x] AltaSocioService implementado
- [x] PrestarLibroService implementado
- [x] DevolverLibroService implementado
- [x] Validaciones de entrada
- [x] Validaciones de negocio
- [x] Reglas del MER/MR aplicadas
- [x] Logging básico
- [x] Inyección de dependencias
- [x] Principios SOLID aplicados
- [x] Test de casos de uso funcionando
- [x] Documentación completa

---

## 🎊 ¡PARTE 2 COMPLETADA CON ÉXITO!

Los tres casos de uso están **100% funcionales** y cumplen con:

✅ Principios SOLID
✅ Validaciones robustas
✅ Manejo de errores personalizado
✅ Respuestas estandarizadas
✅ Reglas de negocio del MER/MR
✅ Logging básico
✅ Código limpio y mantenible
✅ Tests pasando exitosamente

**¡El sistema está listo para la Parte 3!** 🚀📚
