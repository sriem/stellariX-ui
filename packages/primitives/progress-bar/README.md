# @stellarix-ui/progress-bar

Visual indicator showing the progress of a task or operation

## Installation

```bash
pnpm add @stellarix-ui/progress-bar
```

## Features

- ✅ Determinate and indeterminate progress states
- ✅ Multiple visual variants (default, success, warning, error, info)
- ✅ Customizable value range with max property
- ✅ Optional percentage label display
- ✅ Progress completion callbacks
- ✅ Smooth animations and transitions
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createProgressBar } from '@stellarix-ui/progress-bar';
import { reactAdapter } from '@stellarix-ui/react';

// Create progress bar instance
const progressBar = createProgressBar({
  value: 0,
  max: 100,
  showLabel: true,
  onChange: (value, percentage) => {
    console.log(`Progress: ${value}/${max} (${percentage}%)`);
  },
  onComplete: () => {
    console.log('Task complete!');
  }
});

// Connect to React
const ReactProgressBar = progressBar.connect(reactAdapter);

// Use in your app
function App() {
  return <ReactProgressBar />;
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `number` | `0` | Current progress value |
| `max` | `number` | `100` | Maximum value for the progress |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Visual variant |
| `showLabel` | `boolean` | `false` | Show percentage label |
| `isIndeterminate` | `boolean` | `false` | Indeterminate loading state |
| `disabled` | `boolean` | `false` | Disable the progress bar |
| `onChange` | `(value: number, percentage: number) => void` | - | Value change handler |
| `onComplete` | `() => void` | - | Completion handler |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | `number` | Current progress value |
| `max` | `number` | Maximum value |
| `variant` | `string` | Current visual variant |
| `showLabel` | `boolean` | Label visibility |
| `isIndeterminate` | `boolean` | Indeterminate state |
| `disabled` | `boolean` | Disabled state |

### Methods

- `setValue(value: number)` - Update progress value
- `setMax(max: number)` - Update maximum value
- `setVariant(variant: string)` - Change visual variant
- `setShowLabel(show: boolean)` - Toggle label visibility
- `setIndeterminate(indeterminate: boolean)` - Toggle indeterminate state
- `increment(amount?: number)` - Increment progress by amount (default: 1)
- `decrement(amount?: number)` - Decrement progress by amount (default: 1)
- `setProgress(value: number, max?: number)` - Set both value and max
- `reset()` - Reset to initial state
- `getPercentage()` - Get current percentage (0-100)
- `isComplete()` - Check if progress is complete

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ value: number, percentage: number, previousValue: number }` | Fired on value change |
| `complete` | `{ value: number, max: number }` | Fired when reaching 100% |
| `variantChange` | `{ variant: string, previousVariant: string }` | Fired on variant change |

## Examples

### Basic Progress Bar

```typescript
const progressBar = createProgressBar({
  value: 75,
  max: 100,
  showLabel: true
});

// Update progress
progressBar.setValue(80);
```

### File Upload Progress

```typescript
const uploadProgress = createProgressBar({
  value: 0,
  variant: 'default',
  showLabel: true,
  onComplete: () => {
    progressBar.setVariant('success');
    alert('Upload complete!');
  }
});

// Simulate upload
let progress = 0;
const interval = setInterval(() => {
  progress += 10;
  uploadProgress.setValue(progress);
  
  if (progress >= 100) {
    clearInterval(interval);
  }
}, 500);
```

### Indeterminate Loading

```typescript
const loadingBar = createProgressBar({
  isIndeterminate: true,
  showLabel: true
});

// When loading completes
fetch('/api/data').then(() => {
  loadingBar.setIndeterminate(false);
  loadingBar.setValue(100);
  loadingBar.setVariant('success');
});
```

### Multi-step Process

```typescript
const steps = 5;
const stepProgress = createProgressBar({
  value: 0,
  max: steps,
  showLabel: true,
  formatLabel: (value, percentage) => `Step ${value} of ${steps}`
});

// Complete each step
function completeStep(stepNumber: number) {
  stepProgress.setValue(stepNumber);
  
  if (stepNumber === steps) {
    console.log('All steps completed!');
  }
}
```

## Accessibility

- **ARIA roles**: `progressbar`
- **ARIA attributes**: 
  - `aria-valuenow` - Current value
  - `aria-valuemin` - Minimum value (0)
  - `aria-valuemax` - Maximum value
  - `aria-valuetext` - Human-readable value (e.g., "75%")
  - `aria-busy` - Set to true for indeterminate state
  - `aria-disabled` - Set when disabled
- **Screen reader**: Announces progress updates
- **Labels**: Supports aria-label for custom descriptions

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