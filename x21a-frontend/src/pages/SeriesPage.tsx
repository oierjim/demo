import React, { useMemo } from 'react';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { useTranslation } from 'react-i18next';
import { DataTableTemplate } from '../components/DataTableTemplate';
import { serieService } from '../services/serie.service';
import type { Serie } from '../services/serie.service';

interface SerieFilters {
    titulo: string;
    tipo: string | null;
    plataforma: string | null;
    fechaEstrenoDesde: Date | null;
    fechaEstrenoHasta: Date | null;
}

const DEFAULT_FILTERS: SerieFilters = { 
    titulo: '', 
    tipo: null, 
    plataforma: null, 
    fechaEstrenoDesde: null, 
    fechaEstrenoHasta: null 
};

const SeriesPage: React.FC = () => {
    const { t, i18n } = useTranslation(['common', 'domain', 'pages', 'components']);

    const tipos = useMemo(() => [
        { label: t('domain:pelicula.genres.comedy'), value: 'Comedia' },
        { label: t('domain:pelicula.genres.drama'), value: 'Drama' },
        { label: t('domain:pelicula.genres.scifi'), value: 'Ciencia Ficción' },
        { label: t('domain:pelicula.genres.horror'), value: 'Terror' },
        { label: t('domain:pelicula.genres.action'), value: 'Acción' }
    ], [t]);

    const plataformas = useMemo(() => [
        { label: t('domain:platforms.netflix'), value: 'Netflix' },
        { label: t('domain:platforms.hbo'), value: 'HBO Max' },
        { label: t('domain:platforms.disney'), value: 'Disney+' },
        { label: t('domain:platforms.amazon'), value: 'Amazon Prime' },
        { label: t('domain:platforms.apple'), value: 'Apple TV+' }
    ], [t]);

    const tipoBodyTemplate = (rowData: Serie) => {
        const iconMap: any = { 'Comedia': '😂', 'Drama': '😢', 'Ciencia Ficción': '👽', 'Terror': '👻', 'Acción': '💥' };
        return (
            <div className="flex align-items-center gap-2">
                <span style={{ fontSize: '1.2rem' }}>{iconMap[rowData.tipo] || '📺'}</span>
                <span>{rowData.tipo}</span>
            </div>
        );
    };

    const dateBodyTemplate = (rowData: Serie) => {
        if (!rowData.fechaEstreno) return '';
        const date = new Date(rowData.fechaEstreno);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return i18n.language === 'eu' ? `${year}/${month}/${day}` : `${day}/${month}/${year}`;
    };

    const validate = (item: Partial<Serie>) => {
        const errors: Record<string, string> = {};
        if (!item.titulo) errors.titulo = t('common:messages.required');
        return errors;
    };

    return (
        <DataTableTemplate<Serie, SerieFilters>
            title={t('pages:series.title')}
            entityKey="serie"
            service={serieService}
            initialFilters={DEFAULT_FILTERS}
            newItemDefault={{ titulo: '', tipo: 'Comedia', plataforma: 'Netflix', fechaEstreno: new Date() }}
            validate={validate}
            filterFields={(filters, setFilters) => (
                <>
                    <div className="col-12 md:col-3">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:serie.title')}</label>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search" />
                            <InputText value={filters.titulo} onChange={(e) => setFilters(prev => ({...prev, titulo: e.target.value}))} placeholder={t('common:actions.search')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                        </IconField>
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:serie.type')}</label>
                        <Dropdown value={filters.tipo} options={tipos} onChange={(e) => setFilters(prev => ({...prev, tipo: e.value}))} placeholder={t('domain:status.any')} showClear className="p-inputtext-sm w-full" style={{ height: '39px' }} appendTo={() => document.body} />
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaEstrenoDesde')}</label>
                        <Calendar value={filters.fechaEstrenoDesde} onChange={(e) => setFilters(prev => ({...prev, fechaEstrenoDesde: e.value as Date}))} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaEstrenoHasta')}</label>
                        <Calendar value={filters.fechaEstrenoHasta} onChange={(e) => setFilters(prev => ({...prev, fechaEstrenoHasta: e.value as Date}))} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                </>
            )}
            dialogFields={(item, setItem, errors, isReadOnly) => (
                <>
                    <div className="field mb-4">
                        <label htmlFor="titulo" className="font-bold block mb-2">{t('domain:serie.title')}</label>
                        <InputText id="titulo" value={item.titulo || ''} onChange={(e) => setItem(prev => ({ ...prev, titulo: e.target.value }))} required autoFocus disabled={isReadOnly} invalid={!!errors.titulo} />
                        {errors.titulo && <small className="p-error">{errors.titulo}</small>}
                    </div>
                    <div className="field mb-4">
                        <label htmlFor="tipo" className="font-bold block mb-2">{t('domain:serie.type')}</label>
                        <Dropdown id="tipo" value={item.tipo} options={tipos} onChange={(e) => setItem(prev => ({ ...prev, tipo: e.value }))} placeholder={t('common:actions.select')} emptyMessage={t('common:messages.noOptions')} appendTo={() => document.body} disabled={isReadOnly} />
                    </div>
                    <div className="field mb-4">
                        <label htmlFor="plataforma" className="font-bold block mb-2">{t('domain:serie.platform')}</label>
                        <Dropdown id="plataforma" value={item.plataforma} options={plataformas} onChange={(e) => setItem(prev => ({ ...prev, plataforma: e.value }))} placeholder={t('common:actions.select')} emptyMessage={t('common:messages.noOptions')} appendTo={() => document.body} disabled={isReadOnly} />
                    </div>
                    <div className="field">
                        <label htmlFor="fechaEstreno" className="font-bold block mb-2">{t('domain:serie.premiere')}</label>
                        <Calendar id="fechaEstreno" value={item.fechaEstreno ? new Date(item.fechaEstreno) : null} onChange={(e) => setItem(prev => ({ ...prev, fechaEstreno: e.value as Date }))} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} placeholder={t('components:calendar.placeholder')} showOnFocus={true} appendTo={() => document.body} showButtonBar showIcon disabled={isReadOnly} />
                    </div>
                </>
            )}
        >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem', backgroundColor: '#f8fafc' }}></Column>
            <Column field="titulo" header={t('domain:serie.title')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            <Column field="tipo" header={t('domain:serie.type')} body={tipoBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            <Column field="plataforma" header={t('domain:serie.platform')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            <Column field="fechaEstreno" header={t('domain:serie.premiere')} body={dateBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
        </DataTableTemplate>
    );
};

export default SeriesPage;
