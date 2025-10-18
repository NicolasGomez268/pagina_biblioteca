export class Socio {
  constructor({
    id = null,
    nombre,
    apellido,
    dni,
    email,
    telefono,
    direccion,
    fechaInscripcion = new Date(),
    estado = "activo", // activo, suspendido, inactivo
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.email = email;
    this.telefono = telefono;
    this.direccion = direccion;
    this.fechaInscripcion = fechaInscripcion;
    this.estado = estado;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getNombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  estaActivo() {
    return this.estado === "activo";
  }

  suspender() {
    this.estado = "suspendido";
    this.updatedAt = new Date();
  }

  activar() {
    this.estado = "activo";
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      dni: this.dni,
      email: this.email,
      telefono: this.telefono,
      direccion: this.direccion,
      fechaInscripcion: this.fechaInscripcion,
      estado: this.estado,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
