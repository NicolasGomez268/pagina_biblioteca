import dotenv from "dotenv";
import express from "express";
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

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

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
    },
  });
});

// Rutas de la API
app.use("/api/socios", sociosRoutes);
app.use("/api/libros", librosRoutes);
app.use("/api/prestamos", prestamosRoutes);
app.use("/api/multas", multasRoutes);

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
  console.log(`📖 API Docs: http://localhost:${PORT}/\n`);
});

export default app;
