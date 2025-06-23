# @stellarix-ui/dialog

A fully accessible, framework-agnostic modal dialog component with focus management, backdrop control, and keyboard navigation.

## Installation

```bash
pnpm add @stellarix-ui/dialog
```

## Features

- ✅ Modal dialog with focus trap functionality
- ✅ Backdrop click and escape key dismissal
- ✅ Automatic focus management and restoration
- ✅ Body scroll prevention when open
- ✅ Support for both dialog and alertdialog roles
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createDialog } from '@stellarix-ui/dialog';
import { reactAdapter } from '@stellarix-ui/react';

// Create dialog instance
const dialog = createDialog({
  open: false,
  onOpenChange: (open) => console.log('Dialog:', open ? 'opened' : 'closed')
});

// Connect to React
const ReactDialog = dialog.connect(reactAdapter);

// Use in your app
function App() {
  return (
    <div>
      <button onClick={() => dialog.state.setOpen(true)}>
        Open Dialog
      </button>
      
      <ReactDialog>
        <div data-element="backdrop" />
        <div data-element="content">
          <h2>Dialog Title</h2>
          <p>Dialog content goes here.</p>
          <button onClick={() => dialog.state.setOpen(false)}>
            Close
          </button>
        </div>
      </ReactDialog>
    </div>
  );
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `open` | `boolean` | `false` | Initial open state |
| `closeOnBackdropClick` | `boolean` | `true` | Close dialog when backdrop is clicked |
| `closeOnEscape` | `boolean` | `true` | Close dialog when Escape key is pressed |
| `focusTrap` | `boolean` | `true` | Trap focus within dialog when open |
| `preventScroll` | `boolean` | `true` | Prevent body scroll when dialog is open |
| `role` | `'dialog' \| 'alertdialog'` | `'dialog'` | ARIA role for accessibility |
| `id` | `string` | - | ID attribute for the dialog |
| `ariaLabel` | `string` | - | ARIA label for the dialog |
| `ariaLabelledBy` | `string` | - | ID of element that labels the dialog |
| `ariaDescribedBy` | `string` | - | ID of element that describes the dialog |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | - | Callback when Escape key is pressed |
| `onBackdropClick` | `(event: MouseEvent) => void` | - | Callback when backdrop is clicked |
| `className` | `string` | - | Additional CSS classes |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `open` | `boolean` | Whether the dialog is currently open |
| `previousFocus` | `HTMLElement \| null` | Element that had focus before dialog opened |
| `loading` | `boolean` | Whether the dialog is in a loading state |
| `closeOnBackdropClick` | `boolean` | Whether to close on backdrop click |
| `closeOnEscape` | `boolean` | Whether to close on Escape key |
| `focusTrap` | `boolean` | Whether focus is trapped within dialog |
| `preventScroll` | `boolean` | Whether body scroll is prevented |
| `role` | `'dialog' \| 'alertdialog'` | Dialog role for accessibility |

### Methods

- `setOpen(open: boolean)` - Open or close the dialog
- `setPreviousFocus(element: HTMLElement | null)` - Set the element to restore focus to
- `setLoading(loading: boolean)` - Toggle loading state
- `setCloseOnBackdropClick(enabled: boolean)` - Toggle backdrop click behavior
- `setCloseOnEscape(enabled: boolean)` - Toggle escape key behavior
- `setFocusTrap(enabled: boolean)` - Toggle focus trap behavior
- `setPreventScroll(enabled: boolean)` - Toggle body scroll prevention
- `setRole(role: 'dialog' | 'alertdialog')` - Set the ARIA role

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `openChange` | `{ open: boolean }` | Fired when dialog open state changes |
| `escapeKeyDown` | `{ event: KeyboardEvent }` | Fired when Escape key is pressed |
| `backdropClick` | `{ event: MouseEvent }` | Fired when backdrop is clicked |

## Examples

### Basic Modal Dialog

```typescript
const dialog = createDialog({
  open: false,
  onOpenChange: (open) => {
    console.log('Dialog is now:', open ? 'open' : 'closed');
  }
});

// Open the dialog
dialog.state.setOpen(true);

// Close the dialog
dialog.state.setOpen(false);
```

### Alert Dialog (Non-Dismissible)

```typescript
const alertDialog = createDialog({
  role: 'alertdialog',
  closeOnBackdropClick: false,
  closeOnEscape: false,
  onOpenChange: (open) => {
    if (!open) {
      // Only close via explicit user action
      console.log('Alert dialog dismissed');
    }
  }
});
```

### Custom Close Behavior

```typescript
const dialog = createDialog({
  closeOnBackdropClick: true,
  closeOnEscape: true,
  onBackdropClick: (event) => {
    console.log('Backdrop clicked, dialog will close');
  },
  onEscapeKeyDown: (event) => {
    console.log('Escape pressed, dialog will close');
    // Prevent default if you want to handle it yourself
    // event.preventDefault();
  }
});
```

### With Custom Focus Management

```typescript
const dialog = createDialog({
  focusTrap: true,
  onOpenChange: (open) => {
    if (open) {
      // Dialog opened - focus is automatically managed
      // First focusable element will be focused
    } else {
      // Dialog closed - focus restored to previous element
      console.log('Focus restored to:', dialog.state.previousFocus);
    }
  }
});
```

### Loading State Dialog

```typescript
const dialog = createDialog({
  open: false,
  onOpenChange: async (open) => {
    if (open) {
      dialog.state.setLoading(true);
      try {
        await fetchData();
      } finally {
        dialog.state.setLoading(false);
      }
    }
  }
});
```

## Accessibility

- **ARIA roles**: Supports both `dialog` and `alertdialog` roles
- **Keyboard support**: 
  - `Escape` - Closes the dialog (configurable)
  - `Tab` / `Shift+Tab` - Cycles through focusable elements within dialog
  - Focus is trapped within the dialog when open
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports `aria-label`, `aria-labelledby`, `aria-describedby`
- **Focus management**: 
  - Automatically focuses first focusable element when opened
  - Restores focus to previous element when closed
  - Prevents focus from escaping the dialog when open

### Dialog vs AlertDialog

- **`dialog`**: Standard modal dialog that can be dismissed via backdrop click or Escape key
- **`alertdialog`**: Critical dialog that typically requires explicit user action to dismiss (often used for confirmations, errors, or warnings)

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