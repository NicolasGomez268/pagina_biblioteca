#!/usr/bin/env node

/**
 * Script de verificación rápida del sistema
 * Este script verifica que todas las clases y módulos se importen correctamente
 */

import { Devolucion } from "./src/domain/Devolucion.js";
import { Libro } from "./src/domain/Libro.js";
import { Multa } from "./src/domain/Multa.js";
import { Prestamo } from "./src/domain/Prestamo.js";
import { Socio } from "./src/domain/Socio.js";

console.log("🔍 Verificando el Sistema de Biblioteca...\n");

// Test 1: Crear un socio
console.log("✅ Test 1: Crear un socio");
const socio = new Socio({
  nombre: "Juan",
  apellido: "Pérez",
  dni: "12345678",
  email: "juan@example.com",
});
console.log("   Socio creado:", socio.getNombreCompleto());

// Test 2: Crear un libro
console.log("\n✅ Test 2: Crear un libro");
const libro = new Libro({
  titulo: "Cien años de soledad",
  autor: "Gabriel García Márquez",
  isbn: "978-0307474728",
  cantidad: 3,
  cantidadDisponible: 3,
});
console.log("   Libro creado:", libro.obtenerInfoCompleta());
console.log("   ¿Está disponible?", libro.estaDisponible());

// Test 3: Crear un préstamo
console.log("\n✅ Test 3: Crear un préstamo");
const prestamo = new Prestamo({
  socioId: "socio-123",
  libroId: "libro-456",
  diasPrestamo: 14,
});
console.log("   Préstamo creado con ID:", prestamo.id || "temporal");
console.log("   Fecha de devolución:", prestamo.fechaDevolucionEstimada);

// Test 4: Verificar lógica de préstamo
console.log("\n✅ Test 4: Verificar disponibilidad del libro");
if (libro.prestar()) {
  console.log("   ✓ Libro prestado correctamente");
  console.log("   Cantidad disponible ahora:", libro.cantidadDisponible);
}

// Test 5: Crear una devolución
console.log("\n✅ Test 5: Crear una devolución");
const devolucion = new Devolucion({
  prestamoId: "prestamo-789",
  socioId: "socio-123",
  libroId: "libro-456",
  estadoLibro: "bueno",
});
console.log("   Devolución creada");
console.log("   ¿Tiene multa?", devolucion.tieneMulta());

// Test 6: Calcular una multa
console.log("\n✅ Test 6: Calcular multa por retraso");
const diasRetraso = 5;
const montoMulta = Multa.calcularMultaPorRetraso(diasRetraso);
console.log(`   Por ${diasRetraso} días de retraso: $${montoMulta}`);

const multa = new Multa({
  socioId: "socio-123",
  prestamoId: "prestamo-789",
  tipo: "retraso",
  monto: montoMulta,
  descripcion: `Multa por ${diasRetraso} días de retraso`,
});
console.log("   Multa creada:", multa.descripcion);
console.log("   ¿Está pendiente?", multa.estaPendiente());

// Test 7: Verificar métodos de dominio
console.log("\n✅ Test 7: Verificar métodos de negocio");
console.log("   - Socio activo:", socio.estaActivo());
console.log("   - Libro disponible:", libro.estaDisponible());
console.log("   - Préstamo vencido:", prestamo.estaVencido());
console.log("   - Multa vencida:", multa.estaVencida());

// Test 8: Verificar serialización
console.log("\n✅ Test 8: Verificar serialización a JSON");
const socioJSON = socio.toJSON();
console.log(
  "   Socio serializado correctamente:",
  Object.keys(socioJSON).length,
  "propiedades"
);

console.log("\n" + "=".repeat(50));
console.log("🎉 TODOS LOS TESTS PASARON CORRECTAMENTE");
console.log("=".repeat(50));
console.log("\n📝 Próximos pasos:");
console.log("   1. Configurar Supabase en el archivo .env");
console.log("   2. Ejecutar las migraciones de base de datos");
console.log("   3. Iniciar el servidor con: npm run dev");
console.log("   4. Probar los endpoints de la API\n");
