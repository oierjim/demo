import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseService } from '../services/base.service';

interface UseMaintenanceOptions<T, F> {
    entityKey: string;
    service: BaseService<T>;
    initialFilters: F;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

export function useMaintenance<T extends { id: string | number }, F>({
    entityKey,
    service,
    initialFilters,
    onSuccess,
    onError
}: UseMaintenanceOptions<T, F>) {
    const queryClient = useQueryClient();
    
    // Estado de la Tabla (Servidor)
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(20);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<number | null>(null);
    
    // Estado de Filtros
    const [filters, setFilters] = useState<F>(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState<F>(initialFilters);

    // Estado de UI
    const [selectedItems, setSelectedItems] = useState<T[]>([]);
    const [itemDialog, setItemDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [item, setItem] = useState<Partial<T>>({});

    // Petición al Servidor con React Query
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

    // Mutaciones
    const saveMutation = useMutation({
        mutationFn: (item: Partial<T>) => isEdit ? service.update(item.id!, item) : service.create(item),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [entityKey] });
            setItemDialog(false);
            onSuccess?.('Operación realizada con éxito');
        },
        onError: () => onError?.('Error al guardar')
    });

    const deleteMutation = useMutation({
        mutationFn: (ids: (string | number)[]) => service.deleteMultiple(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [entityKey] });
            setSelectedItems([]);
            onSuccess?.('Eliminado correctamente');
        },
        onError: () => onError?.('Error al eliminar')
    });

    // Handlers de la Tabla
    const onPage = (event: any) => {
        setPage(event.page);
        setRows(event.rows);
    };

    const onSort = (event: any) => {
        setSortField(event.sortField);
        setSortOrder(event.sortOrder);
    };

    const handleApplyFilters = () => {
        setPage(0); // Volver a la primera página al filtrar
        setAppliedFilters({ ...filters });
        // Forzamos un refetch manual para asegurar datos frescos aunque el filtro no haya cambiado
        setTimeout(() => refetch(), 0);
    };

    const handleClearFilters = (defaults: F) => {
        setFilters(defaults);
        setAppliedFilters(defaults);
        setPage(0);
    };

    const openNew = (initialState: Partial<T> = {}) => {
        setIsEdit(false);
        setItem(initialState);
        setItemDialog(true);
    };

    const openEdit = (selectedItem: T) => {
        setIsEdit(true);
        setItem({ ...selectedItem });
        setItemDialog(true);
    };

    const closeDialog = () => setItemDialog(false);

    const saveItem = () => saveMutation.mutate(item);

    const deleteSelected = () => {
        if (selectedItems.length > 0) {
            deleteMutation.mutate(selectedItems.map(i => i.id));
        }
    };

    return {
        filteredData,
        totalRecords,
        selectedItems,
        setSelectedItems,
        isLoading,
        isError,
        itemDialog,
        isEdit,
        item,
        setItem,
        filters,
        setFilters,
        page,
        rows,
        sortField,
        sortOrder,
        onPage,
        onSort,
        handleApplyFilters,
        handleClearFilters,
        openNew,
        openEdit,
        closeDialog,
        saveItem,
        deleteSelected,
        isSaving: saveMutation.isPending
    };
}