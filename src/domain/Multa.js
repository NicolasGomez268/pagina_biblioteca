export class Multa {
  constructor({
    id = null,
    socioId,
    prestamoId,
    devolucionId = null,
    tipo = "retraso", // retraso, dano, perdida
    monto,
    descripcion = "",
    fechaEmision = new Date(),
    fechaVencimiento,
    estado = "pendiente", // pendiente, pagada, cancelada
    fechaPago = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.socioId = socioId;
    this.prestamoId = prestamoId;
    this.devolucionId = devolucionId;
    this.tipo = tipo;
    this.monto = monto;
    this.descripcion = descripcion;
    this.fechaEmision = fechaEmision;
    this.fechaVencimiento = fechaVencimiento || this.calcularFechaVencimiento();
    this.estado = estado;
    this.fechaPago = fechaPago;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  calcularFechaVencimiento(diasVencimiento = 30) {
    const fecha = new Date(this.fechaEmision);
    fecha.setDate(fecha.getDate() + diasVencimiento);
    return fecha;
  }

  estaPendiente() {
    return this.estado === "pendiente";
  }

  estaVencida() {
    return (
      this.estado === "pendiente" &&
      new Date() > new Date(this.fechaVencimiento)
    );
  }

  marcarComoPagada() {
    this.estado = "pagada";
    this.fechaPago = new Date();
    this.updatedAt = new Date();
  }

  cancelar() {
    this.estado = "cancelada";
    this.updatedAt = new Date();
  }

  static calcularMultaPorRetraso(diasRetraso, montoPorDia = 50) {
    return diasRetraso * montoPorDia;
  }

  toJSON() {
    return {
      id: this.id,
      socioId: this.socioId,
      prestamoId: this.prestamoId,
      devolucionId: this.devolucionId,
      tipo: this.tipo,
      monto: this.monto,
      descripcion: this.descripcion,
      fechaEmision: this.fechaEmision,
      fechaVencimiento: this.fechaVencimiento,
      estado: this.estado,
      fechaPago: this.fechaPago,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
