/**
 * Table Component Types
 * Define all TypeScript interfaces for the table component
 */

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Selection mode
 */
export type SelectionMode = 'none' | 'single' | 'multiple';

/**
 * Column definition
 */
export interface ColumnDef<TData = any> {
    /**
     * Unique identifier for the column
     */
    id: string;
    
    /**
     * Header content/label
     */
    header: string | (() => any);
    
    /**
     * Accessor to get cell value from row data
     */
    accessorKey?: string;
    accessorFn?: (row: TData) => any;
    
    /**
     * Cell renderer
     */
    cell?: (info: { row: TData; value: any }) => any;
    
    /**
     * Whether the column can be sorted
     * @default true
     */
    enableSorting?: boolean;
    
    /**
     * Whether the column can be hidden
     * @default true
     */
    enableHiding?: boolean;
    
    /**
     * Column width
     */
    size?: number;
    
    /**
     * Min/max width constraints
     */
    minSize?: number;
    maxSize?: number;
}

/**
 * Sorting state for a column
 */
export interface SortingState {
    id: string;
    desc: boolean;
}

/**
 * Pagination state
 */
export interface PaginationState {
    pageIndex: number;
    pageSize: number;
}

/**
 * Focused cell position
 */
export interface CellPosition {
    row: number;
    col: number;
}

/**
 * Table component state
 */
export interface TableState<TData = any> {
    /**
     * Column definitions
     */
    columns: ColumnDef<TData>[];
    
    /**
     * Table data
     */
    data: TData[];
    
    /**
     * Current sorting state
     */
    sorting: SortingState[];
    
    /**
     * Row selection state (rowId -> boolean)
     */
    selection: Record<string, boolean>;
    
    /**
     * Column visibility state (columnId -> boolean)
     */
    columnVisibility: Record<string, boolean>;
    
    /**
     * Pagination state
     */
    pagination: PaginationState;
    
    /**
     * Currently focused cell
     */
    focusedCell: CellPosition | null;
    
    /**
     * Selection mode
     */
    selectionMode: SelectionMode;
    
    /**
     * Whether multi-sort is enabled
     */
    enableMultiSort: boolean;
    
    /**
     * Whether the table is loading
     */
    loading: boolean;
    
    /**
     * Row ID getter function
     */
    getRowId: (row: TData, index: number) => string;
}

/**
 * Table component options
 */
export interface TableOptions<TData = any> {
    /**
     * Column definitions
     */
    columns: ColumnDef<TData>[];
    
    /**
     * Table data
     */
    data: TData[];
    
    /**
     * Initial sorting state
     */
    sorting?: SortingState[];
    
    /**
     * Initial selection state
     */
    selection?: Record<string, boolean>;
    
    /**
     * Initial column visibility
     */
    columnVisibility?: Record<string, boolean>;
    
    /**
     * Initial pagination state
     */
    pagination?: PaginationState;
    
    /**
     * Selection mode
     * @default 'none'
     */
    selectionMode?: SelectionMode;
    
    /**
     * Enable multi-column sorting
     * @default false
     */
    enableMultiSort?: boolean;
    
    /**
     * Loading state
     * @default false
     */
    loading?: boolean;
    
    /**
     * Custom row ID getter
     * @default (row, index) => index.toString()
     */
    getRowId?: (row: TData, index: number) => string;
    
    /**
     * Callback when sorting changes
     */
    onSortingChange?: (sorting: SortingState[]) => void;
    
    /**
     * Callback when selection changes
     */
    onSelectionChange?: (selection: Record<string, boolean>) => void;
    
    /**
     * Callback when column visibility changes
     */
    onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
    
    /**
     * Callback when pagination changes
     */
    onPaginationChange?: (pagination: PaginationState) => void;
    
    /**
     * Callback when a row is clicked
     */
    onRowClick?: (row: TData, index: number) => void;
    
    /**
     * Callback when a cell is clicked
     */
    onCellClick?: (row: TData, columnId: string, value: any) => void;
}

/**
 * Table component events
 */
export interface TableEvents<TData = any> {
    /**
     * Fired when sorting changes
     */
    sortingChange: {
        sorting: SortingState[];
    };
    
    /**
     * Fired when selection changes
     */
    selectionChange: {
        selection: Record<string, boolean>;
    };
    
    /**
     * Fired when column visibility changes
     */
    columnVisibilityChange: {
        visibility: Record<string, boolean>;
    };
    
    /**
     * Fired when pagination changes
     */
    paginationChange: {
        pagination: PaginationState;
    };
    
    /**
     * Fired when a row is clicked
     */
    rowClick: {
        row: TData;
        index: number;
    };
    
    /**
     * Fired when a cell is clicked
     */
    cellClick: {
        row: TData;
        columnId: string;
        value: any;
    };
    
    /**
     * Fired when focused cell changes
     */
    focusedCellChange: {
        cell: CellPosition | null;
    };
}

/**
 * Table component props
 */
export interface TableProps<TData = any> extends TableOptions<TData> {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}

/**
 * Processed row data with computed properties
 */
export interface ProcessedRow<TData = any> {
    original: TData;
    id: string;
    index: number;
    isSelected: boolean;
    cells: Array<{
        columnId: string;
        value: any;
    }>;
}

/**
 * Table utilities for data processing
 */
export interface TableUtils<TData = any> {
    /**
     * Get sorted data based on current sorting state
     */
    getSortedData(data: TData[], sorting: SortingState[], columns: ColumnDef<TData>[]): TData[];
    
    /**
     * Get paginated data
     */
    getPaginatedData(data: TData[], pagination: PaginationState): TData[];
    
    /**
     * Get visible columns
     */
    getVisibleColumns(columns: ColumnDef<TData>[], visibility: Record<string, boolean>): ColumnDef<TData>[];
    
    /**
     * Process rows for rendering
     */
    getProcessedRows(
        data: TData[], 
        columns: ColumnDef<TData>[], 
        selection: Record<string, boolean>,
        getRowId: (row: TData, index: number) => string
    ): ProcessedRow<TData>[];
}