import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseService } from '../services/base.service';

interface UseMaintenanceOptions<T, F> {
    entityKey: string;
    service: BaseService<T>;
    initialFilters: F;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
    validate?: (item: Partial<T>) => Record<string, string>;
}

export function useMaintenance<T extends { id: string | number }, F>({
    entityKey,
    service,
    initialFilters,
    onSuccess,
    onError,
    validate
}: UseMaintenanceOptions<T, F>) {
    const queryClient = useQueryClient();
    
    // Estado de la Tabla
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(20);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<number | null>(null);
    
    // Estado de Filtros
    const [filters, setFilters] = useState<F>(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState<F>(initialFilters);

    // Estado de UI y Selección Global
    const [selectedItems, setSelectedItems] = useState<T[]>([]);
    const [selectAllPages, setSelectAllPages] = useState(false);
    const [deselectedItems, setDeselectedItems] = useState<T[]>([]);
    
    // REF para acceso instantáneo en manejadores de eventos (evita stale closures)
    const selectAllPagesRef = useRef(selectAllPages);
    useEffect(() => {
        selectAllPagesRef.current = selectAllPages;
    }, [selectAllPages]);

    const [itemDialog, setItemDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [item, setItem] = useState<Partial<T>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [entityKey, page, rows, sortField, sortOrder, appliedFilters],
        queryFn: () => service.filter({
            filter: appliedFilters,
            page,
            rows,
            sidx: sortField,
            sord: sortOrder === 1 ? 'asc' : 'desc'
        })
    });

    const filteredData = data?.data || [];
    const totalRecords = data?.totalRecords || 0;

    // Sincronizar selección visual al cambiar de página en modo Select All
    useEffect(() => {
        if (selectAllPages && filteredData.length > 0) {
            const currentlySelectedOnPage = filteredData.filter(
                (item: T) => !deselectedItems.some((d) => String(d.id) === String(item.id))
            );
            setSelectedItems(currentlySelectedOnPage);
        }
    }, [page, filteredData, selectAllPages, deselectedItems]);

    // Mutaciones
    const saveMutation = useMutation({
        mutationFn: (item: Partial<T>) => isEdit ? service.update(item.id!, item) : service.create(item),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [entityKey] });
            setItemDialog(false);
            onSuccess?.(isEdit ? 'common:messages.updated' : 'common:messages.saved');
        },
        onError: () => onError?.('common:messages.error')
    });

    const deleteMutation = useMutation({
        mutationFn: (request: any) => service.deleteMultiple(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [entityKey] });
            handleClearSelection();
            onSuccess?.('common:messages.deleted');
        },
        onError: () => onError?.('common:messages.error')
    });

    // Handlers
    const onPage = (event: any) => {
        setPage(event.page);
        setRows(event.rows);
    };

    const onSort = (event: any) => {
        setSortField(event.sortField);
        setSortOrder(event.sortOrder);
    };

    const handleApplyFilters = () => {
        setPage(0);
        setAppliedFilters({ ...filters });
        handleClearSelection();
        setTimeout(() => refetch(), 0);
    };

    const handleClearFilters = (defaults: F) => {
        setFilters(defaults);
        setAppliedFilters(defaults);
        setPage(0);
        handleClearSelection();
    };

    // Lógica de Selección
    const onSelectionChange = (e: any) => {
        const newVal = (e.value || []) as T[];
        
        // Usamos el REF para evitar stale closures con PrimeReact DataTable
        if (selectAllPagesRef.current) {
            const newValIds = new Set(newVal.map(i => String(i.id)));
            const currentPageIds = filteredData.map(i => String(i.id));
            
            // Los deseleccionados en la página actual son los que están en la página pero no en la nueva selección
            const deselectedOnPage = filteredData.filter(i => !newValIds.has(String(i.id)));
            
            setDeselectedItems(prev => {
                let updated = [...prev];
                
                // Añadimos los nuevos deseleccionados (evitando duplicados)
                deselectedOnPage.forEach(item => {
                    if (!updated.some(u => String(u.id) === String(item.id))) {
                        updated.push(item);
                    }
                });
                
                // Si alguno de los que estaba en deselectedItems ahora SÍ está en newVal, lo quitamos (re-seleccionado)
                updated = updated.filter(u => {
                    if (currentPageIds.includes(String(u.id))) {
                        return !newValIds.has(String(u.id));
                    }
                    return true;
                });
                
                return updated;
            });
        }
        
        setSelectedItems(newVal);
    };

    const handleSelectAllPages = () => {
        setSelectAllPages(true);
        setDeselectedItems([]);
        setSelectedItems([...filteredData]); 
    };

    const handleClearSelection = () => {
        setSelectedItems([]);
        setSelectAllPages(false);
        setDeselectedItems([]);
    };

    const openNew = (initialState: Partial<T> = {}) => {
        setIsEdit(false);
        setItem(initialState);
        setErrors({});
        setItemDialog(true);
    };

    const openEdit = (selectedItem: T) => {
        setIsEdit(true);
        setItem({ ...selectedItem });
        setErrors({});
        setItemDialog(true);
    };

    const closeDialog = () => {
        setItemDialog(false);
        setErrors({});
    };

    const saveItem = () => {
        if (validate) {
            const validationErrors = validate(item);
            setErrors(validationErrors);
            if (Object.keys(validationErrors).length > 0) return;
        }
        saveMutation.mutate(item);
    };

    const deleteSelected = () => {
        const isAllSelected = selectAllPagesRef.current;
        deleteMutation.mutate({
            selectAll: isAllSelected,
            selectedIds: isAllSelected ? [] : selectedItems.map(i => i.id),
            deselectedIds: isAllSelected ? deselectedItems.map(i => i.id) : [],
            filter: appliedFilters
        });
    };

    return {
        filteredData, totalRecords, selectedItems, setSelectedItems,
        selectAllPages, deselectedItems, onSelectionChange,
        handleSelectAllPages, handleClearSelection,
        isLoading, isError, itemDialog, isEdit, item, setItem,
        errors, setErrors,
        filters, setFilters, page, rows, sortField, sortOrder, onPage, onSort,
        handleApplyFilters, handleClearFilters, openNew, openEdit,
        closeDialog, saveItem, deleteSelected, isSaving: saveMutation.isPending
    };
}