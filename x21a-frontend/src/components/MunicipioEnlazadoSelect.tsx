import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { comboService, type ComboElemento } from '../services/combo.service';

interface MunicipioEnlazadoSelectProps {
    provinciaId?: string;
    municipioId?: string;
    onProvinciaChange: (id: string | undefined) => void;
    onMunicipioChange: (id: string | undefined) => void;
    disabled?: boolean;
    isReadOnly?: boolean;
    // Opciones para mostrar etiquetas o no (útil para filtros vs diálogos)
    showLabels?: boolean;
    // Si es para filtros, usa el estilo de etiquetas de filtros
    isFilter?: boolean;
    // Clase para el contenedor (grid col-12, etc.)
    containerClass?: string;
}

export const MunicipioEnlazadoSelect: React.FC<MunicipioEnlazadoSelectProps> = ({
    provinciaId,
    municipioId,
    onProvinciaChange,
    onMunicipioChange,
    disabled = false,
    isReadOnly = false,
    showLabels = true,
    isFilter = false,
    containerClass = "grid"
}) => {
    const { t, i18n } = useTranslation(['common', 'domain']);
    const [provincias, setProvincias] = useState<ComboElemento[]>([]);
    const [municipios, setMunicipios] = useState<ComboElemento[]>([]);

    const getLabel = (item: ComboElemento) => i18n.language === 'eu' ? item.descripcionE : item.descripcionC;

    // Cargar provincias una sola vez
    useEffect(() => {
        comboService.getProvincias().then(setProvincias);
    }, []);

    // Cargar municipios cuando cambie la provincia
    useEffect(() => {
        if (provinciaId) {
            comboService.getMunicipios(provinciaId).then(setMunicipios);
        } else {
            setMunicipios([]);
        }
    }, [provinciaId]);

    const labelClass = isFilter 
        ? "block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider" 
        : "font-bold block mb-2";

    return (
        <div className={containerClass}>
            <div className={`field ${isFilter ? 'col-12 md:col-6 mb-0' : 'col-12 md:col-6 mb-4'}`}>
                {showLabels && <label htmlFor="provincia" className={labelClass}>{t('domain:expediente.province')}</label>}
                <Dropdown 
                    id="provincia"
                    value={provinciaId} 
                    options={provincias} 
                    optionLabel={getLabel} 
                    optionValue="id" 
                    onChange={(e) => {
                        onProvinciaChange(e.value);
                        onMunicipioChange(undefined); // Reset municipio al cambiar provincia
                    }} 
                    placeholder={t('common:actions.select')} 
                    emptyMessage={t('common:messages.noOptions')} 
                    appendTo={() => document.body} 
                    disabled={disabled || isReadOnly} 
                    className="p-inputtext-sm w-full"
                    style={isFilter ? { height: '39px' } : {}}
                    showClear={isFilter} 
                />
            </div>
            <div className={`field ${isFilter ? 'col-12 md:col-6 mb-0' : 'col-12 md:col-6 mb-4'}`}>
                {showLabels && <label htmlFor="municipio" className={labelClass}>{t('domain:expediente.municipality')}</label>}
                <Dropdown 
                    id="municipio"
                    value={municipioId} 
                    options={municipios} 
                    optionLabel={getLabel} 
                    optionValue="id" 
                    onChange={(e) => onMunicipioChange(e.value)} 
                    placeholder={t('common:actions.select')} 
                    emptyMessage={t('common:messages.noOptions')} 
                    appendTo={() => document.body} 
                    disabled={disabled || !provinciaId || isReadOnly} 
                    className="p-inputtext-sm w-full"
                    style={isFilter ? { height: '39px' } : {}}
                    showClear={isFilter}
                />
            </div>
        </div>
    );
};
