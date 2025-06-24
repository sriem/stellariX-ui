/**
 * Table State Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS use subscription pattern: state.subscribe(listener)
 * ✅ ALWAYS verify via listener calls: expect(listener).toHaveBeenCalledWith()
 * 
 * This prevents infinite loops and ensures proper reactive testing
 */

import { describe, it, expect, vi } from 'vitest';
import { createTableState } from './state';
import type { ColumnDef } from './types';

interface TestData {
    id: number;
    name: string;
    age: number;
    email: string;
}

const testColumns: ColumnDef<TestData>[] = [
    { id: 'id', header: 'ID', accessorKey: 'id' },
    { id: 'name', header: 'Name', accessorKey: 'name' },
    { id: 'age', header: 'Age', accessorKey: 'age' },
    { id: 'email', header: 'Email', accessorKey: 'email' }
];

const testData: TestData[] = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' }
];

describe('Table State', () => {
    it('should create state with default values', () => {
        const state = createTableState<TestData>();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setSorting([]);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            sorting: []
        }));
    });
    
    it('should create state with initial options', () => {
        const state = createTableState<TestData>({
            columns: testColumns,
            data: testData,
            selectionMode: 'multiple',
            enableMultiSort: true,
            pagination: { pageIndex: 1, pageSize: 20 }
        });
        
        const listener = vi.fn();
        state.subscribe(listener);
        
        state.setData(testData);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            data: testData
        }));
    });
    
    it('should handle sorting operations', () => {
        const state = createTableState<TestData>({ columns: testColumns, data: testData });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.toggleSort('name');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            sorting: [{ id: 'name', desc: false }]
        }));
        
        listener.mockClear();
        state.toggleSort('name');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            sorting: [{ id: 'name', desc: true }]
        }));
        
        listener.mockClear();
        state.toggleSort('name');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            sorting: []
        }));
        
        listener.mockClear();
        state.setSorting([{ id: 'age', desc: true }]);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            sorting: [{ id: 'age', desc: true }]
        }));
        
        listener.mockClear();
        state.clearSorting();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            sorting: []
        }));
    });
    
    it('should handle multi-sort operations', () => {
        const state = createTableState<TestData>({ 
            columns: testColumns, 
            data: testData,
            enableMultiSort: true 
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.toggleSort('name');
        listener.mockClear();
        
        state.toggleSort('age', true);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            sorting: [
                { id: 'name', desc: false },
                { id: 'age', desc: false }
            ]
        }));
    });
    
    it('should handle selection in single mode', () => {
        const state = createTableState<TestData>({ 
            columns: testColumns, 
            data: testData,
            selectionMode: 'single',
            getRowId: (row) => row.id.toString()
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.toggleRowSelection('1');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            selection: { '1': true }
        }));
        
        listener.mockClear();
        state.toggleRowSelection('2');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            selection: { '1': false, '2': true }
        }));
        
        listener.mockClear();
        state.clearSelection();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            selection: {}
        }));
    });
    
    it('should handle selection in multiple mode', () => {
        const state = createTableState<TestData>({ 
            columns: testColumns, 
            data: testData,
            selectionMode: 'multiple',
            getRowId: (row) => row.id.toString()
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.toggleRowSelection('1');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            selection: { '1': true }
        }));
        
        listener.mockClear();
        state.toggleRowSelection('2');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            selection: { '1': true, '2': true }
        }));
        
        listener.mockClear();
        state.toggleRowSelection('1');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            selection: { '1': false, '2': true }
        }));
        
        listener.mockClear();
        state.toggleAllRowsSelection();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            selection: { '1': true, '2': true, '3': true }
        }));
        
        listener.mockClear();
        state.toggleAllRowsSelection();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            selection: { '1': false, '2': false, '3': false }
        }));
    });
    
    it('should handle column visibility', () => {
        const state = createTableState<TestData>({ columns: testColumns, data: testData });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.toggleColumnVisibility('email');
        expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({
            columnVisibility: { email: false }
        }));
        
        listener.mockClear();
        state.toggleColumnVisibility('email');
        expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({
            columnVisibility: { email: true }
        }));
        
        listener.mockClear();
        state.setColumnVisibility({ name: false, age: false });
        expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({
            columnVisibility: { name: false, age: false }
        }));
        
        listener.mockClear();
        state.showAllColumns();
        expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({
            columnVisibility: {
                id: true,
                name: true,
                age: true,
                email: true
            }
        }));
    });
    
    it('should handle pagination', () => {
        const state = createTableState<TestData>({ 
            columns: testColumns, 
            data: testData,
            pagination: { pageIndex: 0, pageSize: 2 }
        });
        const listener = vi.fn();
        
        expect(state.canPreviousPage()).toBe(false);
        expect(state.canNextPage()).toBe(true);
        expect(state.getTotalPages()).toBe(2);
        
        state.subscribe(listener);
        
        state.nextPage();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            pagination: { pageIndex: 1, pageSize: 2 }
        }));
        
        expect(state.canPreviousPage()).toBe(true);
        expect(state.canNextPage()).toBe(false);
        
        listener.mockClear();
        state.previousPage();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            pagination: { pageIndex: 0, pageSize: 2 }
        }));
        
        listener.mockClear();
        state.setPageSize(10);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            pagination: { pageIndex: 0, pageSize: 10 }
        }));
        expect(state.getTotalPages()).toBe(1);
    });
    
    it('should handle focused cell navigation', () => {
        const state = createTableState<TestData>({ columns: testColumns, data: testData });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setFocusedCell({ row: 0, col: 0 });
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focusedCell: { row: 0, col: 0 }
        }));
        
        listener.mockClear();
        state.moveFocus('right');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focusedCell: { row: 0, col: 1 }
        }));
        
        listener.mockClear();
        state.moveFocus('down');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focusedCell: { row: 1, col: 1 }
        }));
        
        listener.mockClear();
        state.moveFocus('left');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focusedCell: { row: 1, col: 0 }
        }));
        
        listener.mockClear();
        state.moveFocus('up');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focusedCell: { row: 0, col: 0 }
        }));
        
        listener.mockClear();
        state.moveFocus('up');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focusedCell: { row: 0, col: 0 }
        }));
    });
    
    it('should handle focused cell navigation with hidden columns', () => {
        const state = createTableState<TestData>({ columns: testColumns, data: testData });
        const listener = vi.fn();
        
        state.setColumnVisibility({ name: false, age: false });
        state.subscribe(listener);
        
        state.setFocusedCell({ row: 0, col: 0 });
        listener.mockClear();
        
        state.moveFocus('right');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focusedCell: { row: 0, col: 1 }
        }));
        
        listener.mockClear();
        state.moveFocus('right');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focusedCell: { row: 0, col: 1 }
        }));
    });
    
    it('should get selected rows', () => {
        const state = createTableState<TestData>({ 
            columns: testColumns, 
            data: testData,
            selectionMode: 'multiple',
            getRowId: (row) => row.id.toString()
        });
        
        state.setSelection({ '1': true, '3': true });
        
        expect(state.getSelectedRowIds()).toEqual(['1', '3']);
        expect(state.getSelectedRows()).toEqual([testData[0], testData[2]]);
    });
    
    it('should handle data and column updates', () => {
        const state = createTableState<TestData>();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setData(testData);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            data: testData
        }));
        
        listener.mockClear();
        state.setColumns(testColumns);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            columns: testColumns
        }));
        
        listener.mockClear();
        state.setLoading(true);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            loading: true
        }));
    });
    
    it('should handle derived state', () => {
        const state = createTableState<TestData>({ 
            columns: testColumns, 
            data: testData,
            selectionMode: 'multiple'
        });
        
        const selectedCount = state.derive(s => Object.values(s.selection).filter(Boolean).length);
        const listener = vi.fn();
        
        selectedCount.subscribe(listener);
        
        expect(selectedCount.get()).toBe(0);
        
        state.toggleRowSelection('0');
        expect(listener).toHaveBeenCalledWith(1);
        expect(selectedCount.get()).toBe(1);
        
        listener.mockClear();
        state.toggleRowSelection('1');
        expect(listener).toHaveBeenCalledWith(2);
        expect(selectedCount.get()).toBe(2);
    });
});