/**
 * Servicio de envío de emails
 * Mock simple para desarrollo - en producción usar nodemailer con SMTP real
 */

/**
 * Configuración de email (mock para desarrollo)
 */
const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || "biblioteca@edna.com",
  enabled: process.env.EMAIL_ENABLED === "true" || false, // Deshabilitado por defecto
};

/**
 * Función helper para simular envío de email
 */
const enviarEmail = async ({ to, subject, body, html }) => {
  console.log("[Emailer] Enviando email:", {
    to,
    subject,
    from: EMAIL_CONFIG.from,
    timestamp: new Date().toISOString(),
  });

  if (!EMAIL_CONFIG.enabled) {
    console.log(
      "[Emailer] Email deshabilitado (modo desarrollo) - Contenido:",
      {
        body: body || html,
      }
    );
    return {
      success: true,
      message: "Email simulado (modo desarrollo)",
      enviado: false,
    };
  }

  // En producción, aquí iría la integración con nodemailer
  // const transporter = nodemailer.createTransport({...});
  // await transporter.sendMail({from, to, subject, html});

  return {
    success: true,
    message: "Email enviado exitosamente",
    enviado: true,
  };
};

/**
 * Envía notificación cuando un socio devuelve un libro
 */
export const notificarDevolucion = async ({ socio, libro, devolucion }) => {
  const estadoLibro = devolucion.estadoLibro || "bueno";
  const esEstadoNormal = estadoLibro === "bueno";

  const subject = esEstadoNormal
    ? "✅ Devolución registrada - Biblioteca Edna"
    : "⚠️ Devolución con observaciones - Biblioteca Edna";

  const body = `
Estimado/a ${socio.nombre} ${socio.apellido},

Hemos registrado la devolución del libro "${libro.titulo}".

📚 Detalles de la devolución:
- Libro: ${libro.titulo} (ISBN: ${libro.isbn})
- Fecha de devolución: ${new Date(devolucion.createdAt).toLocaleDateString(
    "es-AR"
  )}
- Estado del libro: ${estadoLibro}
${
  devolucion.observaciones ? `- Observaciones: ${devolucion.observaciones}` : ""
}

${
  !esEstadoNormal
    ? `\n⚠️ IMPORTANTE: El libro fue devuelto con estado "${estadoLibro}". Se ha generado una multa correspondiente.\n`
    : ""
}

Gracias por utilizar nuestros servicios.

Saludos cordiales,
Biblioteca Edna
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${esEstadoNormal ? "#28a745" : "#ffc107"};">${
    esEstadoNormal ? "✅" : "⚠️"
  } Devolución registrada</h2>
      <p>Estimado/a <strong>${socio.nombre} ${socio.apellido}</strong>,</p>
      <p>Hemos registrado la devolución del libro <strong>"${
        libro.titulo
      }"</strong>.</p>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">📚 Detalles de la devolución:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Libro:</strong> ${libro.titulo} (ISBN: ${libro.isbn})</li>
          <li><strong>Fecha:</strong> ${new Date(
            devolucion.createdAt
          ).toLocaleDateString("es-AR")}</li>
          <li><strong>Estado:</strong> <span style="color: ${
            esEstadoNormal ? "#28a745" : "#dc3545"
          };">${estadoLibro}</span></li>
          ${
            devolucion.observaciones
              ? `<li><strong>Observaciones:</strong> ${devolucion.observaciones}</li>`
              : ""
          }
        </ul>
      </div>

      ${
        !esEstadoNormal
          ? `
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
          <strong>⚠️ IMPORTANTE:</strong> El libro fue devuelto con estado "${estadoLibro}". Se ha generado una multa correspondiente.
        </div>
      `
          : ""
      }

      <p>Gracias por utilizar nuestros servicios.</p>
      <p style="color: #6c757d; font-size: 14px;">Saludos cordiales,<br><strong>Biblioteca Edna</strong></p>
    </div>
  `;

  try {
    const resultado = await enviarEmail({
      to: socio.email,
      subject,
      body,
      html,
    });

    console.log("[Emailer] Notificación de devolución procesada:", {
      socio: socio.dni,
      libro: libro.isbn,
      estadoLibro,
      resultado,
    });

    return resultado;
  } catch (error) {
    console.error(
      "[Emailer] Error al enviar notificación de devolución:",
      error
    );
    return {
      success: false,
      message: "Error al enviar email",
      error: error.message,
    };
  }
};

/**
 * Envía notificación cuando se genera una multa
 */
export const notificarMulta = async ({ socio, multa, libro = null }) => {
  const subject = "💰 Multa generada - Biblioteca Edna";

  const tipoMulta =
    multa.tipo === "mora"
      ? "por mora en la devolución"
      : multa.tipo === "dano"
      ? "por daño al libro"
      : multa.tipo === "perdida"
      ? "por pérdida del libro"
      : "administrativa";

  const body = `
Estimado/a ${socio.nombre} ${socio.apellido},

Le informamos que se ha generado una multa en su cuenta.

💰 Detalles de la multa:
- Tipo: ${tipoMulta}
- Monto: $${multa.monto}
- Fecha: ${new Date(multa.createdAt).toLocaleDateString("es-AR")}
${libro ? `- Libro: ${libro.titulo} (ISBN: ${libro.isbn})` : ""}
${multa.descripcion ? `- Descripción: ${multa.descripcion}` : ""}

Por favor, regularice su situación para poder continuar utilizando nuestros servicios.

Saludos cordiales,
Biblioteca Edna
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc3545;">💰 Multa generada</h2>
      <p>Estimado/a <strong>${socio.nombre} ${socio.apellido}</strong>,</p>
      <p>Le informamos que se ha generado una multa en su cuenta.</p>
      
      <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #721c24;">💰 Detalles de la multa:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Tipo:</strong> ${tipoMulta}</li>
          <li><strong>Monto:</strong> <span style="font-size: 1.2em; color: #dc3545;">$${
            multa.monto
          }</span></li>
          <li><strong>Fecha:</strong> ${new Date(
            multa.createdAt
          ).toLocaleDateString("es-AR")}</li>
          ${
            libro
              ? `<li><strong>Libro:</strong> ${libro.titulo} (ISBN: ${libro.isbn})</li>`
              : ""
          }
          ${
            multa.descripcion
              ? `<li><strong>Descripción:</strong> ${multa.descripcion}</li>`
              : ""
          }
        </ul>
      </div>

      <p style="background: #fff3cd; padding: 10px; border-radius: 5px;">
        ⚠️ Por favor, regularice su situación para poder continuar utilizando nuestros servicios.
      </p>

      <p style="color: #6c757d; font-size: 14px;">Saludos cordiales,<br><strong>Biblioteca Edna</strong></p>
    </div>
  `;

  try {
    const resultado = await enviarEmail({
      to: socio.email,
      subject,
      body,
      html,
    });

    console.log("[Emailer] Notificación de multa procesada:", {
      socio: socio.dni,
      tipo: multa.tipo,
      monto: multa.monto,
      resultado,
    });

    return resultado;
  } catch (error) {
    console.error("[Emailer] Error al enviar notificación de multa:", error);
    return {
      success: false,
      message: "Error al enviar email",
      error: error.message,
    };
  }
};

/**
 * Envía notificación de bienvenida cuando se registra un nuevo socio
 */
export const notificarAltaSocio = async ({ socio }) => {
  const subject = "🎉 Bienvenido a Biblioteca Edna";

  const body = `
Estimado/a ${socio.nombre} ${socio.apellido},

¡Bienvenido/a a Biblioteca Edna!

Su registro ha sido completado exitosamente.

👤 Datos de su cuenta:
- DNI: ${socio.dni}
- Email: ${socio.email}
- Fecha de inscripción: ${new Date(socio.fechaInscripcion).toLocaleDateString(
    "es-AR"
  )}

Ya puede comenzar a disfrutar de nuestros servicios de préstamo de libros.

Saludos cordiales,
Biblioteca Edna
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">🎉 ¡Bienvenido a Biblioteca Edna!</h2>
      <p>Estimado/a <strong>${socio.nombre} ${socio.apellido}</strong>,</p>
      <p>Su registro ha sido completado exitosamente.</p>
      
      <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #155724;">👤 Datos de su cuenta:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>DNI:</strong> ${socio.dni}</li>
          <li><strong>Email:</strong> ${socio.email}</li>
          <li><strong>Fecha de inscripción:</strong> ${new Date(
            socio.fechaInscripcion
          ).toLocaleDateString("es-AR")}</li>
        </ul>
      </div>

      <p>Ya puede comenzar a disfrutar de nuestros servicios de préstamo de libros.</p>
      <p style="color: #6c757d; font-size: 14px;">Saludos cordiales,<br><strong>Biblioteca Edna</strong></p>
    </div>
  `;

  try {
    const resultado = await enviarEmail({
      to: socio.email,
      subject,
      body,
      html,
    });

    console.log("[Emailer] Notificación de alta de socio procesada:", {
      socio: socio.dni,
      resultado,
    });

    return resultado;
  } catch (error) {
    console.error("[Emailer] Error al enviar notificación de alta:", error);
    return {
      success: false,
      message: "Error al enviar email",
      error: error.message,
    };
  }
};

export default {
  notificarDevolucion,
  notificarMulta,
  notificarAltaSocio,
};
