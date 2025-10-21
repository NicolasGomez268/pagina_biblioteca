const BASE = ""; // misma origin

async function http(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false)
    throw new Error(data.message || "Error en la solicitud");
  return data;
}

// Utilidad simple para mostrar mensajes
function show(el, result) {
  el.className = `mt-2 small ${
    result.success ? "text-success" : "text-danger"
  }`;
  el.textContent = `${result.message || ""}`;
}

// Cargar libros en el select
async function cargarLibros() {
  const select = document.getElementById("select-libros");
  select.innerHTML = "<option>Cargando...</option>";
  try {
    const r = await http("/api/libros");
    const libros = Array.isArray(r.data) ? r.data : [];
    select.innerHTML = libros
      .map(
        (l) =>
          `<option value="${l.id}">${l.titulo} — disp: ${l.cantidadDisponible}</option>`
      )
      .join("");
  } catch (e) {
    select.innerHTML = `<option>Error al cargar</option>`;
  }
}

// Alta de socio
const formAlta = document.getElementById("form-alta-socio");
formAlta?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(formAlta);
  const body = Object.fromEntries(fd.entries());
  // forzar DNI único
  body.dni = body.dni || `DNI${Date.now()}`;
  try {
    const r = await http("/api/socios", {
      method: "POST",
      body: JSON.stringify(body),
    });
    show(document.getElementById("resultado-alta"), r);
  } catch (err) {
    show(document.getElementById("resultado-alta"), {
      success: false,
      message: err.message,
    });
  }
});

// Crear préstamo
const formPrestamo = document.getElementById("form-prestamo");
formPrestamo?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(formPrestamo);
  const socioId = fd.get("socioId");
  const diasPrestamo = fd.get("diasPrestamo");
  const selectLibros = document.getElementById("select-libros");
  const libroId = selectLibros.value;
  try {
    const r = await http("/api/prestamos", {
      method: "POST",
      body: JSON.stringify({
        socioId,
        libroId,
        diasPrestamo: diasPrestamo ? Number(diasPrestamo) : undefined,
      }),
    });
    show(document.getElementById("resultado-prestamo"), r);
  } catch (err) {
    show(document.getElementById("resultado-prestamo"), {
      success: false,
      message: err.message,
    });
  }
});

// Devolución
const formDevolucion = document.getElementById("form-devolucion");
formDevolucion?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(formDevolucion);
  const prestamoId = fd.get("prestamoId");
  const estadoLibro = fd.get("estadoLibro");
  const observaciones = fd.get("observaciones") || undefined;
  try {
    const r = await http(`/api/prestamos/${prestamoId}/devolver`, {
      method: "PUT",
      body: JSON.stringify({ estadoLibro, observaciones }),
    });
    show(document.getElementById("resultado-devolucion"), r);
  } catch (err) {
    show(document.getElementById("resultado-devolucion"), {
      success: false,
      message: err.message,
    });
  }
});

// Multa manual
const formMulta = document.getElementById("form-multa");
formMulta?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(formMulta);
  const body = Object.fromEntries(fd.entries());
  body.monto = Number(body.monto);
  try {
    const r = await http("/api/multas", {
      method: "POST",
      body: JSON.stringify(body),
    });
    show(document.getElementById("resultado-multa"), r);
  } catch (err) {
    show(document.getElementById("resultado-multa"), {
      success: false,
      message: err.message,
    });
  }
});

// Listados
const listado = document.getElementById("listado");
const btnSocios = document.getElementById("btn-listar-socios");
btnSocios?.addEventListener("click", async () => {
  try {
    const r = await http("/api/socios");
    listado.textContent = JSON.stringify(r.data, null, 2);
  } catch (e) {
    listado.textContent = e.message;
  }
});

const btnPrestamos = document.getElementById("btn-listar-prestamos");
btnPrestamos?.addEventListener("click", async () => {
  try {
    const r = await http("/api/prestamos");
    listado.textContent = JSON.stringify(r.data, null, 2);
  } catch (e) {
    listado.textContent = e.message;
  }
});

const btnMultas = document.getElementById("btn-listar-multas");
btnMultas?.addEventListener("click", async () => {
  try {
    const r = await http("/api/multas");
    listado.textContent = JSON.stringify(r.data, null, 2);
  } catch (e) {
    listado.textContent = e.message;
  }
});

// Botón refrescar libros
const btnRefrescarLibros = document.getElementById("btn-refrescar-libros");
btnRefrescarLibros?.addEventListener("click", (e) => {
  e.preventDefault();
  cargarLibros();
});

// Inicial
cargarLibros().catch(() => {});
