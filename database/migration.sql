-- ============================================
-- SCRIPT DE MIGRACIÓN PARA SUPABASE
-- Sistema de Biblioteca Edna
-- ============================================

-- IMPORTANTE: Ejecutar estos comandos en el SQL Editor de Supabase
-- en el orden que aparecen aquí

-- ============================================
-- 1. TABLA SOCIOS
-- ============================================
CREATE TABLE IF NOT EXISTS socios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  dni VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(20),
  direccion TEXT,
  fecha_inscripcion TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'suspendido', 'inactivo')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_socios_dni ON socios(dni);
CREATE INDEX IF NOT EXISTS idx_socios_estado ON socios(estado);
CREATE INDEX IF NOT EXISTS idx_socios_nombre ON socios(nombre, apellido);

-- ============================================
-- 2. TABLA LIBROS
-- ============================================
CREATE TABLE IF NOT EXISTS libros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(255) NOT NULL,
  isbn VARCHAR(50) UNIQUE,
  editorial VARCHAR(100),
  anio_publicacion INTEGER,
  categoria VARCHAR(100),
  cantidad INTEGER DEFAULT 1 CHECK (cantidad >= 0),
  cantidad_disponible INTEGER DEFAULT 1 CHECK (cantidad_disponible >= 0),
  ubicacion VARCHAR(100),
  estado VARCHAR(20) DEFAULT 'disponible' CHECK (estado IN ('disponible', 'prestado', 'en_reparacion', 'perdido')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_libros_isbn ON libros(isbn);
CREATE INDEX IF NOT EXISTS idx_libros_categoria ON libros(categoria);
CREATE INDEX IF NOT EXISTS idx_libros_titulo ON libros(titulo);
CREATE INDEX IF NOT EXISTS idx_libros_autor ON libros(autor);
CREATE INDEX IF NOT EXISTS idx_libros_disponible ON libros(cantidad_disponible) WHERE cantidad_disponible > 0;

-- ============================================
-- 3. TABLA PRÉSTAMOS
-- ============================================
CREATE TABLE IF NOT EXISTS prestamos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id UUID NOT NULL REFERENCES socios(id) ON DELETE CASCADE,
  libro_id UUID NOT NULL REFERENCES libros(id) ON DELETE CASCADE,
  fecha_prestamo TIMESTAMP DEFAULT NOW(),
  fecha_devolucion_estimada TIMESTAMP NOT NULL,
  dias_prestamo INTEGER DEFAULT 14 CHECK (dias_prestamo > 0),
  estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'devuelto', 'vencido')),
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_prestamos_socio ON prestamos(socio_id);
CREATE INDEX IF NOT EXISTS idx_prestamos_libro ON prestamos(libro_id);
CREATE INDEX IF NOT EXISTS idx_prestamos_estado ON prestamos(estado);
CREATE INDEX IF NOT EXISTS idx_prestamos_fecha_devolucion ON prestamos(fecha_devolucion_estimada);

-- ============================================
-- 4. TABLA DEVOLUCIONES
-- ============================================
CREATE TABLE IF NOT EXISTS devoluciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestamo_id UUID NOT NULL REFERENCES prestamos(id) ON DELETE CASCADE,
  socio_id UUID NOT NULL REFERENCES socios(id),
  libro_id UUID NOT NULL REFERENCES libros(id),
  fecha_devolucion TIMESTAMP DEFAULT NOW(),
  estado_libro VARCHAR(20) DEFAULT 'bueno' CHECK (estado_libro IN ('bueno', 'danado', 'perdido')),
  observaciones TEXT,
  multa_generada BOOLEAN DEFAULT FALSE,
  multa_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_devoluciones_prestamo ON devoluciones(prestamo_id);
CREATE INDEX IF NOT EXISTS idx_devoluciones_socio ON devoluciones(socio_id);
CREATE INDEX IF NOT EXISTS idx_devoluciones_fecha ON devoluciones(fecha_devolucion);

-- ============================================
-- 5. TABLA MULTAS
-- ============================================
CREATE TABLE IF NOT EXISTS multas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id UUID NOT NULL REFERENCES socios(id) ON DELETE CASCADE,
  prestamo_id UUID NOT NULL REFERENCES prestamos(id),
  devolucion_id UUID REFERENCES devoluciones(id),
  tipo VARCHAR(20) DEFAULT 'retraso' CHECK (tipo IN ('retraso', 'dano', 'perdida')),
  monto DECIMAL(10, 2) NOT NULL CHECK (monto >= 0),
  descripcion TEXT,
  fecha_emision TIMESTAMP DEFAULT NOW(),
  fecha_vencimiento TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagada', 'cancelada')),
  fecha_pago TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_multas_socio ON multas(socio_id);
CREATE INDEX IF NOT EXISTS idx_multas_prestamo ON multas(prestamo_id);
CREATE INDEX IF NOT EXISTS idx_multas_estado ON multas(estado);
CREATE INDEX IF NOT EXISTS idx_multas_tipo ON multas(tipo);

-- ============================================
-- 6. FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at en cada tabla
CREATE TRIGGER update_socios_updated_at BEFORE UPDATE ON socios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_libros_updated_at BEFORE UPDATE ON libros
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prestamos_updated_at BEFORE UPDATE ON prestamos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devoluciones_updated_at BEFORE UPDATE ON devoluciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_multas_updated_at BEFORE UPDATE ON multas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. DATOS DE PRUEBA (OPCIONAL)
-- ============================================

-- Insertar algunos socios de prueba
INSERT INTO socios (nombre, apellido, dni, email, telefono, direccion) VALUES
  ('Juan', 'Pérez', '12345678', 'juan.perez@email.com', '1234567890', 'Calle Falsa 123'),
  ('María', 'González', '87654321', 'maria.gonzalez@email.com', '0987654321', 'Avenida Siempreviva 742'),
  ('Pedro', 'Ramírez', '11223344', 'pedro.ramirez@email.com', '1122334455', 'Boulevard de los Sueños 456');

-- Insertar algunos libros de prueba
INSERT INTO libros (titulo, autor, isbn, editorial, anio_publicacion, categoria, cantidad, cantidad_disponible, ubicacion) VALUES
  ('Cien años de soledad', 'Gabriel García Márquez', '978-0307474728', 'Sudamericana', 1967, 'Novela', 3, 3, 'Estante A-12'),
  ('El principito', 'Antoine de Saint-Exupéry', '978-0156012195', 'Reynal & Hitchcock', 1943, 'Infantil', 2, 2, 'Estante B-05'),
  ('Don Quijote de la Mancha', 'Miguel de Cervantes', '978-8420412146', 'Francisco de Robles', 1605, 'Clásico', 4, 4, 'Estante A-01'),
  ('1984', 'George Orwell', '978-0451524935', 'Secker & Warburg', 1949, 'Distopía', 2, 2, 'Estante C-20'),
  ('Rayuela', 'Julio Cortázar', '978-8420468471', 'Sudamericana', 1963, 'Novela', 2, 2, 'Estante A-15');

-- ============================================
-- 8. POLÍTICAS DE SEGURIDAD (RLS - Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas (comentado por defecto)
-- Descomenta estas líneas si deseas usar autenticación de Supabase

-- ALTER TABLE socios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE libros ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE prestamos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE devoluciones ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE multas ENABLE ROW LEVEL SECURITY;

-- Políticas de ejemplo (permite todas las operaciones para usuarios autenticados)
-- CREATE POLICY "Enable all for authenticated users" ON socios FOR ALL USING (auth.role() = 'authenticated');
-- CREATE POLICY "Enable all for authenticated users" ON libros FOR ALL USING (auth.role() = 'authenticated');
-- CREATE POLICY "Enable all for authenticated users" ON prestamos FOR ALL USING (auth.role() = 'authenticated');
-- CREATE POLICY "Enable all for authenticated users" ON devoluciones FOR ALL USING (auth.role() = 'authenticated');
-- CREATE POLICY "Enable all for authenticated users" ON multas FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 9. VISTAS ÚTILES
-- ============================================

-- Vista de préstamos con información completa
CREATE OR REPLACE VIEW vista_prestamos_completos AS
SELECT 
  p.id,
  p.fecha_prestamo,
  p.fecha_devolucion_estimada,
  p.estado,
  s.nombre || ' ' || s.apellido AS socio_nombre,
  s.dni AS socio_dni,
  l.titulo AS libro_titulo,
  l.autor AS libro_autor,
  CASE 
    WHEN p.estado = 'activo' AND p.fecha_devolucion_estimada < NOW() THEN true
    ELSE false
  END AS esta_vencido,
  CASE 
    WHEN p.estado = 'activo' AND p.fecha_devolucion_estimada < NOW() 
    THEN EXTRACT(DAY FROM NOW() - p.fecha_devolucion_estimada)::INTEGER
    ELSE 0
  END AS dias_retraso
FROM prestamos p
JOIN socios s ON p.socio_id = s.id
JOIN libros l ON p.libro_id = l.id;

-- Vista de multas pendientes por socio
CREATE OR REPLACE VIEW vista_multas_pendientes_por_socio AS
SELECT 
  s.id AS socio_id,
  s.nombre || ' ' || s.apellido AS socio_nombre,
  s.dni,
  COUNT(m.id) AS cantidad_multas,
  COALESCE(SUM(m.monto), 0) AS total_adeudado
FROM socios s
LEFT JOIN multas m ON s.id = m.socio_id AND m.estado = 'pendiente'
GROUP BY s.id, s.nombre, s.apellido, s.dni;

-- ============================================
-- FINALIZADO
-- ============================================

-- Verificar que todas las tablas fueron creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
