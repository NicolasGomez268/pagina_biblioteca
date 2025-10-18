#!/usr/bin/env node

import dotenv from "dotenv";
import { LibroRepository } from "./src/repos/LibroRepository.js";
import { AltaSocioService } from "./src/services/altaSocioService.js";
import { DevolverLibroService } from "./src/services/devolverLibroService.js";
import { PrestarLibroService } from "./src/services/prestarLibroService.js";

dotenv.config();

const log = (titulo, res) => {
  console.log(`\n=== ${titulo} ===`);
  console.log(JSON.stringify(res, null, 2));
};

async function run() {
  const altaSocio = new AltaSocioService();
  const prestarLibro = new PrestarLibroService();
  const devolverLibro = new DevolverLibroService();
  const libroRepo = new LibroRepository();

  // 1) Alta de socio (con DNI único)
  const dni = `DNI${Date.now()}`;
  const r1 = await altaSocio.ejecutar({
    nombre: "Caso",
    apellido: "Uso",
    dni,
    email: "caso@uso.com",
  });
  log("Alta Socio", r1);
  if (!r1.exito) return;

  // 2) Tomar un libro cualquiera (primer libro disponible)
  // Usaremos ID del primer libro (requiere que existan libros en base de datos)
  const libros = await libroRepo.obtenerTodos({ disponible: true });
  const libroId = libros[0]?.id;
  if (!libroId) {
    console.log("No hay libros en la BD");
    return;
  }
  const r2 = await prestarLibro.ejecutar({
    socioId: r1.datos.id,
    libroId,
    diasPrestamo: 7,
  });
  log("Prestar Libro", r2);
  if (!r2.exito) return;

  // 3) Devolver el libro con daño
  const r3 = await devolverLibro.ejecutar({
    prestamoId: r2.datos.id,
    estadoLibro: "dañado",
    observaciones: "Cubierta rota",
  });
  log("Devolver Libro (dañado)", r3);
}

run().catch((err) => console.error(err));
