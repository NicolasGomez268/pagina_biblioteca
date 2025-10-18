// Helper de respuesta estandarizada para servicios de caso de uso

export const ok = (mensaje, datos = null) => ({ exito: true, mensaje, datos });
export const fail = (mensaje, codigo = "ERROR", detalles = null) => ({
  exito: false,
  mensaje,
  codigo,
  detalles,
});
