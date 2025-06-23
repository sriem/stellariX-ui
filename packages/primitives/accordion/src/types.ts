/**
 * Accordion Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Accordion item definition
 */
export interface AccordionItem {
    /**
     * Unique identifier for the item
     */
    id: string;
    
    /**
     * Whether this item is expanded
     */
    expanded: boolean;
    
    /**
     * Whether this item is disabled
     */
    disabled?: boolean;
}

/**
 * Accordion component state
 */
export interface AccordionState {
    /**
     * Array of item states
     */
    items: AccordionItem[];
    
    /**
     * Currently expanded item IDs
     */
    expandedItems: string[];
    
    /**
     * Whether multiple items can be expanded
     */
    multiple: boolean;
    
    /**
     * Currently focused item ID
     */
    focusedItem: string | null;
    
    /**
     * Whether the accordion is disabled
     */
    disabled: boolean;
}

/**
 * Accordion component options
 */
export interface AccordionOptions {
    /**
     * Initial item configurations
     */
    items?: Array<{
        id: string;
        expanded?: boolean;
        disabled?: boolean;
    }>;
    
    /**
     * Initially expanded item IDs
     * @default []
     */
    expandedItems?: string[];
    
    /**
     * Allow multiple items to be expanded
     * @default false
     */
    multiple?: boolean;
    
    /**
     * Whether the accordion is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Allow all items to be collapsed
     * @default true
     */
    collapsible?: boolean;
    
    /**
     * Callback when item expands/collapses
     */
    onExpandedChange?: (expandedItems: string[]) => void;
    
    /**
     * Callback when a specific item toggles
     */
    onItemToggle?: (itemId: string, expanded: boolean) => void;
}

/**
 * Accordion component events
 */
export interface AccordionEvents {
    /**
     * Fired when expanded items change
     */
    expandedChange: {
        expandedItems: string[];
        previousExpandedItems: string[];
    };
    
    /**
     * Fired when an item is toggled
     */
    itemToggle: {
        itemId: string;
        expanded: boolean;
    };
    
    /**
     * Fired when an item receives focus
     */
    itemFocus: {
        itemId: string;
        event: FocusEvent;
    };
    
    /**
     * Fired when an item loses focus
     */
    itemBlur: {
        itemId: string;
        event: FocusEvent;
    };
}

/**
 * Props for accordion component
 */
export interface AccordionProps extends AccordionOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}

// Re-export state store type from state.ts
export type { AccordionStateStore } from './state.js';

// Re-export logic type from logic.ts
export type { AccordionLogic } from './logic.js';