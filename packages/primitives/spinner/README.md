# @stellarix/spinner

A flexible, accessible loading spinner component for indicating loading states and ongoing processes.

## Installation

```bash
pnpm add @stellarix/spinner
```

## Features

- ✅ Multiple size variants (xs, sm, md, lg, xl)
- ✅ Customizable colors and animation speeds
- ✅ Accessible loading states with proper ARIA labels
- ✅ Start/stop animation control
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createSpinnerWithImplementation } from '@stellarix/spinner';
import { reactAdapter } from '@stellarix/react';

// Create component instance
const component = createSpinnerWithImplementation({
  size: 'md',
  color: '#007bff',
  label: 'Loading content...'
});

// Connect to React
const ReactSpinner = component.connect(reactAdapter);

// Use in your app
function App() {
  return <ReactSpinner />;
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `size` | `SpinnerSize` | `'md'` | Size variant (xs, sm, md, lg, xl) |
| `color` | `string` | `'currentColor'` | CSS color value for the spinner |
| `label` | `string` | `'Loading...'` | Accessible label for screen readers |
| `speed` | `number` | `750` | Animation duration in milliseconds |
| `spinning` | `boolean` | `true` | Whether to start spinning immediately |
| `className` | `string` | - | Additional CSS classes |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `spinning` | `boolean` | Current spinning state |
| `size` | `SpinnerSize` | Current size variant |
| `color` | `string` | Current color value |
| `label` | `string` | Current accessible label |
| `speed` | `number` | Current animation speed |

### Methods

- `start()` - Start the spinning animation
- `stop()` - Stop the spinning animation
- `setSize(size: SpinnerSize)` - Update the size variant
- `setColor(color: string)` - Update the spinner color
- `setLabel(label: string)` - Update the accessible label
- `setSpeed(speed: number)` - Update animation speed

### Events

Spinner is a visual component and doesn't emit interactive events.

## Examples

### Basic Loading Spinner

```typescript
const spinner = createSpinnerWithImplementation({
  size: 'md',
  label: 'Loading data...'
});
```

### Custom Color and Speed

```typescript
const spinner = createSpinnerWithImplementation({
  size: 'lg',
  color: '#28a745',
  speed: 1000, // Slower animation
  label: 'Processing request...'
});
```

### Controlled Spinning

```typescript
const spinner = createSpinnerWithImplementation({
  spinning: false, // Start stopped
  size: 'sm'
});

// Start spinning when needed
spinner.state.start();

// Stop when complete
setTimeout(() => {
  spinner.state.stop();
}, 3000);
```

### Different Sizes

```typescript
// Extra small for inline usage
const xsSpinner = createSpinnerWithImplementation({
  size: 'xs',
  label: 'Loading...'
});

// Large for full-page loading
const lgSpinner = createSpinnerWithImplementation({
  size: 'xl',
  label: 'Loading application...'
});
```

### Dynamic Color Changes

```typescript
const spinner = createSpinnerWithImplementation({
  size: 'md',
  color: '#007bff'
});

// Change to success color when done
setTimeout(() => {
  spinner.state.setColor('#28a745');
  spinner.state.setLabel('Complete!');
}, 2000);
```

## Accessibility

- **ARIA roles**: `status` for loading indication
- **Keyboard support**: 
  - No keyboard interaction (visual indicator only)
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Uses `aria-label` and `aria-live="polite"` for status updates
- **Loading states**: Proper `aria-busy` indication when spinning

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