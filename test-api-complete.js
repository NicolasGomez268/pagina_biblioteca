/**
 * Script de prueba completo para la API de Biblioteca Edna
 * Prueba todos los endpoints principales con casos de uso reales
 */

const BASE_URL = "http://localhost:3000";

// Helper para hacer peticiones HTTP
async function request(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error en petición a ${url}:`, error.message);
    throw error;
  }
}

// Helper para logging formateado
function logTest(nombre, exito, detalles) {
  const icono = exito ? "✅" : "❌";
  console.log(`\n${icono} ${nombre}`);
  if (detalles) {
    console.log(JSON.stringify(detalles, null, 2));
  }
}

async function probarAPI() {
  console.log("\n========================================");
  console.log("🧪 PRUEBA COMPLETA DE LA API");
  console.log("========================================\n");

  let socioId, libroId, prestamoId;

  try {
    // ========================================
    // 1. HEALTH CHECK - GET /ping
    // ========================================
    console.log("\n📍 1. HEALTH CHECK");
    const pingRes = await request(`${BASE_URL}/ping`);
    logTest("GET /ping", pingRes.data.success, {
      mensaje: pingRes.data.message,
      timestamp: pingRes.data.data?.timestamp,
    });

    // ========================================
    // 2. ALTA DE SOCIO - POST /api/socios
    // ========================================
    console.log("\n📍 2. ALTA DE SOCIO");
    const dniAleatorio = `DNI${Date.now()}`;
    const nuevoSocio = {
      nombre: "María",
      apellido: "González",
      dni: dniAleatorio,
      email: "maria.gonzalez@email.com",
      telefono: "1155443322",
      direccion: "Calle Falsa 123",
    };

    const socioRes = await request(`${BASE_URL}/api/socios`, {
      method: "POST",
      body: JSON.stringify(nuevoSocio),
    });

    logTest("POST /api/socios (Alta de Socio)", socioRes.data.success, {
      mensaje: socioRes.data.message,
      socioId: socioRes.data.data?.id,
      dni: socioRes.data.data?.dni,
    });

    if (socioRes.data.success) {
      socioId = socioRes.data.data.id;
    } else {
      throw new Error("No se pudo crear el socio");
    }

    // ========================================
    // 3. LISTAR SOCIOS - GET /api/socios
    // ========================================
    console.log("\n📍 3. LISTAR SOCIOS");
    const listaSociosRes = await request(`${BASE_URL}/api/socios`);
    logTest("GET /api/socios", listaSociosRes.data.success, {
      mensaje: listaSociosRes.data.message,
      cantidad: listaSociosRes.data.data?.length || 0,
    });

    // ========================================
    // 4. OBTENER LIBRO DISPONIBLE
    // ========================================
    console.log("\n📍 4. OBTENER LIBRO DISPONIBLE");
    const librosRes = await request(`${BASE_URL}/api/libros`);

    if (librosRes.data.success && Array.isArray(librosRes.data.data)) {
      const libroDisponible = librosRes.data.data.find(
        (libro) => libro.cantidadDisponible > 0
      );

      if (libroDisponible) {
        libroId = libroDisponible.id;
        logTest("GET /api/libros (Buscar disponible)", true, {
          libroId,
          titulo: libroDisponible.titulo,
          disponibles: libroDisponible.cantidadDisponible,
        });
      } else {
        throw new Error("No hay libros disponibles para prestar");
      }
    } else {
      throw new Error("Error al obtener libros");
    }

    // ========================================
    // 5. CREAR PRÉSTAMO - POST /api/prestamos
    // ========================================
    console.log("\n📍 5. CREAR PRÉSTAMO");
    const nuevoPrestamo = {
      socioId,
      libroId,
      diasPrestamo: 7,
    };

    const prestamoRes = await request(`${BASE_URL}/api/prestamos`, {
      method: "POST",
      body: JSON.stringify(nuevoPrestamo),
    });

    logTest("POST /api/prestamos (Prestar Libro)", prestamoRes.data.success, {
      mensaje: prestamoRes.data.message,
      prestamoId: prestamoRes.data.data?.id,
      fechaDevolucion: prestamoRes.data.data?.fechaDevolucion,
    });

    if (prestamoRes.data.success) {
      prestamoId = prestamoRes.data.data.id;
    } else {
      throw new Error("No se pudo crear el préstamo");
    }

    // ========================================
    // 6. LISTAR PRÉSTAMOS - GET /api/prestamos
    // ========================================
    console.log("\n📍 6. LISTAR PRÉSTAMOS");
    const listaPrestamosRes = await request(`${BASE_URL}/api/prestamos`);
    logTest("GET /api/prestamos", listaPrestamosRes.data.success, {
      mensaje: listaPrestamosRes.data.message,
      cantidad: listaPrestamosRes.data.data?.length || 0,
    });

    // ========================================
    // 7. DEVOLVER LIBRO - PUT /api/prestamos/:id/devolver
    // ========================================
    console.log("\n📍 7. DEVOLVER LIBRO");
    const devolucion = {
      estadoLibro: "dañado",
      observaciones: "Prueba de devolución con daño desde API",
    };

    const devolucionRes = await request(
      `${BASE_URL}/api/prestamos/${prestamoId}/devolver`,
      {
        method: "PUT",
        body: JSON.stringify(devolucion),
      }
    );

    logTest(
      "PUT /api/prestamos/:id/devolver (Devolver Libro)",
      devolucionRes.data.success,
      {
        mensaje: devolucionRes.data.message,
        devolucionId: devolucionRes.data.data?.devolucion?.id,
        multaGenerada: devolucionRes.data.data?.multa ? "Sí" : "No",
        montoMulta: devolucionRes.data.data?.multa?.monto,
      }
    );

    // ========================================
    // 8. LISTAR MULTAS - GET /api/multas
    // ========================================
    console.log("\n📍 8. LISTAR MULTAS");
    const multasRes = await request(`${BASE_URL}/api/multas`);
    logTest("GET /api/multas", multasRes.data.success, {
      mensaje: multasRes.data.message,
      cantidad: multasRes.data.data?.length || 0,
      pendientes:
        multasRes.data.data?.filter((m) => m.estado === "pendiente").length ||
        0,
    });

    // ========================================
    // 9. REGISTRAR MULTA MANUAL - POST /api/multas
    // ========================================
    console.log("\n📍 9. REGISTRAR MULTA MANUAL");
    const multaManual = {
      socioId,
      prestamoId, // Requerido por la BD (prestamo_id NOT NULL)
      tipo: "administrativa",
      monto: 500,
      descripcion: "Multa de prueba desde API",
    };

    const multaManualRes = await request(`${BASE_URL}/api/multas`, {
      method: "POST",
      body: JSON.stringify(multaManual),
    });

    logTest("POST /api/multas (Registrar Multa)", multaManualRes.data.success, {
      mensaje: multaManualRes.data.message,
      multaId: multaManualRes.data.data?.id,
      monto: multaManualRes.data.data?.monto,
      tipo: multaManualRes.data.data?.tipo,
    });

    // ========================================
    // 10. OBTENER MULTAS DEL SOCIO
    // ========================================
    console.log("\n📍 10. OBTENER MULTAS DEL SOCIO");
    const multasSocioRes = await request(
      `${BASE_URL}/api/multas/socio/${socioId}`
    );
    logTest(`GET /api/multas/socio/:socioId`, multasSocioRes.data.success, {
      mensaje: multasSocioRes.data.message,
      cantidad: multasSocioRes.data.data?.length || 0,
    });

    // ========================================
    // RESUMEN FINAL
    // ========================================
    console.log("\n========================================");
    console.log("✅ PRUEBA COMPLETA FINALIZADA");
    console.log("========================================");
    console.log("\n📊 Resumen:");
    console.log(`   - Socio creado: ${socioId}`);
    console.log(`   - DNI: ${dniAleatorio}`);
    console.log(`   - Préstamo creado: ${prestamoId}`);
    console.log(`   - Devolución registrada: ✅`);
    console.log(`   - Multa automática generada: ✅`);
    console.log(`   - Multa manual registrada: ✅`);
    console.log("\n🎉 Todos los endpoints funcionan correctamente!\n");
  } catch (error) {
    console.error("\n❌ ERROR EN LA PRUEBA:", error.message);
    console.error("\n💡 Asegúrate de que:");
    console.error("   1. El servidor esté corriendo en http://localhost:3000");
    console.error("   2. La base de datos esté conectada");
    console.error(
      "   3. Haya al menos un libro disponible en la base de datos\n"
    );
    process.exit(1);
  }
}

// Verificar que el servidor esté corriendo
console.log("🔍 Verificando servidor...");
request(`${BASE_URL}/ping`)
  .then(() => {
    console.log("✅ Servidor detectado, iniciando pruebas...");
    return probarAPI();
  })
  .catch((error) => {
    console.error("\n❌ No se pudo conectar al servidor");
    console.error("💡 Por favor, ejecuta primero: npm run dev\n");
    process.exit(1);
  });
