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
    filterFields: (filters: F, setFilters: React.Dispatch<React.SetStateAction<F>>) => React.ReactNode;
    dialogFields: (item: Partial<T>, setItem: React.Dispatch<React.SetStateAction<Partial<T>>>, errors: Record<string, string>, isReadOnly?: boolean) => React.ReactNode;
    dialogWidth?: string;
    children: React.ReactNode;
    
    // Configuración opcional de funcionalidades
    selectionMode?: 'single' | 'multiple' | 'none';
    showNew?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
    showExport?: boolean;
    extraButtons?: (selectedItems: T[]) => React.ReactNode;
    readOnly?: boolean;
    validate?: (item: Partial<T>) => Record<string, string>;
    entityNameKey?: string;
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
    children,
    selectionMode = 'multiple',
    showNew = true,
    showEdit = true,
    showDelete = true,
    showExport = true,
    extraButtons,
    readOnly = false,
    validate,
    entityNameKey
}: DataTableTemplateProps<T, F>) {
    const { t, i18n } = useTranslation(['common', 'pages', 'components', 'domain']);
    const toast = useRef<Toast>(null);
    const dt = useRef<any>(null);

    const {
        filteredData, totalRecords, selectedItems,
        selectAllPages, deselectedItems, onSelectionChange,
        handleSelectAllPages, handleClearSelection,
        isLoading, itemDialog, isEdit, item, setItem, errors,
        filters, setFilters, page, rows, sortField, sortOrder, onPage, onSort,
        handleApplyFilters, handleClearFilters, openNew, openEdit,
        closeDialog, saveItem, deleteSelected, isSaving
    } = useMaintenance<T, F>({
        entityKey,
        service,
        initialFilters,
        validate,
        onSuccess: (msg) => toast.current?.show({ severity: 'success', summary: t('common:messages.success'), detail: t(msg), life: 3000 }),
        onError: (msg) => toast.current?.show({ severity: 'error', summary: t('common:messages.error'), detail: t(msg), life: 3000 })
    });

    const isDetailMode = readOnly && isEdit;

    const actionLabel = isDetailMode 
        ? t('common:actions.detail') 
        : (isEdit ? t('common:actions.edit') : t('common:actions.new'));
    
    const domainKey = entityNameKey || entityKey;
    const entityLabel = t(`domain:${domainKey}.entity`);
    const dynamicDialogTitle = `${actionLabel} ${entityLabel}`;

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
            <Button label={isDetailMode ? t('common:actions.close') : t('common:actions.cancel')} icon="pi pi-times" outlined onClick={closeDialog} />
            {!isDetailMode && <Button label={t('common:actions.save')} icon="pi pi-check" onClick={saveItem} loading={isSaving} />}
        </React.Fragment>
    );

    const onFilterKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleApplyFilters();
    };

    const isMultiple = selectionMode === 'multiple';
    const isSingle = selectionMode === 'single';
    const hasSelection = selectionMode !== 'none';

    return (
        <div className="maintenance-view animate-fadein">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <div className="flex align-items-center justify-content-between mb-4">
                <h1 className="text-3xl font-bold m-0 text-slate-800 tracking-tight">{title}</h1>
            </div>

            <Card className="mb-4 card shadow-1">
                <div className="grid align-items-end" onKeyDown={onFilterKeyDown}>
                    {filterFields(filters, setFilters)}
                </div>
                
                <div className="flex justify-content-end gap-2 mt-4 pt-3 border-top-1 border-slate-100">
                    <Button 
                        label={t('common:actions.filter')} 
                        icon="pi pi-search" 
                        className="p-button-sm px-4" 
                        outlined 
                        onClick={handleApplyFilters} 
                        style={{ height: '39px', width: 'auto' }} 
                    />
                    <Button 
                        label={t('common:actions.clean')} 
                        icon="pi pi-filter-slash" 
                        className="p-button-sm p-button-secondary px-4" 
                        outlined 
                        onClick={() => handleClearFilters(initialFilters)} 
                        style={{ height: '39px', width: 'auto' }} 
                    />
                </div>
            </Card>

            {(showNew || showEdit || showDelete || showExport || extraButtons) && (
                <Toolbar className="mb-4 bg-transparent border-none p-0" left={
                    <div className="flex flex-wrap gap-2">
                        {showNew && <Button label={t('common:actions.new')} icon="pi pi-plus" severity="success" onClick={() => openNew(newItemDefault as T)} raised />}
                        {showEdit && <Button label={readOnly ? t('common:actions.detail') : t('common:actions.edit')} icon={readOnly ? "pi pi-eye" : "pi pi-pencil"} severity="info" disabled={selectedItems.length !== 1} onClick={() => openEdit(selectedItems[0])} />}
                        {showDelete && <Button label={t('common:actions.delete')} icon="pi pi-trash" severity="danger" disabled={selectedItems.length === 0 && !selectAllPages} onClick={confirmDelete} />}
                        {extraButtons && extraButtons(selectedItems)}
                    </div>
                } right={
                    showExport ? <Button label={t('common:actions.export')} icon="pi pi-upload" severity="secondary" onClick={() => dt.current?.exportCSV()} text /> : null
                }></Toolbar>
            )}

            {isMultiple && selectedItems.length > 0 && selectedItems.length === filteredData.length && !selectAllPages && totalRecords > filteredData.length && (
                <div className="bg-slate-100 border-round-xl p-3 mb-3 flex align-items-center justify-content-center shadow-1 animate-fadein border-1 border-slate-200">
                    <i className="pi pi-info-circle text-slate-600 mr-3" style={{ fontSize: '1.2rem' }}></i>
                    <span className="text-slate-700 mr-2 text-sm font-medium">
                        {t('pages:selection.pageSelected', { count: selectedItems.length })}
                    </span>
                    <Button label={t('pages:selection.selectAll', { total: totalRecords })} className="p-button-link p-0 font-bold text-sm text-blue-600 hover:underline" onClick={handleSelectAllPages} />
                </div>
            )}

            {isMultiple && selectAllPages && (
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
                    {...({
                        ref: dt,
                        value: filteredData,
                        lazy: true,
                        paginator: true,
                        first: page * rows,
                        rows: rows,
                        totalRecords: totalRecords,
                        onPage: onPage,
                        onSort: onSort,
                        sortField: sortField || '',
                        sortOrder: sortOrder as any,
                        selectionMode: hasSelection ? (isMultiple ? "multiple" : "single") : undefined,
                        selection: hasSelection ? (isMultiple ? selectedItems : (selectedItems.length > 0 ? selectedItems[0] : null)) : null,
                        onSelectionChange: (e: any) => {
                            if (isSingle) {
                                onSelectionChange({ value: e.value ? [e.value] : [] });
                            } else if (isMultiple) {
                                onSelectionChange(e);
                            }
                        },
                        rowsPerPageOptions: [20, 50, 100],
                        dataKey: "id",
                        className: "p-datatable-sm",
                        stripedRows: true,
                        rowHover: true,
                        responsiveLayout: "scroll",
                        emptyMessage: t('common:messages.noData'),
                        loading: isLoading,
                        paginatorLeft: hasSelection ? (
                            <span className="text-xs text-slate-400 ml-2">
                                {isMultiple && (selectAllPages ? totalRecords - deselectedItems.length : selectedItems.length) > 0 
                                    ? t('components:paginator.selected', { count: selectAllPages ? totalRecords - deselectedItems.length : selectedItems.length })
                                    : (isSingle && selectedItems.length > 0 ? t('components:paginator.selected', { count: 1 }) : '')
                                }
                            </span>
                        ) : <div className="ml-2" />,
                        paginatorRight: <span className="text-xs text-slate-400 mr-2">{t('components:paginator.total', { count: totalRecords })}</span>,
                        paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
                        paginatorDropdownAppendTo: "self"
                    } as any)}
                >
                    {children}
                </DataTable>
            </div>

            <Dialog 
                visible={itemDialog} 
                style={{ width: dialogWidth }} 
                header={dynamicDialogTitle} 
                modal 
                className="p-fluid" 
                footer={dialogFooter} 
                onHide={closeDialog}
            >
                {dialogFields(item, setItem, errors, isDetailMode)}
            </Dialog>
        </div>
    );
}
