/**
 * Table Component
 * Main entry point and public API
 */

import { createTableState } from './state';
import { createTableLogic, tableUtils } from './logic';
import type { TableOptions, TableState, TableEvents } from './types';
import type { ComponentCore } from '@stellarix-ui/core';

/**
 * Creates a table component
 * @param options Component options
 * @returns Component instance
 */
export function createTable<TData = any>(options: TableOptions<TData> = { columns: [], data: [] }): ComponentCore<TableState<TData>, TableEvents<TData>> {
    const state = createTableState(options);
    const logic = createTableLogic(state, options);
    
    // Connect logic to state
    logic.connect(state);
    logic.initialize();
    
    return {
        state,
        logic,
        metadata: {
            name: 'Table',
            version: '1.0.0',
            accessibility: {
                role: 'table',
                keyboardShortcuts: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'],
                ariaAttributes: ['aria-label', 'aria-rowcount', 'aria-colcount', 'aria-sort', 'aria-checked', 'aria-busy'],
                wcagLevel: 'AA',
                patterns: ['table', 'grid']
            },
            events: {
                supported: ['sortingChange', 'selectionChange', 'columnVisibilityChange', 'paginationChange', 'rowClick', 'cellClick', 'focusedCellChange'],
                required: [],
                custom: {
                    sortingChange: { description: 'Fired when sorting state changes' },
                    selectionChange: { description: 'Fired when selection state changes' },
                    columnVisibilityChange: { description: 'Fired when column visibility changes' },
                    paginationChange: { description: 'Fired when pagination state changes' },
                    rowClick: { description: 'Fired when a row is clicked' },
                    cellClick: { description: 'Fired when a cell is clicked' },
                    focusedCellChange: { description: 'Fired when focused cell changes' }
                }
            },
            structure: {
                elements: {
                    'table': {
                        type: 'table',
                        role: 'table',
                        optional: false
                    },
                    'thead': {
                        type: 'thead',
                        role: 'rowgroup',
                        optional: false
                    },
                    'tbody': {
                        type: 'tbody',
                        role: 'rowgroup',
                        optional: false
                    },
                    'tr': {
                        type: 'tr',
                        role: 'row',
                        optional: false
                    },
                    'th': {
                        type: 'th',
                        role: 'columnheader',
                        optional: false
                    },
                    'td': {
                        type: 'td',
                        role: 'cell',
                        optional: false
                    }
                }
            }
        },
        connect: (adapter: any) => {
            return adapter.createComponent({
                state,
                logic,
                metadata: {
                    name: 'Table',
                    version: '1.0.0'
                }
            });
        }
    };
}

// Re-export types
export type { 
    TableOptions, 
    TableState, 
    TableEvents, 
    TableProps,
    ColumnDef,
    SortingState,
    PaginationState,
    CellPosition,
    SelectionMode,
    SortDirection,
    ProcessedRow,
    TableUtils
} from './types';

export type { TableStateStore } from './state';

// Export utilities
export { tableUtils };

// Default export for convenience
export default createTable;