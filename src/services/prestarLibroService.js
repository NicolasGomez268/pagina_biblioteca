import { Prestamo } from "../domain/Prestamo.js";
import { LibroRepository } from "../repos/LibroRepository.js";
import { PrestamoRepository } from "../repos/PrestamoRepository.js";
import { SocioRepository } from "../repos/SocioRepository.js";
import { ErrorDeNegocio, ErrorDeValidacion } from "./errors.js";
import { fail, ok } from "./result.js";

export class PrestarLibroService {
  constructor({ prestamoRepo, libroRepo, socioRepo } = {}) {
    this.prestamoRepo = prestamoRepo || new PrestamoRepository();
    this.libroRepo = libroRepo || new LibroRepository();
    this.socioRepo = socioRepo || new SocioRepository();
  }

  async ejecutar(payload) {
    console.log("[PrestarLibroService] Inicio");
    try {
      const requeridos = ["socioId", "libroId"];
      for (const campo of requeridos) {
        if (!payload?.[campo])
          throw new ErrorDeValidacion(`El campo ${campo} es obligatorio`);
      }

      // Verificar socio
      const socio = await this.socioRepo.obtenerPorId(payload.socioId);
      if (!socio) throw new ErrorDeNegocio("El socio no existe");
      if (!socio.estaActivo())
        throw new ErrorDeNegocio("El socio no está activo");

      // Verificar libro
      const libro = await this.libroRepo.obtenerPorId(payload.libroId);
      if (!libro) throw new ErrorDeNegocio("El libro no existe");
      if (!libro.estaDisponible())
        throw new ErrorDeNegocio("El libro no está disponible");

      // Regla MR/MER: un préstamo activo por libro (no permitir duplicar mismo libro activo)
      const prestamosDelLibro = await this.prestamoRepo.obtenerPorLibro(
        libro.id,
        { estado: "activo" }
      );
      if ((prestamosDelLibro?.length || 0) >= libro.cantidad) {
        throw new ErrorDeNegocio(
          "No hay ejemplares disponibles para préstamo",
          { regla: "UN_PRESTAMO_ACTIVO_POR_LIBRO" }
        );
      }

      // Evitar duplicidad del mismo socio en el mismo libro activo
      const prestamosDelSocio = await this.prestamoRepo.obtenerPorSocio(
        socio.id,
        { estado: "activo" }
      );
      const yaTiene = prestamosDelSocio?.some((p) => p.libroId === libro.id);
      if (yaTiene)
        throw new ErrorDeNegocio(
          "El socio ya tiene un préstamo activo de este libro"
        );

      // Crear préstamo
      const diasPrestamo =
        Number(payload.diasPrestamo) ||
        Number(process.env.DIAS_PRESTAMO_DEFAULT) ||
        14;
      const prestamo = new Prestamo({
        socioId: socio.id,
        libroId: libro.id,
        diasPrestamo,
        observaciones: payload.observaciones || "",
      });

      const creado = await this.prestamoRepo.crear(prestamo);
      // Actualizar disponibilidad
      await this.libroRepo.actualizarDisponibilidad(
        libro.id,
        Math.max(0, libro.cantidadDisponible - 1)
      );

      console.log("[PrestarLibroService] Préstamo creado", {
        id: creado.id,
        libroId: libro.id,
        socioId: socio.id,
      });
      return ok("Préstamo registrado con éxito", creado);
    } catch (err) {
      console.error("[PrestarLibroService] Error", err);
      if (err instanceof ErrorDeNegocio || err instanceof ErrorDeValidacion) {
        return fail(err.message, err.codigo, err.reglas || err.detalles);
      }
      return fail("No se pudo registrar el préstamo", "UNEXPECTED_ERROR");
    }
  }
}

export default PrestarLibroService;
