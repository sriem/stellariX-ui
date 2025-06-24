/**
 * Table Component Logic
 * Handles interactions and business logic for the table component
 */

import { LogicLayerBuilder } from '@stellarix/core';
import { generateComponentId } from '@stellarix/utils';
import type { LogicLayer } from '@stellarix/core';
import type { TableState, TableEvents, TableOptions, ColumnDef } from './types';
import type { TableStateStore } from './state';

/**
 * Utility to get cell value from row data
 */
function getCellValue<TData>(
    row: TData,
    column: ColumnDef<TData>
): any {
    if (column.accessorFn) {
        return column.accessorFn(row);
    }
    if (column.accessorKey && typeof row === 'object' && row !== null) {
        return (row as any)[column.accessorKey];
    }
    return undefined;
}

/**
 * Sort comparator function
 */
function sortComparator<TData>(
    a: TData,
    b: TData,
    columnId: string,
    columns: ColumnDef<TData>[],
    desc: boolean
): number {
    const column = columns.find(col => col.id === columnId);
    if (!column) return 0;
    
    const aValue = getCellValue(a, column);
    const bValue = getCellValue(b, column);
    
    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    const result = aValue < bValue ? -1 : 1;
    return desc ? -result : result;
}

/**
 * Creates the logic layer for the table component
 */
export function createTableLogic<TData = any>(
    state: TableStateStore<TData>,
    options: TableOptions<TData> = { columns: [], data: [] }
): LogicLayer<TableState<TData>, TableEvents<TData>> {
    const componentId = generateComponentId('table');
    
    return new LogicLayerBuilder<TableState<TData>, TableEvents<TData>>()
        .onEvent('sortingChange', (currentState, payload) => {
            const sorting = payload && 'sorting' in payload ? payload.sorting : [];
            state.setSorting(sorting);
            
            if (options.onSortingChange) {
                options.onSortingChange(sorting);
            }
            
            return null;
        })
        
        .onEvent('selectionChange', (currentState, payload) => {
            const selection = payload && 'selection' in payload ? payload.selection : {};
            state.setSelection(selection);
            
            if (options.onSelectionChange) {
                options.onSelectionChange(selection);
            }
            
            return null;
        })
        
        .onEvent('columnVisibilityChange', (currentState, payload) => {
            const visibility = payload && 'visibility' in payload ? payload.visibility : {};
            state.setColumnVisibility(visibility);
            
            if (options.onColumnVisibilityChange) {
                options.onColumnVisibilityChange(visibility);
            }
            
            return null;
        })
        
        .onEvent('paginationChange', (currentState, payload) => {
            const pagination = payload && 'pagination' in payload ? payload.pagination : currentState.pagination;
            state.setPagination(pagination);
            
            if (options.onPaginationChange) {
                options.onPaginationChange(pagination);
            }
            
            return null;
        })
        
        .onEvent('rowClick', (currentState, payload) => {
            const row = payload && 'row' in payload ? payload.row : null;
            const index = payload && 'index' in payload ? payload.index : -1;
            
            if (row !== null && index >= 0 && options.onRowClick) {
                options.onRowClick(row, index);
            }
            
            return null;
        })
        
        .onEvent('cellClick', (currentState, payload) => {
            const row = payload && 'row' in payload ? payload.row : null;
            const columnId = payload && 'columnId' in payload ? payload.columnId : '';
            const value = payload && 'value' in payload ? payload.value : undefined;
            
            if (row !== null && columnId && options.onCellClick) {
                options.onCellClick(row, columnId, value);
            }
            
            return null;
        })
        
        .onEvent('focusedCellChange', (currentState, payload) => {
            const cell = payload && 'cell' in payload ? payload.cell : null;
            state.setFocusedCell(cell);
            
            return null;
        })
        
        .withA11y('table', (state) => ({
            role: 'table',
            'aria-label': 'Data table',
            'aria-rowcount': state.data.length,
            'aria-colcount': state.columns.filter(col => 
                state.columnVisibility[col.id] !== false
            ).length,
            'aria-busy': state.loading
        }))
        
        .withA11y('thead', (state) => ({
            role: 'rowgroup'
        }))
        
        .withA11y('tbody', (state) => ({
            role: 'rowgroup'
        }))
        
        .withA11y('tr', (state) => ({
            role: 'row'
        }))
        
        .withA11y('th', (state) => (columnId: string) => {
            const column = state.columns.find(col => col.id === columnId);
            const sortState = state.sorting.find(s => s.id === columnId);
            
            return {
                role: 'columnheader',
                'aria-sort': sortState 
                    ? (sortState.desc ? 'descending' : 'ascending')
                    : column?.enableSorting !== false ? 'none' : undefined,
                tabIndex: column?.enableSorting !== false ? 0 : -1
            };
        })
        
        .withA11y('td', (state) => ({
            role: 'cell'
        }))
        
        .withA11y('checkbox', (state) => (rowId: string) => ({
            role: 'checkbox',
            'aria-checked': !!state.selection[rowId],
            'aria-label': `Select row ${rowId}`,
            tabIndex: 0
        }))
        
        .withA11y('selectAll', (state) => {
            const allRowIds = state.data.map((row, index) => 
                state.getRowId(row, index)
            );
            const selectedCount = allRowIds.filter(id => state.selection[id]).length;
            const allSelected = selectedCount === allRowIds.length && allRowIds.length > 0;
            const indeterminate = selectedCount > 0 && selectedCount < allRowIds.length;
            
            return {
                role: 'checkbox',
                'aria-checked': indeterminate ? 'mixed' : allSelected,
                'aria-label': 'Select all rows',
                tabIndex: 0
            };
        })
        
        .withInteraction('th', 'onClick', (currentState, event) => {
            const columnId = (event.currentTarget as HTMLElement).dataset.columnId;
            if (!columnId) return null;
            
            const column = currentState.columns.find(col => col.id === columnId);
            if (!column || column.enableSorting === false) return null;
            
            state.toggleSort(columnId, event.shiftKey);
            
            return 'sortingChange';
            
            return 'sortingChange';
        })
        
        .withInteraction('th', 'onKeyDown', (currentState, event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const columnId = (event.currentTarget as HTMLElement).dataset.columnId;
                if (!columnId) return null;
                
                const column = currentState.columns.find(col => col.id === columnId);
                if (!column || column.enableSorting === false) return null;
                
                state.toggleSort(columnId, event.shiftKey);
                
                return 'sortingChange';
            }
            
            return null;
        })
        
        .withInteraction('row', 'onClick', (currentState, event) => {
            const rowIndex = parseInt((event.currentTarget as HTMLElement).dataset.rowIndex || '-1');
            if (rowIndex < 0 || rowIndex >= currentState.data.length) return null;
            
            const row = currentState.data[rowIndex];
            const rowId = currentState.getRowId(row, rowIndex);
            
            if (currentState.selectionMode !== 'none') {
                state.toggleRowSelection(rowId);
            }
            
            if (options.onRowClick) {
                options.onRowClick(row, rowIndex);
            }
            
            return 'rowClick';
        })
        
        .withInteraction('cell', 'onClick', (currentState, event) => {
            event.stopPropagation();
            
            const rowIndex = parseInt((event.currentTarget as HTMLElement).dataset.rowIndex || '-1');
            const columnId = (event.currentTarget as HTMLElement).dataset.columnId;
            
            if (rowIndex < 0 || rowIndex >= currentState.data.length || !columnId) return null;
            
            const row = currentState.data[rowIndex];
            const column = currentState.columns.find(col => col.id === columnId);
            if (!column) return null;
            
            const value = getCellValue(row, column);
            
            const colIndex = currentState.columns
                .filter(col => currentState.columnVisibility[col.id] !== false)
                .findIndex(col => col.id === columnId);
                
            state.setFocusedCell({ row: rowIndex, col: colIndex });
            
            if (options.onCellClick) {
                options.onCellClick(row, columnId, value);
            }
            
            return 'cellClick';
        })
        
        .withInteraction('checkbox', 'onChange', (currentState, event) => {
            const rowId = (event.currentTarget as HTMLInputElement).dataset.rowId;
            if (!rowId) return null;
            
            state.toggleRowSelection(rowId);
            
            return 'selectionChange';
        })
        
        .withInteraction('selectAll', 'onChange', (currentState, event) => {
            state.toggleAllRowsSelection();
            
            return 'selectionChange';
        })
        
        .withInteraction('table', 'onKeyDown', (currentState, event) => {
            if (!currentState.focusedCell) return null;
            
            switch (event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    state.moveFocus('up');
                    return 'focusedCellChange';
                    
                case 'ArrowDown':
                    event.preventDefault();
                    state.moveFocus('down');
                    return 'focusedCellChange';
                    
                case 'ArrowLeft':
                    event.preventDefault();
                    state.moveFocus('left');
                    return 'focusedCellChange';
                    
                case 'ArrowRight':
                    event.preventDefault();
                    state.moveFocus('right');
                    return 'focusedCellChange';
                    
                case ' ':
                    if (currentState.selectionMode !== 'none') {
                        event.preventDefault();
                        const row = currentState.data[currentState.focusedCell.row];
                        if (row) {
                            const rowId = currentState.getRowId(row, currentState.focusedCell.row);
                            state.toggleRowSelection(rowId);
                            
                            return 'selectionChange';
                        }
                    }
                    break;
                    
                case 'Enter':
                    const visibleColumns = currentState.columns.filter(col => 
                        currentState.columnVisibility[col.id] !== false
                    );
                    const column = visibleColumns[currentState.focusedCell.col];
                    
                    if (column && column.enableSorting !== false) {
                        event.preventDefault();
                        state.toggleSort(column.id, event.shiftKey);
                        
                        return 'sortingChange';
                    }
                    break;
            }
            
            return null;
        })
        
        .build();
}

/**
 * Table utilities for data processing
 */
export const tableUtils = {
    getSortedData<TData>(
        data: TData[],
        sorting: { id: string; desc: boolean }[],
        columns: ColumnDef<TData>[]
    ): TData[] {
        if (!sorting.length) return data;
        
        return [...data].sort((a, b) => {
            for (const sort of sorting) {
                const result = sortComparator(a, b, sort.id, columns, sort.desc);
                if (result !== 0) return result;
            }
            return 0;
        });
    },
    
    getPaginatedData<TData>(
        data: TData[],
        pagination: { pageIndex: number; pageSize: number }
    ): TData[] {
        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;
        return data.slice(start, end);
    },
    
    getVisibleColumns<TData>(
        columns: ColumnDef<TData>[],
        visibility: Record<string, boolean>
    ): ColumnDef<TData>[] {
        return columns.filter(col => visibility[col.id] !== false);
    }
};