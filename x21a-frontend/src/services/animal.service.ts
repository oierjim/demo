import { BaseService } from './base.service';

export interface Animal {
    id: string;
    nombre: string;
    raza: string;
    fechaNacimiento: Date | string;
    peso: number;
    altura: number;
}

class AnimalService extends BaseService<Animal> {
    constructor() {
        super('/animales');
    }
}

export const animalService = new AnimalService();