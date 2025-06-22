# StellarIX UI - System Patterns

## Component Architecture

### Component Construction Pattern

All components follow a consistent construction pattern:

1. **Factory Creation**
   ```typescript
   const buttonComponent = createButton(options);
   ```

2. **Framework Connection**
   ```typescript
   const ReactButton = buttonComponent.connect(reactAdapter);
   ```

3. **Component Usage**
   ```tsx
   <Button variant="primary" disabled={isDisabled}>Click me</Button>
   ```

### Component Types

Components are organized into two main categories:

1. **Primitive Components**
   - Single responsibility
   - Direct HTML element mapping
   - Building blocks for compound components
   - Examples: Button, Input, Checkbox

2. **Compound Components**
   - Composed of multiple primitives
   - Manage component relationships
   - Handle complex interactions
   - Examples: Dialog, Dropdown, Tabs

## Naming Conventions

### Component Names
- PascalCase for component names
- Descriptive and clear naming
- No framework prefixes

### Prop Names
- camelCase for props
- Boolean props should use positive names (e.g., `isDisabled` not `isEnabled`)
- Event handlers should use `on` prefix (e.g., `onChange`)

### API Method Names
- camelCase for method names
- Use verbs for actions (e.g., `updateValue`, `resetForm`)
- Use getters for retrievals (e.g., `getValue`, `getOptions`)

## State Management Patterns

### State Creation
```typescript
const createButtonState = (initialState) => {
  const state = reactive({
    pressed: initialState.pressed || false,
    focused: initialState.focused || false,
    // Additional state properties
  });
  
  return {
    getState: () => state,
    setPressed: (value) => { state.pressed = value; },
    setFocused: (value) => { state.focused = value; },
    // Additional state methods
  };
};
```

### State Connections
```typescript
const connectState = (state, adapter) => {
  return adapter.createObservable(state.getState());
};
```

## Event Handling Patterns

### Event Propagation
- Components emit custom events with standard naming
- Events bubble through component hierarchy
- Event handlers receive standardized payload objects

### Event Naming
- `change`: Value changed
- `input`: User input occurred
- `focus`: Component gained focus
- `blur`: Component lost focus
- `click`: Component was clicked
- `keydown`: Key was pressed
- `open`: Component opened
- `close`: Component closed

## Styling Patterns

### Style Hooks
Components provide hook points for styling:

```tsx
<Button 
  className={styles.button}
  rootProps={{ 
    className: styles.root,
    "data-state": "pressed", 
  }}
/>
```

### Style Customization
Components accept style overrides:

```tsx
<Dialog 
  overlayClassName={styles.overlay}
  contentClassName={styles.content}
  closeButtonClassName={styles.closeButton}
  portal={false}
/>
```

## Accessibility Patterns

### ARIA Attributes
- Proper ARIA roles, states, and properties
- Support for custom ARIA attributes via props

### Focus Management
- Trap focus within modals and dialogs
- Maintain focus order
- Support keyboard navigation
- Provide focus indicators

### Content Patterns
- Support for screen reader text
- Support for labeling and descriptions
- Support for announcements

## Documentation Patterns

### Component Documentation Structure
- Description
- Examples
- Props
- Accessibility notes
- Browser support
- Framework-specific notes
- Edge cases and limitations

### Example Structure
- Basic usage
- Advanced usage
- Framework-specific examples
- Styling examples
- Accessibility examples

## Component API Patterns

### Progressive Disclosure Pattern
```typescript
// Basic usage
<Button>Click Me</Button>

// Advanced configuration
const PrimaryButton = Button.configure({ 
  variant: 'primary', 
  size: 'large' 
});

// Expert customization
const IconButton = Button.createVariant('icon', { 
  padding: 'equal', 
  showLabel: false 
});
```

### Compound Component Pattern
```typescript
// Pattern 1: Explicit Composition
<Select>
  <Select.Trigger>Select an option</Select.Trigger>
  <Select.Menu>
    <Select.Option value="1">Option 1</Select.Option>
    <Select.Option value="2">Option 2</Select.Option>
  </Select.Menu>
</Select>

// Pattern 2: Implicit Composition
<Dialog>
  <Dialog.Trigger>Open Dialog</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Dialog Title</Dialog.Title>
    <Dialog.Description>Description here</Dialog.Description>
    <Dialog.Close>Close</Dialog.Close>
  </Dialog.Content>
</Dialog>
```

### Framework Adapter Pattern
```typescript
// Abstract adapter interface
interface FrameworkAdapter<HostElement = any> {
  adaptState<T>(stateLayer: StateLayer<T>): any;
  adaptLogic<S, E>(logicLayer: LogicLayer<S, E>): any;
  renderToHost(node: any, hostElement: HostElement): void;
  // Other methods...
}

// Usage pattern
const Button = createComponent('Button', {
  // Core logic and state
}).adaptTo(ReactAdapter);
```

## State Management Patterns

### Framework-Agnostic State
```typescript
// Create state
const buttonState = createStore({
  pressed: false,
  hovered: false,
  focused: false
});

// Connect to framework
const useButtonState = connectStoreToReact(buttonState);
// or
const buttonVueState = connectStoreToVue(buttonState);
```

### State Sharing Pattern
```typescript
// Shared state for component instances
const sharedState = createComponentState(initialState, {
  shared: true,
  namespace: 'dropdown-menu'
});

// Isolated state for other instances
const isolatedState = sharedState.isolate();
```

## Error Handling Patterns

### Developer Feedback Pattern
```typescript
// Error message pattern
function createDevError(
  code: string,
  message: string,
  details: {
    component: string;
    suggestions?: string[];
  }
) {
  // Implementation
}

// Warning pattern
function emitDevWarning(
  condition: boolean,
  message: string,
  details: {
    component: string;
    type: 'accessibility' | 'performance';
  }
) {
  // Implementation
}
```

## Accessibility Patterns

### Default A11y Pattern
```typescript
// Built-in accessibility
function getA11yProps(element: string, state: any) {
  switch(element) {
    case 'trigger':
      return {
        role: 'button',
        'aria-expanded': state.open,
        'aria-controls': 'menu'
      };
    case 'menu':
      return {
        role: 'menu',
        id: 'menu'
      };
    // Other elements
  }
}
```

### Focus Management Pattern
```typescript
// Focus trap implementation
function createFocusTrap(containerRef: HTMLElement) {
  return {
    activate: () => {
      // Store previous focus
      // Set focus to first focusable element
      // Handle tab navigation
    },
    deactivate: () => {
      // Restore previous focus
    }
  };
}
```

## Testing Patterns

### Component Testing Pattern
```typescript
// Testing structure
describe('Component: Button', () => {
  // Rendering tests
  describe('rendering', () => {
    it('renders correctly with default props');
    it('renders in disabled state when disabled prop is true');
  });
  
  // Behavior tests
  describe('behavior', () => {
    it('calls onClick handler when clicked');
    it('does not call onClick when disabled');
  });
  
  // Accessibility tests
  describe('accessibility', () => {
    it('has correct role attribute');
    it('supports keyboard navigation');
  });
});
```

## TypeScript Project Organization

### TypeScript Configuration Structure

The StellarIX UI monorepo follows a hierarchical TypeScript configuration pattern:

```
stellariX-ui/
├── tsconfig.json                # Root configuration with path aliases
├── packages/
│   ├── tsconfig.base.json       # Base package configuration
│   ├── core/
│   │   └── tsconfig.json        # Extends base config
│   ├── utils/
│   │   └── tsconfig.json        # Extends base config
│   ├── adapters/
│   │   ├── react/
│   │   │   └── tsconfig.json    # Extends base config
│   │   └── ...
│   └── primitives/
│       ├── button/
│       │   └── tsconfig.json    # Extends base config
│       └── ...
```

### Module Path Resolution

All imports use path aliases for improved maintainability:

```typescript
// Without path aliases
import { createState } from '../../../../core/src/state';

// With path aliases
import { createState } from '@stellarix/core/state';
```

### Project References

The project uses TypeScript Project References for build optimization and proper dependency tracking:

```typescript
// Root tsconfig.json
{
  "references": [
    { "path": "./packages/utils" },
    { "path": "./packages/core" },
    { "path": "./packages/adapters/react" },
    { "path": "./packages/primitives/button" }
  ]
}

// Package tsconfig.json
{
  "references": [
    { "path": "../../core" },
    { "path": "../../utils" }
  ]
}
```

### Declaration Files

TypeScript declaration files are exported from each package:

```typescript
// Package tsconfig.json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true
  }
}
```

### Strict Type Checking

All packages use TypeScript's strict type checking options:

```typescript
// Base tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
``` 