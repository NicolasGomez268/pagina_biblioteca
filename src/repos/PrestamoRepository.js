import { supabase } from "../config/supabase.js";
import { Prestamo } from "../domain/Prestamo.js";

export class PrestamoRepository {
  constructor() {
    this.tabla = "prestamos";
  }

  mapearDesdeBD(data) {
    return new Prestamo({
      id: data.id,
      socioId: data.socio_id,
      libroId: data.libro_id,
      fechaPrestamo: data.fecha_prestamo,
      fechaDevolucionEstimada: data.fecha_devolucion_estimada,
      diasPrestamo: data.dias_prestamo,
      estado: data.estado,
      observaciones: data.observaciones,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }

  async crear(prestamo) {
    const prestamoData = {
      socio_id: prestamo.socioId,
      libro_id: prestamo.libroId,
      fecha_prestamo: prestamo.fechaPrestamo,
      fecha_devolucion_estimada: prestamo.fechaDevolucionEstimada,
      dias_prestamo: prestamo.diasPrestamo,
      estado: prestamo.estado,
      observaciones: prestamo.observaciones,
    };

    const { data, error } = await supabase
      .from(this.tabla)
      .insert([prestamoData])
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

  async obtenerPorSocio(socioId, filtros = {}) {
    let query = supabase.from(this.tabla).select("*").eq("socio_id", socioId);

    if (filtros.estado) {
      query = query.eq("estado", filtros.estado);
    }

    const { data, error } = await query.order("fecha_prestamo", {
      ascending: false,
    });

    if (error) throw error;
    return data.map((item) => this.mapearDesdeBD(item));
  }

  async obtenerPorLibro(libroId, filtros = {}) {
    let query = supabase.from(this.tabla).select("*").eq("libro_id", libroId);

    if (filtros.estado) {
      query = query.eq("estado", filtros.estado);
    }

    const { data, error } = await query.order("fecha_prestamo", {
      ascending: false,
    });

    if (error) throw error;
    return data.map((item) => this.mapearDesdeBD(item));
  }

  async obtenerTodos(filtros = {}) {
    let query = supabase.from(this.tabla).select("*");

    if (filtros.estado) {
      query = query.eq("estado", filtros.estado);
    }

    if (filtros.vencidos) {
      const hoy = new Date().toISOString();
      query = query.eq("estado", "activo").lt("fecha_devolucion_estimada", hoy);
    }

    const { data, error } = await query.order("fecha_prestamo", {
      ascending: false,
    });

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
}
