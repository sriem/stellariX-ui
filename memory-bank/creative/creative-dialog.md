# StellarIX UI - Dialog Component Design

## Component Overview
The Dialog component will be a framework-agnostic, headless modal dialog that follows WAI-ARIA best practices for accessibility. It will support various features like backdrops, focus management, keyboard navigation, and transitions.

## Architecture

### State Layer
The Dialog component's state will include:
- `open`: Boolean indicating whether the dialog is open or closed
- `hasBackdrop`: Boolean to control backdrop visibility
- `closeOnOutsideClick`: Boolean to determine if clicking outside should close the dialog
- `closeOnEsc`: Boolean to determine if Escape key should close the dialog

### Logic Layer
The Logic layer will manage:
- Focus trapping within the Dialog when open
- Keyboard event handling (Escape to close)
- Outside click detection
- Scrolling behavior (locking body scroll when dialog is open)
- Transition state management

### Presentation Layer (Framework Adapters)
The Presentation layer will be implemented through framework adapters and will include:
- Dialog: The main wrapper component
- DialogPanel: The panel containing dialog content
- DialogBackdrop: Optional backdrop behind the dialog
- DialogTitle: Accessible title component
- DialogDescription: Accessible description component

## Accessibility Features
- Focus trapping inside the dialog when open
- Auto-focus on first focusable element or specified element
- Return focus to trigger element when closed
- ARIA attributes for accessibility:
  - `role="dialog"` or `role="alertdialog"`
  - `aria-modal="true"`
  - `aria-labelledby` for title
  - `aria-describedby` for description
- Screen reader announcements
- Keyboard navigation

## API Design

```typescript
// State Interface
interface DialogState {
  isOpen: boolean;
  hasBackdrop: boolean;
  closeOnOutsideClick: boolean;
  closeOnEsc: boolean;
}

// Event Handlers
interface DialogEvents {
  onOpen?: () => void;
  onClose?: () => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onOutsideClick?: (event: MouseEvent) => void;
}

// Options
interface DialogOptions extends DialogEvents {
  initialOpen?: boolean;
  initialFocus?: RefObject<HTMLElement>;
  hasBackdrop?: boolean;
  closeOnOutsideClick?: boolean; 
  closeOnEsc?: boolean;
  preventScroll?: boolean;
  returnFocusOnClose?: boolean;
}

// Logic Return Type
interface DialogLogicReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  dialogRef: RefObject<HTMLElement>;
  backdropRef: RefObject<HTMLElement>;
  titleId: string;
  descriptionId: string;
  contentProps: {
    role: "dialog" | "alertdialog";
    "aria-modal": boolean;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
  };
}
```

## Usage Examples

### React Usage
```jsx
import { Dialog } from '@stellarix/react';

function MyDialog() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Dialog</button>
      
      <Dialog 
        open={isOpen} 
        onClose={() => setIsOpen(false)}
      >
        <Dialog.Backdrop />
        <Dialog.Panel>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>
            Dialog description provides context.
          </Dialog.Description>
          
          <p>Dialog content goes here...</p>
          
          <button onClick={() => setIsOpen(false)}>Close</button>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
```

## Implementation Considerations

1. **Portal Support**: The Dialog should render into a portal by default to ensure proper stacking context.

2. **Focus Management**: Implement a robust focus trap that accounts for dynamic content.

3. **Scroll Locking**: Prevent body scrolling while maintaining dialog content scrollability.

4. **Transitions**: Support for enter/leave transitions with framework-specific adapters.

5. **Responsive Behavior**: Ensure the dialog works on all device sizes.

6. **Testing**: Comprehensive test cases for keyboard navigation, focus management, and accessibility.

## Design Decisions

1. We will implement a headless Dialog component with no styling, allowing users to apply their own styles.

2. The Dialog will follow a compound component pattern for flexibility.

3. The Dialog will be framework-agnostic with adapters for specific frameworks.

4. We will prioritize accessibility and keyboard navigation.

5. The Dialog will include built-in portal support.

6. The component will support both controlled and uncontrolled modes.

## Next Steps

1. Implement the state layer with core Dialog functionality.
2. Create the logic layer with focus management and keyboard handling.
3. Implement the React adapter for the presentation layer.
4. Add comprehensive tests for all layers.
5. Create Storybook stories for documentation and visual testing. 