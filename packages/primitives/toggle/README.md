# @stellarix/toggle

A framework-agnostic toggle switch component for binary choices with smooth animations and accessibility features.

## Installation

```bash
pnpm add @stellarix/toggle
```

## Features

- ✅ Binary toggle switch with visual feedback
- ✅ Smooth on/off animations and transitions
- ✅ Keyboard navigation (Space key)
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createToggleWithImplementation } from '@stellarix/toggle';
import { reactAdapter } from '@stellarix/react';

// Create component instance
const toggle = createToggleWithImplementation({
  checked: false,
  size: 'md',
  onChange: (checked) => console.log('Toggle changed:', checked)
});

// Connect to React
const ReactToggle = toggle.connect(reactAdapter);

// Use in your app
function App() {
  return <ReactToggle />;
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `checked` | `boolean` | `false` | Initial checked state |
| `disabled` | `boolean` | `false` | Disable interaction |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `label` | `string` | - | Optional label text |
| `onChange` | `(checked: boolean) => void` | - | Change handler |
| `onFocus` | `(event: FocusEvent) => void` | - | Focus handler |
| `onBlur` | `(event: FocusEvent) => void` | - | Blur handler |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `checked` | `boolean` | Current checked state |
| `focused` | `boolean` | Focus state |
| `disabled` | `boolean` | Disabled state |

### Methods

- `setChecked(checked: boolean)` - Update the checked state
- `setDisabled(disabled: boolean)` - Toggle disabled state
- `setFocused(focused: boolean)` - Update focus state
- `toggle()` - Toggle the checked state
- `reset()` - Reset to initial state
- `isInteractive()` - Check if toggle is interactive

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ checked: boolean, previousChecked: boolean }` | Fired on state change |
| `focus` | `{ event: FocusEvent }` | Fired on focus |
| `blur` | `{ event: FocusEvent }` | Fired on blur |

## Examples

### Basic Toggle

```typescript
const toggle = createToggleWithImplementation({
  checked: false,
  onChange: (checked) => console.log('Toggle is now:', checked ? 'ON' : 'OFF')
});
```

### Toggle with Label

```typescript
const toggle = createToggleWithImplementation({
  checked: true,
  label: 'Enable notifications',
  size: 'lg',
  onChange: (checked) => {
    updateNotificationSettings({ enabled: checked });
  }
});
```

### Disabled Toggle

```typescript
const toggle = createToggleWithImplementation({
  checked: true,
  disabled: true,
  label: 'Premium feature (upgrade required)'
});
```

### Toggle with Validation

```typescript
const toggle = createToggleWithImplementation({
  checked: false,
  onChange: (checked) => {
    if (checked && !hasPermission) {
      toggle.state.setChecked(false);
      showError('Permission required to enable this feature');
      return;
    }
    saveUserPreference('feature_enabled', checked);
  }
});
```

### Programmatic Control

```typescript
const toggle = createToggleWithImplementation({
  checked: false
});

// Toggle programmatically
toggle.state.toggle();

// Set specific state
toggle.state.setChecked(true);

// Reset to initial state
toggle.state.reset();

// Check if interactive
if (toggle.state.isInteractive()) {
  toggle.state.toggle();
}
```

## Accessibility

- **ARIA roles**: `switch` - Indicates binary toggle control
- **Keyboard support**: 
  - `Tab` - Focus navigation
  - `Space` - Toggle checked state
  - `Enter` - Toggle checked state (alternate)
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby
- **States**: Announces checked/unchecked states clearly

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