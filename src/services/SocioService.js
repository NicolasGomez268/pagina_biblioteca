import { Socio } from "../domain/Socio.js";
import { SocioRepository } from "../repos/SocioRepository.js";

export class SocioService {
  constructor() {
    this.socioRepo = new SocioRepository();
  }

  async crearSocio(datosSocio) {
    // Validar que no exista un socio con el mismo DNI
    const socioExistente = await this.socioRepo.obtenerPorDni(datosSocio.dni);
    if (socioExistente) {
      throw new Error("Ya existe un socio con ese DNI");
    }

    const nuevoSocio = new Socio(datosSocio);
    return await this.socioRepo.crear(nuevoSocio);
  }

  async obtenerSocio(id) {
    const socio = await this.socioRepo.obtenerPorId(id);
    if (!socio) {
      throw new Error("Socio no encontrado");
    }
    return socio;
  }

  async listarSocios(filtros = {}) {
    return await this.socioRepo.obtenerTodos(filtros);
  }

  async actualizarSocio(id, datosActualizados) {
    const socio = await this.obtenerSocio(id);

    // Si se actualiza el DNI, validar que no exista otro socio con ese DNI
    if (datosActualizados.dni && datosActualizados.dni !== socio.dni) {
      const socioConDni = await this.socioRepo.obtenerPorDni(
        datosActualizados.dni
      );
      if (socioConDni) {
        throw new Error("Ya existe otro socio con ese DNI");
      }
    }

    return await this.socioRepo.actualizar(id, datosActualizados);
  }

  async suspenderSocio(id) {
    return await this.socioRepo.actualizar(id, { estado: "suspendido" });
  }

  async activarSocio(id) {
    return await this.socioRepo.actualizar(id, { estado: "activo" });
  }

  async eliminarSocio(id) {
    return await this.socioRepo.eliminar(id);
  }

  async buscarSocios(termino) {
    return await this.socioRepo.obtenerTodos({ busqueda: termino });
  }
}
