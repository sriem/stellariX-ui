# @stellarix/divider

A versatile separator component for creating visual divisions in your UI, supporting horizontal and vertical orientations with customizable styling.

## Installation

```bash
pnpm add @stellarix/divider
```

## Features

- ✅ Horizontal and vertical orientations
- ✅ Multiple visual variants (solid, dashed, dotted)
- ✅ Optional label support with flexible positioning
- ✅ Customizable spacing, color, and thickness
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createDivider } from '@stellarix/divider';
import { reactAdapter } from '@stellarix/react';

// Create component instance
const divider = createDivider({
  orientation: 'horizontal',
  variant: 'solid'
});

// Connect to React
const ReactDivider = divider.connect(reactAdapter);

// Use in your app
function App() {
  return (
    <div>
      <p>Content above</p>
      <ReactDivider />
      <p>Content below</p>
    </div>
  );
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation of the divider |
| `variant` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Visual style of the divider line |
| `label` | `string` | `undefined` | Optional label text |
| `labelPosition` | `'start' \| 'center' \| 'end'` | `'center'` | Position of the label |
| `spacing` | `string` | `'1rem'` | Spacing around the divider (CSS units) |
| `color` | `string` | `undefined` | Custom color for the divider |
| `thickness` | `string` | `'1px'` | Thickness of the divider line (CSS units) |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | Current orientation |
| `variant` | `'solid' \| 'dashed' \| 'dotted'` | Current visual variant |
| `hasLabel` | `boolean` | Whether a label is present |
| `labelPosition` | `'start' \| 'center' \| 'end'` | Current label position |

### Methods

- `setOrientation(orientation: 'horizontal' | 'vertical')` - Change orientation
- `setVariant(variant: 'solid' | 'dashed' | 'dotted')` - Change visual style
- `setLabelPosition(position: 'start' | 'center' | 'end')` - Change label position
- `updateLabel(hasLabel: boolean)` - Toggle label presence
- `isHorizontal()` - Check if orientation is horizontal
- `isVertical()` - Check if orientation is vertical

### Events

Divider is a presentational component and does not emit events.

## Examples

### Horizontal Divider (Default)

```typescript
const horizontalDivider = createDivider({
  orientation: 'horizontal',
  variant: 'solid'
});
```

### Vertical Divider

```typescript
const verticalDivider = createDivider({
  orientation: 'vertical',
  variant: 'solid',
  spacing: '0.5rem'
});
```

### Divider with Label

```typescript
const labeledDivider = createDivider({
  orientation: 'horizontal',
  variant: 'solid',
  label: 'OR',
  labelPosition: 'center'
});
```

### Styled Divider

```typescript
const styledDivider = createDivider({
  orientation: 'horizontal',
  variant: 'dashed',
  color: '#e0e0e0',
  thickness: '2px',
  spacing: '2rem'
});
```

### Layout Sections

```typescript
// Section divider
const sectionDivider = createDivider({
  orientation: 'horizontal',
  variant: 'solid',
  label: 'Settings',
  labelPosition: 'start',
  spacing: '1.5rem'
});

// Sidebar divider
const sidebarDivider = createDivider({
  orientation: 'vertical',
  variant: 'solid',
  spacing: '1rem'
});
```

### Form Section Separators

```typescript
// Form group separator
const formDivider = createDivider({
  orientation: 'horizontal',
  variant: 'dotted',
  label: 'Advanced Options',
  labelPosition: 'center',
  color: '#666666'
});
```

## Accessibility

- **ARIA roles**: `separator` for the divider element
- **Keyboard support**: 
  - Not focusable (decorative element)
  - Does not interfere with keyboard navigation
- **Screen reader**: Announced as a separator when present
- **Labels**: Supports aria-label for custom descriptions
- **Orientation**: Proper aria-orientation attribute for screen readers

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