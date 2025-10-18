import express from "express";
import { LibroRepository } from "../repos/LibroRepository.js";
import { SocioRepository } from "../repos/SocioRepository.js";
import DevolverLibroService from "../services/devolverLibroService.js";
import { notificarDevolucion } from "../services/emailer.js";
import { PrestamoService } from "../services/PrestamoService.js";
import PrestarLibroService from "../services/prestarLibroService.js";

const router = express.Router();
const prestamoService = new PrestamoService();
const prestarLibroService = new PrestarLibroService();
const devolverLibroService = new DevolverLibroService();
const socioRepo = new SocioRepository();
const libroRepo = new LibroRepository();

// Crear un nuevo préstamo (usando caso de uso)
router.post("/", async (req, res, next) => {
  try {
    const resultado = await prestarLibroService.ejecutar(req.body);

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

    res.status(201).json({
      success: true,
      message: resultado.mensaje,
      data: resultado.datos,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener todos los préstamos
router.get("/", async (req, res, next) => {
  try {
    const { estado, vencidos } = req.query;
    const prestamos = await prestamoService.listarPrestamos({
      estado,
      vencidos: vencidos === "true",
    });
    res.json({
      success: true,
      message: "Préstamos obtenidos con éxito",
      data: prestamos,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener préstamos vencidos
router.get("/vencidos", async (req, res, next) => {
  try {
    const prestamos = await prestamoService.listarPrestamosVencidos();
    res.json({
      success: true,
      message: "Préstamos vencidos obtenidos con éxito",
      data: prestamos,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener un préstamo por ID
router.get("/:id", async (req, res, next) => {
  try {
    const prestamo = await prestamoService.obtenerPrestamo(req.params.id);
    res.json({
      success: true,
      message: "Préstamo obtenido con éxito",
      data: prestamo,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener préstamos de un socio
router.get("/socio/:socioId", async (req, res, next) => {
  try {
    const { estado } = req.query;
    const prestamos = await prestamoService.listarPrestamosPorSocio(
      req.params.socioId,
      { estado }
    );
    res.json({
      success: true,
      message: "Préstamos del socio obtenidos con éxito",
      data: prestamos,
    });
  } catch (error) {
    next(error);
  }
});

// Registrar devolución de un préstamo (usando caso de uso)
router.put("/:id/devolver", async (req, res, next) => {
  try {
    const resultado = await devolverLibroService.ejecutar({
      prestamoId: req.params.id,
      ...req.body,
    });

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

    // Enviar email de notificación (no bloqueante)
    if (resultado.datos.devolucion && resultado.datos.devolucion.socioId) {
      const socio = await socioRepo.obtenerPorId(
        resultado.datos.devolucion.socioId
      );
      const libro = await libroRepo.obtenerPorId(
        resultado.datos.devolucion.libroId
      );

      if (socio && libro) {
        notificarDevolucion({
          socio,
          libro,
          devolucion: resultado.datos.devolucion,
        }).catch((err) => {
          console.error(
            "[PrestamosRoutes] Error al enviar email de devolución:",
            err
          );
        });
      }
    }

    res.json({
      success: true,
      message: resultado.mensaje,
      data: resultado.datos,
    });
  } catch (error) {
    next(error);
  }
});

// Renovar un préstamo
router.patch("/:id/renovar", async (req, res, next) => {
  try {
    const { diasExtension } = req.body;
    const prestamo = await prestamoService.renovarPrestamo(
      req.params.id,
      diasExtension
    );
    res.json({
      success: true,
      message: "Préstamo renovado con éxito",
      data: prestamo,
    });
  } catch (error) {
    next(error);
  }
});

// Verificar vencimientos (tarea programada)
router.post("/verificar-vencimientos", async (req, res, next) => {
  try {
    const prestamosVencidos = await prestamoService.verificarVencimientos();
    res.json({
      success: true,
      message: "Vencimientos verificados",
      data: {
        cantidad: prestamosVencidos.length,
        prestamos: prestamosVencidos,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
