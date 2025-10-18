import express from "express";
import { LibroService } from "../services/LibroService.js";

const router = express.Router();
const libroService = new LibroService();

// Crear un nuevo libro
router.post("/", async (req, res, next) => {
  try {
    const libro = await libroService.crearLibro(req.body);
    res.status(201).json({
      success: true,
      message: "Libro creado con éxito",
      data: libro,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener todos los libros
router.get("/", async (req, res, next) => {
  try {
    const { categoria, estado, disponible, busqueda } = req.query;
    const libros = await libroService.listarLibros({
      categoria,
      estado,
      disponible: disponible === "true",
      busqueda,
    });
    res.json({
      success: true,
      message: "Libros obtenidos con éxito",
      data: libros,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener libros disponibles
router.get("/disponibles", async (req, res, next) => {
  try {
    const libros = await libroService.listarLibrosDisponibles();
    res.json({
      success: true,
      message: "Libros disponibles obtenidos con éxito",
      data: libros,
    });
  } catch (error) {
    next(error);
  }
});

// Obtener un libro por ID
router.get("/:id", async (req, res, next) => {
  try {
    const libro = await libroService.obtenerLibro(req.params.id);
    res.json({
      success: true,
      message: "Libro obtenido con éxito",
      data: libro,
    });
  } catch (error) {
    next(error);
  }
});

// Actualizar un libro
router.put("/:id", async (req, res, next) => {
  try {
    const libro = await libroService.actualizarLibro(req.params.id, req.body);
    res.json({
      success: true,
      message: "Libro actualizado con éxito",
      data: libro,
    });
  } catch (error) {
    next(error);
  }
});

// Eliminar un libro
router.delete("/:id", async (req, res, next) => {
  try {
    await libroService.eliminarLibro(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Verificar disponibilidad de un libro
router.get("/:id/disponibilidad", async (req, res, next) => {
  try {
    const disponible = await libroService.verificarDisponibilidad(
      req.params.id
    );
    res.json({
      success: true,
      message: "Disponibilidad obtenida",
      data: { disponible },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
