/**
 * NavigationMenu Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Navigation menu item definition
 */
export interface NavigationMenuItem {
    /**
     * Unique identifier for the item
     */
    id: string;
    
    /**
     * Display text for the menu item
     */
    label: string;
    
    /**
     * URL or path for navigation
     */
    href?: string;
    
    /**
     * Whether this is the active/current item
     * @default false
     */
    active?: boolean;
    
    /**
     * Whether the item is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Icon to display with the item
     */
    icon?: any;
    
    /**
     * Child menu items for nested navigation
     */
    children?: NavigationMenuItem[];
    
    /**
     * Whether the submenu is expanded
     * @default false
     */
    expanded?: boolean;
    
    /**
     * Additional metadata for the item
     */
    metadata?: Record<string, any>;
}

/**
 * Navigation menu orientation
 */
export type NavigationMenuOrientation = 'horizontal' | 'vertical';

/**
 * Navigation menu trigger type for submenus
 */
export type NavigationMenuTrigger = 'click' | 'hover' | 'both';

/**
 * NavigationMenu component state
 * Represents the internal state of the component
 */
export interface NavigationMenuState {
    /**
     * List of navigation menu items
     */
    items: NavigationMenuItem[];
    
    /**
     * Orientation of the menu
     * @default 'horizontal'
     */
    orientation: NavigationMenuOrientation;
    
    /**
     * Whether the menu is collapsed (mobile mode)
     * @default false
     */
    collapsed: boolean;
    
    /**
     * Whether the menu is disabled
     * @default false
     */
    disabled: boolean;
    
    /**
     * Currently focused item ID
     */
    focusedItemId: string | null;
    
    /**
     * Currently active item ID (for current page/route)
     */
    activeItemId: string | null;
    
    /**
     * IDs of expanded menu items
     */
    expandedItemIds: string[];
    
    /**
     * Trigger type for submenus
     * @default 'click'
     */
    trigger: NavigationMenuTrigger;
    
    /**
     * Whether to show mobile menu button
     * @default true
     */
    showMobileMenu: boolean;
    
    /**
     * Breakpoint for mobile menu (px)
     * @default 768
     */
    mobileBreakpoint: number;
}

/**
 * NavigationMenu component options
 * Configuration passed when creating the component
 */
export interface NavigationMenuOptions {
    /**
     * Initial navigation menu items
     * @default []
     */
    items?: NavigationMenuItem[];
    
    /**
     * Orientation of the menu
     * @default 'horizontal'
     */
    orientation?: NavigationMenuOrientation;
    
    /**
     * Whether the menu starts collapsed
     * @default false
     */
    collapsed?: boolean;
    
    /**
     * Whether the menu is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Initially active item ID
     */
    activeItemId?: string | null;
    
    /**
     * Initially expanded item IDs
     * @default []
     */
    expandedItemIds?: string[];
    
    /**
     * Trigger type for submenus
     * @default 'click'
     */
    trigger?: NavigationMenuTrigger;
    
    /**
     * Whether to show mobile menu button
     * @default true
     */
    showMobileMenu?: boolean;
    
    /**
     * Breakpoint for mobile menu (px)
     * @default 768
     */
    mobileBreakpoint?: number;
    
    /**
     * ID attribute for the navigation
     */
    id?: string;
    
    /**
     * Callback when an item is clicked
     */
    onItemClick?: (item: NavigationMenuItem, event: MouseEvent) => void;
    
    /**
     * Callback when items change
     */
    onChange?: (items: NavigationMenuItem[]) => void;
    
    /**
     * Callback when active item changes
     */
    onActiveChange?: (itemId: string | null) => void;
    
    /**
     * Callback when expanded items change
     */
    onExpandedChange?: (expandedIds: string[]) => void;
    
    /**
     * Callback when collapsed state changes
     */
    onCollapsedChange?: (collapsed: boolean) => void;
    
    /**
     * Additional CSS classes
     */
    className?: string;
    
    /**
     * ARIA label for the navigation
     * @default "Main navigation"
     */
    ariaLabel?: string;
}

/**
 * NavigationMenu component events
 * Events that can be triggered by the component
 */
export interface NavigationMenuEvents {
    /**
     * Fired when an item is clicked
     */
    itemClick: {
        item: NavigationMenuItem;
        event: MouseEvent;
    };
    
    /**
     * Fired when items are updated
     */
    itemsChange: {
        items: NavigationMenuItem[];
        previousItems: NavigationMenuItem[];
    };
    
    /**
     * Fired when active item changes
     */
    activeChange: {
        itemId: string | null;
        previousItemId: string | null;
    };
    
    /**
     * Fired when expanded items change
     */
    expandedChange: {
        expandedIds: string[];
        previousExpandedIds: string[];
    };
    
    /**
     * Fired when collapsed state changes
     */
    collapsedChange: {
        collapsed: boolean;
    };
    
    /**
     * Fired when an item receives focus
     */
    itemFocus: {
        itemId: string;
        item: NavigationMenuItem;
    };
    
    /**
     * Fired when keyboard navigation occurs
     */
    keyNavigation: {
        key: string;
        fromItemId: string | null;
        toItemId: string | null;
    };
}

/**
 * NavigationMenu component props
 * Props that can be passed to the component
 */
export interface NavigationMenuProps extends NavigationMenuOptions {
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}