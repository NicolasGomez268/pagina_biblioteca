import {
  ErrorDeInfraestructura,
  ErrorDeNegocio,
  ErrorDeValidacion,
} from "../../services/errors.js";

/**
 * Middleware global para manejo de errores
 * Captura todas las excepciones y las transforma en respuestas JSON estandarizadas
 */
export const errorHandler = (err, req, res, next) => {
  console.error("[ErrorHandler] Error capturado:", {
    nombre: err.name,
    mensaje: err.message,
    ruta: req.path,
    metodo: req.method,
    timestamp: new Date().toISOString(),
  });

  // Error de validación (400 Bad Request)
  if (err instanceof ErrorDeValidacion) {
    return res.status(400).json({
      success: false,
      message: err.message || "Error de validación",
      error: {
        codigo: err.codigo || "VALIDATION_ERROR",
        detalles: err.detalles || {},
      },
    });
  }

  // Error de negocio (422 Unprocessable Entity)
  if (err instanceof ErrorDeNegocio) {
    return res.status(422).json({
      success: false,
      message: err.message || "Regla de negocio violada",
      error: {
        codigo: err.codigo || "BUSINESS_RULE_VIOLATION",
        reglas: err.reglas || {},
      },
    });
  }

  // Error de infraestructura (503 Service Unavailable)
  if (err instanceof ErrorDeInfraestructura) {
    return res.status(503).json({
      success: false,
      message: err.message || "Error de infraestructura",
      error: {
        codigo: err.codigo || "INFRASTRUCTURE_ERROR",
        detalles: process.env.NODE_ENV === "development" ? err.detalles : {},
      },
    });
  }

  // Error de Express (si tiene status code)
  if (err.status || err.statusCode) {
    return res.status(err.status || err.statusCode).json({
      success: false,
      message: err.message || "Error en la petición",
      error: {
        codigo: "HTTP_ERROR",
      },
    });
  }

  // Error desconocido (500 Internal Server Error)
  console.error("[ErrorHandler] Error no controlado:", err);
  return res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: {
      codigo: "INTERNAL_SERVER_ERROR",
      detalles: process.env.NODE_ENV === "development" ? err.message : {},
    },
  });
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFoundHandler = (req, res) => {
  console.warn("[NotFoundHandler] Ruta no encontrada:", {
    ruta: req.path,
    metodo: req.method,
    timestamp: new Date().toISOString(),
  });

  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
    error: {
      codigo: "NOT_FOUND",
    },
  });
};
