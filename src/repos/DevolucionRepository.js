import { supabase } from "../config/supabase.js";
import { Devolucion } from "../domain/Devolucion.js";

export class DevolucionRepository {
  constructor() {
    this.tabla = "devoluciones";
  }

  mapearDesdeBD(data) {
    return new Devolucion({
      id: data.id,
      prestamoId: data.prestamo_id,
      socioId: data.socio_id,
      libroId: data.libro_id,
      fechaDevolucion: data.fecha_devolucion,
      estadoLibro: data.estado_libro,
      observaciones: data.observaciones,
      multaGenerada: data.multa_generada,
      multaId: data.multa_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }

  async crear(devolucion) {
    const devolucionData = {
      prestamo_id: devolucion.prestamoId,
      socio_id: devolucion.socioId,
      libro_id: devolucion.libroId,
      fecha_devolucion: devolucion.fechaDevolucion,
      estado_libro: devolucion.estadoLibro,
      observaciones: devolucion.observaciones,
      multa_generada: devolucion.multaGenerada,
      multa_id: devolucion.multaId,
    };

    const { data, error } = await supabase
      .from(this.tabla)
      .insert([devolucionData])
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

  async obtenerPorPrestamo(prestamoId) {
    const { data, error } = await supabase
      .from(this.tabla)
      .select("*")
      .eq("prestamo_id", prestamoId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? this.mapearDesdeBD(data) : null;
  }

  async obtenerPorSocio(socioId) {
    const { data, error } = await supabase
      .from(this.tabla)
      .select("*")
      .eq("socio_id", socioId)
      .order("fecha_devolucion", { ascending: false });

    if (error) throw error;
    return data.map((item) => this.mapearDesdeBD(item));
  }

  async obtenerTodos(filtros = {}) {
    let query = supabase.from(this.tabla).select("*");

    if (filtros.estadoLibro) {
      query = query.eq("estado_libro", filtros.estadoLibro);
    }

    if (filtros.conMulta !== undefined) {
      query = query.eq("multa_generada", filtros.conMulta);
    }

    const { data, error } = await query.order("fecha_devolucion", {
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
