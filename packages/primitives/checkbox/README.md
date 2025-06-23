# @stellarix-ui/checkbox

A framework-agnostic checkbox component with indeterminate state support and full accessibility compliance.

## Installation

```bash
pnpm add @stellarix-ui/checkbox
```

## Features

- ✅ Three-state support: checked, unchecked, and indeterminate
- ✅ Space key toggle interaction
- ✅ Form integration with name and value attributes
- ✅ Error state and validation support
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createCheckboxWithImplementation } from '@stellarix-ui/checkbox';
import { reactAdapter } from '@stellarix-ui/react';

// Create component instance
const checkbox = createCheckboxWithImplementation({
  checked: false,
  onChange: (checked) => console.log('Checked:', checked)
});

// Connect to React
const ReactCheckbox = checkbox.connect(reactAdapter);

// Use in your app
function App() {
  return <ReactCheckbox>Accept terms and conditions</ReactCheckbox>;
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `checked` | `boolean \| 'indeterminate'` | `false` | Initial checked state |
| `disabled` | `boolean` | `false` | Disable interaction |
| `required` | `boolean` | `false` | Mark as required field |
| `name` | `string` | - | Name attribute for form submission |
| `value` | `string` | - | Value attribute for form submission |
| `id` | `string` | - | ID attribute for the checkbox |
| `className` | `string` | - | Additional CSS classes |
| `onChange` | `(checked: CheckboxCheckedState) => void` | - | Change handler |
| `onFocus` | `(event: FocusEvent) => void` | - | Focus handler |
| `onBlur` | `(event: FocusEvent) => void` | - | Blur handler |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `checked` | `boolean \| 'indeterminate'` | Current checked state |
| `disabled` | `boolean` | Disabled state |
| `focused` | `boolean` | Focus state |
| `required` | `boolean` | Required field state |
| `error` | `boolean` | Error state |
| `errorMessage` | `string` | Error message text |

### Methods

- `setChecked(checked: CheckboxCheckedState)` - Update the checked state
- `setDisabled(disabled: boolean)` - Toggle disabled state
- `setRequired(required: boolean)` - Toggle required state
- `setError(error: boolean, message?: string)` - Set error state
- `focus()` - Focus the component
- `blur()` - Remove focus

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ checked: CheckboxCheckedState, previousChecked: CheckboxCheckedState }` | Fired on checked state change |
| `focus` | `{ event: FocusEvent }` | Fired on focus |
| `blur` | `{ event: FocusEvent }` | Fired on blur |
| `keydown` | `{ event: KeyboardEvent }` | Fired on key press |

## Examples

### Basic Checkbox

```typescript
const checkbox = createCheckboxWithImplementation({
  checked: false,
  onChange: (checked) => console.log('Checked:', checked)
});
```

### Indeterminate State

```typescript
const checkbox = createCheckboxWithImplementation({
  checked: 'indeterminate',
  onChange: (checked) => {
    console.log('State:', checked); // true, false, or 'indeterminate'
  }
});
```

### Form Integration

```typescript
const checkbox = createCheckboxWithImplementation({
  name: 'terms',
  value: 'accepted',
  required: true,
  onChange: (checked) => {
    if (!checked) {
      checkbox.state.setError(true, 'You must accept the terms');
    } else {
      checkbox.state.setError(false);
    }
  }
});
```

### Disabled State

```typescript
const checkbox = createCheckboxWithImplementation({
  checked: true,
  disabled: true,
  onChange: (checked) => {
    // This won't be called when disabled
    console.log('Changed:', checked);
  }
});
```

### With Error Validation

```typescript
const checkbox = createCheckboxWithImplementation({
  required: true,
  onChange: (checked) => {
    if (!checked) {
      checkbox.state.setError(true, 'This field is required');
    } else {
      checkbox.state.setError(false);
    }
  }
});
```

## Accessibility

- **ARIA roles**: `checkbox` with proper `aria-checked` states
- **Keyboard support**: 
  - `Tab` - Focus navigation
  - `Space` - Toggle checked state
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby
- **States**: Properly announces checked, unchecked, indeterminate, disabled, and required states

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