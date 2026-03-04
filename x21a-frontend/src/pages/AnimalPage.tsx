import React, { useRef, useMemo, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import { useMaintenance } from '../hooks/useMaintenance';
import { animalService } from '../services/animal.service';
import type { Animal } from '../services/animal.service';

interface AnimalFilters {
    nombre: string;
    raza: string;
}

const DEFAULT_FILTERS: AnimalFilters = { nombre: '', raza: '' };

const AnimalPage: React.FC = () => {
    const { t, i18n } = useTranslation(['common', 'domain', 'pages', 'components']);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Animal[]>>(null);

    const {
        filteredData, totalRecords, selectedItems, setSelectedItems, isLoading, itemDialog, item, setItem,
        filters, setFilters, page, rows, sortField, sortOrder, onPage, onSort,
        handleApplyFilters, handleClearFilters, openNew, openEdit,
        closeDialog, saveItem, deleteSelected, isSaving
    } = useMaintenance<Animal, AnimalFilters>({
        entityKey: 'animales',
        service: animalService,
        initialFilters: DEFAULT_FILTERS,
        onSuccess: (msg) => toast.current?.show({ severity: 'success', summary: t('common:messages.success'), detail: msg, life: 3000 }),
        onError: (msg) => toast.current?.show({ severity: 'error', summary: t('common:messages.error'), detail: msg, life: 3000 })
    });

    const confirmDelete = useCallback(() => {
        confirmDialog({
            message: t('common:messages.confirmDelete'),
            header: t('common:messages.deleteTitle'),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: t('common:labels.yes'),
            rejectLabel: t('common:labels.no'),
            accept: deleteSelected
        });
    }, [t, deleteSelected]);

    const dateBodyTemplate = useCallback((rowData: Animal) => {
        const date = new Date(rowData.fechaNacimiento);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return i18n.language === 'eu' ? `${year}/${month}/${day}` : `${day}/${month}/${year}`;
    }, [i18n.language]);

    const dialogFooter = useMemo(() => (
        <React.Fragment>
            <Button label={t('common:actions.cancel')} icon="pi pi-times" outlined onClick={closeDialog} />
            <Button label={t('common:actions.save')} icon="pi pi-check" onClick={saveItem} loading={isSaving} />
        </React.Fragment>
    ), [t, closeDialog, saveItem, isSaving]);

    const onFilterKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleApplyFilters();
        }
    };

    return (
        <div className="maintenance-view animate-fadein">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <div className="flex align-items-center justify-content-between mb-4">
                <h1 className="text-3xl font-bold m-0 text-slate-800 tracking-tight">{t('pages:animales.title')}</h1>
            </div>

            <Card className="mb-4 card">
                <div className="grid align-items-end" onKeyDown={onFilterKeyDown}>
                    <div className="col-12 md:col-3">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:animal.nombre')}</label>
                        <InputText value={filters.nombre} onChange={(e) => setFilters({...filters, nombre: e.target.value})} placeholder={t('domain:animal.nombre')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                    </div>
                    <div className="col-12 md:col-3">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:animal.raza')}</label>
                        <InputText value={filters.raza} onChange={(e) => setFilters({...filters, raza: e.target.value})} placeholder={t('domain:animal.raza')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                    </div>
                    <div className="col-12 md:col-6 flex gap-2">
                        <Button label={t('common:actions.filter')} icon="pi pi-search" className="p-button-sm px-3" outlined onClick={handleApplyFilters} style={{ height: '39px', width: 'auto' }} />
                        <Button label={t('common:actions.clean')} icon="pi pi-filter-slash" className="p-button-sm p-button-secondary px-3" outlined onClick={() => handleClearFilters(DEFAULT_FILTERS)} style={{ height: '39px', width: 'auto' }} />
                    </div>
                </div>
            </Card>

            <Toolbar className="mb-4 bg-transparent border-none p-0" left={
                <div className="flex flex-wrap gap-2">
                    <Button label={t('common:actions.new')} icon="pi pi-plus" severity="success" onClick={() => openNew({ nombre: '', raza: '', peso: 0, altura: 0, fechaNacimiento: new Date() })} raised />
                    <Button label={t('common:actions.edit')} icon="pi pi-pencil" severity="info" disabled={selectedItems.length !== 1} onClick={() => openEdit(selectedItems[0])} />
                    <Button label={t('common:actions.delete')} icon="pi pi-trash" severity="danger" disabled={selectedItems.length === 0} onClick={confirmDelete} />
                </div>
            } right={
                <Button label={t('common:actions.export')} icon="pi pi-upload" severity="secondary" onClick={() => dt.current?.exportCSV()} text />
            }></Toolbar>

            <div className="p-datatable-container shadow-3 border-round-xl bg-white mb-8">
                <DataTable key={i18n.language} ref={dt} value={filteredData} lazy paginator first={page * rows} rows={rows} totalRecords={totalRecords} onPage={onPage} onSort={onSort} sortField={sortField || ''} sortOrder={sortOrder as any} selectionMode="multiple" selection={selectedItems} onSelectionChange={(e) => setSelectedItems(e.value)} rowsPerPageOptions={[20, 50, 100]} dataKey="id" className="p-datatable-sm" stripedRows rowHover responsiveLayout="scroll" emptyMessage={t('common:messages.noData')} loading={isLoading}
                    paginatorLeft={<span className="text-xs text-slate-400 ml-2">{t('components:paginator.selected', { count: selectedItems.length })}</span>}
                    paginatorRight={<span className="text-xs text-slate-400 mr-2">{t('components:paginator.total', { count: totalRecords })}</span>}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" paginatorDropdownAppendTo="self">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem', backgroundColor: '#f8fafc' }}></Column>
                    <Column field="nombre" header={t('domain:animal.nombre')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                    <Column field="raza" header={t('domain:animal.raza')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                    <Column field="fechaNacimiento" header={t('domain:animal.fechaNacimiento')} body={dateBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                    <Column field="peso" header={t('domain:animal.peso')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                    <Column field="altura" header={t('domain:animal.altura')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                </DataTable>
            </div>

            <Dialog visible={itemDialog} style={{ width: '500px' }} header={t('pages:animales.dialogTitle')} modal className="p-fluid" footer={dialogFooter} onHide={closeDialog}>
                <div className="field mb-4">
                    <label htmlFor="nombre" className="font-bold block mb-2">{t('domain:animal.nombre')}</label>
                    <InputText id="nombre" value={item.nombre || ''} onChange={(e) => setItem({ ...item, nombre: e.target.value })} required autoFocus />
                </div>
                <div className="field mb-4">
                    <label htmlFor="raza" className="font-bold block mb-2">{t('domain:animal.raza')}</label>
                    <InputText id="raza" value={item.raza || ''} onChange={(e) => setItem({ ...item, raza: e.target.value })} required />
                </div>
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="fechaNac" className="font-bold block mb-2">{t('domain:animal.fechaNacimiento')}</label>
                        <Calendar id="fechaNac" value={item.fechaNacimiento instanceof Date ? item.fechaNacimiento : (item.fechaNacimiento ? new Date(item.fechaNacimiento) : null)} onChange={(e) => setItem({ ...item, fechaNacimiento: e.value as Date })} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} placeholder={t('components:calendar.placeholder')} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                    <div className="field col-6 md:col-3">
                        <label htmlFor="peso" className="font-bold block mb-2">{t('domain:animal.peso')}</label>
                        <InputNumber id="peso" value={item.peso} onValueChange={(e) => setItem({ ...item, peso: e.value || 0 })} mode="decimal" minFractionDigits={1} maxFractionDigits={2} />
                    </div>
                    <div className="field col-6 md:col-3">
                        <label htmlFor="altura" className="font-bold block mb-2">{t('domain:animal.altura')}</label>
                        <InputNumber id="altura" value={item.altura} onValueChange={(e) => setItem({ ...item, altura: e.value || 0 })} mode="decimal" minFractionDigits={0} maxFractionDigits={1} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default AnimalPage;