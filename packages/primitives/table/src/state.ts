/**
 * Table Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix-ui/core';
import type { 
    TableState, 
    TableOptions, 
    SortingState, 
    PaginationState,
    CellPosition,
    ColumnDef
} from './types';

/**
 * Extended state store with component-specific methods
 */
export interface TableStateStore<TData = any> {
    getState: () => TableState<TData>;
    setState: (updater: (prev: TableState<TData>) => TableState<TData>) => void;
    subscribe: (listener: (state: TableState<TData>) => void) => () => void;
    derive: <U>(selector: (state: TableState<TData>) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    setSorting: (sorting: SortingState[]) => void;
    toggleSort: (columnId: string, multi?: boolean) => void;
    clearSorting: () => void;
    
    setSelection: (selection: Record<string, boolean>) => void;
    toggleRowSelection: (rowId: string) => void;
    toggleAllRowsSelection: () => void;
    clearSelection: () => void;
    
    setColumnVisibility: (visibility: Record<string, boolean>) => void;
    toggleColumnVisibility: (columnId: string) => void;
    showAllColumns: () => void;
    
    setPagination: (pagination: PaginationState) => void;
    setPageIndex: (pageIndex: number) => void;
    setPageSize: (pageSize: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    
    setFocusedCell: (cell: CellPosition | null) => void;
    moveFocus: (direction: 'up' | 'down' | 'left' | 'right') => void;
    
    setData: (data: TData[]) => void;
    setColumns: (columns: ColumnDef<TData>[]) => void;
    setLoading: (loading: boolean) => void;
    
    getSelectedRowIds: () => string[];
    getSelectedRows: () => TData[];
    getTotalPages: () => number;
    canNextPage: () => boolean;
    canPreviousPage: () => boolean;
}

/**
 * Default row ID getter
 */
const defaultGetRowId = <TData>(_row: TData, index: number): string => {
    return index.toString();
};

/**
 * Creates the table component state
 */
export function createTableState<TData = any>(
    options: TableOptions<TData> = { columns: [], data: [] }
): TableStateStore<TData> {
    const initialState: TableState<TData> = {
        columns: options.columns || [],
        data: options.data || [],
        sorting: options.sorting || [],
        selection: options.selection || {},
        columnVisibility: options.columnVisibility || {},
        pagination: options.pagination || { pageIndex: 0, pageSize: 10 },
        focusedCell: null,
        selectionMode: options.selectionMode || 'none',
        enableMultiSort: options.enableMultiSort ?? false,
        loading: options.loading ?? false,
        getRowId: options.getRowId || defaultGetRowId,
    };
    
    const store = createComponentState('Table', initialState);
    
    const extendedStore: TableStateStore<TData> = {
        ...store,
        
        setSorting: (sorting: SortingState[]) => {
            store.setState((prev) => ({ ...prev, sorting }));
            if (options.onSortingChange) {
                options.onSortingChange(sorting);
            }
        },
        
        toggleSort: (columnId: string, multi?: boolean) => {
            let newSorting: SortingState[] = [];
            store.setState((prev) => {
                const existing = prev.sorting.find(s => s.id === columnId);
                const enableMulti = multi ?? prev.enableMultiSort;
                
                if (!existing) {
                    const newSort = { id: columnId, desc: false };
                    newSorting = enableMulti ? [...prev.sorting, newSort] : [newSort];
                    return {
                        ...prev,
                        sorting: newSorting
                    };
                }
                
                if (!existing.desc) {
                    newSorting = prev.sorting.map(s => 
                        s.id === columnId ? { ...s, desc: true } : s
                    );
                    return {
                        ...prev,
                        sorting: newSorting
                    };
                }
                
                newSorting = prev.sorting.filter(s => s.id !== columnId);
                return {
                    ...prev,
                    sorting: newSorting
                };
            });
            if (options.onSortingChange) {
                options.onSortingChange(newSorting);
            }
        },
        
        clearSorting: () => {
            store.setState((prev) => ({ ...prev, sorting: [] }));
        },
        
        setSelection: (selection: Record<string, boolean>) => {
            store.setState((prev) => ({ ...prev, selection }));
            if (options.onSelectionChange) {
                options.onSelectionChange(selection);
            }
        },
        
        toggleRowSelection: (rowId: string) => {
            let newSelection: Record<string, boolean> = {};
            store.setState((prev) => {
                newSelection = { ...prev.selection };
                
                if (prev.selectionMode === 'single') {
                    Object.keys(newSelection).forEach(key => {
                        newSelection[key] = false;
                    });
                }
                
                newSelection[rowId] = !newSelection[rowId];
                
                return { ...prev, selection: newSelection };
            });
            if (options.onSelectionChange) {
                options.onSelectionChange(newSelection);
            }
        },
        
        toggleAllRowsSelection: () => {
            let newSelection: Record<string, boolean> = {};
            store.setState((prev) => {
                const allRowIds = prev.data.map((row, index) => 
                    prev.getRowId(row, index)
                );
                const allSelected = allRowIds.every(id => prev.selection[id]);
                
                newSelection = {};
                allRowIds.forEach(id => {
                    newSelection[id] = !allSelected;
                });
                
                return { ...prev, selection: newSelection };
            });
            if (options.onSelectionChange) {
                options.onSelectionChange(newSelection);
            }
        },
        
        clearSelection: () => {
            store.setState((prev) => ({ ...prev, selection: {} }));
        },
        
        setColumnVisibility: (visibility: Record<string, boolean>) => {
            store.setState((prev) => ({ ...prev, columnVisibility: visibility }));
        },
        
        toggleColumnVisibility: (columnId: string) => {
            store.setState((prev) => ({
                ...prev,
                columnVisibility: {
                    ...prev.columnVisibility,
                    [columnId]: prev.columnVisibility[columnId] === false ? true : false
                }
            }));
        },
        
        showAllColumns: () => {
            store.setState((prev) => {
                const visibility: Record<string, boolean> = {};
                prev.columns.forEach(col => {
                    visibility[col.id] = true;
                });
                return { ...prev, columnVisibility: visibility };
            });
        },
        
        setPagination: (pagination: PaginationState) => {
            store.setState((prev) => ({ ...prev, pagination }));
            if (options.onPaginationChange) {
                options.onPaginationChange(pagination);
            }
        },
        
        setPageIndex: (pageIndex: number) => {
            store.setState((prev) => ({
                ...prev,
                pagination: { ...prev.pagination, pageIndex }
            }));
        },
        
        setPageSize: (pageSize: number) => {
            store.setState((prev) => ({
                ...prev,
                pagination: { ...prev.pagination, pageSize, pageIndex: 0 }
            }));
        },
        
        nextPage: () => {
            store.setState((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    pageIndex: prev.pagination.pageIndex + 1
                }
            }));
        },
        
        previousPage: () => {
            store.setState((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    pageIndex: Math.max(0, prev.pagination.pageIndex - 1)
                }
            }));
        },
        
        setFocusedCell: (cell: CellPosition | null) => {
            store.setState((prev) => ({ ...prev, focusedCell: cell }));
        },
        
        moveFocus: (direction: 'up' | 'down' | 'left' | 'right') => {
            store.setState((prev) => {
                if (!prev.focusedCell) return prev;
                
                const visibleColumns = prev.columns.filter(col => 
                    prev.columnVisibility[col.id] !== false
                );
                const maxRow = prev.data.length - 1;
                const maxCol = visibleColumns.length - 1;
                
                let { row, col } = prev.focusedCell;
                
                switch (direction) {
                    case 'up':
                        row = Math.max(0, row - 1);
                        break;
                    case 'down':
                        row = Math.min(maxRow, row + 1);
                        break;
                    case 'left':
                        col = Math.max(0, col - 1);
                        break;
                    case 'right':
                        col = Math.min(maxCol, col + 1);
                        break;
                }
                
                return { ...prev, focusedCell: { row, col } };
            });
        },
        
        setData: (data: TData[]) => {
            store.setState((prev) => ({ ...prev, data }));
        },
        
        setColumns: (columns: ColumnDef<TData>[]) => {
            store.setState((prev) => ({ ...prev, columns }));
        },
        
        setLoading: (loading: boolean) => {
            store.setState((prev) => ({ ...prev, loading }));
        },
        
        getSelectedRowIds: () => {
            const currentState = store.getState();
            return Object.keys(currentState.selection).filter(id => currentState.selection[id]);
        },
        
        getSelectedRows: () => {
            const currentState = store.getState();
            const selectedIds = new Set(
                Object.keys(currentState.selection).filter(id => currentState.selection[id])
            );
            
            return currentState.data.filter((row, index) => 
                selectedIds.has(currentState.getRowId(row, index))
            );
        },
        
        getTotalPages: () => {
            const currentState = store.getState();
            return Math.ceil(currentState.data.length / currentState.pagination.pageSize);
        },
        
        canNextPage: () => {
            const currentState = store.getState();
            const totalPages = Math.ceil(currentState.data.length / currentState.pagination.pageSize);
            return currentState.pagination.pageIndex < totalPages - 1;
        },
        
        canPreviousPage: () => {
            const currentState = store.getState();
            return currentState.pagination.pageIndex > 0;
        }
    };
    
    return extendedStore;
}