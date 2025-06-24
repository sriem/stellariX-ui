# Core Architecture Development Guide

This file provides specific guidance for developing the core architecture of StellarIX UI.

## 🎯 Ultra-Generic Architecture Principles

### Core Philosophy: Maximum Adapter Extensibility
The architecture MUST allow ANY framework adapter to be added without modifying core code. This is the highest priority requirement.

### Three-Layer Architecture
1. **State Layer**: Framework-agnostic reactive state (`packages/core/src/state.ts`)
2. **Logic Layer**: Pure business logic (`packages/core/src/logic.ts`) 
3. **Presentation Layer**: Framework-specific adapters (`packages/adapters/`)

### Minimal Adapter Interface (NEVER change this)
```typescript
interface FrameworkAdapter {
  name: string;
  version: string;
  createComponent<TState, TLogic>(
    componentCore: ComponentCore<TState, TLogic>
  ): any;
  optimize?: (component: any) => any;
}
```

## 🚨 ULTRA-CRITICAL: State Management Rules

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
- NEVER in reactive contexts

## 🏗️ Framework-Agnostic Rules

### Absolute Framework Independence
- ❌ NEVER import framework code in `/packages/core/`
- ❌ NEVER use framework-specific patterns in core
- ✅ ALWAYS use pure functions in core
- ✅ ALWAYS make state updates immutable
- ✅ ALWAYS communicate via events, not direct calls

### Component Creation Pattern
```typescript
import { createButton } from '@stellarix-ui/button';
import { reactAdapter } from '@stellarix-ui/react';

const button = createButton(options);
const ReactButton = button.connect(reactAdapter);
```

## 🔧 Core Development Patterns

### State Store Implementation
```typescript
export interface StateStore<T> {
  getState(): T;
  setState(updater: T | ((prev: T) => T)): void;
  subscribe(listener: (state: T) => void): () => void;
  derive<U>(selector: (state: T) => U): DerivedState<U>;
  destroy(): void;
}
```

### Logic Layer Implementation
```typescript
export interface LogicLayer<TState = any, TEvents = any> {
  handleEvent(event: string, payload?: any): void;
  getA11yProps(elementId: string): Record<string, any>;
  getInteractionHandlers(elementId: string): Record<string, Function>;
  initialize(): void;
  cleanup(): void;
  connect(stateStore: StateStore<TState>): void;
}
```

### Component Factory Implementation
```typescript
export interface ComponentCore<TState, TLogic, TProps = any> {
  state: StateStore<TState>;
  logic: LogicLayer<TState, TLogic>;
  metadata: ComponentMetadata;
  connect?: <TFrameworkComponent>(adapter: FrameworkAdapter) => TFrameworkComponent;
}
```

## 🧪 Core Testing Patterns

### State Testing
```typescript
// ✅ CORRECT - test state via subscription:
const listener = vi.fn();
state.subscribe(listener);
state.setValue('new value');
expect(listener).toHaveBeenCalledWith({ value: 'new value' });

// ❌ FORBIDDEN - never use getState() in tests:
expect(state.getState().value).toBe('new value'); // CAUSES ISSUES!
```

### Logic Testing
```typescript
// ✅ CORRECT - test via events and callbacks:
const logic = createLogicLayer(config);
logic.connect(state);
logic.initialize();
logic.handleEvent('change', { value: 'test' });
expect(mockCallback).toHaveBeenCalledWith('test');
```

## 🚫 Common Pitfalls to Avoid

1. **Framework Dependencies**
   - No React/Vue/Svelte imports in core
   - No DOM manipulation in core
   - No framework-specific patterns

2. **Circular Dependencies**
   - No self-referencing imports
   - No A→B→A import chains
   - No recursive function calls without exit conditions

3. **Memory Leaks**
   - Always cleanup subscriptions
   - Always remove event listeners
   - Properly cleanup derived stores

## 🚨🚨🚨 ABSOLUTE RULE: NO INLINE COMMENTS

**THIS IS A ZERO-TOLERANCE RULE**: Absolutely NO inline comments are allowed in ANY file within the core package!

### ❌❌❌ COMPLETELY FORBIDDEN:
```typescript
// The following are ALL violations:
dts: false, // Temporarily disable DTS to get build working ❌
primary: 'hsl(237.7, 85.6%, 62%)', // Darkened for contrast ❌
setState({ field: value }); // Update state ❌
// TODO: Fix this later ❌
// NOTE: This is important ❌
// FIXME: Known issue ❌
// Updated for WCAG compliance ❌
// Changed to fix bug ❌
```

### ✅✅✅ ONLY ALLOWED:
```typescript
// Clean code with NO comments:
dts: false,
primary: 'hsl(237.7, 85.6%, 62%)',
setState({ field: value });

// JSDoc for PUBLIC APIs only:
/**
 * Creates a state store
 * @param initialState - Initial state
 * @returns State store instance
 */
export function createStateStore(initialState) { ... }
```

**ZERO inline comments** - No exceptions, no "temporary" comments!

## ✅ Core Development Checklist

Before considering core changes complete:

- [ ] Zero framework dependencies
- [ ] All tests pass with >95% coverage
- [ ] No circular dependencies
- [ ] Proper memory cleanup
- [ ] State management uses function updater pattern
- [ ] No state.getState() calls in reactive contexts
- [ ] Logic layer is pure and side-effect free
- [ ] Component factory supports all adapter types

## 🔗 Related Documentation

- Architecture Overview: `../../memory-bank/architecture.md`
- System Patterns: `../../memory-bank/systemPatterns.md`
- Primitive Components: `../primitives/CLAUDE.md`
- Framework Adapters: `../adapters/CLAUDE.md`