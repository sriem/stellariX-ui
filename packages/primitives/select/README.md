# @stellarix-ui/select

Framework-agnostic dropdown select component with search, keyboard navigation, and full accessibility support.

## Installation

```bash
pnpm add @stellarix-ui/select
```

## Features

- ✅ Searchable options with real-time filtering
- ✅ Full keyboard navigation (Arrow keys, Home, End, Escape)
- ✅ Single selection with clear functionality
- ✅ Customizable option rendering
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createSelect } from '@stellarix-ui/select';
import { reactAdapter } from '@stellarix-ui/react';

// Create select instance
const select = createSelect({
  options: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' }
  ],
  value: 'apple',
  onChange: (value) => console.log('Selected:', value)
});

// Connect to React
const ReactSelect = select.connect(reactAdapter);

// Use in your app
function App() {
  return <ReactSelect />;
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `string \| null` | `null` | Currently selected value |
| `options` | `SelectOption[]` | `[]` | Array of options |
| `placeholder` | `string` | `'Select an option'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable the select |
| `readonly` | `boolean` | `false` | Make select read-only |
| `searchable` | `boolean` | `false` | Enable search functionality |
| `clearable` | `boolean` | `false` | Show clear button |
| `onChange` | `(value: string \| null) => void` | - | Value change handler |
| `onOpen` | `() => void` | - | Dropdown open handler |
| `onClose` | `() => void` | - | Dropdown close handler |
| `onSearch` | `(query: string) => void` | - | Search handler |

### SelectOption Type

```typescript
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  data?: any; // Custom data
}
```

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string \| null` | Current selected value |
| `open` | `boolean` | Dropdown open state |
| `focused` | `boolean` | Focus state |
| `disabled` | `boolean` | Disabled state |
| `readonly` | `boolean` | Read-only state |
| `options` | `SelectOption[]` | All options |
| `highlightedIndex` | `number` | Currently highlighted option index |
| `searchQuery` | `string` | Current search query |
| `filteredOptions` | `SelectOption[]` | Filtered options based on search |

### Methods

- `setValue(value: string | null)` - Set selected value
- `setOpen(open: boolean)` - Control dropdown state
- `setSearchQuery(query: string)` - Update search filter
- `navigateUp()` - Move highlight up
- `navigateDown()` - Move highlight down
- `navigateToFirst()` - Highlight first option
- `navigateToLast()` - Highlight last option
- `selectOption(option: SelectOption)` - Select specific option
- `selectHighlighted()` - Select highlighted option
- `clearSelection()` - Clear current selection

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ value: string \| null }` | Fired on value change |
| `open` | `{}` | Fired when dropdown opens |
| `close` | `{}` | Fired when dropdown closes |
| `search` | `{ query: string }` | Fired on search input |
| `navigate` | `{ index: number }` | Fired on keyboard navigation |

## Examples

### Searchable Select

```typescript
const select = createSelect({
  searchable: true,
  options: countries,
  placeholder: 'Search countries...',
  onSearch: (query) => {
    console.log('Searching for:', query);
  }
});
```

### With Clear Button

```typescript
const select = createSelect({
  clearable: true,
  value: 'default',
  options: options,
  onChange: (value) => {
    console.log('Value changed to:', value || 'none');
  }
});
```

### Disabled Options

```typescript
const select = createSelect({
  options: [
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived', disabled: true },
    { value: 'deleted', label: 'Deleted', disabled: true }
  ]
});
```

### Grouped Options (via custom rendering)

```typescript
const select = createSelect({
  options: [
    { value: 'us', label: 'United States', data: { group: 'Americas' } },
    { value: 'ca', label: 'Canada', data: { group: 'Americas' } },
    { value: 'uk', label: 'United Kingdom', data: { group: 'Europe' } },
    { value: 'de', label: 'Germany', data: { group: 'Europe' } }
  ]
});
```

## Accessibility

- **ARIA roles**: `combobox`, `listbox`, `option`
- **Keyboard support**: 
  - `Enter/Space` - Open dropdown / Select option
  - `ArrowDown/ArrowUp` - Navigate options
  - `Home/End` - Jump to first/last option
  - `Escape` - Close dropdown
  - `Tab` - Focus navigation
  - Type characters to search (when searchable)
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby

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