import { BaseService } from './base.service';

export interface Expediente {
    id: string;
    referencia: string;
    solicitante: string;
    fechaApertura: Date | string;
    estado: string;
    fechaCierre?: Date | string;
    ultimoTramite?: string;
    provincia?: {
        id: string;
        descripcionC: string;
        descripcionE: string;
    };
    municipio?: {
        id: string;
        descripcionC: string;
        descripcionE: string;
    };
}

class ExpedienteService extends BaseService<Expediente> {
    constructor() {
        super('/expedientes');
    }
}

export const expedienteService = new ExpedienteService();