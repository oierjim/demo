import React, { useRef, useMemo, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import { useMaintenance } from '../hooks/useMaintenance';
import { personaService } from '../services/persona.service';
import type { Persona } from '../services/persona.service';

interface PersonaFilters {
    dni: string;
    nombre: string;
    fechaNacimientoDesde: Date | null;
    fechaNacimientoHasta: Date | null;
}

const DEFAULT_FILTERS: PersonaFilters = { dni: '', nombre: '', fechaNacimientoDesde: null, fechaNacimientoHasta: null };

const PersonaPage: React.FC = () => {
    const { t, i18n } = useTranslation(['common', 'domain', 'pages', 'components']);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Persona[]>>(null);

    const {
        filteredData, totalRecords, selectedItems, setSelectedItems,
        selectAllPages, deselectedItems, onSelectionChange,
        handleSelectAllPages, handleClearSelection,
        isLoading, itemDialog, item, setItem,
        filters, setFilters, page, rows, sortField, sortOrder, onPage, onSort,
        handleApplyFilters, handleClearFilters, openNew, openEdit,
        closeDialog, saveItem, deleteSelected, isSaving
    } = useMaintenance<Persona, PersonaFilters>({
        entityKey: 'personas',
        service: personaService,
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

    const dateBodyTemplate = useCallback((rowData: Persona) => {
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
        if (e.key === 'Enter') handleApplyFilters();
    };

    return (
        <div className="maintenance-view animate-fadein">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <div className="flex align-items-center justify-content-between mb-4">
                <h1 className="text-3xl font-bold m-0 text-slate-800 tracking-tight">{t('pages:personas.title')}</h1>
            </div>

            <Card className="mb-4 card">
                <div className="grid align-items-end" onKeyDown={onFilterKeyDown}>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaNacimientoDesde')}</label>
                        <Calendar value={filters.fechaNacimientoDesde} onChange={(e) => setFilters({...filters, fechaNacimientoDesde: e.value as Date})} placeholder={t('components:calendar.placeholder')} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaNacimientoHasta')}</label>
                        <Calendar value={filters.fechaNacimientoHasta} onChange={(e) => setFilters({...filters, fechaNacimientoHasta: e.value as Date})} placeholder={t('components:calendar.placeholder')} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:persona.dni')}</label>
                        <InputText value={filters.dni} onChange={(e) => setFilters({...filters, dni: e.target.value})} placeholder="12345678X" className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                    </div>
                    <div className="col-12 md:col-3">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:persona.nombre')}</label>
                        <InputText value={filters.nombre} onChange={(e) => setFilters({...filters, nombre: e.target.value})} placeholder={t('domain:persona.nombre')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                    </div>
                    <div className="col-12 md:col-3 flex gap-2">
                        <Button label={t('common:actions.filter')} icon="pi pi-search" className="p-button-sm px-3" outlined onClick={handleApplyFilters} style={{ height: '39px', width: 'auto' }} />
                        <Button label={t('common:actions.clean')} icon="pi pi-filter-slash" className="p-button-sm p-button-secondary px-3" outlined onClick={() => handleClearFilters(DEFAULT_FILTERS)} style={{ height: '39px', width: 'auto' }} />
                    </div>
                </div>
            </Card>

            <Toolbar className="mb-4 bg-transparent border-none p-0" left={
                <div className="flex flex-wrap gap-2">
                    <Button label={t('common:actions.new')} icon="pi pi-plus" severity="success" onClick={() => openNew({ dni: '', nombre: '', apellido1: '', apellido2: '', email: '', fechaNacimiento: new Date() })} raised />
                    <Button label={t('common:actions.edit')} icon="pi pi-pencil" severity="info" disabled={selectedItems.length !== 1} onClick={() => openEdit(selectedItems[0])} />
                    <Button label={t('common:actions.delete')} icon="pi pi-trash" severity="danger" disabled={selectedItems.length === 0 && !selectAllPages} onClick={confirmDelete} />
                </div>
            } right={
                <Button label={t('common:actions.export')} icon="pi pi-upload" severity="secondary" onClick={() => dt.current?.exportCSV()} text />
            }></Toolbar>

            {selectedItems.length > 0 && selectedItems.length === filteredData.length && !selectAllPages && totalRecords > filteredData.length && (
                <div className="bg-slate-100 border-round-xl p-3 mb-3 flex align-items-center justify-content-center shadow-1 animate-fadein border-1 border-slate-200">
                    <i className="pi pi-info-circle text-slate-600 mr-3" style={{ fontSize: '1.2rem' }}></i>
                    <span className="text-slate-700 mr-2 text-sm font-medium">
                        {t('pages:selection.pageSelected', { count: selectedItems.length })}
                    </span>
                    <Button label={t('pages:selection.selectAll', { total: totalRecords })} className="p-button-link p-0 font-bold text-sm text-blue-600 hover:underline" onClick={handleSelectAllPages} />
                </div>
            )}

            {selectAllPages && (
                <div className="bg-slate-800 border-round-xl p-3 mb-3 flex align-items-center justify-content-center shadow-2 animate-fadein text-slate-300 border-1 border-slate-900">
                    <i className="pi pi-check-circle text-green-400 mr-3" style={{ fontSize: '1.2rem' }}></i>
                    <span className="mr-3 text-sm font-medium">
                        {t('pages:selection.allSelected', { total: totalRecords })}
                        {deselectedItems.length > 0 && t('pages:selection.exceptions', { count: deselectedItems.length })}
                    </span>
                    <Button label={t('pages:selection.clear')} className="p-button-link p-0 text-slate-300 underline font-bold text-sm hover:text-white" onClick={handleClearSelection} />
                </div>
            )}

            <div className="p-datatable-container shadow-3 border-round-xl bg-white mb-8">
                <DataTable key={i18n.language} ref={dt} value={filteredData} lazy paginator first={page * rows} rows={rows} totalRecords={totalRecords} onPage={onPage} onSort={onSort} sortField={sortField || ''} sortOrder={sortOrder as any} selectionMode="multiple" selection={selectedItems} onSelectionChange={onSelectionChange} rowsPerPageOptions={[20, 50, 100]} dataKey="id" className="p-datatable-sm" stripedRows rowHover responsiveLayout="scroll" emptyMessage={t('common:messages.noData')} loading={isLoading}
                    paginatorLeft={<span className="text-xs text-slate-400 ml-2">{t('components:paginator.selected', { count: selectAllPages ? totalRecords - deselectedItems.length : selectedItems.length })}</span>}
                    paginatorRight={<span className="text-xs text-slate-400 mr-2">{t('components:paginator.total', { count: totalRecords })}</span>}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" paginatorDropdownAppendTo="self">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem', backgroundColor: '#f8fafc' }}></Column>
                    <Column field="dni" header={t('domain:persona.dni')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                    <Column field="nombre" header={t('domain:persona.nombre')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                    <Column field="apellido1" header={t('domain:persona.apellido1')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                    <Column field="apellido2" header={t('domain:persona.apellido2')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                    <Column field="fechaNacimiento" header={t('domain:persona.fechaNacimiento')} body={dateBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                    <Column field="email" header={t('domain:persona.email')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                </DataTable>
            </div>

            <Dialog visible={itemDialog} style={{ width: '600px' }} header={t('pages:personas.dialogTitle')} modal className="p-fluid" footer={dialogFooter} onHide={closeDialog}>
                <div className="formgrid grid">
                    <div className="field col-12 md:col-4">
                        <label htmlFor="dni" className="font-bold block mb-2">{t('domain:persona.dni')}</label>
                        <InputText id="dni" value={item.dni || ''} onChange={(e) => setItem({ ...item, dni: e.target.value })} required autoFocus />
                    </div>
                    <div className="field col-12 md:col-8">
                        <label htmlFor="nombre" className="font-bold block mb-2">{t('domain:persona.nombre')}</label>
                        <InputText id="nombre" value={item.nombre || ''} onChange={(e) => setItem({ ...item, nombre: e.target.value })} required />
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="apellido1" className="font-bold block mb-2">{t('domain:persona.apellido1')}</label>
                        <InputText id="apellido1" value={item.apellido1 || ''} onChange={(e) => setItem({ ...item, apellido1: e.target.value })} required />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="apellido2" className="font-bold block mb-2">{t('domain:persona.apellido2')}</label>
                        <InputText id="apellido2" value={item.apellido2 || ''} onChange={(e) => setItem({ ...item, apellido2: e.target.value })} />
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="fechaNac" className="font-bold block mb-2">{t('domain:persona.fechaNacimiento')}</label>
                        <Calendar id="fechaNac" value={item.fechaNacimiento instanceof Date ? item.fechaNacimiento : (item.fechaNacimiento ? new Date(item.fechaNacimiento) : null)} onChange={(e) => setItem({ ...item, fechaNacimiento: e.value as Date })} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} placeholder={t('components:calendar.placeholder')} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="email" className="font-bold block mb-2">{t('domain:persona.email')}</label>
                        <InputText id="email" value={item.email || ''} onChange={(e) => setItem({ ...item, email: e.target.value })} required />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default PersonaPage;