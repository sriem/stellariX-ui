# @stellarix/radio

Framework-agnostic radio button component with full accessibility and keyboard navigation support.

## Installation

```bash
pnpm add @stellarix/radio
```

## Features

- ✅ Radio group behavior with exclusive selection
- ✅ Full keyboard navigation (Arrow keys, Tab, Space)
- ✅ Cannot uncheck once checked (radio-specific behavior)
- ✅ Form integration with name/value attributes
- ✅ Validation states (required, error) 
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createRadio } from '@stellarix/radio';
import { reactAdapter } from '@stellarix/react';

// Create radio component instance
const radio = createRadio({
  name: 'theme',
  value: 'dark',
  checked: false,
  onChange: (checked, value) => {
    console.log(`Radio ${value} is now ${checked ? 'checked' : 'unchecked'}`);
  }
});

// Connect to React
const ReactRadio = radio.connect(reactAdapter);

// Use in your app
function App() {
  return (
    <div>
      <ReactRadio>Dark Theme</ReactRadio>
    </div>
  );
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | - | **Required** - Name attribute for radio group |
| `value` | `string` | - | **Required** - Value for this radio option |
| `checked` | `boolean` | `false` | Initial checked state |
| `disabled` | `boolean` | `false` | Disable interaction |
| `required` | `boolean` | `false` | Mark as required field |
| `id` | `string` | - | ID attribute for the radio |
| `className` | `string` | - | Additional CSS classes |
| `onChange` | `(checked: boolean, value: string) => void` | - | Change handler |
| `onFocus` | `(event: FocusEvent) => void` | - | Focus handler |
| `onBlur` | `(event: FocusEvent) => void` | - | Blur handler |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `checked` | `boolean` | Current checked state |
| `disabled` | `boolean` | Whether radio is disabled |
| `focused` | `boolean` | Whether radio has focus |
| `required` | `boolean` | Whether radio is required |
| `error` | `boolean` | Whether radio has validation error |
| `errorMessage` | `string?` | Error message text |
| `value` | `string` | The value of this radio option |
| `name` | `string` | The name attribute for radio group |

### Methods

- `setChecked(checked: boolean)` - Update the checked state
- `setDisabled(disabled: boolean)` - Toggle disabled state
- `setFocused(focused: boolean)` - Update focus state
- `setRequired(required: boolean)` - Toggle required state
- `setError(error: boolean, message?: string)` - Set error state
- `isInteractive()` - Check if radio can be interacted with

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ checked: boolean, value: string, previousChecked: boolean }` | Fired when checked state changes |
| `focus` | `{ event: FocusEvent }` | Fired when radio receives focus |
| `blur` | `{ event: FocusEvent }` | Fired when radio loses focus |
| `keydown` | `{ event: KeyboardEvent }` | Fired on arrow key navigation |

## Examples

### Basic Radio Group

```typescript
// Create multiple radios for a group
const radios = ['light', 'dark', 'auto'].map(theme => 
  createRadio({
    name: 'theme',
    value: theme,
    checked: theme === 'light', // Default selection
    onChange: (checked, value) => {
      if (checked) {
        console.log(`Selected theme: ${value}`);
        // Uncheck other radios in the group
        radios.forEach(radio => {
          if (radio.options.value !== value) {
            radio.state.setChecked(false);
          }
        });
      }
    }
  })
);
```

### With Form Validation

```typescript
const radio = createRadio({
  name: 'terms',
  value: 'accepted',
  required: true,
  onChange: (checked, value) => {
    if (checked) {
      radio.state.setError(false); // Clear error when checked
    }
  }
});

// Validate on form submit
function validateForm() {
  if (!radio.state.getState().checked) {
    radio.state.setError(true, 'You must accept the terms to continue');
    return false;
  }
  return true;
}
```

### Disabled State

```typescript
const radio = createRadio({
  name: 'option',
  value: 'premium',
  disabled: true,
  onChange: (checked, value) => {
    // This won't fire when disabled
    console.log('This will not be called');
  }
});
```

### Radio Group Manager (Advanced)

```typescript
// Helper to manage radio groups
class RadioGroup {
  private radios: Map<string, RadioCore> = new Map();
  
  add(radio: RadioCore) {
    this.radios.set(radio.options.value, radio);
    
    // Override onChange to handle group behavior
    const originalOnChange = radio.options.onChange;
    radio.options.onChange = (checked, value) => {
      if (checked) {
        // Uncheck all other radios in the group
        this.radios.forEach((otherRadio, otherValue) => {
          if (otherValue !== value) {
            otherRadio.state.setChecked(false);
          }
        });
      }
      originalOnChange?.(checked, value);
    };
  }
  
  getValue(): string | null {
    for (const [value, radio] of this.radios) {
      if (radio.state.getState().checked) {
        return value;
      }
    }
    return null;
  }
  
  setValue(value: string) {
    this.radios.forEach((radio, radioValue) => {
      radio.state.setChecked(radioValue === value);
    });
  }
}

// Usage
const themeGroup = new RadioGroup();
themeGroup.add(createRadio({ name: 'theme', value: 'light' }));
themeGroup.add(createRadio({ name: 'theme', value: 'dark' }));
themeGroup.add(createRadio({ name: 'theme', value: 'auto' }));

themeGroup.setValue('dark'); // Select dark theme
console.log(themeGroup.getValue()); // 'dark'
```

## Radio Button Behavior

Radio buttons have specific behavior that differs from checkboxes:

### Key Differences
- **Exclusive Selection**: Only one radio in a group can be checked
- **Cannot Uncheck**: Clicking a checked radio does NOT uncheck it
- **Group Navigation**: Arrow keys move between radios in the same group
- **Name Attribute**: All radios in a group must share the same `name`
- **Value Attribute**: Each radio must have a unique `value`

### Form Integration
```html
<!-- HTML equivalent -->
<input type="radio" name="theme" value="light" checked>
<input type="radio" name="theme" value="dark">
<input type="radio" name="theme" value="auto">
```

```typescript
// StellarIX equivalent
const lightRadio = createRadio({ name: 'theme', value: 'light', checked: true });
const darkRadio = createRadio({ name: 'theme', value: 'dark' });
const autoRadio = createRadio({ name: 'theme', value: 'auto' });
```

## Accessibility

- **ARIA roles**: `radio` with `radiogroup` container
- **Keyboard support**: 
  - `Tab` - Enter/exit radio group
  - `Arrow Keys` - Navigate between radios in group
  - `Space` - Select focused radio
- **Screen reader**: Announces radio state, group context, and labels
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby
- **Required**: Indicates required state to assistive technology
- **Validation**: Error states are announced to screen readers

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