# @stellarix/breadcrumb

A framework-agnostic breadcrumb navigation component that provides hierarchical navigation with full accessibility support.

## Features

- 🎯 **Item Management**: Add, remove, and update breadcrumb items dynamically
- 🎨 **Customizable Separators**: Use any character or symbol as separator
- 📍 **Current Page Indication**: Mark the active/current page in the breadcrumb trail
- ✂️ **Smart Truncation**: Automatically truncate long breadcrumb trails
- 🖱️ **Click Navigation**: Navigate to any item in the breadcrumb
- ⌨️ **Keyboard Navigation**: Full keyboard support with arrow keys, Home, and End
- ♿ **Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes
- 🎭 **Framework Agnostic**: Works with React, Vue, Svelte, and more

## Installation

```bash
pnpm add @stellarix/breadcrumb
```

## Basic Usage

```typescript
import { createBreadcrumb } from '@stellarix/breadcrumb';
import { reactAdapter } from '@stellarix/react';

// Create breadcrumb instance
const breadcrumb = createBreadcrumb({
  items: [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'phones', label: 'Phones', href: '/products/phones' },
    { id: 'current', label: 'iPhone 15', current: true }
  ],
  separator: '/',
  onItemClick: (item, index) => {
    console.log(`Clicked ${item.label} at index ${index}`);
  }
});

// Connect to your framework
const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
```

## API

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | `[]` | Array of breadcrumb items |
| `separator` | `string` | `'/'` | Separator between items |
| `maxItems` | `number` | `undefined` | Maximum items to display before truncation |
| `disabled` | `boolean` | `false` | Whether the breadcrumb is disabled |
| `showHomeIcon` | `boolean` | `false` | Show home icon for first item |
| `ariaLabel` | `string` | `'Breadcrumb'` | ARIA label for navigation |
| `onItemClick` | `function` | `undefined` | Callback when item is clicked |
| `onChange` | `function` | `undefined` | Callback when items change |

### BreadcrumbItem

```typescript
interface BreadcrumbItem {
  id: string;              // Unique identifier
  label: string;           // Display text
  href?: string;          // URL for navigation
  current?: boolean;      // Mark as current page
  disabled?: boolean;     // Disable this item
  metadata?: any;         // Additional data
}
```

### State Methods

```typescript
// Item management
breadcrumb.state.setItems(items);
breadcrumb.state.addItem(item);
breadcrumb.state.removeItem(id);
breadcrumb.state.updateItem(id, updates);
breadcrumb.state.clearItems();
breadcrumb.state.setCurrentItem(id);

// Configuration
breadcrumb.state.setSeparator(separator);
breadcrumb.state.setMaxItems(max);
breadcrumb.state.setDisabled(disabled);
breadcrumb.state.setShowHomeIcon(show);
```

## Examples

### Basic Breadcrumb

```typescript
const breadcrumb = createBreadcrumb({
  items: [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'docs', label: 'Documentation', href: '/docs' },
    { id: 'api', label: 'API', current: true }
  ]
});
```

### Custom Separator

```typescript
const breadcrumb = createBreadcrumb({
  items: [...],
  separator: '›' // or '>', '|', '•', etc.
});
```

### Truncated Breadcrumb

```typescript
const breadcrumb = createBreadcrumb({
  items: veryLongItemsList,
  maxItems: 5 // Shows: Item1 > Item2 > ... > Item9 > Item10
});
```

### Without Links (Steps)

```typescript
const breadcrumb = createBreadcrumb({
  items: [
    { id: 'step1', label: 'Personal Info' },
    { id: 'step2', label: 'Shipping' },
    { id: 'step3', label: 'Payment', current: true }
  ]
});
```

### Dynamic Updates

```typescript
// Add item
breadcrumb.state.addItem({
  id: 'new-page',
  label: 'New Page',
  href: '/new-page'
});

// Remove item
breadcrumb.state.removeItem('old-page');

// Update item
breadcrumb.state.updateItem('page-id', {
  label: 'Updated Label',
  current: true
});
```

## Keyboard Navigation

- **Tab**: Focus breadcrumb navigation
- **Arrow Left/Right**: Navigate between items
- **Home**: Go to first item
- **End**: Go to last item
- **Enter/Space**: Activate item (for non-link items)

## Accessibility

The breadcrumb component follows WCAG 2.1 AA guidelines:

- Uses semantic `nav` element with `aria-label`
- Proper list structure with `role="list"` and `role="listitem"`
- Current page marked with `aria-current="page"`
- Disabled items have `aria-disabled="true"`
- Full keyboard navigation support
- Screen reader friendly

## Styling

The component is headless and provides no styles. You can style it using:

- CSS classes on the wrapper element
- CSS selectors targeting ARIA attributes
- Your framework's styling solution

```css
/* Example styles */
nav[role="navigation"] {
  font-size: 14px;
}

nav[role="navigation"] ol {
  display: flex;
  list-style: none;
  padding: 0;
}

nav[role="navigation"] a {
  color: #3b82f6;
  text-decoration: none;
}

nav[role="navigation"] [aria-current="page"] {
  color: #1f2937;
  font-weight: 600;
}
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  BreadcrumbState,
  BreadcrumbOptions,
  BreadcrumbItem,
  BreadcrumbEvents
} from '@stellarix/breadcrumb';
```

## Framework Adapters

Works with all popular frameworks:

- React: `@stellarix/react`
- Vue: `@stellarix/vue`
- Svelte: `@stellarix/svelte`
- Solid: `@stellarix/solid`
- Qwik: `@stellarix/qwik`
- Angular: `@stellarix/angular`

## License

MIT