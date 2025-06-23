# @stellarix/container

Framework-agnostic layout container component with responsive design and flexible sizing options.

## Installation

```bash
pnpm add @stellarix/container
```

## Features

- ✅ Responsive container with size presets (sm, md, lg, xl, full)
- ✅ Multiple variants (default, fluid, responsive)
- ✅ Automatic centering with customizable padding
- ✅ Custom max-width override support
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createContainer } from '@stellarix/container';
import { reactAdapter } from '@stellarix/react';

// Create component instance
const container = createContainer({
  size: 'lg',
  variant: 'responsive',
  padding: '2rem'
});

// Connect to React
const ReactContainer = container.connect(reactAdapter);

// Use in your app
function App() {
  return (
    <ReactContainer>
      <h1>Welcome to StellarIX UI</h1>
      <p>This content is centered and responsive.</p>
    </ReactContainer>
  );
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Container size preset |
| `variant` | `'default' \| 'fluid' \| 'responsive'` | `'default'` | Container behavior variant |
| `maxWidth` | `string` | - | Custom max-width (overrides size) |
| `padding` | `string` | `'1rem'` | Internal padding |
| `center` | `boolean` | `true` | Whether to center the container |
| `className` | `string` | - | Additional CSS classes |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `size` | `ContainerSize` | Current size preset |
| `variant` | `ContainerVariant` | Current variant |
| `maxWidth` | `string \| undefined` | Custom max-width value |
| `padding` | `string \| undefined` | Current padding |

### Methods

- `setSize(size: ContainerSize)` - Update the size preset
- `setVariant(variant: ContainerVariant)` - Change container variant
- `setMaxWidth(maxWidth: string | undefined)` - Set custom max-width
- `setPadding(padding: string | undefined)` - Update padding
- `getComputedMaxWidth()` - Get the effective max-width
- `getComputedStyles()` - Get all computed styles

### Events

Container is a layout component and doesn't emit interactive events.

| Event | Payload | Description |
|-------|---------|-------------|
| - | - | No events (layout component) |

## Examples

### Basic Container

```typescript
const container = createContainer({
  size: 'md',
  padding: '1rem'
});
```

### Fluid Container

```typescript
const fluidContainer = createContainer({
  variant: 'fluid',
  padding: '2rem'
});
```

### Responsive Container

```typescript
const responsiveContainer = createContainer({
  variant: 'responsive',
  size: 'xl'
});
```

### Custom Max-Width

```typescript
const customContainer = createContainer({
  maxWidth: '900px',
  center: true,
  padding: '1.5rem'
});
```

### Size Presets

```typescript
// Small container (640px max-width)
const smallContainer = createContainer({ size: 'sm' });

// Medium container (768px max-width) - default
const mediumContainer = createContainer({ size: 'md' });

// Large container (1024px max-width)
const largeContainer = createContainer({ size: 'lg' });

// Extra large container (1280px max-width)
const xlContainer = createContainer({ size: 'xl' });

// Full width container (100% width)
const fullContainer = createContainer({ size: 'full' });
```

## Accessibility

- **ARIA roles**: None (semantic layout container)
- **Keyboard support**: Not applicable (layout component)
- **Screen reader**: Transparent to assistive technology
- **Labels**: Container itself doesn't need labeling

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