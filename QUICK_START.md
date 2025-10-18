# 🚀 Inicio Rápido - Sistema de Biblioteca Edna

## ⚡ Instalación Express (5 minutos)

### Paso 1: Verificar la instalación

```bash
npm test
```

✅ Si ves "TODOS LOS TESTS PASARON CORRECTAMENTE", ¡estás listo!

### Paso 2: Configurar Supabase

#### 2.1 Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Anota la URL y la Key que te proporciona

#### 2.2 Configurar variables de entorno

1. Abre el archivo `.env` en el editor
2. Reemplaza los valores:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-key-aqui
```

#### 2.3 Crear las tablas

1. Ve al **SQL Editor** en tu proyecto de Supabase
2. Copia todo el contenido de `database/migration.sql`
3. Pégalo en el editor y presiona "Run"
4. ✅ Verás un mensaje de éxito

### Paso 3: Iniciar el servidor

```bash
npm run dev
```

✅ Deberías ver:

```
🚀 Servidor corriendo en http://localhost:3000
📚 Sistema de Biblioteca Edna - Entorno: development
```

### Paso 4: Probar la API

#### Opción A: En el navegador

Abre: [http://localhost:3000](http://localhost:3000)

#### Opción B: Con cURL (PowerShell)

```powershell
# Ver información de la API
curl http://localhost:3000

# Crear un socio
curl -X POST http://localhost:3000/api/socios `
  -H "Content-Type: application/json" `
  -d '{"nombre":"Juan","apellido":"Pérez","dni":"12345678","email":"juan@email.com"}'

# Listar socios
curl http://localhost:3000/api/socios
```

#### Opción C: Con Thunder Client (VS Code)

1. Instala la extensión "Thunder Client"
2. Crea una nueva request
3. Usa los ejemplos de `API_EXAMPLES.md`

---

## 📚 Estructura de Archivos Importantes

```
📁 BibliotecaEdna/
├── 📄 .env                      ← Configurar aquí tus credenciales
├── 📄 README.md                 ← Documentación completa
├── 📄 API_EXAMPLES.md          ← Ejemplos de todos los endpoints
├── 📄 RESUMEN.md               ← Resumen del proyecto
├── 📄 QUICK_START.md           ← Este archivo
│
├── 📁 src/
│   ├── 📁 domain/              ← Clases de negocio
│   ├── 📁 repos/               ← Acceso a base de datos
│   ├── 📁 services/            ← Lógica de negocio
│   ├── 📁 api/                 ← Rutas de la API
│   ├── 📁 config/              ← Configuración
│   └── 📄 index.js             ← Servidor principal
│
└── 📁 database/
    └── 📄 migration.sql        ← Script de base de datos
```

---

## 🎯 Flujo de Trabajo Típico

### 1️⃣ Crear un Socio

```bash
POST /api/socios
{
  "nombre": "María",
  "apellido": "González",
  "dni": "87654321",
  "email": "maria@email.com"
}
```

### 2️⃣ Crear un Libro

```bash
POST /api/libros
{
  "titulo": "El Principito",
  "autor": "Antoine de Saint-Exupéry",
  "isbn": "978-0156012195",
  "cantidad": 2
}
```

### 3️⃣ Crear un Préstamo

```bash
POST /api/prestamos
{
  "socioId": "uuid-del-socio",
  "libroId": "uuid-del-libro",
  "diasPrestamo": 14
}
```

### 4️⃣ Devolver el Libro

```bash
POST /api/prestamos/{id}/devolver
{
  "estadoLibro": "bueno"
}
```

### 5️⃣ Ver Multas (si hay retraso)

```bash
GET /api/multas/socio/{socioId}
```

---

## 🔧 Comandos Útiles

```bash
# Verificar que todo funciona
npm test

# Iniciar servidor en modo desarrollo (con auto-recarga)
npm run dev

# Iniciar servidor en modo producción
npm start

# Ver los logs del servidor
# (aparecen automáticamente en la terminal)
```

---

## 🐛 Solución de Problemas

### Problema: "Cannot find module"

**Solución:**

```bash
npm install
```

### Problema: "SUPABASE_URL is required"

**Solución:**

1. Verifica que el archivo `.env` existe
2. Verifica que las variables están configuradas correctamente
3. Reinicia el servidor

### Problema: Error al conectar con Supabase

**Solución:**

1. Verifica tu conexión a internet
2. Verifica que la URL y Key son correctas
3. Verifica que creaste las tablas con el script `migration.sql`

### Problema: Puerto 3000 en uso

**Solución:**
Cambia el puerto en el archivo `.env`:

```env
PORT=3001
```

---

## 📖 Documentación Adicional

- **Documentación completa:** Ver `README.md`
- **Ejemplos de API:** Ver `API_EXAMPLES.md`
- **Resumen del proyecto:** Ver `RESUMEN.md`
- **Schema de base de datos:** Ver `database/migration.sql`

---

## 🎓 Conceptos Clave

### Arquitectura en Capas

```
API (Routes)
    ↓
Services (Lógica de negocio)
    ↓
Repositories (Acceso a datos)
    ↓
Supabase/PostgreSQL
```

### Flujo de una Petición

```
1. Cliente hace request → /api/socios
2. Route recibe request → sociosRoutes.js
3. Service valida y procesa → SocioService.js
4. Repository accede a BD → SocioRepository.js
5. Supabase ejecuta query → PostgreSQL
6. Response vuelve al cliente ← JSON
```

---

## ✅ Checklist de Configuración

- [ ] Dependencias instaladas (`npm install`)
- [ ] Tests pasando (`npm test`)
- [ ] Cuenta de Supabase creada
- [ ] Proyecto de Supabase creado
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Migraciones ejecutadas (`migration.sql`)
- [ ] Servidor iniciado (`npm run dev`)
- [ ] API funcionando (prueba con cURL o navegador)

---

## 🎉 ¡Listo para Usar!

Una vez completados estos pasos, tu Sistema de Biblioteca estará completamente funcional y listo para agregar funcionalidades adicionales.

### Próximas Funcionalidades Sugeridas:

- Sistema de reservas
- Notificaciones por email
- Panel de administración web
- Reportes y estadísticas
- Sistema de multas automático programado

---

## 💡 Recursos Adicionales

- [Documentación de Express](https://expressjs.com/)
- [Documentación de Supabase](https://supabase.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**¿Necesitas ayuda?** Revisa los archivos de documentación o busca en los comentarios del código.

¡Feliz desarrollo! 🚀📚
