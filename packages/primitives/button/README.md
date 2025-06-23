# @stellarix-ui/button

A versatile, accessible button component with multiple variants, sizes, and states.

## Installation

```bash
pnpm add @stellarix-ui/button
```

## Features

- ✅ 7 variants: default, primary, secondary, destructive, ghost, link, icon
- ✅ 3 sizes: small (sm), medium (md), large (lg)
- ✅ Loading state with aria-busy support
- ✅ Disabled state management
- ✅ Pressed state handling (mouse down/up)
- ✅ Keyboard navigation (Enter, Space)
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createButtonWithImplementation } from '@stellarix-ui/button';
import { reactAdapter } from '@stellarix-ui/react';

// Create button instance
const button = createButtonWithImplementation({
  variant: 'primary',
  size: 'md',
  onClick: (event) => console.log('Button clicked!')
});

// Connect to React
const ReactButton = button.connect(reactAdapter);

// Use in your app
function App() {
  return (
    <ReactButton>
      Click me
    </ReactButton>
  );
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `ButtonVariant` | `'default'` | Visual style variant |
| `size` | `ButtonSize` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disable interaction |
| `loading` | `boolean` | `false` | Show loading state |
| `onClick` | `(event: MouseEvent) => void` | - | Click handler |
| `onFocus` | `(event: FocusEvent) => void` | - | Focus handler |
| `onBlur` | `(event: FocusEvent) => void` | - | Blur handler |

### Type Definitions

```typescript
type ButtonVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';
```

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `pressed` | `boolean` | Button pressed state |
| `focused` | `boolean` | Focus state |
| `disabled` | `boolean` | Disabled state |
| `loading` | `boolean` | Loading state |
| `variant` | `ButtonVariant` | Current variant |
| `size` | `ButtonSize` | Current size |

### Methods

- `setPressed(pressed: boolean)` - Update pressed state (for visual feedback)
- `setFocused(focused: boolean)` - Update focus state
- `setDisabled(disabled: boolean)` - Toggle disabled state
- `setLoading(loading: boolean)` - Toggle loading state
- `setVariant(variant: ButtonVariant)` - Change variant
- `setSize(size: ButtonSize)` - Change size

### Computed Properties

- `isInteractive` - Returns true if button is not disabled and not loading
- `classes` - Object containing CSS classes for styling

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `{ event: MouseEvent }` | Fired on click |
| `focus` | `{ event: FocusEvent }` | Fired on focus |
| `blur` | `{ event: FocusEvent }` | Fired on blur |
| `keydown` | `{ event: KeyboardEvent }` | Fired on key press |

## Examples

### Basic Button

```typescript
const button = createButtonWithImplementation({
  onClick: () => alert('Hello!')
});
```

### Loading Button

```typescript
const button = createButtonWithImplementation({
  variant: 'primary',
  onClick: async (event) => {
    button.state.setLoading(true);
    try {
      await saveData();
    } finally {
      button.state.setLoading(false);
    }
  }
});
```

### Icon Button

```typescript
const iconButton = createButtonWithImplementation({
  variant: 'icon',
  size: 'sm',
  onClick: () => openSettings()
});
```

### Disabled Button

```typescript
const disabledButton = createButtonWithImplementation({
  variant: 'secondary',
  disabled: true,
  onClick: () => console.log('This will not fire')
});
```

### With Focus Handlers

```typescript
const button = createButtonWithImplementation({
  variant: 'primary',
  onClick: () => console.log('Clicked!'),
  onFocus: (event) => console.log('Button focused'),
  onBlur: (event) => console.log('Button blurred')
});
```

## Styling

### CSS Classes

The button component generates semantic CSS classes:

- `.sx-button` - Base button class
- `.sx-button--default` - Default variant
- `.sx-button--primary` - Primary variant
- `.sx-button--secondary` - Secondary variant
- `.sx-button--destructive` - Destructive variant
- `.sx-button--ghost` - Ghost variant
- `.sx-button--link` - Link variant
- `.sx-button--icon` - Icon variant
- `.sx-button--sm` - Small size
- `.sx-button--md` - Medium size (default)
- `.sx-button--lg` - Large size
- `.sx-button--loading` - Loading state
- `.sx-button--disabled` - Disabled state
- `.sx-button--pressed` - Pressed state
- `.sx-button--focused` - Focused state

### CSS Variables

Customize appearance with CSS variables:

```css
:root {
  --sx-button-primary-bg: #3b82f6;
  --sx-button-primary-hover: #2563eb;
  --sx-button-border-radius: 0.375rem;
  --sx-button-padding-x: 1rem;
  --sx-button-padding-y: 0.5rem;
}
```

## Accessibility

- **ARIA roles**: `button` (explicit via logic layer)
- **ARIA attributes**: 
  - `aria-pressed` - Indicates pressed state
  - `aria-disabled` - Indicates disabled state
  - `aria-busy` - Indicates loading state
- **Keyboard support**: 
  - `Enter` - Activate button
  - `Space` - Activate button
  - `Tab` - Focus navigation (disabled when button is disabled)
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby
- **Focus management**: Proper tabIndex handling for disabled states
- **Event prevention**: Disabled buttons properly prevent all interaction

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