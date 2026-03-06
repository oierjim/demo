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
        { label: 'Comedia', value: 'Comedia' },
        { label: 'Drama', value: 'Drama' },
        { label: 'Ciencia Ficción', value: 'Ciencia Ficción' },
        { label: 'Terror', value: 'Terror' },
        { label: 'Acción', value: 'Acción' }
    ], []);

    const plataformas = useMemo(() => [
        { label: 'Netflix', value: 'Netflix' },
        { label: 'HBO Max', value: 'HBO Max' },
        { label: 'Disney+', value: 'Disney+' },
        { label: 'Amazon Prime', value: 'Amazon Prime' },
        { label: 'Apple TV+', value: 'Apple TV+' }
    ], []);

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

    return (
        <DataTableTemplate<Serie, SerieFilters>
            title={t('pages:series.title')}
            entityKey="series"
            service={serieService}
            initialFilters={DEFAULT_FILTERS}
            newItemDefault={{ titulo: '', tipo: 'Comedia', plataforma: 'Netflix', fechaEstreno: new Date() }}
            filterFields={(filters, setFilters) => (
                <>
                    <div className="col-12 md:col-3">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:serie.title')}</label>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search" />
                            <InputText value={filters.titulo} onChange={(e) => setFilters({...filters, titulo: e.target.value})} placeholder={t('common:actions.search')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                        </IconField>
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:serie.type')}</label>
                        <Dropdown value={filters.tipo} options={tipos} onChange={(e) => setFilters({...filters, tipo: e.value})} placeholder={t('domain:status.any')} showClear className="p-inputtext-sm w-full" style={{ height: '39px' }} appendTo={() => document.body} />
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaEstrenoDesde')}</label>
                        <Calendar value={filters.fechaEstrenoDesde} onChange={(e) => setFilters({...filters, fechaEstrenoDesde: e.value as Date})} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaEstrenoHasta')}</label>
                        <Calendar value={filters.fechaEstrenoHasta} onChange={(e) => setFilters({...filters, fechaEstrenoHasta: e.value as Date})} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                </>
            )}
            dialogFields={(item, setItem, isReadOnly) => (
                <>
                    <div className="field mb-4">
                        <label htmlFor="titulo" className="font-bold block mb-2">{t('domain:serie.title')}</label>
                        <InputText id="titulo" value={item.titulo || ''} onChange={(e) => setItem({ ...item, titulo: e.target.value })} required autoFocus className={!item.titulo ? 'p-invalid' : ''} disabled={isReadOnly} />
                    </div>
                    <div className="field mb-4">
                        <label htmlFor="tipo" className="font-bold block mb-2">{t('domain:serie.type')}</label>
                        <Dropdown id="tipo" value={item.tipo} options={tipos} onChange={(e) => setItem({ ...item, tipo: e.value })} placeholder={t('common:actions.select')} emptyMessage={t('common:messages.noOptions')} appendTo={() => document.body} disabled={isReadOnly} />
                    </div>
                    <div className="field mb-4">
                        <label htmlFor="plataforma" className="font-bold block mb-2">{t('domain:serie.platform')}</label>
                        <Dropdown id="plataforma" value={item.plataforma} options={plataformas} onChange={(e) => setItem({ ...item, plataforma: e.value })} placeholder={t('common:actions.select')} emptyMessage={t('common:messages.noOptions')} appendTo={() => document.body} disabled={isReadOnly} />
                    </div>
                    <div className="field">
                        <label htmlFor="fechaEstreno" className="font-bold block mb-2">{t('domain:serie.premiere')}</label>
                        <Calendar id="fechaEstreno" value={item.fechaEstreno ? new Date(item.fechaEstreno) : null} onChange={(e) => setItem({ ...item, fechaEstreno: e.value as Date })} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} placeholder={t('components:calendar.placeholder')} showOnFocus={true} appendTo={() => document.body} showButtonBar showIcon disabled={isReadOnly} />
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
