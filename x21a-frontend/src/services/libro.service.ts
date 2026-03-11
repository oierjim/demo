import { BaseService } from './base.service';

export interface Libro {
    id: string; // Alias de ISBN
    isbn: string;
    titulo: string;
    autor: string;
    estrellas: number;
    fechaPublicacion: Date;
}

class LibroService extends BaseService<Libro> {
    constructor() {
        super('/libros');
    }
}

export const libroService = new LibroService();
