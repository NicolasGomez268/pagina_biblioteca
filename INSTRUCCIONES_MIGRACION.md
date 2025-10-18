# 🗄️ Instrucciones para Ejecutar la Migración en Supabase

## ✅ Credenciales Configuradas

Tu archivo `.env` ya está configurado con:

- **URL de Supabase:** `https://wkbqxerkxjwofqntkurt.supabase.co`
- **API Key (anon):** Configurada ✓

---

## 📝 Pasos para Ejecutar la Migración

### Paso 1: Acceder a Supabase

1. Abre tu navegador
2. Ve a: [https://supabase.com/dashboard](https://supabase.com/dashboard)
3. Inicia sesión con tu cuenta

### Paso 2: Seleccionar tu Proyecto

1. En el dashboard, selecciona tu proyecto: **wkbqxerkxjwofqntkurt**
2. Deberías ver el panel de control de tu proyecto

### Paso 3: Abrir el SQL Editor

1. En el menú lateral izquierdo, busca el icono 🔧 **"SQL Editor"**
2. Haz clic en **"SQL Editor"**
3. Se abrirá el editor de SQL

### Paso 4: Crear Nueva Query

1. Haz clic en el botón **"+ New query"** (arriba a la derecha)
2. Se abrirá un editor de SQL vacío

### Paso 5: Copiar el Script de Migración

1. **Opción A - Desde VS Code:**

   - Abre el archivo: `database/migration.sql`
   - Presiona `Ctrl+A` para seleccionar todo
   - Presiona `Ctrl+C` para copiar

2. **Opción B - Desde PowerShell:**
   ```powershell
   Get-Content database\migration.sql | Set-Clipboard
   ```

### Paso 6: Pegar y Ejecutar

1. En el SQL Editor de Supabase, presiona `Ctrl+V` para pegar todo el script
2. Revisa que el script se haya pegado correctamente
3. Haz clic en el botón **"Run"** (o presiona `Ctrl+Enter`)
4. **¡Espera!** La ejecución puede tardar unos segundos

### Paso 7: Verificar Resultados

Deberías ver en la parte inferior:

- ✅ **"Success. No rows returned"** - ¡Esto es correcto!
- O un mensaje indicando que las tablas fueron creadas

---

## 🔍 Verificar que las Tablas se Crearon

### Opción 1: Desde el Table Editor

1. En el menú lateral, haz clic en **"Table Editor"**
2. Deberías ver las siguientes tablas:
   - ✅ socios
   - ✅ libros
   - ✅ prestamos
   - ✅ devoluciones
   - ✅ multas

### Opción 2: Desde SQL Editor

Ejecuta este query:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Deberías ver las 5 tablas listadas.

---

## 📊 Datos de Prueba (Opcional)

El script de migración incluye datos de prueba:

- 3 socios de ejemplo
- 5 libros de ejemplo

Para verificar que se insertaron correctamente:

```sql
-- Ver socios
SELECT * FROM socios;

-- Ver libros
SELECT * FROM libros;
```

---

## 🚀 Siguiente Paso: Iniciar el Servidor

Una vez que las tablas estén creadas, ejecuta:

```powershell
npm run dev
```

Deberías ver:

```
🚀 Servidor corriendo en http://localhost:3000
📚 Sistema de Biblioteca Edna - Entorno: development
```

---

## 🧪 Probar la API

### Prueba 1: Ver información de la API

Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

### Prueba 2: Listar los socios de prueba

```powershell
curl http://localhost:3000/api/socios
```

### Prueba 3: Listar los libros de prueba

```powershell
curl http://localhost:3000/api/libros
```

---

## ❌ Solución de Problemas

### Error: "relation 'socios' already exists"

**Causa:** Las tablas ya fueron creadas anteriormente.

**Solución:**

- Si quieres empezar de cero, ejecuta primero:

```sql
DROP TABLE IF EXISTS multas CASCADE;
DROP TABLE IF EXISTS devoluciones CASCADE;
DROP TABLE IF EXISTS prestamos CASCADE;
DROP TABLE IF EXISTS libros CASCADE;
DROP TABLE IF EXISTS socios CASCADE;
```

- Luego ejecuta el script completo de nuevo.

### Error: "permission denied"

**Causa:** Problemas con los permisos de RLS (Row Level Security).

**Solución:**
El script ya incluye la configuración correcta. Si tienes problemas, asegúrate de que RLS esté deshabilitado para desarrollo:

```sql
ALTER TABLE socios DISABLE ROW LEVEL SECURITY;
ALTER TABLE libros DISABLE ROW LEVEL SECURITY;
ALTER TABLE prestamos DISABLE ROW LEVEL SECURITY;
ALTER TABLE devoluciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE multas DISABLE ROW LEVEL SECURITY;
```

### No puedo acceder a Supabase

**Solución:**

- Verifica tu conexión a internet
- Asegúrate de estar logueado en supabase.com
- Verifica que el proyecto existe en tu dashboard

---

## 📞 Ayuda Adicional

Si tienes problemas:

1. Revisa los mensajes de error en el SQL Editor
2. Consulta la documentación de Supabase: [docs.supabase.com](https://docs.supabase.com)
3. Verifica que el archivo `.env` tenga las credenciales correctas

---

## ✅ Checklist Final

- [ ] Accedí al SQL Editor de Supabase
- [ ] Copié el contenido de `database/migration.sql`
- [ ] Pegué el script en el SQL Editor
- [ ] Ejecuté el script con "Run"
- [ ] Verifiqué que las 5 tablas se crearon
- [ ] Vi los datos de prueba insertados
- [ ] Inicié el servidor con `npm run dev`
- [ ] Probé que la API funciona

---

Una vez completado este checklist, ¡tu sistema estará **100% funcional**! 🎉
