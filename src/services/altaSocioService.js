import { Socio } from "../domain/Socio.js";
import { SocioRepository } from "../repos/SocioRepository.js";
import { ErrorDeNegocio, ErrorDeValidacion } from "./errors.js";
import { fail, ok } from "./result.js";

export class AltaSocioService {
  constructor({ socioRepo } = {}) {
    this.socioRepo = socioRepo || new SocioRepository();
  }

  async ejecutar(payload) {
    console.log("[AltaSocioService] Iniciando alta de socio");
    try {
      // Validaciones básicas
      const requeridos = ["nombre", "apellido", "dni"];
      for (const campo of requeridos) {
        if (!payload?.[campo])
          throw new ErrorDeValidacion(`El campo ${campo} es obligatorio`);
      }

      // Regla de negocio: DNI único
      const existente = await this.socioRepo.obtenerPorDni(payload.dni);
      if (existente) {
        throw new ErrorDeNegocio("Ya existe un socio con ese DNI", {
          regla: "DNI_UNICO",
        });
      }

      const socio = new Socio({
        nombre: payload.nombre,
        apellido: payload.apellido,
        dni: payload.dni,
        email: payload.email || null,
        telefono: payload.telefono || null,
        direccion: payload.direccion || null,
        estado: "activo",
      });

      const creado = await this.socioRepo.crear(socio);
      console.log("[AltaSocioService] Socio creado", {
        id: creado.id,
        dni: creado.dni,
      });
      return ok("Socio registrado con éxito", creado);
    } catch (err) {
      console.error("[AltaSocioService] Error", err);
      if (err instanceof ErrorDeNegocio || err instanceof ErrorDeValidacion) {
        return fail(err.message, err.codigo, err.reglas || err.detalles);
      }
      return fail("No se pudo registrar el socio", "UNEXPECTED_ERROR");
    }
  }
}

export default AltaSocioService;
