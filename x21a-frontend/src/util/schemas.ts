import { z } from 'zod';

// --- Esquemas Base ---
const requiredMsg = 'common:messages.required';

// --- Animal ---
export const AnimalSchema = z.object({
    nombre: z.string().min(1, requiredMsg),
    raza: z.string().min(1, requiredMsg),
    peso: z.number().optional(),
    altura: z.number().optional(),
    fechaNacimiento: z.any()
});

// --- Expediente ---
export const ExpedienteSchema = z.object({
    referencia: z.string().min(1, requiredMsg),
    solicitante: z.string().min(1, requiredMsg),
    estado: z.string().optional(),
    ultimoTramite: z.string().optional(),
    provincia: z.any().optional(),
    municipio: z.any().optional(),
    fechaApertura: z.any().optional(),
    fechaCierre: z.any().optional()
});

// --- Libro ---
export const LibroSchema = z.object({
    isbn: z.string().min(1, requiredMsg),
    titulo: z.string().min(1, requiredMsg),
    autor: z.string().min(1, requiredMsg),
    estrellas: z.number().min(1).max(5),
    fechaPublicacion: z.any().optional()
});

// --- Pelicula ---
export const PeliculaSchema = z.object({
    titulo: z.string().min(1, requiredMsg),
    director: z.string().min(1, requiredMsg),
    genero: z.string().optional(),
    duracion: z.number().min(1).optional(),
    oscar: z.boolean().optional(),
    fechaEstreno: z.any().optional()
});

// --- Persona ---
export const PersonaSchema = z.object({
    dni: z.string().min(1, requiredMsg).regex(/^[0-9]{8}[A-Z]$/, 'Formato inválido (12345678X)'),
    nombre: z.string().min(1, requiredMsg),
    apellido1: z.string().min(1, requiredMsg),
    apellido2: z.string().optional(),
    email: z.string().min(1, requiredMsg).email('Email inválido'),
    fechaNacimiento: z.any().optional()
});

// --- Serie ---
export const SerieSchema = z.object({
    titulo: z.string().min(1, requiredMsg),
    tipo: z.string().optional(),
    plataforma: z.string().optional(),
    episodios: z.number().optional(),
    fechaEstreno: z.any().optional()
});
