/**
 * Breadcrumb Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Breadcrumb item definition
 */
export interface BreadcrumbItem {
    /**
     * Unique identifier for the item
     */
    id: string;
    
    /**
     * Display text for the breadcrumb
     */
    label: string;
    
    /**
     * URL or path for navigation
     */
    href?: string;
    
    /**
     * Whether this is the current/active item
     * @default false
     */
    current?: boolean;
    
    /**
     * Whether the item is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Additional metadata for the item
     */
    metadata?: Record<string, any>;
}

/**
 * Breadcrumb component state
 * Represents the internal state of the component
 */
export interface BreadcrumbState {
    /**
     * List of breadcrumb items
     */
    items: BreadcrumbItem[];
    
    /**
     * Separator between breadcrumb items
     * @default "/"
     */
    separator: string;
    
    /**
     * Maximum number of items to display (for truncation)
     * Items in the middle will be collapsed
     */
    maxItems?: number;
    
    /**
     * Whether the breadcrumb is disabled
     */
    disabled: boolean;
    
    /**
     * Currently focused item index
     */
    focusedIndex: number;
    
    /**
     * Whether to show home icon for first item
     */
    showHomeIcon: boolean;
}

/**
 * Breadcrumb component options
 * Configuration passed when creating the component
 */
export interface BreadcrumbOptions {
    /**
     * Initial breadcrumb items
     * @default []
     */
    items?: BreadcrumbItem[];
    
    /**
     * Separator between items
     * @default "/"
     */
    separator?: string;
    
    /**
     * Maximum items to display before truncation
     */
    maxItems?: number;
    
    /**
     * Whether the breadcrumb is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Whether to show home icon for first item
     * @default false
     */
    showHomeIcon?: boolean;
    
    /**
     * ID attribute for the breadcrumb
     */
    id?: string;
    
    /**
     * Callback when an item is clicked
     */
    onItemClick?: (item: BreadcrumbItem, index: number) => void;
    
    /**
     * Callback when items change
     */
    onChange?: (items: BreadcrumbItem[]) => void;
    
    /**
     * Additional CSS classes
     */
    className?: string;
    
    /**
     * ARIA label for the navigation
     * @default "Breadcrumb"
     */
    ariaLabel?: string;
}

/**
 * Breadcrumb component events
 * Events that can be triggered by the component
 */
export interface BreadcrumbEvents {
    /**
     * Fired when an item is clicked
     */
    itemClick: {
        item: BreadcrumbItem;
        index: number;
    };
    
    /**
     * Fired when items are updated
     */
    itemsChange: {
        items: BreadcrumbItem[];
        previousItems: BreadcrumbItem[];
    };
    
    /**
     * Fired when a breadcrumb item receives focus
     */
    itemFocus: {
        index: number;
        item: BreadcrumbItem;
    };
    
    /**
     * Fired when keyboard navigation occurs
     */
    keyNavigation: {
        key: string;
        fromIndex: number;
        toIndex: number;
    };
}

/**
 * Breadcrumb component props
 * Props that can be passed to the component
 */
export interface BreadcrumbProps extends BreadcrumbOptions {
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}