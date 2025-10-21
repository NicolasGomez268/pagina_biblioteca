import { supabase } from "../config/supabase.js";
import { Multa } from "../domain/Multa.js";

export class MultaRepository {
  constructor() {
    this.tabla = "multas";
  }

  mapearDesdeBD(data) {
    return new Multa({
      id: data.id,
      socioId: data.socio_id,
      prestamoId: data.prestamo_id,
      devolucionId: data.devolucion_id,
      tipo: data.tipo,
      monto: parseFloat(data.monto),
      descripcion: data.descripcion,
      fechaEmision: data.fecha_emision,
      fechaVencimiento: data.fecha_vencimiento,
      estado: data.estado,
      fechaPago: data.fecha_pago,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }

  async crear(multa) {
    const multaData = {
      socio_id: multa.socioId,
      prestamo_id: multa.prestamoId,
      devolucion_id: multa.devolucionId,
      tipo: multa.tipo,
      monto: multa.monto,
      descripcion: multa.descripcion,
      fecha_emision: multa.fechaEmision,
      fecha_vencimiento: multa.fechaVencimiento,
      estado: multa.estado,
      fecha_pago: multa.fechaPago,
    };

    const { data, error } = await supabase
      .from(this.tabla)
      .insert([multaData])
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

    const { data, error } = await query.order("fecha_emision", {
      ascending: false,
    });

    if (error) throw error;
    return data.map((item) => this.mapearDesdeBD(item));
  }

  async obtenerPorPrestamo(prestamoId) {
    const { data, error } = await supabase
      .from(this.tabla)
      .select("*")
      .eq("prestamo_id", prestamoId);

    if (error) throw error;
    return data.map((item) => this.mapearDesdeBD(item));
  }

  async obtenerTodos(filtros = {}) {
    let query = supabase.from(this.tabla).select("*");

    if (filtros.estado) {
      query = query.eq("estado", filtros.estado);
    }

    if (filtros.tipo) {
      query = query.eq("tipo", filtros.tipo);
    }

    if (filtros.vencidas) {
      const hoy = new Date().toISOString();
      query = query.eq("estado", "pendiente").lt("fecha_vencimiento", hoy);
    }

    const { data, error } = await query.order("fecha_emision", {
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

  async obtenerTotalPendientePorSocio(socioId) {
    const { data, error } = await supabase
      .from(this.tabla)
      .select("monto")
      .eq("socio_id", socioId)
      .eq("estado", "pendiente");

    if (error) throw error;

    return data.reduce((total, multa) => total + parseFloat(multa.monto), 0);
  }
}
