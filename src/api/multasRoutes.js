import express from "express";
import { Multa } from "../domain/Multa.js";
import { LibroRepository } from "../repos/LibroRepository.js";
import { MultaRepository } from "../repos/MultaRepository.js";
import { SocioRepository } from "../repos/SocioRepository.js";
import { notificarMulta } from "../services/emailer.js";
import { MultaService } from "../services/MultaService.js";

const router = express.Router();
const multaService = new MultaService();
const multaRepo = new MultaRepository();
const socioRepo = new SocioRepository();
const libroRepo = new LibroRepository();

// Crear/registrar una multa manual
router.post("/", async (req, res, next) => {
  try {
    const { socioId, tipo, monto, descripcion, libroId, prestamoId } = req.body;

    // Validar campos obligatorios
    // Nota: por esquema actual, prestamoId es obligatorio (prestamo_id NOT NULL)
    if (!socioId || !tipo || !monto || !prestamoId) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan campos obligatorios (socioId, tipo, monto, prestamoId)",
        error: { codigo: "VALIDATION_ERROR" },
      });
    }

    // Normalizar y validar tipo de multa
    const normalizarTipo = (t) => {
      const v = String(t || "").toLowerCase();
      if (v === "dañado" || v === "daniado" || v === "danado") return "dano";
      if (v === "perdido") return "perdida";
      if (v === "mora" || v === "retraso") return "retraso";
      return v;
    };

    const tipoNormalizado = normalizarTipo(tipo);
    const TIPOS_PERMITIDOS = ["retraso", "dano", "perdida"];
    if (!TIPOS_PERMITIDOS.includes(tipoNormalizado)) {
      return res.status(400).json({
        success: false,
        message: `Tipo de multa inválido. Permitidos: ${TIPOS_PERMITIDOS.join(
          ", "
        )}`,
        error: { codigo: "VALIDATION_ERROR" },
      });
    }

    // Crear multa
    const multa = new Multa({
      socioId,
      prestamoId,
      tipo: tipoNormalizado,
      monto: parseFloat(monto),
      descripcion: descripcion || `Multa manual (${tipo})`,
      estado: "pendiente",
    });

    const multaCreada = await multaRepo.crear(multa);

    // Enviar email de notificación (no bloqueante)
    const socio = await socioRepo.obtenerPorId(socioId);
    const libro = libroId ? await libroRepo.obtenerPorId(libroId) : null;

    if (socio) {
      notificarMulta({ socio, multa: multaCreada, libro }).catch((err) => {
        console.error("[MultasRoutes] Error al enviar email de multa:", err);
      });
    }

    res.status(201).json({
      success: true,
      message: "Multa registrada con éxito",
      data: multaCreada,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener todas las multas
router.get("/", async (req, res, next) => {
  try {
    const { estado, tipo } = req.query;
    const multas = await multaService.listarMultas({ estado, tipo });
    res.json({
      success: true,
      message: "Multas obtenidas con éxito",
      data: multas,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener multas pendientes
router.get("/pendientes", async (req, res, next) => {
  try {
    const multas = await multaService.listarMultasPendientes();
    res.json({
      success: true,
      message: "Multas pendientes obtenidas con éxito",
      data: multas,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener multas vencidas
router.get("/vencidas", async (req, res, next) => {
  try {
    const multas = await multaService.listarMultasVencidas();
    res.json({
      success: true,
      message: "Multas vencidas obtenidas con éxito",
      data: multas,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener una multa por ID
router.get("/:id", async (req, res, next) => {
  try {
    const multa = await multaService.obtenerMulta(req.params.id);
    res.json({
      success: true,
      message: "Multa obtenida con éxito",
      data: multa,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener multas de un socio
router.get("/socio/:socioId", async (req, res, next) => {
  try {
    const { estado } = req.query;
    const multas = await multaService.listarMultasPorSocio(req.params.socioId, {
      estado,
    });
    res.json({
      success: true,
      message: "Multas del socio obtenidas con éxito",
      data: multas,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener total de multas pendientes de un socio
router.get("/socio/:socioId/total", async (req, res, next) => {
  try {
    const total = await multaService.obtenerTotalPendientePorSocio(
      req.params.socioId
    );
    res.json({
      success: true,
      message: "Total de multas pendientes obtenido",
      data: { total },
    });
  } catch (error) {
    next(error);
  }
});

// Registrar pago de una multa
router.patch("/:id/pagar", async (req, res, next) => {
  try {
    const multa = await multaService.registrarPago(req.params.id);
    res.json({
      success: true,
      message: "Pago registrado con éxito",
      data: multa,
    });
  } catch (error) {
    next(error);
  }
});

// Cancelar una multa
router.patch("/:id/cancelar", async (req, res, next) => {
  try {
    const { motivo } = req.body;
    const multa = await multaService.cancelarMulta(req.params.id, motivo);
    res.json({
      success: true,
      message: "Multa cancelada con éxito",
      data: multa,
    });
  } catch (error) {
    next(error);
  }
});

// Verificar vencimientos (tarea programada)
router.post("/verificar-vencimientos", async (req, res, next) => {
  try {
    const multasVencidas = await multaService.verificarVencimientos();
    res.json({
      success: true,
      message: "Vencimientos verificados",
      data: {
        cantidad: multasVencidas.length,
        multas: multasVencidas,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
