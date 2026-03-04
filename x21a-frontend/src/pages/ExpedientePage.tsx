import React, { useRef, useMemo, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import { useMaintenance } from '../hooks/useMaintenance';
import { expedienteService } from '../services/expediente.service';
import type { Expediente } from '../services/expediente.service';

interface ExpedienteFilters {
    referencia: string;
    estado: string | null;
    fechaAperturaDesde: Date | null;
    fechaAperturaHasta: Date | null;
}

const DEFAULT_FILTERS: ExpedienteFilters = { referencia: '', estado: null, fechaAperturaDesde: null, fechaAperturaHasta: null };

const MaintenancePage: React.FC = () => {
    const { t, i18n } = useTranslation(['common', 'domain', 'pages', 'components']);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Expediente[]>>(null);

    const {
        filteredData, totalRecords, selectedItems, setSelectedItems,
        selectAllPages, deselectedItems, onSelectionChange,
        handleSelectAllPages, handleClearSelection,
        isLoading, itemDialog, item, setItem,
        filters, setFilters, page, rows, sortField, sortOrder, onPage, onSort,
        handleApplyFilters, handleClearFilters, openNew, openEdit,
        closeDialog, saveItem, deleteSelected, isSaving
    } = useMaintenance<Expediente, ExpedienteFilters>({
        entityKey: 'expedientes',
        service: expedienteService,
        initialFilters: DEFAULT_FILTERS,
        onSuccess: (msg) => toast.current?.show({ severity: 'success', summary: t('common:messages.success'), detail: msg, life: 3000 }),
        onError: (msg) => toast.current?.show({ severity: 'error', summary: t('common:messages.error'), detail: msg, life: 3000 })
    });

    const estados = useMemo(() => [
        { label: t('domain:status.open'), value: 'Abierto' },
        { label: t('domain:status.pending'), value: 'Pendiente' },
        { label: t('domain:status.closed'), value: 'Cerrado' },
        { label: t('domain:status.inProcess'), value: 'En Proceso' }
    ], [t]);

    const getStatusLabel = useCallback((status: string) => {
        return estados.find(e => e.value === status)?.label || status;
    }, [estados]);

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

    const statusBodyTemplate = useCallback((rowData: Expediente) => {
        const severityMap: any = { 'Abierto': 'info', 'En Proceso': 'warning', 'Pendiente': 'secondary', 'Cerrado': 'success' };
        return <Tag value={getStatusLabel(rowData.estado)} severity={severityMap[rowData.estado]} className="px-3 py-1 font-semibold" style={{ borderRadius: '6px' }} />;
    }, [getStatusLabel]);

    const dateBodyTemplate = useCallback((rowData: Expediente) => {
        const date = new Date(rowData.fechaApertura);
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
                <h1 className="text-3xl font-bold m-0 text-slate-800 tracking-tight">{t('pages:maintenance.title')}</h1>
            </div>

            <Card className="mb-4 card">
                <div className="grid align-items-end" onKeyDown={onFilterKeyDown}>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaAperturaDesde')}</label>
                        <Calendar value={filters.fechaAperturaDesde} onChange={(e) => setFilters({...filters, fechaAperturaDesde: e.value as Date})} placeholder={t('components:calendar.placeholder')} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaAperturaHasta')}</label>
                        <Calendar value={filters.fechaAperturaHasta} onChange={(e) => setFilters({...filters, fechaAperturaHasta: e.value as Date})} placeholder={t('components:calendar.placeholder')} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                    <div className="col-12 md:col-3">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:expediente.reference')}</label>
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-id-card" />
                            <InputText value={filters.referencia} onChange={(e) => setFilters({...filters, referencia: e.target.value})} placeholder="EXP-202X-..." className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                        </IconField>
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:expediente.status')}</label>
                        <Dropdown value={filters.estado} options={estados} optionLabel="label" optionValue="value" onChange={(e) => setFilters({...filters, estado: e.value})} placeholder={t('domain:status.any')} showClear className="p-inputtext-sm w-full" style={{ height: '39px' }} emptyMessage={t('common:messages.noOptions')} appendTo={() => document.body} />
                    </div>
                    <div className="col-12 md:col-3 flex gap-2">
                        <Button label={t('common:actions.filter')} icon="pi pi-search" className="p-button-sm px-3" outlined onClick={handleApplyFilters} style={{ height: '39px', width: 'auto' }} />
                        <Button label={t('common:actions.clean')} icon="pi pi-filter-slash" className="p-button-sm p-button-secondary px-3" outlined onClick={() => handleClearFilters(DEFAULT_FILTERS)} style={{ height: '39px', width: 'auto' }} />
                    </div>
                </div>
            </Card>

            <Toolbar className="mb-4 bg-transparent border-none p-0" left={
                <div className="flex flex-wrap gap-2">
                    <Button label={t('common:actions.new')} icon="pi pi-plus" severity="success" onClick={() => openNew({ estado: 'Abierto', referencia: '', solicitante: '', fechaApertura: new Date() })} raised />
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
                    <Column field="referencia" header={t('domain:expediente.reference')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                    <Column field="solicitante" header={t('domain:expediente.applicant')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                    <Column field="fechaApertura" header={t('domain:expediente.dateOpen')} body={dateBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                    <Column field="estado" header={t('domain:expediente.status')} body={statusBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                </DataTable>
            </div>

            <Dialog visible={itemDialog} style={{ width: '450px' }} header={t('pages:maintenance.dialogTitle')} modal className="p-fluid" footer={dialogFooter} onHide={closeDialog}>
                <div className="field mb-4">
                    <label htmlFor="referencia" className="font-bold block mb-2">{t('domain:expediente.reference')}</label>
                    <InputText id="referencia" value={item.referencia || ''} onChange={(e) => setItem({ ...item, referencia: e.target.value })} required autoFocus className={!item.referencia ? 'p-invalid' : ''} />
                </div>
                <div className="field mb-4">
                    <label htmlFor="solicitante" className="font-bold block mb-2">{t('domain:expediente.applicant')}</label>
                    <InputText id="solicitante" value={item.solicitante || ''} onChange={(e) => setItem({ ...item, solicitante: e.target.value })} required />
                </div>
                <div className="formgrid grid">
                    <div className="field col-6">
                        <label htmlFor="fecha" className="font-bold block mb-2">{t('domain:expediente.dateOpen')}</label>
                        <Calendar id="fecha" value={item.fechaApertura instanceof Date ? item.fechaApertura : (item.fechaApertura ? new Date(item.fechaApertura) : null)} onChange={(e) => setItem({ ...item, fechaApertura: e.value as Date })} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} placeholder={t('components:calendar.placeholder')} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                    <div className="field col-6">
                        <label htmlFor="fechaCierre" className="font-bold block mb-2">{t('domain:expediente.dateClose')}</label>
                        <Calendar id="fechaCierre" value={item.fechaCierre instanceof Date ? item.fechaCierre : (item.fechaCierre ? new Date(item.fechaCierre) : null)} onChange={(e) => setItem({ ...item, fechaCierre: e.value as Date })} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} placeholder={t('components:calendar.placeholder')} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                </div>
                <div className="field mb-4">
                    <label htmlFor="ultimoTramite" className="font-bold block mb-2">{t('domain:expediente.lastStep')}</label>
                    <InputText id="ultimoTramite" value={item.ultimoTramite || ''} onChange={(e) => setItem({ ...item, ultimoTramite: e.target.value })} />
                </div>
                <div className="field">
                    <label htmlFor="estado" className="font-bold block mb-2">{t('domain:expediente.status')}</label>
                    <Dropdown id="estado" value={item.estado} options={estados} optionLabel="label" optionValue="value" onChange={(e) => setItem({ ...item, estado: e.value })} placeholder={t('common:actions.select')} emptyMessage={t('common:messages.noOptions')} appendTo={() => document.body} />
                </div>
            </Dialog>
        </div>
    );
};

export default MaintenancePage;