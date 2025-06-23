# @stellarix-ui/menu

Framework-agnostic dropdown menu component with keyboard navigation, hierarchical submenus, and type-ahead search.

## Installation

```bash
pnpm add @stellarix-ui/menu
```

## Features

- ✅ Dropdown menus with keyboard navigation
- ✅ Hierarchical submenus with infinite nesting
- ✅ Type-ahead search for quick item selection
- ✅ Arrow key navigation with disabled item skipping
- ✅ Mouse and keyboard interaction support
- ✅ Focus management and accessibility features
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createMenu } from '@stellarix-ui/menu';
import { reactAdapter } from '@stellarix-ui/react';

// Create component instance
const menu = createMenu({
  items: [
    { id: '1', label: 'Cut' },
    { id: '2', label: 'Copy' },
    { id: '3', label: 'Paste', disabled: true },
    { 
      id: '4', 
      label: 'More', 
      items: [
        { id: '4.1', label: 'Rename' },
        { id: '4.2', label: 'Delete' }
      ]
    }
  ],
  onSelect: (item) => console.log('Selected:', item.label)
});

// Connect to React
const ReactMenu = menu.connect(reactAdapter);

// Use in your app
function App() {
  return <ReactMenu />;
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `MenuItem[]` | `[]` | Menu items with optional submenus |
| `open` | `boolean` | `false` | Initial open state |
| `id` | `string` | - | Component ID for ARIA labeling |
| `onOpen` | `() => void` | - | Callback when menu opens |
| `onClose` | `() => void` | - | Callback when menu closes |
| `onSelect` | `(item: MenuItem) => void` | - | Callback when item is selected |
| `closeOnSelect` | `boolean` | `true` | Close menu on item selection |
| `typeAhead` | `boolean` | `true` | Enable type-ahead search |
| `typeAheadTimeout` | `number` | `500` | Type-ahead timeout in ms |

### MenuItem Interface

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the menu item |
| `label` | `string` | Display label for the menu item |
| `disabled` | `boolean` | Whether the item is disabled |
| `icon` | `any` | Optional icon component/element |
| `items` | `MenuItem[]` | Nested submenu items |
| `onSelect` | `() => void` | Custom action handler |
| `data` | `any` | Additional data associated with the item |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `open` | `boolean` | Whether the menu is open |
| `activeIndex` | `number` | Currently focused item index |
| `items` | `MenuItem[]` | Menu items |
| `searchQuery` | `string` | Current search query for type-ahead |
| `focused` | `boolean` | Whether the menu has focus |
| `selectedId` | `string` | Selected item ID |
| `submenuStack` | `string[]` | Stack of open submenu paths |

### Methods

- `setOpen(open: boolean)` - Toggle menu open state
- `setActiveIndex(index: number)` - Set focused item index
- `setItems(items: MenuItem[])` - Update menu items
- `navigateUp()` - Move focus to previous enabled item
- `navigateDown()` - Move focus to next enabled item
- `navigateToFirst()` - Focus first enabled item
- `navigateToLast()` - Focus last enabled item
- `pushSubmenu(itemId: string)` - Enter a submenu
- `popSubmenu()` - Exit current submenu
- `getCurrentItems()` - Get items for current menu level
- `getActiveItem()` - Get currently focused item

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `open` | `null` | Fired when menu opens |
| `close` | `null` | Fired when menu closes |
| `select` | `{ item: MenuItem }` | Fired when item is selected |
| `navigate` | `{ index: number }` | Fired on navigation |
| `search` | `{ query: string }` | Fired on type-ahead search |
| `focus` | `{ event: FocusEvent }` | Fired on focus |
| `blur` | `{ event: FocusEvent }` | Fired on blur |
| `keydown` | `{ event: KeyboardEvent }` | Fired on key press |

## Examples

### Basic Dropdown Menu

```typescript
const menu = createMenu({
  items: [
    { id: 'new', label: 'New File', icon: 'plus' },
    { id: 'open', label: 'Open File', icon: 'folder' },
    { id: 'save', label: 'Save', icon: 'save' },
    { id: 'separator', label: '---', disabled: true },
    { id: 'exit', label: 'Exit', icon: 'x' }
  ],
  onSelect: (item) => {
    if (item.id === 'new') createNewFile();
    if (item.id === 'open') openFile();
    if (item.id === 'save') saveFile();
  }
});
```

### Hierarchical Context Menu

```typescript
const contextMenu = createMenu({
  items: [
    { id: 'cut', label: 'Cut' },
    { id: 'copy', label: 'Copy' },
    { id: 'paste', label: 'Paste' },
    {
      id: 'format',
      label: 'Format',
      items: [
        { id: 'bold', label: 'Bold' },
        { id: 'italic', label: 'Italic' },
        {
          id: 'align',
          label: 'Align',
          items: [
            { id: 'left', label: 'Left' },
            { id: 'center', label: 'Center' },
            { id: 'right', label: 'Right' }
          ]
        }
      ]
    }
  ],
  typeAhead: true,
  closeOnSelect: true
});
```

### Dynamic Menu with Data

```typescript
const dynamicMenu = createMenu({
  items: [
    {
      id: 'recent',
      label: 'Recent Files',
      items: recentFiles.map(file => ({
        id: file.id,
        label: file.name,
        data: { path: file.path, modified: file.modified },
        onSelect: () => openFile(file.path)
      }))
    }
  ]
});
```

### Menu with Type-ahead Search

```typescript
const searchableMenu = createMenu({
  items: commands.map(cmd => ({
    id: cmd.id,
    label: cmd.name,
    data: { shortcut: cmd.shortcut }
  })),
  typeAhead: true,
  typeAheadTimeout: 300,
  onSelect: (item) => executeCommand(item.id)
});
```

## Accessibility

- **ARIA roles**: `menu`, `menuitem` for proper screen reader support
- **Keyboard support**: 
  - `Arrow Keys` - Navigate between items
  - `Enter/Space` - Select item or enter submenu
  - `Arrow Right` - Enter submenu
  - `Arrow Left/Escape` - Exit submenu or close menu
  - `Home/End` - Jump to first/last item
  - `Tab` - Close menu and move focus
  - `Type-ahead` - Search items by typing
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby
- **Focus management**: Proper focus trap and restoration
- **Disabled items**: Properly announced and skipped during navigation

## Framework Adapters

Works with all major frameworks:

- ✅ React 18+ / React 19
- ✅ Vue 3.5+
- ✅ Svelte 5+
- ✅ Solid 1.0+
- ✅ Qwik
- ✅ Angular
- ✅ Web Components

## Browser Support

- Chrome/Edge 90+ (Chromium-based)
- Firefox 90+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for development setup.

## License

MIT © StellarIX UI