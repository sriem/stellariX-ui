# @stellarix/popover

A framework-agnostic popover component that provides floating overlay functionality.

## Features

- ✅ Multiple placement options (top, bottom, left, right with start/end variations)
- ✅ Auto-positioning to keep popover within viewport
- ✅ Click outside to close
- ✅ Escape key to close
- ✅ Focus management
- ✅ Controlled and uncontrolled modes
- ✅ Full accessibility support (WCAG 2.1 AA)
- ✅ TypeScript support

## Installation

```bash
npm install @stellarix/popover
```

## Usage

```typescript
import { createPopover } from '@stellarix/popover';

// Create popover instance
const popover = createPopover({
  placement: 'bottom',
  closeOnClickOutside: true,
  closeOnEscape: true,
  onOpenChange: (open) => console.log('Popover open:', open)
});

// Connect to a framework adapter
const PopoverComponent = popover.connect(reactAdapter);
```

## Options

- `open?: boolean` - Initial open state (default: false)
- `placement?: PopoverPlacement` - Preferred placement (default: 'bottom')
- `disabled?: boolean` - Whether the popover is disabled
- `offset?: number` - Offset from trigger in pixels (default: 8)
- `closeOnClickOutside?: boolean` - Close when clicking outside (default: true)
- `closeOnEscape?: boolean` - Close on Escape key (default: true)
- `onOpenChange?: (open: boolean) => void` - Callback when open state changes
- `onPlacementChange?: (placement: PopoverPlacement) => void` - Callback when placement changes

## Placement Options

- `top`, `top-start`, `top-end`
- `bottom`, `bottom-start`, `bottom-end`
- `left`, `left-start`, `left-end`
- `right`, `right-start`, `right-end`
- `auto`, `auto-start`, `auto-end`

## State Management

The popover component manages the following state:
- `open` - Whether the popover is visible
- `placement` - Current placement of the popover
- `triggerElement` - Reference to the trigger element
- `contentElement` - Reference to the popover content
- `focused` - Whether the popover has focus
- `disabled` - Whether the popover is disabled

## Accessibility

- Proper ARIA attributes (`aria-expanded`, `aria-haspopup`, `aria-controls`)
- Keyboard navigation support (Enter/Space to open, Escape to close)
- Focus management
- Screen reader announcements