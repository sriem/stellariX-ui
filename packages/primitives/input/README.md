# @stellarix-ui/input

A flexible, accessible input component that handles various input types with built-in validation, focus management, and form integration.

## Installation

```bash
pnpm add @stellarix-ui/input
```

## Features

- ✅ Multiple input types (text, email, password, number, tel, url, search)
- ✅ Built-in validation with custom error messages
- ✅ Three size variants (sm, md, lg)
- ✅ Focus management with keyboard navigation
- ✅ Readonly and disabled states
- ✅ Real-time input validation with pattern matching
- ✅ Min/max length constraints
- ✅ Number input with min/max/step support
- ✅ Autocomplete integration
- ✅ Prefix and suffix content support
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createInputWithImplementation } from '@stellarix-ui/input';
import { reactAdapter } from '@stellarix-ui/react';

// Create component instance
const input = createInputWithImplementation({
  type: 'text',
  placeholder: 'Enter your name',
  onChange: (value) => console.log('Value:', value)
});

// Connect to React
const ReactInput = input.connect(reactAdapter);

// Use in your app
function App() {
  return <ReactInput />;
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Initial value |
| `type` | `InputType` | `'text'` | Input type (text, email, password, etc.) |
| `size` | `InputSize` | `'md'` | Size variant (sm, md, lg) |
| `placeholder` | `string` | - | Placeholder text |
| `disabled` | `boolean` | `false` | Disable interaction |
| `readonly` | `boolean` | `false` | Make input readonly |
| `required` | `boolean` | `false` | Mark as required field |
| `pattern` | `string` | - | Validation pattern (regex) |
| `minLength` | `number` | - | Minimum character length |
| `maxLength` | `number` | - | Maximum character length |
| `min` | `number \| string` | - | Minimum value (for number inputs) |
| `max` | `number \| string` | - | Maximum value (for number inputs) |
| `step` | `number \| string` | - | Step value (for number inputs) |
| `autocomplete` | `string` | - | Autocomplete attribute |
| `name` | `string` | - | Form field name |
| `id` | `string` | - | Element ID |
| `error` | `boolean` | `false` | Initial error state |
| `errorMessage` | `string` | - | Error message to display |
| `onChange` | `(value: string) => void` | - | Value change handler |
| `onFocus` | `(event: FocusEvent) => void` | - | Focus event handler |
| `onBlur` | `(event: FocusEvent) => void` | - | Blur event handler |
| `onInput` | `(value: string) => void` | - | Real-time input handler |
| `onKeyDown` | `(event: KeyboardEvent) => void` | - | Keydown event handler |
| `onSubmit` | `(value: string) => void` | - | Submit handler (Enter key) |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Current input value |
| `focused` | `boolean` | Whether input is focused |
| `disabled` | `boolean` | Whether input is disabled |
| `readonly` | `boolean` | Whether input is readonly |
| `error` | `boolean` | Whether input has error |
| `errorMessage` | `string` | Current error message |
| `required` | `boolean` | Whether input is required |
| `type` | `InputType` | Current input type |
| `size` | `InputSize` | Current size variant |

### Methods

- `setValue(value: string)` - Update the input value
- `setFocused(focused: boolean)` - Set focus state
- `setDisabled(disabled: boolean)` - Toggle disabled state
- `setReadonly(readonly: boolean)` - Toggle readonly state
- `setError(error: boolean, message?: string)` - Set error state with message
- `setRequired(required: boolean)` - Toggle required state
- `setType(type: InputType)` - Change input type
- `setSize(size: InputSize)` - Change size variant
- `clear()` - Clear the input value
- `isInteractive()` - Check if input can be interacted with
- `hasError()` - Check if input has validation errors
- `isEmpty()` - Check if input value is empty
- `getValidationState()` - Get current validation state

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ value: string, previousValue: string }` | Fired on value change |
| `input` | `{ value: string }` | Fired on real-time input |
| `focus` | `{ event: FocusEvent }` | Fired on focus |
| `blur` | `{ event: FocusEvent }` | Fired on blur |
| `keydown` | `{ event: KeyboardEvent }` | Fired on keydown |
| `submit` | `{ value: string }` | Fired on Enter key press |

## Examples

### Basic Text Input

```typescript
const input = createInputWithImplementation({
  type: 'text',
  placeholder: 'Enter your name',
  onChange: (value) => console.log('Name:', value)
});
```

### Email Input with Validation

```typescript
const emailInput = createInputWithImplementation({
  type: 'email',
  placeholder: 'Enter your email',
  required: true,
  pattern: '^[^@]+@[^@]+\.[^@]+$',
  onChange: (value) => {
    // Custom validation
    const isValid = /^[^@]+@[^@]+\.[^@]+$/.test(value);
    if (value && !isValid) {
      emailInput.state.setError(true, 'Please enter a valid email address');
    } else {
      emailInput.state.setError(false);
    }
  }
});
```

### Password Input with Requirements

```typescript
const passwordInput = createInputWithImplementation({
  type: 'password',
  placeholder: 'Enter password',
  minLength: 8,
  required: true,
  onChange: (value) => {
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isLongEnough = value.length >= 8;
    
    if (value && (!hasUppercase || !hasNumber || !isLongEnough)) {
      passwordInput.state.setError(true, 
        'Password must be 8+ characters with uppercase and number');
    } else {
      passwordInput.state.setError(false);
    }
  }
});
```

### Number Input with Constraints

```typescript
const quantityInput = createInputWithImplementation({
  type: 'number',
  placeholder: 'Quantity',
  min: 1,
  max: 100,
  step: 1,
  onChange: (value) => {
    const num = parseInt(value);
    if (num < 1 || num > 100) {
      quantityInput.state.setError(true, 'Quantity must be between 1 and 100');
    } else {
      quantityInput.state.setError(false);
    }
  }
});
```

### Search Input with Real-time Results

```typescript
const searchInput = createInputWithImplementation({
  type: 'search',
  placeholder: 'Search products...',
  onInput: (value) => {
    // Real-time search as user types
    if (value.length >= 2) {
      performSearch(value);
    }
  },
  onSubmit: (value) => {
    // Handle Enter key submission
    navigateToSearchResults(value);
  }
});
```

### Form Integration with Validation

```typescript
const formInput = createInputWithImplementation({
  name: 'username',
  id: 'username-field',
  required: true,
  minLength: 3,
  maxLength: 20,
  pattern: '^[a-zA-Z0-9_]+$',
  autocomplete: 'username',
  onChange: (value) => {
    // Update form state
    updateFormField('username', value);
    
    // Validate username availability
    if (value.length >= 3) {
      checkUsernameAvailability(value).then(available => {
        if (!available) {
          formInput.state.setError(true, 'Username is already taken');
        } else {
          formInput.state.setError(false);
        }
      });
    }
  }
});
```

## Accessibility

- **ARIA roles**: `textbox` with proper labeling
- **Keyboard support**: 
  - `Tab` - Focus navigation
  - `Enter` - Submit/trigger onSubmit callback
  - `Escape` - Clear focus (when supported)
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby
- **Validation**: Announces validation errors via aria-invalid and aria-describedby
- **Required fields**: Properly marked with aria-required
- **States**: Disabled and readonly states are announced

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