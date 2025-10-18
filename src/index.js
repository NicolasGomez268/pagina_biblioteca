import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import librosRoutes from "./api/librosRoutes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./api/middlewares/errorHandler.js";
import { requestLogger } from "./api/middlewares/logger.js";
import multasRoutes from "./api/multasRoutes.js";
import prestamosRoutes from "./api/prestamosRoutes.js";
import sociosRoutes from "./api/sociosRoutes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Archivos estáticos del frontend
app.use(express.static(PUBLIC_DIR));

// Endpoint de health check
app.get("/ping", (req, res) => {
  res.json({
    success: true,
    message: "API Biblioteca funcionando",
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    },
  });
});

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API del Sistema de Biblioteca Edna",
    data: {
      version: "1.0.0",
      endpoints: {
        ping: "/ping",
        socios: "/api/socios",
        libros: "/api/libros",
        prestamos: "/api/prestamos",
        multas: "/api/multas",
      },
      ui: "/app",
    },
  });
});

// Rutas de la API
app.use("/api/socios", sociosRoutes);
app.use("/api/libros", librosRoutes);
app.use("/api/prestamos", prestamosRoutes);
app.use("/api/multas", multasRoutes);

// UI del front (cualquier ruta que empiece con /app sirve el index.html de React)
app.use("/app", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// Middleware para rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware global de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(
    `📚 Sistema de Biblioteca Edna - Entorno: ${
      process.env.NODE_ENV || "development"
    }`
  );
  console.log(`🔗 Health check: http://localhost:${PORT}/ping`);
  console.log(`�️  UI: http://localhost:${PORT}/app`);
  console.log(`�📖 API Info: http://localhost:${PORT}/\n`);
});

export default app;
