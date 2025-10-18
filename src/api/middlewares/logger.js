/**
 * Middleware de logging para todas las peticiones HTTP
 * Registra método, ruta, IP, duración y código de estado
 */
export const requestLogger = (req, res, next) => {
  const inicioTiempo = Date.now();
  const timestamp = new Date().toISOString();

  // Log inicial de la petición
  console.log("[RequestLogger] Petición entrante:", {
    metodo: req.method,
    ruta: req.path,
    ip: req.ip || req.connection.remoteAddress,
    timestamp,
    body: req.method !== "GET" ? req.body : undefined,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
  });

  // Capturar el código de estado de la respuesta
  const originalSend = res.send;
  res.send = function (data) {
    const duracion = Date.now() - inicioTiempo;

    console.log("[RequestLogger] Respuesta enviada:", {
      metodo: req.method,
      ruta: req.path,
      statusCode: res.statusCode,
      duracion: `${duracion}ms`,
      timestamp: new Date().toISOString(),
    });

    originalSend.call(this, data);
  };

  next();
};

/**
 * Middleware simplificado de logging (solo para desarrollo)
 */
export const simpleLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};
