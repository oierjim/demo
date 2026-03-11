import api from '../api';

export interface ComboElemento {
  id: string;
  descripcionC: string;
  descripcionE: string;
}

const getProvincias = () => {
  return api.get<ComboElemento[]>('/combos/provincias').then(res => res.data);
};

const getMunicipios = (provinciaId?: string) => {
  return api.get<ComboElemento[]>(`/combos/municipios${provinciaId ? `?provinciaId=${provinciaId}` : ''}`).then(res => res.data);
};

export const comboService = {
  getProvincias,
  getMunicipios
};
