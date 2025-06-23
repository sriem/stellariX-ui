# @stellarix/popover

A floating overlay component that appears next to a trigger element with intelligent positioning and focus management.

## Installation

```bash
pnpm add @stellarix/popover
```

## Features

- ✅ 15 placement options (top, bottom, left, right with start/end/auto variations)
- ✅ Auto-positioning to keep popover within viewport
- ✅ Click outside to close functionality
- ✅ Escape key to close
- ✅ Focus management and trap
- ✅ Configurable offset from trigger element
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

```typescript
import { createPopover } from '@stellarix/popover';
import { reactAdapter } from '@stellarix/react';

// Create component instance
const popover = createPopover({
  placement: 'bottom',
  offset: 8,
  closeOnClickOutside: true,
  closeOnEscape: true,
  onOpenChange: (open) => console.log('Popover open:', open)
});

// Connect to React
const ReactPopover = popover.connect(reactAdapter);

// Use in your app
function App() {
  return (
    <div>
      <button data-popover-trigger>Click me</button>
      <ReactPopover>
        <div>Popover content goes here</div>
      </ReactPopover>
    </div>
  );
}
```

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `open` | `boolean` | `false` | Initial open state |
| `placement` | `PopoverPlacement` | `'bottom'` | Preferred placement |
| `disabled` | `boolean` | `false` | Disable popover interaction |
| `offset` | `number` | `8` | Offset from trigger in pixels |
| `closeOnClickOutside` | `boolean` | `true` | Close when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `id` | `string` | - | ID attribute for popover |
| `onOpenChange` | `(open: boolean) => void` | - | Open state change handler |
| `onPlacementChange` | `(placement: PopoverPlacement) => void` | - | Placement change handler |
| `className` | `string` | - | Additional CSS classes |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `open` | `boolean` | Whether popover is visible |
| `placement` | `PopoverPlacement` | Current placement |
| `triggerElement` | `HTMLElement \| null` | Reference to trigger element |
| `contentElement` | `HTMLElement \| null` | Reference to popover content |
| `focused` | `boolean` | Whether popover has focus |
| `disabled` | `boolean` | Whether popover is disabled |

### Methods

- `setOpen(open: boolean)` - Toggle popover visibility
- `setPlacement(placement: PopoverPlacement)` - Update placement
- `setTriggerElement(element: HTMLElement | null)` - Set trigger reference
- `setContentElement(element: HTMLElement | null)` - Set content reference
- `setFocused(focused: boolean)` - Toggle focus state
- `setDisabled(disabled: boolean)` - Toggle disabled state

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `openChange` | `{ open: boolean, source: string }` | Fired when open state changes |
| `placementChange` | `{ placement: PopoverPlacement, previousPlacement: PopoverPlacement }` | Fired when placement changes |
| `focus` | `{ event: FocusEvent }` | Fired when popover receives focus |
| `blur` | `{ event: FocusEvent }` | Fired when popover loses focus |
| `escape` | `{ event: KeyboardEvent }` | Fired when Escape key is pressed |
| `outsideClick` | `{ event: MouseEvent }` | Fired when clicked outside |

## Examples

### Basic Popover

```typescript
const popover = createPopover({
  placement: 'bottom',
  onOpenChange: (open) => console.log('Popover toggled:', open)
});
```

### Controlled Popover

```typescript
const popover = createPopover({
  open: false,
  closeOnClickOutside: false,
  onOpenChange: (open) => {
    // Handle state changes manually
    if (open) {
      console.log('Opening popover');
    } else {
      console.log('Closing popover');
    }
  }
});

// Programmatically control
popover.state.setOpen(true);
```

### Auto-positioning

```typescript
const popover = createPopover({
  placement: 'auto', // Automatically finds best position
  offset: 12,
  onPlacementChange: (placement, previousPlacement) => {
    console.log('Placement changed from', previousPlacement, 'to', placement);
  }
});
```

### Custom Positioning

```typescript
const popover = createPopover({
  placement: 'top-start',
  offset: 16,
  onOpenChange: (open) => {
    if (open) {
      // Custom positioning logic
      const { triggerElement, contentElement } = popover.state.getState();
      if (triggerElement && contentElement) {
        // Position relative to specific element
        const rect = triggerElement.getBoundingClientRect();
        contentElement.style.left = `${rect.left + 20}px`;
        contentElement.style.top = `${rect.top - 10}px`;
      }
    }
  }
});
```

### With Focus Management

```typescript
const popover = createPopover({
  placement: 'bottom',
  onOpenChange: (open) => {
    if (open) {
      // Focus first interactive element
      const firstInput = popover.state.contentElement?.querySelector('input, button, select');
      firstInput?.focus();
    }
  }
});
```

## Placement Options

### Basic Placements
- `top` - Above trigger, centered
- `bottom` - Below trigger, centered
- `left` - Left of trigger, centered
- `right` - Right of trigger, centered

### Aligned Placements
- `top-start` - Above trigger, aligned to start
- `top-end` - Above trigger, aligned to end
- `bottom-start` - Below trigger, aligned to start
- `bottom-end` - Below trigger, aligned to end
- `left-start` - Left of trigger, aligned to start
- `left-end` - Left of trigger, aligned to end
- `right-start` - Right of trigger, aligned to start
- `right-end` - Right of trigger, aligned to end

### Auto Placements
- `auto` - Automatically chooses best position
- `auto-start` - Auto with start alignment
- `auto-end` - Auto with end alignment

## Accessibility

- **ARIA roles**: `dialog` for popover content
- **Keyboard support**: 
  - `Enter/Space` - Open/close popover
  - `Escape` - Close popover
  - `Tab` - Navigate within popover content
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports `aria-label`, `aria-labelledby`, `aria-describedby`
- **Attributes**: `aria-expanded`, `aria-haspopup`, `aria-controls`, `aria-hidden`

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