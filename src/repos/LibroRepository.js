import { supabase } from "../config/supabase.js";
import { Libro } from "../domain/Libro.js";

export class LibroRepository {
  constructor() {
    this.tabla = "libros";
  }

  mapearDesdeBD(data) {
    return new Libro({
      id: data.id,
      titulo: data.titulo,
      autor: data.autor,
      isbn: data.isbn,
      editorial: data.editorial,
      anioPublicacion: data.anio_publicacion,
      categoria: data.categoria,
      cantidad: data.cantidad,
      cantidadDisponible: data.cantidad_disponible,
      ubicacion: data.ubicacion,
      estado: data.estado,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }

  async crear(libro) {
    const libroData = {
      titulo: libro.titulo,
      autor: libro.autor,
      isbn: libro.isbn,
      editorial: libro.editorial,
      anio_publicacion: libro.anioPublicacion,
      categoria: libro.categoria,
      cantidad: libro.cantidad,
      cantidad_disponible: libro.cantidadDisponible,
      ubicacion: libro.ubicacion,
      estado: libro.estado,
    };

    const { data, error } = await supabase
      .from(this.tabla)
      .insert([libroData])
      .select()
      .single();

    if (error) throw error;
    return this.mapearDesdeBD(data);
  }

  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from(this.tabla)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data ? this.mapearDesdeBD(data) : null;
  }

  async obtenerPorIsbn(isbn) {
    const { data, error } = await supabase
      .from(this.tabla)
      .select("*")
      .eq("isbn", isbn)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? this.mapearDesdeBD(data) : null;
  }

  async obtenerTodos(filtros = {}) {
    let query = supabase.from(this.tabla).select("*");

    if (filtros.categoria) {
      query = query.eq("categoria", filtros.categoria);
    }

    if (filtros.estado) {
      query = query.eq("estado", filtros.estado);
    }

    if (filtros.disponible) {
      query = query.gt("cantidad_disponible", 0);
    }

    if (filtros.busqueda) {
      query = query.or(
        `titulo.ilike.%${filtros.busqueda}%,autor.ilike.%${filtros.busqueda}%,isbn.ilike.%${filtros.busqueda}%`
      );
    }

    const { data, error } = await query.order("titulo", { ascending: true });

    if (error) throw error;
    return data.map((item) => this.mapearDesdeBD(item));
  }

  async actualizar(id, datosActualizados) {
    const { data, error } = await supabase
      .from(this.tabla)
      .update({ ...datosActualizados, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return this.mapearDesdeBD(data);
  }

  async eliminar(id) {
    const { error } = await supabase.from(this.tabla).delete().eq("id", id);

    if (error) throw error;
    return true;
  }

  async actualizarDisponibilidad(id, cantidad) {
    const { data, error } = await supabase
      .from(this.tabla)
      .update({ cantidad_disponible: cantidad, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return this.mapearDesdeBD(data);
  }
}
