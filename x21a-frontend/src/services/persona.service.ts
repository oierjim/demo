import { BaseService } from './base.service';

export interface Persona {
    id: string;
    dni: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    fechaNacimiento: Date | string;
    email: string;
}

class PersonaService extends BaseService<Persona> {
    constructor() {
        super('/personas');
    }
}

export const personaService = new PersonaService();