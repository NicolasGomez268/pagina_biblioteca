export class Prestamo {
  constructor({
    id = null,
    socioId,
    libroId,
    fechaPrestamo = new Date(),
    fechaDevolucionEstimada,
    diasPrestamo = 14,
    estado = "activo", // activo, devuelto, vencido
    observaciones = "",
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.socioId = socioId;
    this.libroId = libroId;
    this.fechaPrestamo = fechaPrestamo;
    this.fechaDevolucionEstimada =
      fechaDevolucionEstimada || this.calcularFechaDevolucion(diasPrestamo);
    this.diasPrestamo = diasPrestamo;
    this.estado = estado;
    this.observaciones = observaciones;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  calcularFechaDevolucion(dias) {
    const fecha = new Date(this.fechaPrestamo);
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  estaVencido() {
    return (
      new Date() > new Date(this.fechaDevolucionEstimada) &&
      this.estado === "activo"
    );
  }

  diasDeRetraso() {
    if (!this.estaVencido()) return 0;
    const hoy = new Date();
    const fechaDevolucion = new Date(this.fechaDevolucionEstimada);
    const diferencia = hoy - fechaDevolucion;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  }

  marcarComoDevuelto() {
    this.estado = "devuelto";
    this.updatedAt = new Date();
  }

  marcarComoVencido() {
    this.estado = "vencido";
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      socioId: this.socioId,
      libroId: this.libroId,
      fechaPrestamo: this.fechaPrestamo,
      fechaDevolucionEstimada: this.fechaDevolucionEstimada,
      diasPrestamo: this.diasPrestamo,
      estado: this.estado,
      observaciones: this.observaciones,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
