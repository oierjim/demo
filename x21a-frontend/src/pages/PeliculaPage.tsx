import React, { useMemo } from 'react';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { DataTableMaintenance } from '../components/DataTableMaintenance';
import { peliculaService } from '../services/pelicula.service';
import type { Pelicula } from '../services/pelicula.service';
import { PeliculaSchema } from '../util/schemas';
import { formatZodErrors } from '../util/validation';

interface PeliculaFilters {
    titulo: string;
    genero: string | null;
    fechaEstrenoDesde: Date | null;
    fechaEstrenoHasta: Date | null;
}

const DEFAULT_FILTERS: PeliculaFilters = { 
    titulo: '', 
    genero: null, 
    fechaEstrenoDesde: null, 
    fechaEstrenoHasta: null 
};

const PeliculaPage: React.FC = () => {
    const { t, i18n } = useTranslation(['common', 'domain', 'pages', 'components']);

    const generos = useMemo(() => [
        { label: t('domain:pelicula.genres.drama'), value: 'Drama' },
        { label: t('domain:pelicula.genres.action'), value: 'Acción' },
        { label: t('domain:pelicula.genres.scifi'), value: 'Ciencia Ficción' },
        { label: t('domain:pelicula.genres.horror'), value: 'Terror' },
        { label: t('domain:pelicula.genres.suspense'), value: 'Suspense' }
    ], [t]);

    const oscarBodyTemplate = (rowData: Pelicula) => {
        return <i className={`pi ${rowData.oscar ? 'pi-star-fill text-yellow-500' : 'pi-star text-slate-300'}`} style={{ fontSize: '1.2rem' }}></i>;
    };

    const dateBodyTemplate = (rowData: Pelicula) => {
        if (!rowData.fechaEstreno) return '';
        const date = new Date(rowData.fechaEstreno);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return i18n.language === 'eu' ? `${year}/${month}/${day}` : `${day}/${month}/${year}`;
    };

    const validate = (item: any) => {
        const result = PeliculaSchema.safeParse(item);
        return result.success ? {} : formatZodErrors(result.error);
    };

    return (
        <DataTableMaintenance<Pelicula, PeliculaFilters>
            entityKey="pelicula"
            service={peliculaService}
            initialFilters={DEFAULT_FILTERS}
            validate={validate}
        >
            <DataTableMaintenance.Title title={t('pages:peliculas.title')} />

            <DataTableMaintenance.Filters>
                {(filters, setFilters) => (
                    <>
                        <div className="col-12 md:col-3">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:pelicula.title', { defaultValue: 'Título' })}</label>
                            <IconField iconPosition="left">
                                <InputIcon className="pi pi-search" />
                                <InputText value={filters.titulo} onChange={(e) => setFilters((prev: any) => ({...prev, titulo: e.target.value}))} placeholder={t('common:actions.search')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                            </IconField>
                        </div>
                        <div className="col-12 md:col-2">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:pelicula.genre', { defaultValue: 'Género' })}</label>
                            <Dropdown value={filters.genero} options={generos} onChange={(e) => setFilters((prev: any) => ({...prev, genero: e.value}))} placeholder={t('domain:status.any')} showClear className="p-inputtext-sm w-full" style={{ height: '39px' }} appendTo={() => document.body} />
                        </div>
                        <div className="col-12 md:col-2">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaEstrenoDesde')}</label>
                            <Calendar value={filters.fechaEstrenoDesde} onChange={(e) => setFilters((prev: any) => ({...prev, fechaEstrenoDesde: e.value as Date}))} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                        </div>
                        <div className="col-12 md:col-2">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaEstrenoHasta')}</label>
                            <Calendar value={filters.fechaEstrenoHasta} onChange={(e) => setFilters((prev: any) => ({...prev, fechaEstrenoHasta: e.value as Date}))} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                        </div>
                    </>
                )}
            </DataTableMaintenance.Filters>

            <DataTableMaintenance.Toolbar 
                showNew={false}
                showDelete={false}
                showExport={false}
                newItemDefault={{ titulo: '', director: '', genero: 'Drama', duracion: 120, oscar: false, fechaEstreno: new Date() } as any} 
                extraButtons={(selectedItems) => (
                    <Button 
                        label={t('pages:peliculas.viewTrailer')} 
                        icon="pi pi-external-link" 
                        severity="help" 
                        disabled={selectedItems.length !== 1} 
                        onClick={() => alert(`${t('pages:peliculas.viewTrailer')}: ${(selectedItems[0] as any).titulo}`)} 
                    />
                )}
            />

            <DataTableMaintenance.Table selectionMode="single">
                <Column field="titulo" header={t('domain:pelicula.title', { defaultValue: 'Título' })} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="director" header={t('domain:pelicula.director', { defaultValue: 'Director' })} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="genero" header={t('domain:pelicula.genre', { defaultValue: 'Género' })} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="duracion" header={t('domain:pelicula.duration', { defaultValue: 'Minutos' })} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="oscar" header="Oscar" body={oscarBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc', textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }} />
                <Column field="fechaEstreno" header={t('domain:pelicula.premiere', { defaultValue: 'Fecha' })} body={dateBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            </DataTableMaintenance.Table>

            <DataTableMaintenance.Dialog>
                {(item, setItem, errors, isReadOnly) => (
                    <>
                        <div className="field mb-4">
                            <label htmlFor="titulo" className="font-bold block mb-2">{t('domain:pelicula.title', { defaultValue: 'Título' })}</label>
                            <InputText id="titulo" value={item.titulo || ''} onChange={(e) => setItem((prev: any) => ({ ...prev, titulo: e.target.value }))} required autoFocus disabled={isReadOnly} invalid={!!errors.titulo} />
                            {errors.titulo && <small className="p-error">{errors.titulo}</small>}
                        </div>
                        <div className="field mb-4">
                            <label htmlFor="director" className="font-bold block mb-2">{t('domain:pelicula.director', { defaultValue: 'Director' })}</label>
                            <InputText id="director" value={item.director || ''} onChange={(e) => setItem((prev: any) => ({ ...prev, director: e.target.value }))} required disabled={isReadOnly} invalid={!!errors.director} />
                            {errors.director && <small className="p-error">{errors.director}</small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="genero" className="font-bold block mb-2">{t('domain:pelicula.genre', { defaultValue: 'Género' })}</label>
                                <Dropdown id="genero" value={item.genero} options={generos} onChange={(e) => setItem((prev: any) => ({ ...prev, genero: e.value }))} placeholder={t('common:actions.select')} appendTo={() => document.body} disabled={isReadOnly} />
                            </div>
                            <div className="field col-12 md:col-6">
                                <label htmlFor="duracion" className="font-bold block mb-2">{t('domain:pelicula.duration', { defaultValue: 'Duración (min)' })}</label>
                                <InputNumber id="duracion" value={item.duracion} onValueChange={(e) => setItem((prev: any) => ({ ...prev, duracion: e.value || 0 }))} suffix=" min" disabled={isReadOnly} />
                            </div>
                        </div>
                        <div className="field mb-4">
                            <label htmlFor="fechaEstreno" className="font-bold block mb-2">{t('domain:pelicula.premiere', { defaultValue: 'Fecha Estreno' })}</label>
                            <Calendar id="fechaEstreno" value={item.fechaEstreno ? new Date(item.fechaEstreno) : null} onChange={(e) => setItem((prev: any) => ({ ...prev, fechaEstreno: e.value as Date }))} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} showButtonBar showIcon disabled={isReadOnly} />
                        </div>
                        <div className="field-checkbox">
                            <Checkbox id="oscar" onChange={e => setItem((prev: any) => ({ ...prev, oscar: e.checked || false }))} checked={item.oscar || false} disabled={isReadOnly} />
                            <label htmlFor="oscar" className="ml-2 font-bold">{t('domain:pelicula.oscar', { defaultValue: '¿Tiene Oscar?' })}</label>
                        </div>
                    </>
                )}
            </DataTableMaintenance.Dialog>
        </DataTableMaintenance>
    );
};

export default PeliculaPage;
