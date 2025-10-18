
# Modelo de Datos — Biblioteca (MER y MR)

Este repo incluye archivos que **VS Code** puede leer y previsualizar fácilmente:
- `biblioteca.dbml` → formato **DBML** (extensión *DBML Preview* o *dbdiagram*).
- `modelo.puml` → **PlantUML** (extensión *PlantUML*).
- `migration.sql` → **DDL PostgreSQL/Supabase** (para ejecutar en SQL Editor).
- Este `README.md` con snippets de **Mermaid** y **PlantUML**.

---

## 📐 MER (Mermaid ER Diagram)

> Abrí este archivo en VS Code y activá la vista previa Markdown (`Ctrl+Shift+V`).

```mermaid
erDiagram
    SOCIO {
        nro_socio
        dni
        nombre_completo
        telefono
        direccion
        email
    }

    LIBRO {
        isbn
        titulo
        autor
        estado
    }

    PRESTAMO {
        id_prestamo
        fecha_inicio
        fecha_devolucion_prevista
        nro_socio
        isbn
    }

    DEVOLUCION {
        id_devolucion
        id_prestamo
        fecha_devolucion
        estado_fisico
        observaciones
    }

    MULTA {
        id_multa
        id_devolucion
        fecha
        motivo
        monto
    }

    SOCIO ||--o{ PRESTAMO : solicita
    LIBRO ||--o{ PRESTAMO : se_presta_en
    PRESTAMO ||--o| DEVOLUCION : se_devuelve_en
    DEVOLUCION ||--o| MULTA : genera
```

> Nota: Mermaid ER no soporta PK/FK/UNIQUE en el bloque; eso se expresa abajo en SQL/DBML.

---

## 🧱 MR (PlantUML — Tablas y claves)

```plantuml
@startuml
hide methods
hide stereotypes
skinparam linetype ortho

entity "socio" as socio {
  * nro_socio : bigint <<PK>>
  dni : varchar <<UNIQUE>>
  nombre_completo : varchar
  telefono : varchar
  direccion : varchar
  email : varchar
}

entity "libro" as libro {
  * isbn : varchar <<PK>>
  titulo : varchar
  autor : varchar
  estado : varchar
}

entity "prestamo" as prestamo {
  * id_prestamo : bigint <<PK>>
  fecha_inicio : date
  fecha_devolucion_prevista : date
  nro_socio : bigint <<FK>>
  isbn : varchar <<FK>>
}

entity "devolucion" as devolucion {
  * id_devolucion : bigint <<PK>>
  id_prestamo : bigint <<FK, UNIQUE>>
  fecha_devolucion : date
  estado_fisico : varchar
  observaciones : varchar
}

entity "multa" as multa {
  * id_multa : bigint <<PK>>
  id_devolucion : bigint <<FK, UNIQUE>>
  fecha : date
  motivo : varchar
  monto : numeric(10,2)
}

socio ||--o{ prestamo : solicita
libro ||--o{ prestamo : incluye
prestamo ||--o| devolucion : se_devuelve_en
devolucion ||--o| multa : genera
@enduml
```

---

## ▶ SQL (PostgreSQL/Supabase)

El archivo `migration.sql` incluye todo el DDL:
- PK, FK y UNIQUE
- Regla: **un préstamo activo por libro** (una devolución por préstamo)

Ejecutá el contenido en **Supabase → SQL Editor**.

