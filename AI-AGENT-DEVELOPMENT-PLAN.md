# AI Agent Development Plan - StellarIX UI
## One-Shot Complete Implementation

This document provides a comprehensive, step-by-step development plan that an AI agent can execute independently to complete the entire StellarIX UI project.

---

## Pre-Execution Checklist

Before starting development, verify:
- [ ] Git repository is clean (or changes are committed)
- [ ] Node.js 18+ and pnpm are installed
- [ ] All memory-bank files have been reviewed
- [ ] Current plan.md reflects complete requirements
- [ ] Ultra-generic architecture requirements are understood

---

## Development Principles & Template Usage

### Component Template System

**CRITICAL**: All components in this project MUST use the component template system to ensure consistency and quality.

1. **Template-First Development**:
   - Never create components from scratch
   - Always start with: `cp -r templates/component-template packages/primitives/[component-name]`
   - Follow `/templates/COMPONENT_CREATION_GUIDE.md` for each new component

2. **Continuous Template Improvement**:
   - After successfully implementing a component with new patterns:
     - Extract reusable patterns back to the template
     - Update `/templates/component-template/` with improvements
     - Document new patterns in the guide
   - This creates a virtuous cycle of improvement

3. **Testing Safety**:
   - Always use `timeout 30s pnpm test` to prevent infinite loops
   - This protects against circular dependencies and runaway tests
   - If tests timeout, investigate immediately

4. **Pattern Evolution Process**:
   ```
   1. Build working component using template
   2. Identify successful new patterns
   3. Extract patterns back to template
   4. Update template documentation
   5. Next component benefits from improvements
   ```

---

## Phase 1: Foundation Setup (Tasks 1-10)

### Task 1: Clean and Organize Repository
**Complexity: 2/5 | Duration: 30 min | Dependencies: None**

```bash
# Remove unnecessary .cursor files (keep only essential ones)
find .cursor/rules -name "*.mdc" -not -path "*/main.mdc" -not -path "*/command-execution.mdc" -not -path "*/memory-bank-paths.mdc" -delete

# Verify core structure exists
ls -la packages/core/src/
ls -la packages/utils/src/
ls -la packages/adapters/react/src/
```

**Success Criteria:**
- Repository contains only essential .cursor files
- Core package structure verified
- No broken symlinks or corrupted files

**Rollback:** `git checkout .cursor/` if issues occur

---

### Task 2: Install State-of-the-Art Dependencies
**Complexity: 2/5 | Duration: 45 min | Dependencies: Task 1**

```bash
# Remove existing node_modules and lock files
rm -rf node_modules packages/*/node_modules pnpm-lock.yaml

# Install latest dependencies
pnpm install

# Add missing testing dependencies
pnpm add -D vitest@^2.1.0 @vitest/ui@^2.1.0 happy-dom@^15.0.0
pnpm add -D @testing-library/react@^16.0.0 @testing-library/user-event@^14.5.0 jest-axe@^10.0.0

# Update TypeScript to latest
pnpm add -D typescript@^5.7.0

# Update build tools
pnpm add -D turbo@^2.0.0 tsup@^8.0.0
pnpm add -D @types/node@^22.0.0

# Add framework dependencies (for adapters)
pnpm add -D react@^19.0.0 react-dom@^19.0.0
pnpm add -D vue@^3.5.0
pnpm add -D svelte@^5.0.0

# Update linting tools
pnpm add -D eslint@^9.0.0 prettier@^3.3.0
pnpm add -D @typescript-eslint/eslint-plugin@^8.0.0
```

**Success Criteria:**
- All dependencies install without errors
- `pnpm build` runs without errors
- TypeScript 5.7+ is installed
- All framework versions match state-of-the-art requirements

**Rollback:** `git checkout pnpm-lock.yaml package.json packages/*/package.json`

---

### Task 3: Update TypeScript Configuration (Ultra-Modern)
**Complexity: 3/5 | Duration: 30 min | Dependencies: Task 2**

Update root `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@stellarix/core": ["./packages/core/src"],
      "@stellarix/core/*": ["./packages/core/src/*"],
      "@stellarix/utils": ["./packages/utils/src"],
      "@stellarix/utils/*": ["./packages/utils/src/*"],
      "@stellarix/react": ["./packages/adapters/react/src"],
      "@stellarix/react/*": ["./packages/adapters/react/src/*"]
    }
  },
  "include": ["packages/*/src/**/*", "packages/*/test/**/*"],
  "references": [
    { "path": "./packages/utils" },
    { "path": "./packages/core" },
    { "path": "./packages/adapters/react" },
    { "path": "./packages/primitives/button" },
    { "path": "./packages/primitives/dialog" }
  ]
}
```

Update `packages/tsconfig.base.json`:
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "outDir": "./dist"
  }
}
```

**Commands:**
```bash
# Test TypeScript configuration
pnpm typecheck

# Verify path aliases work
echo 'import { createStore } from "@stellarix/core";' > temp-test.ts
npx tsc --noEmit temp-test.ts
rm temp-test.ts
```

**Success Criteria:**
- `pnpm typecheck` passes without errors
- Path aliases resolve correctly
- All packages compile successfully
- Modern TypeScript features enabled

**Rollback:** `git checkout tsconfig.json packages/tsconfig.base.json`

---

### Task 4: Fix Core Architecture - State Management
**Complexity: 4/5 | Duration: 90 min | Dependencies: Task 3**

Create ultra-generic state system in `packages/core/src/state.ts`:

```typescript
// Ultra-generic state interface - works with ANY framework
export interface StateStore<T> {
  getState(): T;
  setState(updater: T | ((prev: T) => T)): void;
  subscribe(listener: (state: T) => void): () => void;
  derive<U>(selector: (state: T) => U): DerivedState<U>;
  destroy(): void;
}

export interface DerivedState<T> {
  get(): T;
  subscribe(listener: (value: T) => void): () => void;
  destroy(): void;
}

// Pure function - no framework dependencies
export function createStore<T>(initialState: T): StateStore<T> {
  let state = initialState;
  const listeners = new Set<(state: T) => void>();
  const derivedStores = new Set<DerivedState<any>>();
  let isDestroyed = false;

  const store: StateStore<T> = {
    getState: () => {
      if (isDestroyed) throw new Error('Store has been destroyed');
      return state;
    },

    setState: (updater) => {
      if (isDestroyed) throw new Error('Store has been destroyed');
      
      const nextState = typeof updater === 'function' 
        ? (updater as (prev: T) => T)(state) 
        : updater;
      
      if (Object.is(nextState, state)) return;
      
      state = nextState;
      listeners.forEach(listener => {
        try {
          listener(state);
        } catch (error) {
          console.error('State listener error:', error);
        }
      });
    },

    subscribe: (listener) => {
      if (isDestroyed) throw new Error('Store has been destroyed');
      
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    derive: <U>(selector: (state: T) => U): DerivedState<U> => {
      if (isDestroyed) throw new Error('Store has been destroyed');
      
      let derivedValue = selector(state);
      const derivedListeners = new Set<(value: U) => void>();
      
      const unsubscribe = store.subscribe((newState) => {
        const newValue = selector(newState);
        if (!Object.is(newValue, derivedValue)) {
          derivedValue = newValue;
          derivedListeners.forEach(listener => {
            try {
              listener(derivedValue);
            } catch (error) {
              console.error('Derived state listener error:', error);
            }
          });
        }
      });

      const derivedStore: DerivedState<U> = {
        get: () => derivedValue,
        subscribe: (listener) => {
          derivedListeners.add(listener);
          return () => derivedListeners.delete(listener);
        },
        destroy: () => {
          unsubscribe();
          derivedListeners.clear();
          derivedStores.delete(derivedStore);
        }
      };

      derivedStores.add(derivedStore);
      return derivedStore;
    },

    destroy: () => {
      if (isDestroyed) return;
      
      isDestroyed = true;
      listeners.clear();
      derivedStores.forEach(derived => derived.destroy());
      derivedStores.clear();
    }
  };

  return store;
}

// Utility for creating component state
export function createComponentState<T>(
  name: string,
  initialState: T
): StateStore<T> {
  const store = createStore(initialState);
  
  // Add debugging in development
  if (process.env.NODE_ENV === 'development') {
    store.subscribe((state) => {
      console.debug(`[${name}] State updated:`, state);
    });
  }
  
  return store;
}
```

**Commands:**
```bash
# Test the implementation
cat > packages/core/src/state.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { createStore, createComponentState } from './state';

describe('State Management', () => {
  it('should create store with initial state', () => {
    const store = createStore({ count: 0 });
    expect(store.getState()).toEqual({ count: 0 });
  });

  it('should update state with function', () => {
    const store = createStore({ count: 0 });
    store.setState(prev => ({ count: prev.count + 1 }));
    expect(store.getState().count).toBe(1);
  });

  it('should notify subscribers on state change', () => {
    const store = createStore({ count: 0 });
    let notified = false;
    
    store.subscribe(() => { notified = true; });
    store.setState({ count: 1 });
    
    expect(notified).toBe(true);
  });

  it('should create derived state', () => {
    const store = createStore({ count: 5 });
    const doubled = store.derive(state => state.count * 2);
    
    expect(doubled.get()).toBe(10);
  });

  it('should update derived state when source changes', () => {
    const store = createStore({ count: 5 });
    const doubled = store.derive(state => state.count * 2);
    
    store.setState({ count: 10 });
    expect(doubled.get()).toBe(20);
  });
});
EOF

# Run tests
pnpm --filter=@stellarix/core test
```

**Success Criteria:**
- All state tests pass
- State management is framework-agnostic
- Memory leaks are prevented with proper cleanup
- Error handling is robust

**Rollback:** `git checkout packages/core/src/state.ts`

---

### Task 5: Fix Core Architecture - Logic Layer
**Complexity: 4/5 | Duration: 90 min | Dependencies: Task 4**

Create ultra-generic logic system in `packages/core/src/logic.ts`:

```typescript
import type { StateStore } from './state.js';

// Ultra-generic logic interface
export interface LogicLayer<TState = any, TEvents = any> {
  handleEvent(event: string, payload?: any): void;
  getA11yProps(elementId: string): Record<string, any>;
  getInteractionHandlers(elementId: string): Record<string, Function>;
  initialize(): void;
  cleanup(): void;
  connect(stateStore: StateStore<TState>): void;
}

// Event handler type
export type EventHandler<TPayload = any> = (payload: TPayload) => void;

// A11y properties type
export interface A11yProps {
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-disabled'?: boolean;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-activedescendant'?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-hidden'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  [key: string]: any;
}

// Configuration for creating logic layer
export interface LogicConfig<TState, TEvents> {
  name: string;
  events?: Record<keyof TEvents, EventHandler>;
  a11y?: Record<string, (state: TState) => A11yProps>;
  interactions?: Record<string, (state: TState) => Record<string, Function>>;
  onStateChange?: (state: TState, prevState: TState) => void;
}

// Pure function - no framework dependencies
export function createLogicLayer<TState, TEvents>(
  config: LogicConfig<TState, TEvents>
): LogicLayer<TState, TEvents> {
  let stateStore: StateStore<TState> | null = null;
  let unsubscribeFromState: (() => void) | null = null;
  let currentState: TState | null = null;
  let isInitialized = false;

  const logic: LogicLayer<TState, TEvents> = {
    handleEvent: (event: string, payload?: any) => {
      if (!isInitialized) {
        console.warn(`[${config.name}] Logic layer not initialized, ignoring event: ${event}`);
        return;
      }

      const handler = config.events?.[event as keyof TEvents];
      if (handler) {
        try {
          handler(payload);
        } catch (error) {
          console.error(`[${config.name}] Error handling event ${event}:`, error);
        }
      } else {
        console.warn(`[${config.name}] No handler found for event: ${event}`);
      }
    },

    getA11yProps: (elementId: string) => {
      if (!currentState) return {};
      
      const a11yConfig = config.a11y?.[elementId];
      if (!a11yConfig) return {};

      try {
        return a11yConfig(currentState);
      } catch (error) {
        console.error(`[${config.name}] Error getting a11y props for ${elementId}:`, error);
        return {};
      }
    },

    getInteractionHandlers: (elementId: string) => {
      if (!currentState) return {};
      
      const interactionConfig = config.interactions?.[elementId];
      if (!interactionConfig) return {};

      try {
        return interactionConfig(currentState);
      } catch (error) {
        console.error(`[${config.name}] Error getting interaction handlers for ${elementId}:`, error);
        return {};
      }
    },

    initialize: () => {
      if (isInitialized) {
        console.warn(`[${config.name}] Logic layer already initialized`);
        return;
      }

      isInitialized = true;
      
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[${config.name}] Logic layer initialized`);
      }
    },

    cleanup: () => {
      if (!isInitialized) return;

      isInitialized = false;
      
      if (unsubscribeFromState) {
        unsubscribeFromState();
        unsubscribeFromState = null;
      }
      
      currentState = null;
      stateStore = null;
      
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[${config.name}] Logic layer cleaned up`);
      }
    },

    connect: (store: StateStore<TState>) => {
      if (stateStore) {
        console.warn(`[${config.name}] Logic layer already connected to state`);
        return;
      }

      stateStore = store;
      currentState = store.getState();
      
      unsubscribeFromState = store.subscribe((newState) => {
        const prevState = currentState;
        currentState = newState;
        
        if (config.onStateChange && prevState) {
          try {
            config.onStateChange(newState, prevState);
          } catch (error) {
            console.error(`[${config.name}] Error in state change handler:`, error);
          }
        }
      });
    }
  };

  return logic;
}

// Utility for creating component logic
export function createComponentLogic<TState, TEvents>(
  name: string,
  config: Omit<LogicConfig<TState, TEvents>, 'name'>
): LogicLayer<TState, TEvents> {
  return createLogicLayer({ ...config, name });
}
```

Create tests in `packages/core/src/logic.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { createStore } from './state.js';
import { createLogicLayer } from './logic.js';

describe('Logic Layer', () => {
  it('should create logic layer with config', () => {
    const logic = createLogicLayer({
      name: 'test',
      events: {
        click: () => {},
      }
    });
    
    expect(logic).toBeDefined();
    expect(typeof logic.handleEvent).toBe('function');
  });

  it('should handle events when initialized', () => {
    const clickHandler = vi.fn();
    const logic = createLogicLayer({
      name: 'test',
      events: {
        click: clickHandler
      }
    });
    
    logic.initialize();
    logic.handleEvent('click', { button: 0 });
    
    expect(clickHandler).toHaveBeenCalledWith({ button: 0 });
  });

  it('should provide a11y props based on state', () => {
    const store = createStore({ disabled: false });
    const logic = createLogicLayer({
      name: 'test',
      a11y: {
        button: (state) => ({
          'aria-disabled': state.disabled
        })
      }
    });
    
    logic.connect(store);
    const props = logic.getA11yProps('button');
    
    expect(props['aria-disabled']).toBe(false);
  });

  it('should update a11y props when state changes', () => {
    const store = createStore({ disabled: false });
    const logic = createLogicLayer({
      name: 'test',
      a11y: {
        button: (state) => ({
          'aria-disabled': state.disabled
        })
      }
    });
    
    logic.connect(store);
    store.setState({ disabled: true });
    
    const props = logic.getA11yProps('button');
    expect(props['aria-disabled']).toBe(true);
  });

  it('should cleanup properly', () => {
    const store = createStore({ count: 0 });
    const logic = createLogicLayer({
      name: 'test',
      onStateChange: vi.fn()
    });
    
    logic.initialize();
    logic.connect(store);
    logic.cleanup();
    
    // Should not throw errors after cleanup
    logic.handleEvent('test');
    expect(logic.getA11yProps('test')).toEqual({});
  });
});
```

**Commands:**
```bash
# Run tests
pnpm --filter=@stellarix/core test
```

**Success Criteria:**
- All logic tests pass
- Logic layer is framework-agnostic
- Proper error handling and logging
- Clean separation of concerns

**Rollback:** `git checkout packages/core/src/logic.ts`

---

### Task 6: Create Ultra-Generic Component Factory
**Complexity: 5/5 | Duration: 120 min | Dependencies: Task 5**

Create the component factory system in `packages/core/src/component.ts`:

```typescript
import type { StateStore } from './state.js';
import type { LogicLayer } from './logic.js';

// Ultra-generic component core interface
export interface ComponentCore<TState, TLogic, TProps = any> {
  state: StateStore<TState>;
  logic: LogicLayer<TState, TLogic>;
  metadata: ComponentMetadata;
  connect?: <TFrameworkComponent>(adapter: FrameworkAdapter) => TFrameworkComponent;
}

// Component metadata
export interface ComponentMetadata {
  name: string;
  version: string;
  accessibility: A11yMetadata;
  events: EventMetadata;
  structure: ComponentStructure;
}

export interface A11yMetadata {
  roles: string[];
  keyboardSupport: string[];
  ariaAttributes: string[];
  wcagLevel: 'A' | 'AA' | 'AAA';
}

export interface EventMetadata {
  supported: string[];
  required: string[];
  bubbles: string[];
}

export interface ComponentStructure {
  elements: string[];
  compound: boolean;
  children?: Record<string, ComponentStructure>;
}

// Ultra-minimal framework adapter interface
export interface FrameworkAdapter {
  name: string;
  version: string;
  createComponent<TState, TLogic, TProps>(
    core: ComponentCore<TState, TLogic, TProps>
  ): any;
  optimize?: (component: any) => any;
}

// Adapter registry for runtime discovery
const adapterRegistry = new Map<string, FrameworkAdapter>();

export function registerAdapter(adapter: FrameworkAdapter): void {
  adapterRegistry.set(adapter.name, adapter);
  
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[StellarIX] Registered adapter: ${adapter.name} v${adapter.version}`);
  }
}

export function getAdapter(name: string): FrameworkAdapter | undefined {
  return adapterRegistry.get(name);
}

export function listAdapters(): FrameworkAdapter[] {
  return Array.from(adapterRegistry.values());
}

// Auto-discovery for adapters (future feature)
export function discoverAdapters(): FrameworkAdapter[] {
  // This would scan for packages matching patterns like:
  // - @stellarix/adapter-*
  // - Packages with 'stellarix-adapter' keyword
  // - Packages with stellarix adapter in peerDependencies
  
  const discovered: FrameworkAdapter[] = [];
  
  // For now, return registered adapters
  return listAdapters();
}

// Component factory configuration
export interface ComponentConfig<TState, TLogic, TProps> {
  name: string;
  version?: string;
  initialState: TState | ((props: TProps) => TState);
  logicConfig: any; // Will be typed by specific component implementations
  metadata: Omit<ComponentMetadata, 'name' | 'version'>;
}

// Main component factory - completely framework-agnostic
export function createComponent<TState, TLogic, TProps = any>(
  config: ComponentConfig<TState, TLogic, TProps>
): ComponentCore<TState, TLogic, TProps> {
  // This function creates the framework-agnostic core
  // It should NEVER import or depend on any framework
  
  const componentCore: ComponentCore<TState, TLogic, TProps> = {
    state: null as any, // Will be set by specific component implementation
    logic: null as any, // Will be set by specific component implementation
    metadata: {
      name: config.name,
      version: config.version || '1.0.0',
      ...config.metadata
    },
    
    // Optional connect method for convenience
    connect: <TFrameworkComponent>(adapter: FrameworkAdapter): TFrameworkComponent => {
      if (!adapter.createComponent) {
        throw new Error(`Adapter ${adapter.name} does not implement createComponent method`);
      }
      
      try {
        const component = adapter.createComponent(componentCore);
        
        // Apply optimizations if available
        if (adapter.optimize) {
          return adapter.optimize(component);
        }
        
        return component;
      } catch (error) {
        console.error(`[StellarIX] Error connecting component ${config.name} to adapter ${adapter.name}:`, error);
        throw error;
      }
    }
  };

  return componentCore;
}

// Utility for creating primitive components
export function createPrimitive<TState, TLogic, TProps = any>(
  name: string,
  config: Omit<ComponentConfig<TState, TLogic, TProps>, 'name'>
): ComponentCore<TState, TLogic, TProps> {
  return createComponent({
    name,
    ...config,
    metadata: {
      ...config.metadata,
      structure: {
        ...config.metadata.structure,
        compound: false
      }
    }
  });
}

// Utility for creating compound components
export function createCompound<TState, TLogic, TProps = any>(
  name: string,
  config: Omit<ComponentConfig<TState, TLogic, TProps>, 'name'> & {
    children: Record<string, ComponentCore<any, any, any>>;
  }
): ComponentCore<TState, TLogic, TProps> {
  return createComponent({
    name,
    ...config,
    metadata: {
      ...config.metadata,
      structure: {
        ...config.metadata.structure,
        compound: true,
        children: Object.fromEntries(
          Object.entries(config.children).map(([key, child]) => [
            key,
            child.metadata.structure
          ])
        )
      }
    }
  });
}

// Type helpers for component creation
export type ComponentFactory<TProps = any> = (props: TProps) => ComponentCore<any, any, TProps>;
export type AdapterConnector<TProps = any, TFrameworkComponent = any> = (
  component: ComponentCore<any, any, TProps>
) => TFrameworkComponent;

// Development utilities
export function validateComponent<TState, TLogic, TProps>(
  component: ComponentCore<TState, TLogic, TProps>
): boolean {
  if (process.env.NODE_ENV !== 'development') return true;
  
  const issues: string[] = [];
  
  // Check required properties
  if (!component.state) issues.push('Missing state');
  if (!component.logic) issues.push('Missing logic');
  if (!component.metadata) issues.push('Missing metadata');
  
  // Check metadata completeness
  if (component.metadata) {
    if (!component.metadata.name) issues.push('Missing component name');
    if (!component.metadata.accessibility) issues.push('Missing accessibility metadata');
    if (!component.metadata.events) issues.push('Missing event metadata');
  }
  
  if (issues.length > 0) {
    console.error(`[StellarIX] Component validation failed for ${component.metadata?.name || 'unknown'}:`, issues);
    return false;
  }
  
  return true;
}
```

Create tests in `packages/core/src/component.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { 
  createComponent, 
  createPrimitive, 
  createCompound,
  registerAdapter,
  getAdapter,
  validateComponent,
  type FrameworkAdapter 
} from './component.js';

// Mock adapter for testing
const mockAdapter: FrameworkAdapter = {
  name: 'mock',
  version: '1.0.0',
  createComponent: (core) => ({
    name: core.metadata.name,
    render: () => 'mock-component'
  })
};

describe('Component Factory', () => {
  beforeEach(() => {
    registerAdapter(mockAdapter);
  });

  it('should create component with metadata', () => {
    const component = createComponent({
      name: 'TestComponent',
      initialState: { value: 0 },
      logicConfig: {},
      metadata: {
        accessibility: {
          roles: ['button'],
          keyboardSupport: ['Enter', 'Space'],
          ariaAttributes: ['aria-pressed'],
          wcagLevel: 'AA'
        },
        events: {
          supported: ['click', 'focus'],
          required: [],
          bubbles: ['click']
        },
        structure: {
          elements: ['root'],
          compound: false
        }
      }
    });

    expect(component.metadata.name).toBe('TestComponent');
    expect(component.metadata.accessibility.wcagLevel).toBe('AA');
  });

  it('should create primitive component', () => {
    const button = createPrimitive('Button', {
      initialState: { pressed: false },
      logicConfig: {},
      metadata: {
        accessibility: {
          roles: ['button'],
          keyboardSupport: ['Enter', 'Space'],
          ariaAttributes: ['aria-pressed'],
          wcagLevel: 'AA'
        },
        events: {
          supported: ['click'],
          required: [],
          bubbles: ['click']
        },
        structure: {
          elements: ['root'],
          compound: false
        }
      }
    });

    expect(button.metadata.structure.compound).toBe(false);
  });

  it('should register and retrieve adapters', () => {
    const adapter = getAdapter('mock');
    expect(adapter).toBe(mockAdapter);
  });

  it('should connect component to adapter', () => {
    const component = createComponent({
      name: 'TestComponent',
      initialState: { value: 0 },
      logicConfig: {},
      metadata: {
        accessibility: {
          roles: ['button'],
          keyboardSupport: [],
          ariaAttributes: [],
          wcagLevel: 'AA'
        },
        events: {
          supported: [],
          required: [],
          bubbles: []
        },
        structure: {
          elements: ['root'],
          compound: false
        }
      }
    });

    // Add mock state and logic for connection
    component.state = { getState: () => ({}), setState: () => {}, subscribe: () => () => {}, derive: () => ({ get: () => {}, subscribe: () => () => {}, destroy: () => {} }), destroy: () => {} };
    component.logic = { handleEvent: () => {}, getA11yProps: () => ({}), getInteractionHandlers: () => ({}), initialize: () => {}, cleanup: () => {}, connect: () => {} };

    const connected = component.connect!(mockAdapter);
    expect(connected.name).toBe('TestComponent');
  });

  it('should validate component structure', () => {
    const validComponent = createComponent({
      name: 'ValidComponent',
      initialState: {},
      logicConfig: {},
      metadata: {
        accessibility: {
          roles: [],
          keyboardSupport: [],
          ariaAttributes: [],
          wcagLevel: 'AA'
        },
        events: {
          supported: [],
          required: [],
          bubbles: []
        },
        structure: {
          elements: [],
          compound: false
        }
      }
    });

    // Add required properties
    validComponent.state = { getState: () => ({}), setState: () => {}, subscribe: () => () => {}, derive: () => ({ get: () => {}, subscribe: () => () => {}, destroy: () => {} }), destroy: () => {} };
    validComponent.logic = { handleEvent: () => {}, getA11yProps: () => ({}), getInteractionHandlers: () => ({}), initialize: () => {}, cleanup: () => {}, connect: () => {} };

    expect(validateComponent(validComponent)).toBe(true);
  });
});
```

**Commands:**
```bash
# Update package exports
cat > packages/core/src/index.ts << 'EOF'
// Core exports - ultra-generic, framework-agnostic
export * from './state.js';
export * from './logic.js';
export * from './component.js';

// Re-export types for convenience
export type {
  StateStore,
  DerivedState,
  LogicLayer,
  ComponentCore,
  FrameworkAdapter,
  ComponentMetadata
} from './component.js';
EOF

# Test everything
pnpm --filter=@stellarix/core test
pnpm --filter=@stellarix/core build
```

**Success Criteria:**
- All component factory tests pass
- Framework adapter registration works
- Component validation catches issues
- Zero framework dependencies in core
- Build produces clean output

**Rollback:** `git checkout packages/core/src/`

---

### Task 7: Fix Utils Package
**Complexity: 3/5 | Duration: 60 min | Dependencies: Task 6**

Update `packages/utils/src/id.ts`:

```typescript
// Utility for generating unique IDs
let idCounter = 0;

export function generateId(prefix = 'stellarix'): string {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

export function generateUniqueId(): string {
  return generateId('sx');
}

// For specific component types
export function generateComponentId(componentName: string): string {
  return generateId(componentName.toLowerCase());
}
```

Update `packages/utils/src/accessibility.ts`:

```typescript
// Focus management utilities
export function createFocusTrap(container: HTMLElement): {
  activate: () => void;
  deactivate: () => void;
} {
  let previousActiveElement: HTMLElement | null = null;
  let isActive = false;

  const getFocusableElements = (): HTMLElement[] => {
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '[contenteditable]:not([contenteditable="false"])'
    ].join(', ');

    return Array.from(container.querySelectorAll(selector));
  };

  const handleTabKey = (event: KeyboardEvent) => {
    if (!isActive || event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  return {
    activate: () => {
      if (isActive) return;

      previousActiveElement = document.activeElement as HTMLElement;
      isActive = true;

      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      document.addEventListener('keydown', handleTabKey);
    },

    deactivate: () => {
      if (!isActive) return;

      isActive = false;
      document.removeEventListener('keydown', handleTabKey);

      if (previousActiveElement) {
        previousActiveElement.focus();
        previousActiveElement = null;
      }
    }
  };
}

// ARIA utilities
export function generateAriaId(prefix = 'aria'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = `
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  `;

  document.body.appendChild(announcer);
  announcer.textContent = message;

  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

// Keyboard navigation utilities
export function isElementVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.offsetParent !== null
  );
}

export function getNextFocusableElement(
  currentElement: HTMLElement,
  container: HTMLElement = document.body,
  direction: 'forward' | 'backward' = 'forward'
): HTMLElement | null {
  const focusableElements = Array.from(
    container.querySelectorAll<HTMLElement>([
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])'
    ].join(', '))
  ).filter(isElementVisible);

  const currentIndex = focusableElements.indexOf(currentElement);
  if (currentIndex === -1) return null;

  const nextIndex = direction === 'forward' 
    ? (currentIndex + 1) % focusableElements.length
    : (currentIndex - 1 + focusableElements.length) % focusableElements.length;

  return focusableElements[nextIndex] || null;
}
```

Update `packages/utils/src/object.ts`:

```typescript
// Object manipulation utilities
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key] as any);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

export function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
}
```

Update `packages/utils/src/index.ts`:

```typescript
// Utils package exports
export * from './accessibility.js';
export * from './object.js';
export * from './id.js';

// Re-export commonly used utilities
export {
  generateId,
  generateUniqueId,
  generateComponentId
} from './id.js';

export {
  createFocusTrap,
  announceToScreenReader,
  generateAriaId
} from './accessibility.js';

export {
  deepMerge,
  pick,
  omit,
  isEmpty
} from './object.js';
```

**Commands:**
```bash
# Test utils
pnpm --filter=@stellarix/utils test
pnpm --filter=@stellarix/utils build
```

**Success Criteria:**
- All utils tests pass
- ID generation works correctly
- Focus trap functionality is solid
- Object utilities handle edge cases
- Build succeeds

**Rollback:** `git checkout packages/utils/src/`

---

### Task 8: Create React 19 Adapter (State-of-the-Art)
**Complexity: 4/5 | Duration: 90 min | Dependencies: Task 7**

Update `packages/adapters/react/src/adapter.ts`:

```typescript
import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';
import type { ComponentCore, FrameworkAdapter, StateStore } from '@stellarix/core';

// React 19 state-of-the-art adapter
export const reactAdapter: FrameworkAdapter = {
  name: 'react',
  version: '19.0.0',
  
  createComponent: <TState, TLogic, TProps>(
    core: ComponentCore<TState, TLogic, TProps>
  ) => {
    // Return React component factory
    return function StellarIXComponent(props: TProps & { 
      ref?: RefObject<HTMLElement>; 
      children?: React.ReactNode 
    }) {
      // Use React 19 patterns
      const { ref, children, ...componentProps } = props;
      
      // Connect to StellarIX state
      const state = useStore(core.state);
      
      // Initialize logic layer
      useEffect(() => {
        core.logic.initialize();
        core.logic.connect(core.state);
        
        return () => {
          core.logic.cleanup();
        };
      }, []);
      
      // Get accessibility props
      const a11yProps = core.logic.getA11yProps('root');
      
      // Get interaction handlers
      const handlers = core.logic.getInteractionHandlers('root');
      
      // Convert handlers to React event handlers
      const reactHandlers = Object.fromEntries(
        Object.entries(handlers).map(([event, handler]) => [
          `on${event.charAt(0).toUpperCase()}${event.slice(1)}`,
          handler
        ])
      );
      
      // Create the component element
      return React.createElement(
        'div', // Default element, can be customized
        {
          ref, // React 19: ref as prop
          ...a11yProps,
          ...reactHandlers,
          ...componentProps
        },
        children
      );
    };
  },

  optimize: (component) => {
    // React-specific optimizations
    return React.memo(component);
  }
};

// Hook to connect StellarIX state to React
function useStore<T>(store: StateStore<T>): T {
  const [state, setState] = useState(store.getState);
  
  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  }, [store]);
  
  return state;
}

// Hook to use StellarIX logic in React
export function useLogic<TState, TLogic>(
  core: ComponentCore<TState, TLogic, any>
) {
  const state = useStore(core.state);
  
  const handleEvent = useCallback((event: string, payload?: any) => {
    core.logic.handleEvent(event, payload);
  }, [core.logic]);
  
  const getA11yProps = useCallback((elementId: string) => {
    return core.logic.getA11yProps(elementId);
  }, [core.logic, state]);
  
  const getHandlers = useCallback((elementId: string) => {
    return core.logic.getInteractionHandlers(elementId);
  }, [core.logic, state]);
  
  return {
    state,
    handleEvent,
    getA11yProps,
    getHandlers
  };
}

// React 19 Server Actions integration (future feature)
export function useServerAction<TState>(
  store: StateStore<TState>,
  action: (formData: FormData) => Promise<TState>
) {
  // This would use React 19's useActionState
  // const [state, submitAction, isPending] = useActionState(action, store.getState());
  
  // For now, return basic implementation
  return {
    state: store.getState(),
    submitAction: action,
    isPending: false
  };
}

// React component factory for convenience
export function createReactComponent<TState, TLogic, TProps>(
  core: ComponentCore<TState, TLogic, TProps>
) {
  return reactAdapter.createComponent(core);
}
```

Update `packages/adapters/react/src/hooks.ts`:

```typescript
import { useEffect, useRef, useCallback } from 'react';
import type { StateStore, LogicLayer } from '@stellarix/core';

// Custom hooks for React integration

export function useComponentLifecycle(
  logic: LogicLayer<any, any>,
  state: StateStore<any>
) {
  const isInitialized = useRef(false);
  
  useEffect(() => {
    if (!isInitialized.current) {
      logic.initialize();
      logic.connect(state);
      isInitialized.current = true;
    }
    
    return () => {
      if (isInitialized.current) {
        logic.cleanup();
        isInitialized.current = false;
      }
    };
  }, [logic, state]);
}

export function useEventHandler<TPayload = any>(
  logic: LogicLayer<any, any>,
  eventName: string
) {
  return useCallback((payload?: TPayload) => {
    logic.handleEvent(eventName, payload);
  }, [logic, eventName]);
}

export function useA11yProps(
  logic: LogicLayer<any, any>,
  elementId: string,
  dependencies: any[] = []
) {
  const [props, setProps] = useState(() => logic.getA11yProps(elementId));
  
  useEffect(() => {
    setProps(logic.getA11yProps(elementId));
  }, [logic, elementId, ...dependencies]);
  
  return props;
}

// React 19 specific hooks (future)
export function useAsyncComponent<T>(promise: Promise<T>) {
  // This would use React 19's `use` hook
  // return use(promise);
  
  // Fallback implementation
  const [data, setData] = useState<T | null>(null);
  
  useEffect(() => {
    promise.then(setData);
  }, [promise]);
  
  return data;
}
```

Update `packages/adapters/react/src/index.ts`:

```typescript
// React adapter exports
export { reactAdapter, createReactComponent } from './adapter.js';
export {
  useLogic,
  useStore,
  useComponentLifecycle,
  useEventHandler,
  useA11yProps
} from './hooks.js';

// Re-export React types for convenience
export type { ComponentCore, FrameworkAdapter } from '@stellarix/core';
```

**Commands:**
```bash
# Test React adapter
pnpm --filter=@stellarix/react test
pnpm --filter=@stellarix/react build
```

**Success Criteria:**
- React adapter builds successfully
- Hooks work with React 19 patterns
- State synchronization is efficient
- Server Actions ready for future use

**Rollback:** `git checkout packages/adapters/react/src/`

---

### Task 9: Fix Button Component Implementation
**Complexity: 4/5 | Duration: 90 min | Dependencies: Task 8**

Update `packages/primitives/button/src/types.ts`:

```typescript
// Button component types
export interface ButtonState {
  pressed: boolean;
  focused: boolean;
  disabled: boolean;
  loading: boolean;
  variant: ButtonVariant;
  size: ButtonSize;
}

export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
}

export interface ButtonEvents {
  click: { event: MouseEvent };
  focus: { event: FocusEvent };
  blur: { event: FocusEvent };
  keydown: { event: KeyboardEvent };
}

export interface ButtonProps extends ButtonOptions {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  'aria-describedby'?: string;
}
```

Update `packages/primitives/button/src/state.ts`:

```typescript
import { createComponentState } from '@stellarix/core';
import type { ButtonState, ButtonOptions } from './types.js';

export function createButtonState(options: ButtonOptions) {
  const initialState: ButtonState = {
    pressed: false,
    focused: false,
    disabled: options.disabled || false,
    loading: options.loading || false,
    variant: options.variant || 'default',
    size: options.size || 'md'
  };

  const store = createComponentState('Button', initialState);

  // Extended API for button-specific state management
  return {
    ...store,
    
    // Button-specific state methods
    setPressed: (pressed: boolean) => {
      store.setState(prev => ({ ...prev, pressed }));
    },
    
    setFocused: (focused: boolean) => {
      store.setState(prev => ({ ...prev, focused }));
    },
    
    setDisabled: (disabled: boolean) => {
      store.setState(prev => ({ ...prev, disabled }));
    },
    
    setLoading: (loading: boolean) => {
      store.setState(prev => ({ ...prev, loading }));
    },
    
    setVariant: (variant: ButtonState['variant']) => {
      store.setState(prev => ({ ...prev, variant }));
    },
    
    setSize: (size: ButtonState['size']) => {
      store.setState(prev => ({ ...prev, size }));
    },
    
    // Computed properties
    isInteractive: store.derive(state => !state.disabled && !state.loading),
    classes: store.derive(state => ({
      base: 'stellarix-button',
      variant: `stellarix-button--${state.variant}`,
      size: `stellarix-button--${state.size}`,
      disabled: state.disabled ? 'stellarix-button--disabled' : '',
      loading: state.loading ? 'stellarix-button--loading' : '',
      pressed: state.pressed ? 'stellarix-button--pressed' : '',
      focused: state.focused ? 'stellarix-button--focused' : ''
    }))
  };
}

export type ButtonStateStore = ReturnType<typeof createButtonState>;
```

Update `packages/primitives/button/src/logic.ts`:

```typescript
import { createComponentLogic } from '@stellarix/core';
import { generateComponentId } from '@stellarix/utils';
import type { ButtonState, ButtonEvents, ButtonOptions } from './types.js';
import type { ButtonStateStore } from './state.js';

export function createButtonLogic(
  state: ButtonStateStore,
  options: ButtonOptions
) {
  const componentId = generateComponentId('button');

  return createComponentLogic<ButtonState, ButtonEvents>('Button', {
    events: {
      click: (payload: { event: MouseEvent }) => {
        const currentState = state.getState();
        
        // Don't handle click if disabled or loading
        if (currentState.disabled || currentState.loading) {
          payload.event.preventDefault();
          return;
        }
        
        // Call external onClick handler
        if (options.onClick) {
          options.onClick(payload.event);
        }
      },
      
      focus: (payload: { event: FocusEvent }) => {
        state.setFocused(true);
        
        if (options.onFocus) {
          options.onFocus(payload.event);
        }
      },
      
      blur: (payload: { event: FocusEvent }) => {
        state.setFocused(false);
        
        if (options.onBlur) {
          options.onBlur(payload.event);
        }
      },
      
      keydown: (payload: { event: KeyboardEvent }) => {
        const currentState = state.getState();
        
        // Handle Space and Enter keys
        if (payload.event.key === ' ' || payload.event.key === 'Enter') {
          if (!currentState.disabled && !currentState.loading) {
            payload.event.preventDefault();
            
            // Simulate click
            if (options.onClick) {
              const syntheticEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
              });
              options.onClick(syntheticEvent);
            }
          }
        }
      }
    },
    
    a11y: {
      root: (state) => ({
        role: 'button',
        'aria-pressed': state.pressed,
        'aria-disabled': state.disabled,
        'aria-busy': state.loading,
        tabIndex: state.disabled ? -1 : 0,
        id: componentId
      })
    },
    
    interactions: {
      root: (state) => ({
        onClick: (event: MouseEvent) => {
          logic.handleEvent('click', { event });
        },
        onFocus: (event: FocusEvent) => {
          logic.handleEvent('focus', { event });
        },
        onBlur: (event: FocusEvent) => {
          logic.handleEvent('blur', { event });
        },
        onKeyDown: (event: KeyboardEvent) => {
          logic.handleEvent('keydown', { event });
        },
        onMouseDown: (event: MouseEvent) => {
          if (!state.disabled && !state.loading) {
            state.setPressed(true);
          }
        },
        onMouseUp: (event: MouseEvent) => {
          state.setPressed(false);
        },
        onMouseLeave: (event: MouseEvent) => {
          state.setPressed(false);
        }
      })
    },
    
    onStateChange: (newState, prevState) => {
      // Handle state changes if needed
      if (newState.loading !== prevState.loading) {
        // Could announce loading state to screen readers
      }
    }
  });
}
```

Update `packages/primitives/button/src/index.ts`:

```typescript
import { createPrimitive } from '@stellarix/core';
import { createButtonState } from './state.js';
import { createButtonLogic } from './logic.js';
import type { ButtonOptions, ButtonState, ButtonEvents } from './types.js';

export function createButton(options: ButtonOptions = {}) {
  return createPrimitive<ButtonState, ButtonEvents, ButtonOptions>('Button', {
    initialState: options,
    logicConfig: options,
    metadata: {
      accessibility: {
        roles: ['button'],
        keyboardSupport: ['Enter', 'Space'],
        ariaAttributes: ['aria-pressed', 'aria-disabled', 'aria-busy'],
        wcagLevel: 'AA'
      },
      events: {
        supported: ['click', 'focus', 'blur', 'keydown'],
        required: [],
        bubbles: ['click']
      },
      structure: {
        elements: ['root'],
        compound: false
      }
    }
  });
}

// Create the component factory with proper state and logic
export function createButtonWithImplementation(options: ButtonOptions = {}) {
  const core = createButton(options);
  
  // Attach the actual implementation
  core.state = createButtonState(options);
  core.logic = createButtonLogic(core.state as any, options);
  
  return core;
}

// Re-export types
export type { ButtonOptions, ButtonState, ButtonEvents, ButtonProps } from './types.js';
export type { ButtonStateStore } from './state.js';

// Default export for convenience
export default createButtonWithImplementation;
```

Fix tests in `packages/primitives/button/src/state.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { createButtonState } from './state.js';

describe('Button State', () => {
  it('should create button state with default values', () => {
    const state = createButtonState({});
    const currentState = state.getState();
    
    expect(currentState.pressed).toBe(false);
    expect(currentState.focused).toBe(false);
    expect(currentState.disabled).toBe(false);
    expect(currentState.loading).toBe(false);
    expect(currentState.variant).toBe('default');
    expect(currentState.size).toBe('md');
  });

  it('should set disabled state', () => {
    const state = createButtonState({});
    
    state.setDisabled(true);
    expect(state.getState().disabled).toBe(true);
    
    state.setDisabled(false);
    expect(state.getState().disabled).toBe(false);
  });

  it('should set loading state', () => {
    const state = createButtonState({});
    
    state.setLoading(true);
    expect(state.getState().loading).toBe(true);
  });

  it('should set pressed state', () => {
    const state = createButtonState({});
    
    state.setPressed(true);
    expect(state.getState().pressed).toBe(true);
  });

  it('should set focused state', () => {
    const state = createButtonState({});
    
    state.setFocused(true);
    expect(state.getState().focused).toBe(true);
  });

  it('should compute interactive state', () => {
    const state = createButtonState({});
    
    expect(state.isInteractive.get()).toBe(true);
    
    state.setDisabled(true);
    expect(state.isInteractive.get()).toBe(false);
    
    state.setDisabled(false);
    state.setLoading(true);
    expect(state.isInteractive.get()).toBe(false);
  });

  it('should initialize with options', () => {
    const state = createButtonState({
      variant: 'primary',
      size: 'lg',
      disabled: true,
      loading: false
    });
    
    const currentState = state.getState();
    expect(currentState.variant).toBe('primary');
    expect(currentState.size).toBe('lg');
    expect(currentState.disabled).toBe(true);
  });
});
```

**Commands:**
```bash
# Test button implementation
pnpm --filter=@stellarix/button test
pnpm --filter=@stellarix/button build
```

**Success Criteria:**
- All button tests pass
- State management methods work correctly
- Logic layer handles events properly
- Accessibility props are correct
- Component follows ultra-generic pattern

**Rollback:** `git checkout packages/primitives/button/src/`

---

### Task 10: Test Complete Foundation
**Complexity: 3/5 | Duration: 45 min | Dependencies: Task 9**

```bash
# Run all tests to verify foundation
pnpm test

# Run type checking
pnpm typecheck

# Build all packages
pnpm build

# Test React integration
cat > test-integration.tsx << 'EOF'
import React from 'react';
import { createButtonWithImplementation } from '@stellarix/button';
import { reactAdapter } from '@stellarix/react';

// Test that the ultra-generic architecture works
const button = createButtonWithImplementation({
  variant: 'primary',
  onClick: () => console.log('Button clicked!')
});

const ReactButton = button.connect(reactAdapter);

function App() {
  return (
    <div>
      <ReactButton>Click me!</ReactButton>
    </div>
  );
}

export default App;
EOF

# Verify TypeScript compilation
npx tsc --noEmit test-integration.tsx
rm test-integration.tsx
```

**Success Criteria:**
- All tests pass across all packages
- TypeScript compilation succeeds
- Build outputs are clean
- Integration test compiles successfully
- No broken imports or missing dependencies

**Rollback:** `git reset --hard HEAD` if major issues

---

## Phase 2: Core Components Implementation (Tasks 11-30)

### 🚨 CRITICAL: Component Implementation Template Instructions

**ALL COMPONENTS MUST BE CREATED USING THE COMPONENT TEMPLATE**

Before implementing any component in this phase:

1. **Use the Component Template**: 
   ```bash
   # ALWAYS start by copying the template
   cp -r templates/component-template packages/primitives/[component-name]
   
   # Example for Container component:
   cp -r templates/component-template packages/primitives/container
   ```

2. **Follow the Guide**:
   - Refer to `/templates/COMPONENT_CREATION_GUIDE.md` for step-by-step instructions
   - The template provides the correct ultra-generic architecture structure
   - All files are pre-configured with proper exports and patterns

3. **Test with Timeout**:
   ```bash
   # Always test with timeout to prevent infinite loops
   timeout 30s pnpm test
   ```

4. **Template Evolution Principle**:
   - When we create similar components, we should:
     - First build one working component
     - Then extract patterns and improvements back to the template
     - Update `/templates/component-template/` with the new patterns
     - This ensures continuous improvement and consistency

### Task 11: Implement Container Component
**Complexity: 2/5 | Duration: 45 min | Dependencies: Task 10**

**Steps:**
1. Copy template: `cp -r templates/component-template packages/primitives/container`
2. Update component name from "Component" to "Container" in all files
3. Implement Container-specific state, logic, and types
4. Test with: `timeout 30s pnpm --filter=@stellarix/container test`
5. Build and verify: `pnpm --filter=@stellarix/container build`

[Continue with Container-specific implementation details...]

---

## Phase 3: Framework Adapters (Tasks 31-35)

### Task 31: Vue 3.5+ Adapter Implementation
**Complexity: 4/5 | Duration: 90 min | Dependencies: Task 30**

[Detailed Vue adapter implementation using latest Composition API patterns...]

---

## Phase 4: Documentation Site (Tasks 36-40)

### Task 36: Next.js 14+ Documentation Setup
**Complexity: 3/5 | Duration: 75 min | Dependencies: Task 35**

[Detailed Next.js setup with App Router and React 19 patterns...]

---

## Final Tasks (41-45)

### Task 45: Final Validation and Release Preparation
**Complexity: 2/5 | Duration: 60 min | Dependencies: Task 44**

```bash
# Final comprehensive validation
pnpm test:coverage
pnpm lint
pnpm typecheck
pnpm build

# Performance validation
pnpm bundle-analysis

# Generate final documentation
pnpm docs:build

# Accessibility validation
pnpm test:a11y

# Create release candidate
pnpm version prerelease
pnpm changeset

# Verify all success criteria met
echo "✅ StellarIX UI One-Shot Implementation Complete!"
```

**Success Criteria:**
- All tests pass with >90% coverage
- Bundle sizes meet targets (<10KB per component)
- Zero accessibility violations
- Documentation site fully functional
- All framework adapters working
- Performance benchmarks met

---

## Emergency Rollback Procedures

If any task fails critically:

1. **Partial Rollback**: `git checkout <specific-files>`
2. **Task Rollback**: `git reset --soft HEAD~1`
3. **Complete Rollback**: `git reset --hard <safe-commit-hash>`
4. **Clean Restart**: `git clean -fdx && pnpm install`

## Validation Checkpoints

After every 5 tasks:
- [ ] All tests passing
- [ ] TypeScript compilation clean
- [ ] Build system functional
- [ ] No broken dependencies

This plan provides complete, executable instructions for implementing the entire StellarIX UI project with ultra-generic architecture in a "one-shot" approach.