import express from "express";
import { SocioService } from "../services/SocioService.js";
import AltaSocioService from "../services/altaSocioService.js";
import { notificarAltaSocio } from "../services/emailer.js";

const router = express.Router();
const socioService = new SocioService();
const altaSocioService = new AltaSocioService();

// Crear un nuevo socio (usando caso de uso)
router.post("/", async (req, res, next) => {
  try {
    const resultado = await altaSocioService.ejecutar(req.body);

    if (!resultado.exito) {
      return res.status(400).json({
        success: false,
        message: resultado.mensaje,
        error: {
          codigo: resultado.codigo,
          detalles: resultado.detalles,
        },
      });
    }

    // Enviar email de bienvenida (no bloqueante)
    notificarAltaSocio({ socio: resultado.datos }).catch((err) => {
      console.error("[SociosRoutes] Error al enviar email de bienvenida:", err);
    });

    res.status(201).json({
      success: true,
      message: resultado.mensaje,
      data: resultado.datos,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener todos los socios
router.get("/", async (req, res, next) => {
  try {
    const { estado, busqueda } = req.query;
    const socios = await socioService.listarSocios({ estado, busqueda });
    res.json({
      success: true,
      message: "Socios obtenidos con éxito",
      data: socios,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener un socio por ID
router.get("/:id", async (req, res, next) => {
  try {
    const socio = await socioService.obtenerSocio(req.params.id);
    res.json({
      success: true,
      message: "Socio obtenido con éxito",
      data: socio,
    });
  } catch (error) {
    next(error);
  }
});

// Actualizar un socio
router.put("/:id", async (req, res, next) => {
  try {
    const socio = await socioService.actualizarSocio(req.params.id, req.body);
    res.json({
      success: true,
      message: "Socio actualizado con éxito",
      data: socio,
    });
  } catch (error) {
    next(error);
  }
});

// Suspender un socio
router.patch("/:id/suspender", async (req, res, next) => {
  try {
    const socio = await socioService.suspenderSocio(req.params.id);
    res.json({
      success: true,
      message: "Socio suspendido con éxito",
      data: socio,
    });
  } catch (error) {
    next(error);
  }
});

// Activar un socio
router.patch("/:id/activar", async (req, res, next) => {
  try {
    const socio = await socioService.activarSocio(req.params.id);
    res.json({
      success: true,
      message: "Socio activado con éxito",
      data: socio,
    });
  } catch (error) {
    next(error);
  }
});

// Eliminar un socio
router.delete("/:id", async (req, res, next) => {
  try {
    await socioService.eliminarSocio(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
