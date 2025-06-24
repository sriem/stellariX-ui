# Primitives Component Development Guide

This file provides specific guidance for developing primitive components in the StellarIX UI library.

## 🚨 ULTRA-CRITICAL: State Management Rules

These rules MUST be followed to prevent infinite loops and application crashes.

### 🚨🚨🚨 setState PARTIAL UPDATE PREVENTION

**FORBIDDEN**: NEVER use partial object updates with setState
```typescript
// ❌❌❌ NEVER do this (WILL BREAK):
store.setState({ field: value }); // FORBIDDEN! Loses all other fields
state.setState({ field: value }); // FORBIDDEN! Causes NaN/undefined

// ✅ ONLY CORRECT PATTERN FOR setState:
store.setState((prev: any) => ({ ...prev, field: value }));

// ✅ For multiple fields:
store.setState((prev: any) => ({ 
  ...prev, 
  field1: value1,
  field2: value2 
}));
```

**WHY**: The core setState expects either a full state object or a function updater. Partial objects cause the state to lose all other fields, resulting in NaN/undefined errors.

### 🚨 state.getState() INFINITE LOOP PREVENTION

**FORBIDDEN**: NEVER call `state.getState()` in reactive contexts
```typescript
// ❌❌❌ FORBIDDEN - CAUSES INFINITE LOOPS:
.withInteraction('root', 'onClick', (currentState, event) => {
    const state = store.getState(); // 🚨 INFINITE LOOP!
    if (state.disabled) return;     // 🚨 INFINITE LOOP!
})

// ✅✅✅ CORRECT - PROVEN WORKING PATTERN:
.withInteraction('root', 'onClick', (currentState, event) => {
    if (currentState.disabled) return; // ✅ Use parameter
    state.setChecked(newValue);         // ✅ Call state methods directly
    return 'change';                    // ✅ Return event type
})
```

**FORBIDDEN CONTEXTS**:
- NEVER in logic layer methods
- NEVER in event handlers  
- NEVER in getInteractionHandlers()
- NEVER in getA11yProps()
- NEVER in interactions generator
- NEVER in tests: `expect(state.getState())`
- NEVER in Storybook: `component.state.getState()`

### 🚨 Critical Primitive-Specific Rules
- **ALWAYS** use LogicLayerBuilder pattern for all component logic implementations
- **ALWAYS** handle event payload extraction: `const event = payload?.event ? payload.event : payload`
- **ALWAYS** support both direct events and wrapped { event } payloads in onEvent handlers
- **ALWAYS** call onChange callbacks directly in interaction handlers for proper value passing
- **ALWAYS** test interactions via callbacks, not state inspection
- **ALWAYS** use subscription pattern in Storybook: useState + useEffect + subscribe
- **ALWAYS** use function updater pattern for setState: `store.setState((prev) => ({ ...prev, field: value }))`

## 📋 Component Creation Process

### Step 1: Copy Template (ALWAYS use this method)
```bash
# From packages/primitives directory:
cp -r ../../templates/component-template ./[component-name]
cd [component-name]

# Example:
cp -r ../../templates/component-template ./select
cd select
```

### Step 2: Replace Placeholders
Use your editor's find & replace:
- `Template` → `YourComponent` (PascalCase, e.g., `Select`)
- `template` → `yourComponent` (camelCase, e.g., `select`)
- `TEMPLATE` → `YOUR_COMPONENT` (SCREAMING_CASE, e.g., `SELECT`)

### Step 3: Update package.json
```json
{
  "name": "@stellarix-ui/[component-name]",
  "description": "[Component description]"
}
```

### Step 4: Implement Component Logic

#### MANDATORY LogicLayerBuilder Pattern
```typescript
// ✅ ALWAYS use this pattern:
export function createComponentLogic(state, options = {}) {
    return new LogicLayerBuilder<State, Events>()
        .onEvent('change', (currentState, payload) => {
            // Extract value properly
            const newValue = payload && 'value' in payload ? payload.value : currentState.value;
            state.setValue(newValue);
            if (options.onChange) options.onChange(newValue);
            return null;
        })
        .withA11y('root', (state) => ({
            'aria-disabled': state.disabled ? 'true' : undefined,
            tabIndex: state.disabled ? -1 : 0,
        }))
        .withInteraction('root', 'onClick', (currentState, event) => {
            if (currentState.disabled) { 
                event.preventDefault(); 
                return null; 
            }
            state.setValue(newValue);  // Update state directly
            return 'change';           // Trigger event
        })
        .build();
}
```

### Step 5: Testing Patterns

#### State Testing
```typescript
// ✅ CORRECT - test state via subscription:
const listener = vi.fn();
state.subscribe(listener);
state.setChecked(true);
expect(listener).toHaveBeenCalledWith({ checked: true });

// ❌ FORBIDDEN - never use getState() in tests:
expect(state.getState().checked).toBe(true); // CAUSES ISSUES!
```

#### Logic Testing
```typescript
// ✅ CORRECT - test via callbacks:
const onChange = vi.fn();
const logic = createComponentLogic(state, { onChange });
logic.connect(state);
logic.initialize();
const interactions = logic.getInteractionHandlers('root');
interactions.onClick(mockEvent);
expect(onChange).toHaveBeenCalledWith(true);
```

#### Interaction Handler Testing
```typescript
// ✅ CORRECT - handlers don't return values, test side effects:
it('should handle click interaction', () => {
    const handlers = logic.getInteractionHandlers('root');
    handlers.onClick?.(mockEvent);
    
    // Verify callback was called
    expect(options.onClick).toHaveBeenCalledWith(mockEvent);
    
    // Or verify state changed
    const listener = vi.fn();
    state.subscribe(listener);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ active: true }));
});
```

### Step 6: Create Storybook Story

#### Story File Creation
```bash
# The template now includes Component.stories.tsx
# Just update the placeholders as you did with other files
```

#### Story Pattern
```typescript
// ✅ CORRECT - use wrapper pattern for state management:
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createComponentWithImplementation } from './index';
import { reactAdapter } from '@stellarix-ui/react';

// Create wrapper to manage individual instances
const ComponentWrapper = React.forwardRef((props: any, ref: any) => {
  const [component] = React.useState(() => createComponentWithImplementation(props));
  const Component = React.useMemo(() => component.connect(reactAdapter), [component]);
  
  // Update component state when props change
  React.useEffect(() => {
    if (props.value !== undefined) {
      component.state.setValue(props.value);
    }
  }, [props.value, component]);
  
  return <Component ref={ref} {...props} />;
});

// ❌ FORBIDDEN - causes infinite loops:
const state = component.state.getState(); // NEVER DO THIS IN STORIES!
```

#### Required Story Sections
1. **Basic Stories**: Default, WithValue, Disabled, Loading, Error
2. **Interactive Example**: Shows state changes
3. **Showcase Story**: Grid of all variations
4. **Accessibility Story**: Demonstrates a11y features

### Step 7: Run Tests with Timeout Protection
```bash
# ALWAYS use timeout to prevent hanging:
timeout 30s pnpm test
timeout 30s pnpm build
timeout 30s pnpm typecheck
```

### Step 8: Create Changeset for Component
```bash
# After all tests pass and component is complete:
pnpm changeset

# For new components, always use 'minor' version bump
# Select the component package (e.g., @stellarix-ui/select)
# Write a clear summary:
# "Add Select component with search, keyboard navigation, and accessibility support"
```

## 📦 Component Changeset Guidelines

### New Component = Minor Version
When creating a new primitive component, ALWAYS use a **minor** version bump (0.X.0) because:
- It's a new feature addition
- It's backwards compatible (nothing existed before)
- It signals to users that new functionality is available

### Changeset Message Template for Components:
```
feat: add [Component] component

- Full keyboard navigation support
- WCAG 2.2 AA compliant
- [Specific feature 1]
- [Specific feature 2]
- Framework-agnostic with adapter support
```

### Example Component Changesets:

**New Component:**
```
feat: add Select component

- Searchable dropdown with real-time filtering
- Full keyboard navigation (Arrow keys, Home, End, Escape)
- Single selection with optional clear button
- Customizable option rendering
- WCAG 2.2 AA compliant with proper ARIA attributes
```

**Component Enhancement:**
```
feat(button): add loading state support

- Added loading prop to show spinner
- Loading state prevents user interaction
- Spinner inherits button variant colors
- Added loadingText prop for accessibility
```

**Component Bug Fix:**
```
fix(dialog): prevent focus trap memory leak

- Properly cleanup focus trap on unmount
- Remove event listeners in cleanup function
- Fix subscription cleanup in useEffect
```

## 🎯 Reference Implementations

Use these components as perfect examples:

### ✅ Checkbox (100% Success - 30/30 tests)
Location: `./checkbox/`
- Perfect LogicLayerBuilder usage
- No state.getState() calls
- Proper event payload extraction
- Complete accessibility
- Subscription-based testing

### ✅ Radio (100% Success - 29/29 tests)
Location: `./radio/`
- Built using Checkbox patterns
- Radio-specific behavior
- Callback verification in tests
- Proper state management

### ✅ Dialog (100% Success - 27/27 tests)
Location: `./dialog/`
- Complex state management
- Focus trap implementation
- Backdrop handling
- No getState() violations

## 📖 Storybook Requirements

Every component MUST have a comprehensive story showing:

1. **All Variants**: primary, secondary, outline, etc.
2. **All Sizes**: sm, md, lg
3. **All States**: normal, hover, focus, disabled, loading, error
4. **Edge Cases**: empty states, overflow, validation

Example structure:
```tsx
export const Default = { ... }
export const Disabled = { ... }
export const Loading = { ... }
export const Error = { ... }

// Showcase with all variations
export const Showcase = {
  render: () => (
    // Grid showing everything
  )
}
```

## 📝 Code Style Guidelines

### Clean Code Practices
- NO inline comments explaining code changes (e.g., `// Updated for WCAG compliance`)
- NO implementation notes in production code
- Keep code self-documenting through clear naming
- Use JSDoc comments only for public APIs
- Place explanatory comments in PR descriptions, not code

### Example:
```typescript
// ❌ AVOID:
primary: 'hsl(237.7, 85.6%, 62%)',  // Darkened for 4.5:1 contrast
success: '#059669',  // Updated for WCAG AA compliance

// ✅ PREFERRED:
primary: 'hsl(237.7, 85.6%, 62%)',
success: '#059669',
```

## 🚫 Common Pitfalls to Avoid

1. **Circular Dependencies**
   - Don't import component into itself
   - No state→logic→state cycles
   - No recursive subscriptions

2. **Memory Leaks**
   - Always cleanup subscriptions
   - Remove event listeners
   - Clear timers/intervals

3. **Test Hangs**
   - Always use `timeout` command
   - Check for infinite loops
   - Verify no circular dependencies

## ✅ Component Checklist

Before considering a component complete:

- [ ] State management uses function updater pattern
- [ ] No state.getState() calls anywhere
- [ ] LogicLayerBuilder pattern used
- [ ] All tests passing (90%+ coverage)
- [ ] Storybook story created
- [ ] Accessibility props implemented
- [ ] No circular dependencies
- [ ] Build succeeds
- [ ] TypeScript strict mode passes
- [ ] Changeset created with `pnpm changeset`
- [ ] README.md follows standard template

## 📝 Component README Structure

Every component MUST have a proper README.md following this exact structure:

### README.md Template
```markdown
# @stellarix-ui/[component-name]

[One-line description of what this component does]

## Installation

\`\`\`bash
pnpm add @stellarix-ui/[component-name]
\`\`\`

## Features

- ✅ [Key feature 1 - be specific!]
- ✅ [Key feature 2]
- ✅ Framework-agnostic architecture
- ✅ Full TypeScript support
- ✅ Zero runtime dependencies
- ✅ WCAG 2.2 AA compliant

## Basic Usage

\`\`\`typescript
import { create[Component] } from '@stellarix-ui/[component-name]';
import { reactAdapter } from '@stellarix-ui/react';

// Create component instance
const [component] = create[Component]({
  // options
});

// Connect to React
const React[Component] = [component].connect(reactAdapter);

// Use in your app
function App() {
  return <React[Component] />;
}
\`\`\`

## API Reference

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Initial value |
| `disabled` | `boolean` | `false` | Disable interaction |
| `onChange` | `(value: T) => void` | - | Change handler |

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Current value |
| `focused` | `boolean` | Focus state |
| `disabled` | `boolean` | Disabled state |

### Methods

- `setValue(value: string)` - Update the value
- `setDisabled(disabled: boolean)` - Toggle disabled state
- `focus()` - Focus the component
- `blur()` - Remove focus

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ value: string }` | Fired on value change |
| `focus` | `{ event: FocusEvent }` | Fired on focus |
| `blur` | `{ event: FocusEvent }` | Fired on blur |

## Examples

### Basic Example

\`\`\`typescript
const input = createInput({
  value: 'Hello',
  onChange: (value) => console.log('New value:', value)
});
\`\`\`

### With Validation

\`\`\`typescript
const input = createInput({
  value: '',
  required: true,
  pattern: /^[A-Z]/,
  onChange: (value) => {
    if (!value.match(/^[A-Z]/)) {
      input.state.setError(true, 'Must start with uppercase');
    }
  }
});
\`\`\`

## Accessibility

- **ARIA roles**: `[role]` (when applicable)
- **Keyboard support**: 
  - `Tab` - Focus navigation
  - `[Other keys]` - Specific actions
- **Screen reader**: Fully compatible with NVDA, JAWS, VoiceOver
- **Labels**: Supports aria-label, aria-labelledby, aria-describedby

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
\`\`\`

### Key Points for Good READMEs

1. **Be Specific**: Don't use generic descriptions
2. **Show Real Examples**: Use actual code, not placeholders
3. **Document All Options**: Every option should be in the table
4. **Include Edge Cases**: Show how to handle errors, validation, etc.
5. **Accessibility First**: Always document keyboard and screen reader support

## 🔗 Quick Links

- Component Template: `../../templates/component-template/`
- Main Architecture: `../../CLAUDE.md`
- Component Catalog: `../../memory-bank/component-catalog.md`
- Testing Guide: `../../memory-bank/testing-guide.md`