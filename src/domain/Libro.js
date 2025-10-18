export class Libro {
  constructor({
    id = null,
    titulo,
    autor,
    isbn,
    editorial,
    anioPublicacion,
    categoria,
    cantidad = 1,
    cantidadDisponible = 1,
    ubicacion = "",
    estado = "disponible", // disponible, prestado, en_reparacion, perdido
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
    this.editorial = editorial;
    this.anioPublicacion = anioPublicacion;
    this.categoria = categoria;
    this.cantidad = cantidad;
    this.cantidadDisponible = cantidadDisponible;
    this.ubicacion = ubicacion;
    this.estado = estado;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  estaDisponible() {
    return this.cantidadDisponible > 0 && this.estado === "disponible";
  }

  prestar() {
    if (this.cantidadDisponible > 0) {
      this.cantidadDisponible--;
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }

  devolver() {
    if (this.cantidadDisponible < this.cantidad) {
      this.cantidadDisponible++;
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }

  obtenerInfoCompleta() {
    return `${this.titulo} - ${this.autor} (${this.anioPublicacion})`;
  }

  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      autor: this.autor,
      isbn: this.isbn,
      editorial: this.editorial,
      anioPublicacion: this.anioPublicacion,
      categoria: this.categoria,
      cantidad: this.cantidad,
      cantidadDisponible: this.cantidadDisponible,
      ubicacion: this.ubicacion,
      estado: this.estado,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
