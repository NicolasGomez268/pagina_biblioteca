// Errores de dominio/negocio estandarizados

export class ErrorDeAplicacion extends Error {
  constructor(mensaje, codigo = "APP_ERROR") {
    super(mensaje);
    this.name = this.constructor.name;
    this.codigo = codigo;
  }
}

export class ErrorDeValidacion extends ErrorDeAplicacion {
  constructor(mensaje, detalles = {}) {
    super(mensaje, "VALIDATION_ERROR");
    this.detalles = detalles;
  }
}

export class ErrorDeNegocio extends ErrorDeAplicacion {
  constructor(mensaje, reglas = {}) {
    super(mensaje, "BUSINESS_RULE_VIOLATION");
    this.reglas = reglas;
  }
}

export class ErrorDeInfraestructura extends ErrorDeAplicacion {
  constructor(mensaje, causa) {
    super(mensaje, "INFRASTRUCTURE_ERROR");
    this.causa = causa;
  }
}
