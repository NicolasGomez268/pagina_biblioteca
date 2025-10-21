import { Libro } from "../domain/Libro.js";
import { LibroRepository } from "../repos/LibroRepository.js";

export class LibroService {
  constructor() {
    this.libroRepo = new LibroRepository();
  }

  async crearLibro(datosLibro) {
    // Validar que no exista un libro con el mismo ISBN
    if (datosLibro.isbn) {
      const libroExistente = await this.libroRepo.obtenerPorIsbn(
        datosLibro.isbn
      );
      if (libroExistente) {
        throw new Error("Ya existe un libro con ese ISBN");
      }
    }

    const nuevoLibro = new Libro(datosLibro);
    return await this.libroRepo.crear(nuevoLibro);
  }

  async obtenerLibro(id) {
    const libro = await this.libroRepo.obtenerPorId(id);
    if (!libro) {
      throw new Error("Libro no encontrado");
    }
    return libro;
  }

  async listarLibros(filtros = {}) {
    return await this.libroRepo.obtenerTodos(filtros);
  }

  async listarLibrosDisponibles() {
    return await this.libroRepo.obtenerTodos({ disponible: true });
  }

  async actualizarLibro(id, datosActualizados) {
    const libro = await this.obtenerLibro(id);

    // Si se actualiza el ISBN, validar que no exista otro libro con ese ISBN
    if (datosActualizados.isbn && datosActualizados.isbn !== libro.isbn) {
      const libroConIsbn = await this.libroRepo.obtenerPorIsbn(
        datosActualizados.isbn
      );
      if (libroConIsbn) {
        throw new Error("Ya existe otro libro con ese ISBN");
      }
    }

    return await this.libroRepo.actualizar(id, datosActualizados);
  }

  async eliminarLibro(id) {
    return await this.libroRepo.eliminar(id);
  }

  async buscarLibros(termino) {
    return await this.libroRepo.obtenerTodos({ busqueda: termino });
  }

  async verificarDisponibilidad(id) {
    const libro = await this.obtenerLibro(id);
    return libro.estaDisponible();
  }

  async actualizarDisponibilidad(id, cantidad) {
    return await this.libroRepo.actualizarDisponibilidad(id, cantidad);
  }
}
