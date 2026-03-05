import React, { useRef, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import { useMaintenance } from '../hooks/useMaintenance';
import { BaseService } from '../services/base.service';

interface DataTableTemplateProps<T, F> {
    title: string;
    entityKey: string;
    service: BaseService<T>;
    initialFilters: F;
    newItemDefault: Partial<T>;
    filterFields: (filters: F, setFilters: (f: F) => void) => React.ReactNode;
    dialogFields: (item: Partial<T>, setItem: (i: Partial<T>) => void) => React.ReactNode;
    dialogWidth?: string;
    children: React.ReactNode; // Las columnas vendrán aquí
}

export function DataTableTemplate<T extends { id: any }, F>({
    title,
    entityKey,
    service,
    initialFilters,
    newItemDefault,
    filterFields,
    dialogFields,
    dialogWidth = '450px',
    children
}: DataTableTemplateProps<T, F>) {
    const { t, i18n } = useTranslation(['common', 'pages', 'components']);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<T[]>>(null);

    const {
        filteredData, totalRecords, selectedItems,
        selectAllPages, deselectedItems, onSelectionChange,
        handleSelectAllPages, handleClearSelection,
        isLoading, itemDialog, item, setItem,
        filters, setFilters, page, rows, sortField, sortOrder, onPage, onSort,
        handleApplyFilters, handleClearFilters, openNew, openEdit,
        closeDialog, saveItem, deleteSelected, isSaving
    } = useMaintenance<T, F>({
        entityKey,
        service,
        initialFilters,
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

    const dialogFooter = (
        <React.Fragment>
            <Button label={t('common:actions.cancel')} icon="pi pi-times" outlined onClick={closeDialog} />
            <Button label={t('common:actions.save')} icon="pi pi-check" onClick={saveItem} loading={isSaving} />
        </React.Fragment>
    );

    const onFilterKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleApplyFilters();
    };

    return (
        <div className="maintenance-view animate-fadein">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <div className="flex align-items-center justify-content-between mb-4">
                <h1 className="text-3xl font-bold m-0 text-slate-800 tracking-tight">{title}</h1>
            </div>

            <Card className="mb-4 card">
                <div className="grid align-items-end" onKeyDown={onFilterKeyDown}>
                    {filterFields(filters, setFilters)}
                    <div className="col-12 md:col-3 flex gap-2">
                        <Button label={t('common:actions.filter')} icon="pi pi-search" className="p-button-sm px-3" outlined onClick={handleApplyFilters} style={{ height: '39px', width: 'auto' }} />
                        <Button label={t('common:actions.clean')} icon="pi pi-filter-slash" className="p-button-sm p-button-secondary px-3" outlined onClick={() => handleClearFilters(initialFilters)} style={{ height: '39px', width: 'auto' }} />
                    </div>
                </div>
            </Card>

            <Toolbar className="mb-4 bg-transparent border-none p-0" left={
                <div className="flex flex-wrap gap-2">
                    <Button label={t('common:actions.new')} icon="pi pi-plus" severity="success" onClick={() => openNew(newItemDefault as T)} raised />
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
                <DataTable 
                    key={i18n.language} 
                    ref={dt} 
                    value={filteredData} 
                    lazy 
                    paginator 
                    first={page * rows} 
                    rows={rows} 
                    totalRecords={totalRecords} 
                    onPage={onPage} 
                    onSort={onSort} 
                    sortField={sortField || ''} 
                    sortOrder={sortOrder as any} 
                    selectionMode="multiple" 
                    selection={selectedItems} 
                    onSelectionChange={onSelectionChange} 
                    rowsPerPageOptions={[20, 50, 100]} 
                    dataKey="id" 
                    className="p-datatable-sm" 
                    stripedRows 
                    rowHover 
                    responsiveLayout="scroll" 
                    emptyMessage={t('common:messages.noData')} 
                    loading={isLoading}
                    paginatorLeft={<span className="text-xs text-slate-400 ml-2">{t('components:paginator.selected', { count: selectAllPages ? totalRecords - deselectedItems.length : selectedItems.length })}</span>}
                    paginatorRight={<span className="text-xs text-slate-400 mr-2">{t('components:paginator.total', { count: totalRecords })}</span>}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" 
                    paginatorDropdownAppendTo="self"
                >
                    {children}
                </DataTable>
            </div>

            <Dialog 
                visible={itemDialog} 
                style={{ width: dialogWidth }} 
                header={t('pages:maintenance.dialogTitle')} 
                modal 
                className="p-fluid" 
                footer={dialogFooter} 
                onHide={closeDialog}
            >
                {dialogFields(item, setItem)}
            </Dialog>
        </div>
    );
}
