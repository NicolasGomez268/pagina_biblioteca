import { Devolucion } from "../domain/Devolucion.js";
import { Multa } from "../domain/Multa.js";
import { DevolucionRepository } from "../repos/DevolucionRepository.js";
import { LibroRepository } from "../repos/LibroRepository.js";
import { MultaRepository } from "../repos/MultaRepository.js";
import { PrestamoRepository } from "../repos/PrestamoRepository.js";
import { ErrorDeNegocio, ErrorDeValidacion } from "./errors.js";
import { fail, ok } from "./result.js";

const normalizarEstadoFisico = (estado) => {
  if (!estado) return "bueno";
  const e = String(estado).toLowerCase();
  if (e === "dañado" || e === "daniado" || e === "danado") return "danado";
  if (e === "perdido") return "perdido";
  return "bueno";
};

export class DevolverLibroService {
  constructor({ prestamoRepo, devolucionRepo, multaRepo, libroRepo } = {}) {
    this.prestamoRepo = prestamoRepo || new PrestamoRepository();
    this.devolucionRepo = devolucionRepo || new DevolucionRepository();
    this.multaRepo = multaRepo || new MultaRepository();
    this.libroRepo = libroRepo || new LibroRepository();
  }

  async ejecutar(payload) {
    console.log("[DevolverLibroService] Inicio");
    try {
      const requeridos = ["prestamoId"];
      for (const campo of requeridos) {
        if (!payload?.[campo])
          throw new ErrorDeValidacion(`El campo ${campo} es obligatorio`);
      }

      const prestamo = await this.prestamoRepo.obtenerPorId(payload.prestamoId);
      if (!prestamo) throw new ErrorDeNegocio("Préstamo no encontrado");
      if (prestamo.estado === "devuelto")
        throw new ErrorDeNegocio("El préstamo ya fue devuelto");

      // Regla MR: una devolución por préstamo
      const devExistente = await this.devolucionRepo.obtenerPorPrestamo(
        prestamo.id
      );
      if (devExistente)
        throw new ErrorDeNegocio(
          "Este préstamo ya tiene una devolución registrada",
          { regla: "UNA_DEVOLUCION_POR_PRESTAMO" }
        );

      const estadoLibro = normalizarEstadoFisico(
        payload.estadoLibro || payload.estado_fisico
      );

      // Crear devolución
      const devolucion = new Devolucion({
        prestamoId: prestamo.id,
        socioId: prestamo.socioId,
        libroId: prestamo.libroId,
        estadoLibro,
        observaciones: payload.observaciones || "",
      });

      const creada = await this.devolucionRepo.crear(devolucion);

      // Actualizar estado del préstamo y disponibilidad del libro
      await this.prestamoRepo.actualizar(prestamo.id, { estado: "devuelto" });
      const libroActual = await this.libroRepo.obtenerPorId(prestamo.libroId);
      await this.libroRepo.actualizarDisponibilidad(
        libroActual.id,
        Math.min(libroActual.cantidad, libroActual.cantidadDisponible + 1)
      );

      let multaCreada = null;

      // Regla: generar multa si el estado físico es dañado o perdido
      if (estadoLibro === "danado" || estadoLibro === "perdido") {
        const multaDano = Number(process.env.MONTO_MULTA_DANO || 1000);
        const multaPerdida = Number(process.env.MONTO_MULTA_PERDIDA || 5000);
        const monto = estadoLibro === "perdido" ? multaPerdida : multaDano;

        const multa = new Multa({
          socioId: prestamo.socioId,
          prestamoId: prestamo.id,
          devolucionId: creada.id,
          tipo: estadoLibro === "perdido" ? "perdida" : "dano",
          monto,
          descripcion:
            estadoLibro === "perdido"
              ? "Multa por pérdida de libro"
              : "Multa por daño del libro",
        });

        multaCreada = await this.multaRepo.crear(multa);
        await this.devolucionRepo.actualizar(creada.id, {
          multa_generada: true,
          multa_id: multaCreada.id,
        });
      }

      console.log("[DevolverLibroService] Devolución OK", {
        devolucionId: creada.id,
        multaId: multaCreada?.id,
      });
      return ok("Devolución registrada con éxito", {
        devolucion: creada,
        multa: multaCreada,
      });
    } catch (err) {
      console.error("[DevolverLibroService] Error", err);
      if (err instanceof ErrorDeNegocio || err instanceof ErrorDeValidacion) {
        return fail(err.message, err.codigo, err.reglas || err.detalles);
      }
      return fail("No se pudo registrar la devolución", "UNEXPECTED_ERROR");
    }
  }
}

export default DevolverLibroService;
