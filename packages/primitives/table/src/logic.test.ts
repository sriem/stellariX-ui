/**
 * Table Logic Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS test via callbacks: onChange, onFocus, etc.
 * ✅ ALWAYS verify behavior through callback invocations
 * ✅ For a11y props, call logic.getA11yProps() directly
 * 
 * This prevents infinite loops and ensures proper behavior testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTableLogic, tableUtils } from './logic';
import { createTableState } from './state';
import type { TableOptions, ColumnDef } from './types';

interface TestData {
    id: number;
    name: string;
    age: number;
    email: string;
}

const testColumns: ColumnDef<TestData>[] = [
    { id: 'id', header: 'ID', accessorKey: 'id' },
    { id: 'name', header: 'Name', accessorKey: 'name', enableSorting: true },
    { id: 'age', header: 'Age', accessorKey: 'age', enableSorting: true },
    { id: 'email', header: 'Email', accessorKey: 'email', enableSorting: false }
];

const testData: TestData[] = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' }
];

describe('Table Logic', () => {
    let stateStore: ReturnType<typeof createTableState<TestData>>;
    let logic: ReturnType<typeof createTableLogic<TestData>>;
    let mockOnSortingChange: ReturnType<typeof vi.fn>;
    let mockOnSelectionChange: ReturnType<typeof vi.fn>;
    let mockOnRowClick: ReturnType<typeof vi.fn>;
    let mockOnCellClick: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnSortingChange = vi.fn();
        mockOnSelectionChange = vi.fn();
        mockOnRowClick = vi.fn();
        mockOnCellClick = vi.fn();
        
        const options: TableOptions<TestData> = {
            columns: testColumns,
            data: testData,
            onSortingChange: mockOnSortingChange,
            onSelectionChange: mockOnSelectionChange,
            onRowClick: mockOnRowClick,
            onCellClick: mockOnCellClick,
            selectionMode: 'multiple',
            getRowId: (row) => row.id.toString()
        };
        
        stateStore = createTableState(options);
        logic = createTableLogic(stateStore, options);
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle sortingChange events', () => {
        logic.handleEvent('sortingChange', { 
            sorting: [{ id: 'name', desc: false }]
        });
        
        expect(mockOnSortingChange).toHaveBeenCalledWith([{ id: 'name', desc: false }]);
    });
    
    it('should handle selectionChange events', () => {
        logic.handleEvent('selectionChange', { 
            selection: { '1': true, '2': false }
        });
        
        expect(mockOnSelectionChange).toHaveBeenCalledWith({ '1': true, '2': false });
    });
    
    it('should handle rowClick events', () => {
        logic.handleEvent('rowClick', { 
            row: testData[0],
            index: 0
        });
        
        expect(mockOnRowClick).toHaveBeenCalledWith(testData[0], 0);
    });
    
    it('should handle cellClick events', () => {
        logic.handleEvent('cellClick', { 
            row: testData[0],
            columnId: 'name',
            value: 'John Doe'
        });
        
        expect(mockOnCellClick).toHaveBeenCalledWith(testData[0], 'name', 'John Doe');
    });
    
    it('should provide correct table a11y props', () => {
        const props = logic.getA11yProps('table');
        
        expect(props).toEqual({
            role: 'table',
            'aria-label': 'Data table',
            'aria-rowcount': 3,
            'aria-colcount': 4,
            'aria-busy': false
        });
    });
    
    it('should provide correct column header a11y props', () => {
        const propsFunc = logic.getA11yProps('th');
        const sortableProps = propsFunc('name');
        const nonSortableProps = propsFunc('email');
        
        expect(sortableProps).toEqual({
            role: 'columnheader',
            'aria-sort': 'none',
            tabIndex: 0
        });
        
        expect(nonSortableProps).toEqual({
            role: 'columnheader',
            'aria-sort': undefined,
            tabIndex: -1
        });
    });
    
    it('should provide correct checkbox a11y props', () => {
        const propsFunc = logic.getA11yProps('checkbox');
        const props = propsFunc('1');
        
        expect(props).toEqual({
            role: 'checkbox',
            'aria-checked': false,
            'aria-label': 'Select row 1',
            tabIndex: 0
        });
    });
    
    it('should provide correct selectAll a11y props', () => {
        const props = logic.getA11yProps('selectAll');
        
        expect(props).toEqual({
            role: 'checkbox',
            'aria-checked': false,
            'aria-label': 'Select all rows',
            tabIndex: 0
        });
    });
    
    it('should handle column header click interaction', () => {
        const handlers = logic.getInteractionHandlers('th');
        const mockEvent = {
            currentTarget: {
                dataset: { columnId: 'name' }
            },
            shiftKey: false
        } as any;
        
        handlers.onClick(mockEvent);
        
        expect(mockOnSortingChange).toHaveBeenCalledWith([{ id: 'name', desc: false }]);
    });
    
    it('should not sort disabled columns', () => {
        const handlers = logic.getInteractionHandlers('th');
        const mockEvent = {
            currentTarget: {
                dataset: { columnId: 'email' }
            },
            shiftKey: false
        } as any;
        
        handlers.onClick(mockEvent);
        
        expect(mockOnSortingChange).not.toHaveBeenCalled();
    });
    
    it('should handle row click interaction', () => {
        const handlers = logic.getInteractionHandlers('row');
        const mockEvent = {
            currentTarget: {
                dataset: { rowIndex: '0' }
            }
        } as any;
        
        handlers.onClick(mockEvent);
        
        expect(mockOnRowClick).toHaveBeenCalledWith(testData[0], 0);
        expect(mockOnSelectionChange).toHaveBeenCalledWith({ '1': true });
    });
    
    it('should handle cell click interaction', () => {
        const handlers = logic.getInteractionHandlers('cell');
        const mockEvent = {
            currentTarget: {
                dataset: { rowIndex: '0', columnId: 'name' }
            },
            stopPropagation: vi.fn()
        } as any;
        
        handlers.onClick(mockEvent);
        
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(mockOnCellClick).toHaveBeenCalledWith(testData[0], 'name', 'John Doe');
    });
    
    it('should handle checkbox change interaction', () => {
        const handlers = logic.getInteractionHandlers('checkbox');
        const mockEvent = {
            currentTarget: {
                dataset: { rowId: '1' }
            }
        } as any;
        
        handlers.onChange(mockEvent);
        
        expect(mockOnSelectionChange).toHaveBeenCalledWith({ '1': true });
    });
    
    it('should handle selectAll change interaction', () => {
        const handlers = logic.getInteractionHandlers('selectAll');
        const mockEvent = {} as any;
        
        handlers.onChange(mockEvent);
        
        expect(mockOnSelectionChange).toHaveBeenCalledWith({ '1': true, '2': true, '3': true });
    });
    
    it('should handle keyboard navigation', () => {
        stateStore.setFocusedCell({ row: 1, col: 1 });
        
        const handlers = logic.getInteractionHandlers('table');
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        const arrowUpEvent = {
            key: 'ArrowUp',
            preventDefault: vi.fn()
        } as any;
        
        handlers.onKeyDown(arrowUpEvent);
        
        expect(arrowUpEvent.preventDefault).toHaveBeenCalled();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focusedCell: { row: 0, col: 1 }
        }));
    });
    
    it('should handle space key for selection', () => {
        stateStore.setFocusedCell({ row: 0, col: 0 });
        
        const handlers = logic.getInteractionHandlers('table');
        const spaceEvent = {
            key: ' ',
            preventDefault: vi.fn()
        } as any;
        
        handlers.onKeyDown(spaceEvent);
        
        expect(spaceEvent.preventDefault).toHaveBeenCalled();
        expect(mockOnSelectionChange).toHaveBeenCalledWith({ '1': true });
    });
    
    it('should handle enter key for sorting', () => {
        stateStore.setFocusedCell({ row: 0, col: 1 });
        
        const handlers = logic.getInteractionHandlers('table');
        const enterEvent = {
            key: 'Enter',
            preventDefault: vi.fn(),
            shiftKey: false
        } as any;
        
        handlers.onKeyDown(enterEvent);
        
        expect(enterEvent.preventDefault).toHaveBeenCalled();
        expect(mockOnSortingChange).toHaveBeenCalledWith([{ id: 'name', desc: false }]);
    });
});

describe('Table Utils', () => {
    it('should sort data correctly', () => {
        const sorted = tableUtils.getSortedData(
            testData,
            [{ id: 'age', desc: false }],
            testColumns
        );
        
        expect(sorted[0].age).toBe(25);
        expect(sorted[1].age).toBe(30);
        expect(sorted[2].age).toBe(35);
        
        const sortedDesc = tableUtils.getSortedData(
            testData,
            [{ id: 'age', desc: true }],
            testColumns
        );
        
        expect(sortedDesc[0].age).toBe(35);
        expect(sortedDesc[1].age).toBe(30);
        expect(sortedDesc[2].age).toBe(25);
    });
    
    it('should handle multi-column sorting', () => {
        const dataWithDuplicates = [
            { id: 1, name: 'John', age: 30, email: 'john@example.com' },
            { id: 2, name: 'Jane', age: 30, email: 'jane@example.com' },
            { id: 3, name: 'Bob', age: 25, email: 'bob@example.com' }
        ];
        
        const sorted = tableUtils.getSortedData(
            dataWithDuplicates,
            [
                { id: 'age', desc: false },
                { id: 'name', desc: false }
            ],
            testColumns
        );
        
        expect(sorted[0].name).toBe('Bob');
        expect(sorted[1].name).toBe('Jane');
        expect(sorted[2].name).toBe('John');
    });
    
    it('should paginate data correctly', () => {
        const page1 = tableUtils.getPaginatedData(testData, { pageIndex: 0, pageSize: 2 });
        expect(page1).toHaveLength(2);
        expect(page1[0].id).toBe(1);
        expect(page1[1].id).toBe(2);
        
        const page2 = tableUtils.getPaginatedData(testData, { pageIndex: 1, pageSize: 2 });
        expect(page2).toHaveLength(1);
        expect(page2[0].id).toBe(3);
    });
    
    it('should filter visible columns', () => {
        const visible = tableUtils.getVisibleColumns(
            testColumns,
            { id: true, name: false, age: true, email: false }
        );
        
        expect(visible).toHaveLength(2);
        expect(visible[0].id).toBe('id');
        expect(visible[1].id).toBe('age');
    });
});