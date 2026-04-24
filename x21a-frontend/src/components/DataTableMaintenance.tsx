import React, { createContext, useContext, useRef, useCallback, type ReactNode, type Dispatch, type SetStateAction } from 'react';
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

// --- INTERFACES DE CONTEXTO ---
export interface MaintenanceContextProps<T extends { id: string | number }, F> {
    filteredData: T[];
    totalRecords: number;
    selectedItems: T[];
    setSelectedItems: Dispatch<SetStateAction<T[]>>;
    selectAllPages: boolean;
    deselectedItems: T[];
    onSelectionChange: (e: any) => void;
    handleSelectAllPages: () => void;
    handleClearSelection: () => void;
    isLoading: boolean;
    isError: boolean;
    itemDialog: boolean;
    isEdit: boolean;
    item: Partial<T>;
    setItem: Dispatch<SetStateAction<Partial<T>>>;
    errors: Record<string, string>;
    setErrors: Dispatch<SetStateAction<Record<string, string>>>;
    filters: F;
    setFilters: Dispatch<SetStateAction<F>>;
    page: number;
    rows: number;
    sortField: string | null;
    sortOrder: number | null;
    onPage: (event: any) => void;
    onSort: (event: any) => void;
    handleApplyFilters: () => void;
    handleClearFilters: (defaults: F) => void;
    openNew: (initialState?: Partial<T>) => void;
    openEdit: (selectedItem: T) => void;
    closeDialog: () => void;
    saveItem: () => void;
    deleteSelected: () => void;
    isSaving: boolean;
    entityKey: string;
    initialFilters: F;
    t: any;
}

const MaintenanceContext = createContext<MaintenanceContextProps<any, any> | null>(null);

export const useMaintenanceContext = <T extends { id: string | number }, F>() => {
    const context = useContext(MaintenanceContext);
    if (!context) throw new Error('useMaintenanceContext must be used within a DataTableMaintenance');
    return context as MaintenanceContextProps<T, F>;
};

// --- DEFINICIÓN DE INTERFAZ DEL COMPONENTE COMPUESTO ---

export interface DataTableMaintenanceComponent {
    <T extends { id: string | number }, F>(props: {
        entityKey: string;
        service: BaseService<T>;
        initialFilters: F;
        validate?: (item: Partial<T>) => Record<string, string>;
        children: ReactNode;
    }): ReactNode;
    Title: React.FC<{ title: string }>;
    Filters: React.FC<{ children: (filters: any, setFilters: Dispatch<SetStateAction<any>>) => ReactNode }>;
    Toolbar: React.FC<{
        showNew?: boolean;
        showEdit?: boolean;
        showDelete?: boolean;
        showExport?: boolean;
        readOnly?: boolean;
        newItemDefault?: any;
        extraButtons?: (selectedItems: any[]) => ReactNode;
        entityNameKey?: string;
    }>;
    Table: React.FC<{ children: ReactNode; selectionMode?: 'single' | 'multiple' | 'none'; dataKey?: string }>;
    Dialog: React.FC<{
        title?: string;
        width?: string;
        readOnly?: boolean;
        children: (item: any, setItem: Dispatch<SetStateAction<any>>, errors: Record<string, string>, isReadOnly: boolean) => ReactNode;
        entityNameKey?: string;
    }>;
}

// --- IMPLEMENTACIÓN ---

const DataTableMaintenanceRoot = ({
    entityKey,
    service,
    initialFilters,
    validate,
    children
}: any) => {
    const { t } = useTranslation(['common', 'pages', 'components', 'domain']);
    const toast = useRef<Toast>(null);
    const maintenance = useMaintenance<any, any>({ entityKey, service, initialFilters, validate, 
        onSuccess: (msg) => toast.current?.show({ severity: 'success', summary: t('common:messages.success'), detail: t(msg), life: 3000 }),
        onError: (msg) => toast.current?.show({ severity: 'error', summary: t('common:messages.error'), detail: t(msg), life: 3000 })
    });

    return (
        <MaintenanceContext.Provider value={{ ...maintenance, entityKey, initialFilters, t }}>
            <div className="maintenance-view animate-fadein"><Toast ref={toast} /><ConfirmDialog />{children}</div>
        </MaintenanceContext.Provider>
    );
};

const Title: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex align-items-center justify-content-between mb-4">
        <h1 className="text-3xl font-bold m-0 text-slate-800 tracking-tight">{title}</h1>
    </div>
);

const Filters: React.FC<{ children: (filters: any, setFilters: Dispatch<SetStateAction<any>>) => ReactNode }> = ({ children }) => {
    const { filters, setFilters, handleApplyFilters, handleClearFilters, initialFilters, t } = useMaintenanceContext();
    const onFilterKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleApplyFilters(); };
    return (
        <Card className="mb-4 card shadow-1">
            <div className="grid align-items-end" onKeyDown={onFilterKeyDown}>{children(filters, setFilters)}</div>
            <div className="flex justify-content-end gap-2 mt-4 pt-3 border-top-1 border-slate-100">
                <Button label={t('common:actions.filter')} icon="pi pi-search" className="p-button-sm px-4" outlined onClick={handleApplyFilters} style={{ height: '39px', width: 'auto' }} />
                <Button label={t('common:actions.clean')} icon="pi pi-filter-slash" className="p-button-sm p-button-secondary px-4" outlined onClick={() => handleClearFilters(initialFilters)} style={{ height: '39px', width: 'auto' }} />
            </div>
        </Card>
    );
};

const MaintenanceToolbar: React.FC<any> = ({ showNew = true, showEdit = true, showDelete = true, showExport = true, readOnly = false, newItemDefault = {}, extraButtons }) => {
    const { selectedItems, selectAllPages, openNew, openEdit, deleteSelected, t } = useMaintenanceContext();
    const confirmDelete = useCallback(() => { confirmDialog({ message: t('common:messages.confirmDelete'), header: t('common:messages.deleteTitle'), icon: 'pi pi-exclamation-triangle', acceptLabel: t('common:labels.yes'), rejectLabel: t('common:labels.no'), accept: deleteSelected }); }, [t, deleteSelected]);
    return (
        <Toolbar className="mb-4 bg-transparent border-none p-0" left={
            <div className="flex flex-wrap gap-2">
                {showNew && <Button label={t('common:actions.new')} icon="pi pi-plus" severity="success" onClick={() => openNew(newItemDefault)} raised />}
                {showEdit && <Button label={readOnly ? t('common:actions.detail') : t('common:actions.edit')} icon={readOnly ? "pi pi-eye" : "pi pi-pencil"} severity="info" disabled={selectedItems.length !== 1} onClick={() => openEdit(selectedItems[0])} />}
                {showDelete && <Button label={t('common:actions.delete')} icon="pi pi-trash" severity="danger" disabled={selectedItems.length === 0 && !selectAllPages} onClick={confirmDelete} />}
                {extraButtons && extraButtons(selectedItems)}
            </div>
        } right={showExport ? <Button label={t('common:actions.export')} icon="pi pi-upload" severity="secondary" onClick={() => window.dispatchEvent(new CustomEvent('maintenance-export'))} text /> : null} />
    );
};

const Table: React.FC<any> = ({ children, selectionMode = 'multiple', dataKey = 'id' }) => {
    const { filteredData, totalRecords, selectedItems, selectAllPages, deselectedItems, onSelectionChange, isLoading, page, rows, sortField, sortOrder, onPage, onSort, t } = useMaintenanceContext();
    const dt = useRef<any>(null);
    React.useEffect(() => { const h = () => dt.current?.exportCSV(); window.addEventListener('maintenance-export', h); return () => window.removeEventListener('maintenance-export', h); }, []);
    const isMultiple = selectionMode === 'multiple';
    const isSingle = selectionMode === 'single';
    const hasSelection = selectionMode !== 'none';
    return (
        <div className="p-datatable-container shadow-3 border-round-xl bg-white mb-8">
            <DataTable {...({
                ref: dt, value: filteredData, lazy: true, paginator: true, first: page * rows, rows, totalRecords, onPage, onSort, sortField: sortField || '', sortOrder: sortOrder as any,
                selectionMode: hasSelection ? (isMultiple ? "multiple" : "single") : undefined,
                selection: hasSelection ? (isMultiple ? selectedItems : (selectedItems.length > 0 ? selectedItems[0] : null)) : null,
                onSelectionChange: (e: any) => isSingle ? onSelectionChange({ value: e.value ? [e.value] : [] }) : onSelectionChange(e),
                rowsPerPageOptions: [20, 50, 100], dataKey, className: "p-datatable-sm", stripedRows: true, rowHover: true, responsiveLayout: "scroll", emptyMessage: t('common:messages.noData'), loading: isLoading,
                paginatorLeft: hasSelection ? (<span className="text-xs text-slate-400 ml-2">{isMultiple && (selectAllPages ? totalRecords - deselectedItems.length : selectedItems.length) > 0 ? t('components:paginator.selected', { count: selectAllPages ? totalRecords - deselectedItems.length : selectedItems.length }) : (isSingle && selectedItems.length > 0 ? t('components:paginator.selected', { count: 1 }) : '')}</span>) : <div className="ml-2" />,
                paginatorRight: <span className="text-xs text-slate-400 mr-2">{t('components:paginator.total', { count: totalRecords })}</span>,
                paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown", paginatorDropdownAppendTo: "self"
            } as any)}>{children}</DataTable>
        </div>
    );
};

const MaintenanceDialog: React.FC<any> = ({ title, width = '450px', readOnly = false, children, entityNameKey }) => {
    const { itemDialog, isEdit, item, setItem, errors, closeDialog, saveItem, isSaving, entityKey, t } = useMaintenanceContext();
    const isDetailMode = readOnly && isEdit;
    const domainKey = entityNameKey || entityKey;
    const dynamicDialogTitle = title || `${isDetailMode ? t('common:actions.detail') : (isEdit ? t('common:actions.edit') : t('common:actions.new'))} ${t(`domain:${domainKey}.entity`)}`;
    const footer = (<><Button label={isDetailMode ? t('common:actions.close') : t('common:actions.cancel')} icon="pi pi-times" outlined onClick={closeDialog} />{!isDetailMode && <Button label={t('common:actions.save')} icon="pi pi-check" onClick={saveItem} loading={isSaving} />}</>);
    return (<Dialog visible={itemDialog} style={{ width }} header={dynamicDialogTitle} modal className="p-fluid" footer={footer} onHide={closeDialog}>{children(item, setItem, errors, isDetailMode)}</Dialog>);
};

export const DataTableMaintenance = DataTableMaintenanceRoot as unknown as DataTableMaintenanceComponent;
DataTableMaintenance.Title = Title;
DataTableMaintenance.Filters = Filters;
DataTableMaintenance.Toolbar = MaintenanceToolbar;
DataTableMaintenance.Table = Table;
DataTableMaintenance.Dialog = MaintenanceDialog;
