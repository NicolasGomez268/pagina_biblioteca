# Cliente React para Biblioteca

Este cliente es una SPA simple creada con Vite + React 18 que consume la API del backend (la API debe estar corriendo en http://localhost:3000).

Comandos:

- Instalar dependencias:

```
cd client
npm install
```

- Ejecutar en desarrollo (con proxy a /api):

```
npm run dev
```

- Construir para producción:

```
npm run build
```

Notas:
- El proxy está configurado en `vite.config.js` para redirigir `/api` a `http://localhost:3000` en desarrollo.
- Las rutas principales: `/socios`, `/libros`, `/prestamos`, `/multas`.
