/**
 * Tabs Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Single tab configuration
 */
export interface Tab {
    /**
     * Unique identifier for the tab
     */
    id: string;
    
    /**
     * Label to display in the tab list
     */
    label: string;
    
    /**
     * Whether the tab is disabled
     */
    disabled?: boolean;
    
    /**
     * Icon to display (framework adapter will handle rendering)
     */
    icon?: any;
}

/**
 * Tabs orientation
 */
export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Tab activation mode
 */
export type TabActivationMode = 'automatic' | 'manual';

/**
 * Tabs component state
 * Represents the internal state of the component
 */
export interface TabsState {
    /**
     * Currently active tab ID
     */
    activeTab: string | null;
    
    /**
     * List of tabs
     */
    tabs: Tab[];
    
    /**
     * Whether the component is disabled
     */
    disabled: boolean;
    
    /**
     * Orientation of the tabs
     */
    orientation: TabsOrientation;
    
    /**
     * Index of the focused tab (for keyboard navigation)
     */
    focusedIndex: number;
    
    /**
     * Whether to activate tabs automatically on focus
     */
    activationMode: TabActivationMode;
}

/**
 * Tabs component options
 * Configuration passed when creating the component
 */
export interface TabsOptions {
    /**
     * Initial active tab ID
     */
    activeTab?: string;
    
    /**
     * List of tabs
     */
    tabs?: Tab[];
    
    /**
     * Whether the component is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Orientation of the tabs
     * @default 'horizontal'
     */
    orientation?: TabsOrientation;
    
    /**
     * Tab activation mode
     * @default 'automatic'
     */
    activationMode?: TabActivationMode;
    
    /**
     * ID attribute for the tabs
     */
    id?: string;
    
    /**
     * Callback when active tab changes
     */
    onChange?: (tabId: string) => void;
    
    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Tabs component events
 * Events that can be triggered by the component
 */
export interface TabsEvents {
    /**
     * Fired when the active tab changes
     */
    change: {
        tabId: string;
        previousTabId: string | null;
    };
    
    /**
     * Fired when a tab receives focus
     */
    focus: {
        tabId: string;
        index: number;
    };
    
    /**
     * Fired when keyboard navigation occurs
     */
    navigate: {
        direction: 'next' | 'previous' | 'first' | 'last';
        index: number;
    };
}

/**
 * Tabs component props
 * Props that can be passed to the component
 */
export interface TabsProps extends TabsOptions {
    /**
     * Children (tab panels) - framework adapter will handle rendering
     */
    children?: any;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}