# @stellarix/alert

A framework-agnostic alert component for displaying important notifications and messages to users.

## Installation

```bash
pnpm add @stellarix/alert
```

## Features

- ✅ Four distinct alert variants (info, success, warning, error)
- ✅ Dismissible alerts with close functionality
- ✅ Auto-dismiss with configurable timeout
- ✅ Optional titles and icons for enhanced messaging
- ✅ Live region support for screen readers
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createAlertWithImplementation } from '@stellarix/alert';
import { reactAdapter } from '@stellarix/react';

// Create alert component instance
const alert = createAlertWithImplementation({
  variant: 'info',
  message: 'This is an informational alert',
  dismissible: true
});

// Connect to React
const ReactAlert = alert.connect(reactAdapter);

// Use in your app
function App() {
  return <ReactAlert />;
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Alert type/variant |
| `message` | `string` | `''` | Alert message content |
| `title` | `string` | `undefined` | Optional alert title |
| `dismissible` | `boolean` | `false` | Whether alert can be dismissed |
| `showIcon` | `boolean` | `true` | Whether to show variant icon |
| `visible` | `boolean` | `true` | Initial visibility state |
| `autoClose` | `number` | `0` | Auto-dismiss timeout in ms (0 = disabled) |
| `onDismiss` | `() => void` | - | Callback when alert is dismissed |
| `onVisibilityChange` | `(visible: boolean) => void` | - | Callback when visibility changes |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `visible` | `boolean` | Current visibility state |
| `variant` | `AlertVariant` | Current alert variant |
| `dismissible` | `boolean` | Whether alert can be dismissed |
| `dismissing` | `boolean` | Whether alert is being dismissed |
| `message` | `string` | Alert message content |
| `title` | `string` | Alert title (optional) |
| `showIcon` | `boolean` | Whether icon is shown |

### Methods

- `setVisible(visible: boolean)` - Update visibility state
- `setMessage(message: string)` - Update alert message
- `setTitle(title: string)` - Update alert title
- `setVariant(variant: AlertVariant)` - Change alert variant
- `dismiss()` - Dismiss the alert
- `show()` - Show the alert

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `dismiss` | `{ reason: 'user' \| 'auto' }` | Fired when alert is dismissed |
| `visibilityChange` | `{ visible: boolean }` | Fired when visibility changes |
| `close` | `{ event: MouseEvent }` | Fired when close button is clicked |

## Examples

### Basic Alert Types

```typescript
// Info alert
const infoAlert = createAlertWithImplementation({
  variant: 'info',
  message: 'Your settings have been saved.',
  showIcon: true
});

// Success alert
const successAlert = createAlertWithImplementation({
  variant: 'success',
  title: 'Success!',
  message: 'Your profile has been updated successfully.',
  dismissible: true
});

// Warning alert
const warningAlert = createAlertWithImplementation({
  variant: 'warning',
  title: 'Warning',
  message: 'Your session will expire in 5 minutes.',
  autoClose: 5000
});

// Error alert
const errorAlert = createAlertWithImplementation({
  variant: 'error',
  title: 'Error',
  message: 'Failed to save changes. Please try again.',
  dismissible: true
});
```

### Dismissible Alert with Callback

```typescript
const dismissibleAlert = createAlertWithImplementation({
  variant: 'info',
  message: 'Click the X to dismiss this alert',
  dismissible: true,
  onDismiss: () => {
    console.log('Alert was dismissed');
    // Handle cleanup or navigation
  }
});
```

### Auto-Dismissing Alert

```typescript
const autoAlert = createAlertWithImplementation({
  variant: 'success',
  message: 'File uploaded successfully!',
  autoClose: 3000, // Auto-dismiss after 3 seconds
  onVisibilityChange: (visible) => {
    if (!visible) {
      console.log('Alert auto-dismissed');
    }
  }
});
```

### Dynamic Alert Management

```typescript
const dynamicAlert = createAlertWithImplementation({
  variant: 'info',
  message: 'Initial message',
  dismissible: true
});

// Update message dynamically
dynamicAlert.state.setMessage('Updated message');

// Change variant based on condition
if (hasError) {
  dynamicAlert.state.setVariant('error');
  dynamicAlert.state.setMessage('An error occurred');
}

// Show/hide programmatically
dynamicAlert.state.setVisible(false);
setTimeout(() => {
  dynamicAlert.state.setVisible(true);
}, 2000);
```

## Accessibility

- **ARIA roles**: `alert` (for live announcements)
- **Keyboard support**: 
  - `Escape` - Dismiss alert (when dismissible)
  - `Tab` - Navigate to close button
  - `Enter/Space` - Activate close button
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Live regions**: Alerts are announced when they appear
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby
- **Focus management**: Properly handles focus for dismissible alerts

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