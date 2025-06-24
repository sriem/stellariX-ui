/**
 * Pagination Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Pagination component state
 * Represents the internal state of the component
 */
export interface PaginationState {
    /**
     * Current page number (1-based)
     */
    currentPage: number;
    
    /**
     * Total number of items
     */
    totalItems: number;
    
    /**
     * Number of items per page
     */
    itemsPerPage: number;
    
    /**
     * Total number of pages (derived)
     */
    totalPages: number;
    
    /**
     * Number of sibling pages to show on each side of current page
     */
    siblingCount: number;
    
    /**
     * Whether the component is disabled
     */
    disabled: boolean;
}

/**
 * Pagination component options
 * Configuration passed when creating the component
 */
export interface PaginationOptions {
    /**
     * Initial page number
     * @default 1
     */
    currentPage?: number;
    
    /**
     * Total number of items
     * @default 0
     */
    totalItems?: number;
    
    /**
     * Items per page
     * @default 10
     */
    itemsPerPage?: number;
    
    /**
     * Number of sibling pages to show
     * @default 1
     */
    siblingCount?: number;
    
    /**
     * Whether the component is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Callback when page changes
     */
    onPageChange?: (page: number) => void;
    
    /**
     * Callback when items per page changes
     */
    onItemsPerPageChange?: (itemsPerPage: number) => void;
}

/**
 * Pagination component events
 * Events that can be triggered by the component
 */
export interface PaginationEvents {
    /**
     * Fired when the page changes
     */
    pageChange: {
        page: number;
        previousPage: number;
    };
    
    /**
     * Fired when items per page changes
     */
    itemsPerPageChange: {
        itemsPerPage: number;
        previousItemsPerPage: number;
    };
    
    /**
     * Fired when navigation occurs
     */
    navigate: {
        direction: 'first' | 'previous' | 'next' | 'last' | 'page';
        page: number;
    };
}

/**
 * Pagination component props
 * Props that can be passed to the component
 */
export interface PaginationProps extends PaginationOptions {
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
 * Page information for display
 */
export interface PageInfo {
    /**
     * Start index of items on current page (1-based)
     */
    startIndex: number;
    
    /**
     * End index of items on current page (1-based)
     */
    endIndex: number;
    
    /**
     * Array of page numbers to display
     */
    pages: (number | 'ellipsis')[];
}