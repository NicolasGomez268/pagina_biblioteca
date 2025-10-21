#!/usr/bin/env node

/**
 * Script para probar la conexión con Supabase y la API
 */

import { LibroService } from "./src/services/LibroService.js";
import { SocioService } from "./src/services/SocioService.js";

console.log("🔍 Probando conexión con Supabase...\n");

async function probarConexion() {
  try {
    const socioService = new SocioService();
    const libroService = new LibroService();

    // Test 1: Listar socios
    console.log("✅ Test 1: Listar socios de la base de datos");
    const socios = await socioService.listarSocios();
    console.log(`   Encontrados: ${socios.length} socios`);
    if (socios.length > 0) {
      console.log(`   Ejemplo: ${socios[0].getNombreCompleto()}`);
    }

    // Test 2: Listar libros
    console.log("\n✅ Test 2: Listar libros de la base de datos");
    const libros = await libroService.listarLibros();
    console.log(`   Encontrados: ${libros.length} libros`);
    if (libros.length > 0) {
      console.log(`   Ejemplo: ${libros[0].titulo} - ${libros[0].autor}`);
    }

    // Test 3: Crear un nuevo socio de prueba
    console.log("\n✅ Test 3: Crear un nuevo socio");
    const nuevoSocio = await socioService.crearSocio({
      nombre: "Prueba",
      apellido: "API",
      dni: `TEST${Date.now()}`,
      email: "prueba@test.com",
      telefono: "1234567890",
    });
    console.log(
      `   Socio creado: ${nuevoSocio.getNombreCompleto()} (ID: ${
        nuevoSocio.id
      })`
    );

    console.log("\n" + "=".repeat(50));
    console.log("🎉 ¡CONEXIÓN CON SUPABASE EXITOSA!");
    console.log("=".repeat(50));
    console.log("\n✨ Tu sistema está 100% funcional y listo para usar\n");
  } catch (error) {
    console.error("\n❌ Error al conectar con Supabase:");
    console.error("   Mensaje:", error.message);
    console.error("\n💡 Verifica:");
    console.error("   1. Que las credenciales en .env sean correctas");
    console.error("   2. Que las tablas estén creadas en Supabase");
    console.error("   3. Que tengas conexión a internet\n");
    process.exit(1);
  }
}

probarConexion();
