import React from 'react';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { useTranslation } from 'react-i18next';
import { DataTableMaintenance } from '../components/DataTableMaintenance';
import { animalService } from '../services/animal.service';
import type { Animal } from '../services/animal.service';

interface AnimalFilters {
    nombre: string;
    raza: string;
}

const DEFAULT_FILTERS: AnimalFilters = { nombre: '', raza: '' };

const AnimalPage: React.FC = () => {
    const { t, i18n } = useTranslation(['common', 'domain', 'pages', 'components']);

    const dateBodyTemplate = (rowData: Animal) => {
        const date = new Date(rowData.fechaNacimiento);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return i18n.language === 'eu' ? `${year}/${month}/${day}` : `${day}/${month}/${year}`;
    };

    const validate = (item: Partial<Animal>) => {
        const errors: Record<string, string> = {};
        if (!item.nombre) errors.nombre = t('common:messages.required');
        if (!item.raza) errors.raza = t('common:messages.required');
        return errors;
    };

    return (
        <DataTableMaintenance<Animal, AnimalFilters>
            entityKey="animales"
            service={animalService}
            initialFilters={DEFAULT_FILTERS}
            validate={validate}
        >
            <DataTableMaintenance.Title title={t('pages:animales.title')} />

            <DataTableMaintenance.Filters>
                {(filters, setFilters) => (
                    <>
                        <div className="col-12 md:col-2">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:animal.nombre')}</label>
                            <InputText value={filters.nombre} onChange={(e) => setFilters(prev => ({...prev, nombre: e.target.value}))} placeholder={t('domain:animal.nombre')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                        </div>
                        <div className="col-12 md:col-2">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:animal.raza')}</label>
                            <InputText value={filters.raza} onChange={(e) => setFilters(prev => ({...prev, raza: e.target.value}))} placeholder={t('domain:animal.raza')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                        </div>
                    </>
                )}
            </DataTableMaintenance.Filters>

            <DataTableMaintenance.Toolbar 
                showExport 
                newItemDefault={{ nombre: '', raza: '', peso: 0, altura: 0, fechaNacimiento: new Date() }} 
            />

            <DataTableMaintenance.Table selectionMode="multiple">
                <Column selectionMode="multiple" headerStyle={{ width: '3rem', backgroundColor: '#f8fafc' }}></Column>
                <Column field="nombre" header={t('domain:animal.nombre')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="raza" header={t('domain:animal.raza')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="fechaNacimiento" header={t('domain:animal.fechaNacimiento')} body={dateBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="peso" header={t('domain:animal.peso')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="altura" header={t('domain:animal.altura')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            </DataTableMaintenance.Table>

            <DataTableMaintenance.Dialog width="500px">
                {(item, setItem, errors, isReadOnly) => (
                    <>
                        <div className="field mb-4">
                            <label htmlFor="nombre" className="font-bold block mb-2">{t('domain:animal.nombre')}</label>
                            <InputText id="nombre" value={item.nombre || ''} onChange={(e) => setItem(prev => ({ ...prev, nombre: e.target.value }))} required autoFocus disabled={isReadOnly} invalid={!!errors.nombre} />
                            {errors.nombre && <small className="p-error">{errors.nombre}</small>}
                        </div>
                        <div className="field mb-4">
                            <label htmlFor="raza" className="font-bold block mb-2">{t('domain:animal.raza')}</label>
                            <InputText id="raza" value={item.raza || ''} onChange={(e) => setItem(prev => ({ ...prev, raza: e.target.value }))} required disabled={isReadOnly} invalid={!!errors.raza} />
                            {errors.raza && <small className="p-error">{errors.raza}</small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="fechaNac" className="font-bold block mb-2">{t('domain:animal.fechaNacimiento')}</label>
                                <Calendar id="fechaNac" value={item.fechaNacimiento instanceof Date ? item.fechaNacimiento : (item.fechaNacimiento ? new Date(item.fechaNacimiento) : null)} onChange={(e) => setItem(prev => ({ ...prev, fechaNacimiento: e.value as Date }))} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} placeholder={t('components:calendar.placeholder')} showOnFocus={true} appendTo={() => document.body} disabled={isReadOnly} />
                            </div>
                            <div className="field col-6 md:col-3">
                                <label htmlFor="peso" className="font-bold block mb-2">{t('domain:animal.peso')}</label>
                                <InputNumber id="peso" value={item.peso} onValueChange={(e) => setItem(prev => ({ ...prev, peso: e.value || 0 }))} mode="decimal" minFractionDigits={1} maxFractionDigits={2} disabled={isReadOnly} />
                            </div>
                            <div className="field col-6 md:col-3">
                                <label htmlFor="altura" className="font-bold block mb-2">{t('domain:animal.altura')}</label>
                                <InputNumber id="altura" value={item.altura} onValueChange={(e) => setItem(prev => ({ ...prev, altura: e.value || 0 }))} mode="decimal" minFractionDigits={0} maxFractionDigits={1} disabled={isReadOnly} />
                            </div>
                        </div>
                    </>
                )}
            </DataTableMaintenance.Dialog>
        </DataTableMaintenance>
    );
};

export default AnimalPage;
