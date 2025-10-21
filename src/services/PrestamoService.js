import { Devolucion } from "../domain/Devolucion.js";
import { Multa } from "../domain/Multa.js";
import { Prestamo } from "../domain/Prestamo.js";
import { DevolucionRepository } from "../repos/DevolucionRepository.js";
import { MultaRepository } from "../repos/MultaRepository.js";
import { PrestamoRepository } from "../repos/PrestamoRepository.js";
import { LibroService } from "./LibroService.js";
import { SocioService } from "./SocioService.js";

export class PrestamoService {
  constructor() {
    this.prestamoRepo = new PrestamoRepository();
    this.devolucionRepo = new DevolucionRepository();
    this.multaRepo = new MultaRepository();
    this.libroService = new LibroService();
    this.socioService = new SocioService();
  }

  async crearPrestamo(datosPrestamo) {
    // Verificar que el socio existe y está activo
    const socio = await this.socioService.obtenerSocio(datosPrestamo.socioId);
    if (!socio.estaActivo()) {
      throw new Error("El socio no está activo y no puede solicitar préstamos");
    }

    // Verificar que el libro existe y está disponible
    const libro = await this.libroService.obtenerLibro(datosPrestamo.libroId);
    if (!libro.estaDisponible()) {
      throw new Error("El libro no está disponible para préstamo");
    }

    // Crear el préstamo
    const nuevoPrestamo = new Prestamo(datosPrestamo);
    const prestamoCreado = await this.prestamoRepo.crear(nuevoPrestamo);

    // Actualizar disponibilidad del libro
    await this.libroService.actualizarDisponibilidad(
      libro.id,
      libro.cantidadDisponible - 1
    );

    return prestamoCreado;
  }

  async obtenerPrestamo(id) {
    const prestamo = await this.prestamoRepo.obtenerPorId(id);
    if (!prestamo) {
      throw new Error("Préstamo no encontrado");
    }
    return prestamo;
  }

  async listarPrestamos(filtros = {}) {
    return await this.prestamoRepo.obtenerTodos(filtros);
  }

  async listarPrestamosPorSocio(socioId, filtros = {}) {
    return await this.prestamoRepo.obtenerPorSocio(socioId, filtros);
  }

  async listarPrestamosVencidos() {
    return await this.prestamoRepo.obtenerTodos({ vencidos: true });
  }

  async registrarDevolucion(prestamoId, datosDevolucion) {
    const prestamo = await this.obtenerPrestamo(prestamoId);

    if (prestamo.estado === "devuelto") {
      throw new Error("Este préstamo ya fue devuelto");
    }

    // Crear la devolución
    const devolucion = new Devolucion({
      ...datosDevolucion,
      prestamoId: prestamoId,
      socioId: prestamo.socioId,
      libroId: prestamo.libroId,
    });

    const devolucionCreada = await this.devolucionRepo.crear(devolucion);

    // Actualizar el estado del préstamo
    await this.prestamoRepo.actualizar(prestamoId, { estado: "devuelto" });

    // Actualizar disponibilidad del libro
    const libro = await this.libroService.obtenerLibro(prestamo.libroId);
    await this.libroService.actualizarDisponibilidad(
      libro.id,
      libro.cantidadDisponible + 1
    );

    // Verificar si hay retraso y generar multa
    if (prestamo.estaVencido()) {
      const diasRetraso = prestamo.diasDeRetraso();
      const montoMulta = Multa.calcularMultaPorRetraso(diasRetraso);

      const multa = new Multa({
        socioId: prestamo.socioId,
        prestamoId: prestamoId,
        devolucionId: devolucionCreada.id,
        tipo: "retraso",
        monto: montoMulta,
        descripcion: `Multa por retraso de ${diasRetraso} días`,
      });

      const multaCreada = await this.multaRepo.crear(multa);

      // Actualizar la devolución con la multa generada
      await this.devolucionRepo.actualizar(devolucionCreada.id, {
        multaGenerada: true,
        multaId: multaCreada.id,
      });

      return { devolucion: devolucionCreada, multa: multaCreada };
    }

    return { devolucion: devolucionCreada, multa: null };
  }

  async renovarPrestamo(prestamoId, diasExtension = 7) {
    const prestamo = await this.obtenerPrestamo(prestamoId);

    if (prestamo.estado !== "activo") {
      throw new Error("Solo se pueden renovar préstamos activos");
    }

    const nuevaFechaDevolucion = new Date(prestamo.fechaDevolucionEstimada);
    nuevaFechaDevolucion.setDate(
      nuevaFechaDevolucion.getDate() + diasExtension
    );

    return await this.prestamoRepo.actualizar(prestamoId, {
      fechaDevolucionEstimada: nuevaFechaDevolucion,
      diasPrestamo: prestamo.diasPrestamo + diasExtension,
    });
  }

  async verificarVencimientos() {
    const prestamosActivos = await this.prestamoRepo.obtenerTodos({
      estado: "activo",
    });
    const prestamosVencidos = prestamosActivos.filter((p) => p.estaVencido());

    for (const prestamo of prestamosVencidos) {
      await this.prestamoRepo.actualizar(prestamo.id, { estado: "vencido" });
    }

    return prestamosVencidos;
  }
}
