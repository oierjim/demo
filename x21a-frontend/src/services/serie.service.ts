import { BaseService } from './base.service';

export interface Serie {
    id: number;
    titulo: string;
    tipo: string;
    plataforma: string;
    fechaEstreno: string | Date;
}

export class SerieService extends BaseService<Serie> {
    constructor() {
        super('series');
    }
}

export const serieService = new SerieService();