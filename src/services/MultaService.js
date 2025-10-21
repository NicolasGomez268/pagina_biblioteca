import { MultaRepository } from "../repos/MultaRepository.js";
import { SocioService } from "./SocioService.js";

export class MultaService {
  constructor() {
    this.multaRepo = new MultaRepository();
    this.socioService = new SocioService();
  }

  async obtenerMulta(id) {
    const multa = await this.multaRepo.obtenerPorId(id);
    if (!multa) {
      throw new Error("Multa no encontrada");
    }
    return multa;
  }

  async listarMultas(filtros = {}) {
    return await this.multaRepo.obtenerTodos(filtros);
  }

  async listarMultasPorSocio(socioId, filtros = {}) {
    return await this.multaRepo.obtenerPorSocio(socioId, filtros);
  }

  async listarMultasPendientes() {
    return await this.multaRepo.obtenerTodos({ estado: "pendiente" });
  }

  async listarMultasVencidas() {
    return await this.multaRepo.obtenerTodos({ vencidas: true });
  }

  async registrarPago(multaId) {
    const multa = await this.obtenerMulta(multaId);

    if (multa.estado !== "pendiente") {
      throw new Error("Solo se pueden pagar multas pendientes");
    }

    return await this.multaRepo.actualizar(multaId, {
      estado: "pagada",
      fechaPago: new Date(),
    });
  }

  async cancelarMulta(multaId, motivo) {
    const multa = await this.obtenerMulta(multaId);

    if (multa.estado === "pagada") {
      throw new Error("No se puede cancelar una multa ya pagada");
    }

    return await this.multaRepo.actualizar(multaId, {
      estado: "cancelada",
      observaciones: motivo,
    });
  }

  async obtenerTotalPendientePorSocio(socioId) {
    return await this.multaRepo.obtenerTotalPendientePorSocio(socioId);
  }

  async verificarVencimientos() {
    const multasPendientes = await this.multaRepo.obtenerTodos({
      estado: "pendiente",
    });
    const multasVencidas = multasPendientes.filter((m) => m.estaVencida());

    // Aquí se podría implementar lógica adicional como:
    // - Enviar notificaciones
    // - Suspender socios con multas vencidas
    // - etc.

    return multasVencidas;
  }
}
