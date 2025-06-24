/**
 * Menu Component Types
 * Framework-agnostic type definitions
 */

/**
 * Individual menu item configuration
 */
export interface MenuItem {
    /** Unique identifier for the menu item */
    id: string;
    /** Display label for the menu item */
    label: string;
    /** Whether the item is disabled */
    disabled?: boolean;
    /** Optional icon component/element */
    icon?: any;
    /** Nested submenu items */
    items?: MenuItem[];
    /** Custom action handler */
    onSelect?: () => void;
    /** Additional data associated with the item */
    data?: any;
}

/**
 * Menu component state
 */
export interface MenuState {
    /** Whether the menu is open */
    open: boolean;
    /** Currently focused item index */
    activeIndex: number;
    /** Menu items */
    items: MenuItem[];
    /** Current search query for type-ahead */
    searchQuery: string;
    /** Timestamp of last search input */
    searchTimeout: number;
    /** Whether the menu has focus */
    focused: boolean;
    /** Selected item ID */
    selectedId?: string;
    /** Stack of open submenu paths */
    submenuStack: string[];
}

/**
 * Menu component options
 */
export interface MenuOptions {
    /** Menu items */
    items?: MenuItem[];
    /** Initial open state */
    open?: boolean;
    /** Initial selected item ID */
    selectedId?: string;
    /** Component ID for ARIA */
    id?: string;
    /** Callback when menu opens */
    onOpen?: () => void;
    /** Callback when menu closes */
    onClose?: () => void;
    /** Callback when item is selected */
    onSelect?: (item: MenuItem) => void;
    /** Close menu on item selection */
    closeOnSelect?: boolean;
    /** Enable type-ahead search */
    typeAhead?: boolean;
    /** Type-ahead timeout in ms */
    typeAheadTimeout?: number;
}

/**
 * Menu component events
 */
export interface MenuEvents {
    /** Menu opened */
    open: null;
    /** Menu closed */
    close: null;
    /** Item selected */
    select: { item: MenuItem };
    /** Navigation occurred */
    navigate: { index: number };
    /** Search query updated */
    search: { query: string };
    /** Focus changed */
    focus: { event: FocusEvent };
    /** Blur occurred */
    blur: { event: FocusEvent };
    /** Key pressed */
    keydown: { event: KeyboardEvent };
}