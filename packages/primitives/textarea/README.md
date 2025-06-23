# @stellarix/textarea

Multi-line text input component with autogrow support and flexible resize options.

## Installation

```bash
pnpm add @stellarix/textarea
```

## Features

- ✅ Auto-growing height based on content
- ✅ Fixed height mode with configurable rows
- ✅ Flexible resize options (none, vertical, horizontal, both)
- ✅ Character and line counting utilities
- ✅ Full validation support (required, maxLength)
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createTextareaWithImplementation } from '@stellarix/textarea';
import { reactAdapter } from '@stellarix/react';

// Create component instance
const textarea = createTextareaWithImplementation({
  value: 'Enter your message here...',
  variant: 'autogrow',
  minRows: 2,
  maxRows: 8
});

// Connect to React
const ReactTextarea = textarea.connect(reactAdapter);

// Use in your app
function App() {
  return <ReactTextarea placeholder="Type your message..." />;
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Initial value |
| `variant` | `'fixed' \| 'autogrow'` | `'fixed'` | Textarea behavior mode |
| `rows` | `number` | `4` | Number of visible rows (fixed variant) |
| `minRows` | `number` | `2` | Minimum rows (autogrow variant) |
| `maxRows` | `number` | `10` | Maximum rows (autogrow variant) |
| `disabled` | `boolean` | `false` | Disable interaction |
| `readonly` | `boolean` | `false` | Make read-only |
| `error` | `boolean` | `false` | Show error state |
| `placeholder` | `string` | - | Placeholder text |
| `maxLength` | `number` | - | Maximum character limit |
| `required` | `boolean` | `false` | Mark as required field |
| `resize` | `'none' \| 'horizontal' \| 'vertical' \| 'both'` | `'vertical'` | Resize behavior |
| `onChange` | `(value: string) => void` | - | Value change handler |
| `onFocus` | `() => void` | - | Focus handler |
| `onBlur` | `() => void` | - | Blur handler |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Current text value |
| `focused` | `boolean` | Focus state |
| `disabled` | `boolean` | Disabled state |
| `readonly` | `boolean` | Read-only state |
| `error` | `boolean` | Error state |
| `rows` | `number` | Current number of rows |
| `minRows` | `number` | Minimum rows allowed |
| `maxRows` | `number` | Maximum rows allowed |

### Methods

- `setValue(value: string)` - Update the text value
- `setDisabled(disabled: boolean)` - Toggle disabled state
- `setReadonly(readonly: boolean)` - Toggle read-only state
- `setError(error: boolean)` - Toggle error state
- `setRows(rows: number)` - Set current rows (for autogrow)
- `focus()` - Focus the textarea
- `blur()` - Remove focus
- `getCharCount()` - Get current character count
- `getLineCount()` - Get current line count
- `isInteractive()` - Check if textarea can be interacted with
- `isEmpty()` - Check if textarea is empty

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ value: string }` | Fired on value change |
| `focus` | `void` | Fired on focus |
| `blur` | `void` | Fired on blur |
| `input` | `{ value: string }` | Fired on input (for autogrow) |

## Examples

### Basic Textarea

```typescript
const textarea = createTextareaWithImplementation({
  value: 'Hello world!',
  placeholder: 'Enter your text...',
  onChange: (value) => console.log('New value:', value)
});
```

### Auto-growing Textarea

```typescript
const autoTextarea = createTextareaWithImplementation({
  variant: 'autogrow',
  minRows: 3,
  maxRows: 12,
  placeholder: 'This textarea will grow as you type...',
  onChange: (value) => {
    console.log(`Lines: ${textarea.state.getLineCount()}`);
    console.log(`Characters: ${textarea.state.getCharCount()}`);
  }
});
```

### With Character Limit

```typescript
const limitedTextarea = createTextareaWithImplementation({
  maxLength: 280,
  placeholder: 'Twitter-style message (280 chars max)',
  onChange: (value) => {
    const remaining = 280 - value.length;
    console.log(`${remaining} characters remaining`);
  }
});
```

### Disabled Resize

```typescript
const fixedTextarea = createTextareaWithImplementation({
  resize: 'none',
  rows: 6,
  value: 'This textarea cannot be resized by the user'
});
```

### Read-only Mode

```typescript
const readonlyTextarea = createTextareaWithImplementation({
  readonly: true,
  value: 'This content is read-only and cannot be edited',
  variant: 'autogrow',
  minRows: 2
});
```

### With Validation

```typescript
const validatedTextarea = createTextareaWithImplementation({
  required: true,
  minRows: 3,
  maxLength: 500,
  onChange: (value) => {
    // Custom validation
    if (value.length < 10) {
      textarea.state.setError(true);
    } else {
      textarea.state.setError(false);
    }
  }
});
```

## Accessibility

- **ARIA roles**: `textbox` with `aria-multiline="true"`
- **Keyboard support**:
  - `Tab` - Focus navigation
  - `Enter` - New line (in multiline mode)
  - `Shift+Tab` - Reverse focus navigation
  - `Ctrl+A` - Select all text
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby
- **Validation**: Supports aria-invalid, aria-required for form validation
- **Live regions**: Character count updates announced to screen readers

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