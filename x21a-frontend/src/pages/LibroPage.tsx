import React from 'react';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Rating } from 'primereact/rating';
import { useTranslation } from 'react-i18next';
import { DataTableMaintenance } from '../components/DataTableMaintenance';
import { libroService } from '../services/libro.service';
import type { Libro } from '../services/libro.service';

interface LibroFilters {
    isbn: string;
    titulo: string;
    autor: string;
}

const DEFAULT_FILTERS: LibroFilters = { isbn: '', titulo: '', autor: '' };

const LibroPage: React.FC = () => {
    const { t, i18n } = useTranslation(['common', 'domain', 'pages', 'components']);

    const dateBodyTemplate = (rowData: Libro) => {
        if (!rowData.fechaPublicacion) return '';
        const date = new Date(rowData.fechaPublicacion);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return i18n.language === 'eu' ? `${year}/${month}/${day}` : `${day}/${month}/${year}`;
    };

    const ratingBodyTemplate = (rowData: Libro) => {
        return <Rating value={rowData.estrellas} readOnly cancel={false} />;
    };

    const validate = (item: Partial<Libro>) => {
        const errors: Record<string, string> = {};
        if (!item.isbn) errors.isbn = t('common:messages.required');
        if (!item.titulo) errors.titulo = t('common:messages.required');
        if (!item.autor) errors.autor = t('common:messages.required');
        return errors;
    };

    return (
        <DataTableMaintenance<Libro, LibroFilters>
            entityKey="libros"
            service={libroService}
            initialFilters={DEFAULT_FILTERS}
            validate={validate}
        >
            <DataTableMaintenance.Title title={t('pages:libros.title')} />

            <DataTableMaintenance.Filters>
                {(filters, setFilters) => (
                    <>
                        <div className="col-12 md:col-3">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:libro.isbn')}</label>
                            <InputText value={filters.isbn} onChange={(e) => setFilters(prev => ({...prev, isbn: e.target.value}))} placeholder="ISBN" className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                        </div>
                        <div className="col-12 md:col-3">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:libro.titulo')}</label>
                            <InputText value={filters.titulo} onChange={(e) => setFilters(prev => ({...prev, titulo: e.target.value}))} placeholder={t('domain:libro.titulo')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                        </div>
                        <div className="col-12 md:col-3">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:libro.autor')}</label>
                            <InputText value={filters.autor} onChange={(e) => setFilters(prev => ({...prev, autor: e.target.value}))} placeholder={t('domain:libro.autor')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                        </div>
                    </>
                )}
            </DataTableMaintenance.Filters>

            <DataTableMaintenance.Toolbar 
                showExport 
                entityNameKey="libro"
                newItemDefault={{ isbn: '', titulo: '', autor: '', estrellas: 3, fechaPublicacion: new Date() }} 
            />

            <DataTableMaintenance.Table selectionMode="multiple">
                <Column selectionMode="multiple" headerStyle={{ width: '3rem', backgroundColor: '#f8fafc' }}></Column>
                <Column field="isbn" header={t('domain:libro.isbn')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="titulo" header={t('domain:libro.titulo')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="autor" header={t('domain:libro.autor')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="estrellas" header={t('domain:libro.estrellas')} body={ratingBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="fechaPublicacion" header={t('domain:libro.fechaPublicacion')} body={dateBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            </DataTableMaintenance.Table>

            <DataTableMaintenance.Dialog width="500px" entityNameKey="libro">
                {(item, setItem, errors, isReadOnly) => (
                    <>
                        <div className="field mb-4">
                            <label htmlFor="isbn" className="font-bold block mb-2">{t('domain:libro.isbn')}</label>
                            <InputText id="isbn" value={item.isbn || ''} onChange={(e) => setItem(prev => ({ ...prev, isbn: e.target.value, id: e.target.value }))} required autoFocus disabled={isReadOnly} invalid={!!errors.isbn} />
                            {errors.isbn && <small className="p-error">{errors.isbn}</small>}
                        </div>
                        <div className="field mb-4">
                            <label htmlFor="titulo" className="font-bold block mb-2">{t('domain:libro.titulo')}</label>
                            <InputText id="titulo" value={item.titulo || ''} onChange={(e) => setItem(prev => ({ ...prev, titulo: e.target.value }))} required disabled={isReadOnly} invalid={!!errors.titulo} />
                            {errors.titulo && <small className="p-error">{errors.titulo}</small>}
                        </div>
                        <div className="field mb-4">
                            <label htmlFor="autor" className="font-bold block mb-2">{t('domain:libro.autor')}</label>
                            <InputText id="autor" value={item.autor || ''} onChange={(e) => setItem(prev => ({ ...prev, autor: e.target.value }))} required disabled={isReadOnly} invalid={!!errors.autor} />
                            {errors.autor && <small className="p-error">{errors.autor}</small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="fechaPub" className="font-bold block mb-2">{t('domain:libro.fechaPublicacion')}</label>
                                <Calendar id="fechaPub" value={item.fechaPublicacion ? new Date(item.fechaPublicacion) : null} onChange={(e) => setItem(prev => ({ ...prev, fechaPublicacion: e.value as Date }))} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} placeholder={t('components:calendar.placeholder')} showOnFocus={true} appendTo={() => document.body} disabled={isReadOnly} />
                            </div>
                            <div className="field col-12 md:col-6">
                                <label htmlFor="estrellas" className="font-bold block mb-2">{t('domain:libro.estrellas')}</label>
                                <div className="flex align-items-center h-full" style={{ minHeight: '39px' }}>
                                    <Rating id="estrellas" value={item.estrellas} onChange={(e) => setItem(prev => ({ ...prev, estrellas: e.value || 0 }))} cancel={false} disabled={isReadOnly} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DataTableMaintenance.Dialog>
        </DataTableMaintenance>
    );
};

export default LibroPage;
