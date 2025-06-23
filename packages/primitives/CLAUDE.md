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
  "name": "@stellarix/[component-name]",
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

### Step 6: Storybook Pattern
```typescript
// ✅ CORRECT - use subscription pattern:
const [componentState, setComponentState] = useState(() => component.state.getState());
useEffect(() => {
  const unsubscribe = component.state.subscribe(setComponentState);
  return unsubscribe;
}, []);

// ❌ FORBIDDEN - causes infinite loops:
const state = component.state.getState(); // NEVER DO THIS!
```

### Step 7: Run Tests with Timeout Protection
```bash
# ALWAYS use timeout to prevent hanging:
timeout 30s pnpm test
timeout 30s pnpm build
timeout 30s pnpm typecheck
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

## 🔗 Quick Links

- Component Template: `../../templates/component-template/`
- Main Architecture: `../../CLAUDE.md`
- Component Catalog: `../../memory-bank/component-catalog.md`
- Testing Guide: `../../memory-bank/testing-guide.md`