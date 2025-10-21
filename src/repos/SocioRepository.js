import { supabase } from "../config/supabase.js";
import { Socio } from "../domain/Socio.js";

export class SocioRepository {
  constructor() {
    this.tabla = "socios";
  }

  async crear(socio) {
    const socioData = {
      nombre: socio.nombre,
      apellido: socio.apellido,
      dni: socio.dni,
      email: socio.email,
      telefono: socio.telefono,
      direccion: socio.direccion,
      fecha_inscripcion: socio.fechaInscripcion,
      estado: socio.estado,
    };

    const { data, error } = await supabase
      .from(this.tabla)
      .insert([socioData])
      .select()
      .single();

    if (error) throw error;
    return this.mapearDesdeBD(data);
  }

  mapearDesdeBD(data) {
    return new Socio({
      id: data.id,
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion,
      fechaInscripcion: data.fecha_inscripcion,
      estado: data.estado,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
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

  async obtenerPorDni(dni) {
    const { data, error } = await supabase
      .from(this.tabla)
      .select("*")
      .eq("dni", dni)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data ? this.mapearDesdeBD(data) : null;
  }

  async obtenerTodos(filtros = {}) {
    let query = supabase.from(this.tabla).select("*");

    if (filtros.estado) {
      query = query.eq("estado", filtros.estado);
    }

    if (filtros.busqueda) {
      query = query.or(
        `nombre.ilike.%${filtros.busqueda}%,apellido.ilike.%${filtros.busqueda}%,dni.ilike.%${filtros.busqueda}%`
      );
    }

    const { data, error } = await query.order("apellido", { ascending: true });

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
