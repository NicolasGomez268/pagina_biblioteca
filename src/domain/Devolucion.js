export class Devolucion {
  constructor({
    id = null,
    prestamoId,
    socioId,
    libroId,
    fechaDevolucion = new Date(),
    estadoLibro = "bueno", // bueno, danado, perdido
    observaciones = "",
    multaGenerada = false,
    multaId = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.prestamoId = prestamoId;
    this.socioId = socioId;
    this.libroId = libroId;
    this.fechaDevolucion = fechaDevolucion;
    this.estadoLibro = estadoLibro;
    this.observaciones = observaciones;
    this.multaGenerada = multaGenerada;
    this.multaId = multaId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  tieneMulta() {
    return this.multaGenerada;
  }

  libroEnBuenEstado() {
    return this.estadoLibro === "bueno";
  }

  asociarMulta(multaId) {
    this.multaGenerada = true;
    this.multaId = multaId;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      prestamoId: this.prestamoId,
      socioId: this.socioId,
      libroId: this.libroId,
      fechaDevolucion: this.fechaDevolucion,
      estadoLibro: this.estadoLibro,
      observaciones: this.observaciones,
      multaGenerada: this.multaGenerada,
      multaId: this.multaId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
