# @stellarix/navigation-menu

A flexible and accessible navigation menu component for StellarIX UI that supports nested menus, keyboard navigation, and responsive behavior.

## Installation

```bash
pnpm add @stellarix/navigation-menu @stellarix/core
```

## Features

- **Multi-level Navigation**: Support for nested menus with unlimited depth
- **Flexible Layouts**: Horizontal and vertical orientations
- **Responsive Design**: Built-in mobile menu with customizable breakpoint
- **Keyboard Navigation**: Full keyboard support with Arrow keys, Tab, Enter, and Escape
- **Multiple Triggers**: Click, hover, or both for submenu expansion
- **Active State Management**: Track and highlight current page/route
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes
- **Framework Agnostic**: Works with React, Vue, Svelte, and more
- **TypeScript**: Full type safety and IntelliSense support

## Usage

### Basic Example

```typescript
import { createNavigationMenu } from '@stellarix/navigation-menu';

const menu = createNavigationMenu({
  items: [
    { id: 'home', label: 'Home', href: '/', active: true },
    { 
      id: 'products', 
      label: 'Products',
      children: [
        { id: 'electronics', label: 'Electronics', href: '/products/electronics' },
        { id: 'clothing', label: 'Clothing', href: '/products/clothing' }
      ]
    },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'contact', label: 'Contact', href: '/contact' }
  ]
});

// Listen to state changes
menu.state.subscribe((state) => {
  console.log('Menu state:', state);
});
```

### React Integration

```tsx
import { createNavigationMenu } from '@stellarix/navigation-menu';
import { reactAdapter } from '@stellarix/react';

const NavigationMenuComponent = reactAdapter.createComponent({
  state: menu.state,
  logic: menu.logic,
  render: ({ state, a11y, interactions }) => (
    <nav {...a11y.root}>
      <ul {...a11y.menuList}>
        {state.items.map(item => (
          <li key={item.id}>
            <a 
              {...a11y.menuItem({ itemId: item.id, hasChildren: false })}
              {...interactions.menuItem({ itemId: item.id })}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
});
```

## API

### Options

```typescript
interface NavigationMenuOptions {
  items?: NavigationMenuItem[];           // Menu items
  orientation?: 'horizontal' | 'vertical'; // Layout orientation (default: 'horizontal')
  collapsed?: boolean;                     // Initial collapsed state (default: false)
  disabled?: boolean;                      // Disable all interactions (default: false)
  activeItemId?: string | null;           // Currently active item
  expandedItemIds?: string[];             // Initially expanded items
  trigger?: 'click' | 'hover' | 'both';   // Submenu trigger (default: 'click')
  showMobileMenu?: boolean;               // Show mobile menu button (default: true)
  mobileBreakpoint?: number;              // Mobile breakpoint in px (default: 768)
  ariaLabel?: string;                     // ARIA label (default: 'Main navigation')
  
  // Callbacks
  onItemClick?: (item: NavigationMenuItem, event: MouseEvent) => void;
  onChange?: (items: NavigationMenuItem[]) => void;
  onActiveChange?: (itemId: string | null) => void;
  onExpandedChange?: (expandedIds: string[]) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}
```

### NavigationMenuItem

```typescript
interface NavigationMenuItem {
  id: string;                    // Unique identifier
  label: string;                 // Display text
  href?: string;                 // URL for navigation
  active?: boolean;              // Is current/active item
  disabled?: boolean;            // Is disabled
  icon?: any;                    // Optional icon
  children?: NavigationMenuItem[]; // Child items for nested menus
  expanded?: boolean;            // Is submenu expanded
  metadata?: Record<string, any>; // Additional data
}
```

### State Management

```typescript
// Get current state
const currentState = menu.state.getState();

// Update items
menu.state.setItems(newItems);

// Set active item
menu.state.setActiveItemId('products');

// Toggle submenu
menu.state.toggleExpanded('products');

// Expand/collapse specific items
menu.state.expandItem('products');
menu.state.collapseItem('products');

// Toggle mobile menu
menu.state.toggleCollapsed();

// Disable/enable menu
menu.state.setDisabled(true);
```

## Keyboard Navigation

- **Tab**: Navigate between menu items
- **Arrow Keys**: Navigate in menu direction
  - Horizontal: Left/Right for siblings, Down to enter submenu
  - Vertical: Up/Down for all items, Right to enter submenu
- **Enter/Space**: Activate item or toggle submenu
- **Escape**: Close submenu or exit navigation
- **Home/End**: Jump to first/last item

## Styling

The component is headless and provides no default styles. You have complete control over the visual appearance. Here's a basic example:

```css
nav[role="navigation"] {
  background: #f5f5f5;
  padding: 1rem;
}

ul[role="menubar"] {
  display: flex;
  list-style: none;
  gap: 1rem;
}

[role="menuitem"] {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

[role="menuitem"][aria-current="page"] {
  color: #0066cc;
  background: #e0e0e0;
}

[role="menuitem"][aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Submenu styles */
[role="menu"] {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/* Mobile menu button */
button[aria-label*="navigation menu"] {
  display: none;
}

@media (max-width: 768px) {
  button[aria-label*="navigation menu"] {
    display: block;
  }
  
  ul[role="menubar"] {
    flex-direction: column;
  }
}
```

## Responsive Behavior

The navigation menu automatically adapts to mobile viewports:

1. Shows a mobile menu button at the configured breakpoint
2. Collapses the menu behind a toggle button
3. Switches to vertical layout on mobile
4. Closes menu after item selection on mobile

## Examples

### Vertical Navigation

```typescript
const verticalMenu = createNavigationMenu({
  orientation: 'vertical',
  items: menuItems
});
```

### Hover-Triggered Submenus

```typescript
const hoverMenu = createNavigationMenu({
  trigger: 'hover',
  items: menuItems
});
```

### Custom Mobile Breakpoint

```typescript
const responsiveMenu = createNavigationMenu({
  mobileBreakpoint: 1024, // Tablet and below
  items: menuItems
});
```

### Programmatic Control

```typescript
// Open specific submenu
menu.state.expandItem('products');

// Close all submenus
menu.state.setExpandedItemIds([]);

// Update active item based on route
menu.state.setActiveItemId(currentRoute);
```

## Accessibility

The NavigationMenu component follows WCAG 2.1 AA guidelines:

- Proper ARIA roles and attributes
- Keyboard navigation support
- Focus management
- Screen reader announcements
- High contrast mode support
- Reduced motion support

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- IE11 (with polyfills)

## License

MIT