import { BaseService } from './base.service';

export interface Pelicula {
    id: number;
    titulo: string;
    director: string;
    genero: string;
    fechaEstreno: string | Date;
    duracion: number;
    oscar: boolean;
}

export class PeliculaService extends BaseService<Pelicula> {
    constructor() {
        super('pelicula');
    }
}

export const peliculaService = new PeliculaService();
