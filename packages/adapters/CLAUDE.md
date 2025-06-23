# Framework Adapters Development Guide

This file provides specific guidance for developing framework adapters for StellarIX UI.

## 🎯 Adapter Philosophy

### Ultra-Generic Adapter Interface
Every adapter MUST implement the minimal interface without requiring core changes:

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

### Adapter Principles
- ✅ ALWAYS work with StellarIX core without modifications
- ✅ ALWAYS use latest framework patterns and conventions
- ✅ ALWAYS provide optimal performance for the target framework
- ✅ ALWAYS maintain framework-specific developer experience
- ❌ NEVER require changes to core architecture
- ❌ NEVER break the ultra-generic component pattern

## 🚀 State-of-the-Art Framework Patterns (2025)

### React 19 Adapter Patterns
```typescript
import { useState, useEffect, useRef, useCallback } from 'react';

// React 19: ref as prop pattern
const Component = ({ ref, ...props }) => {
  const state = useStore(core.state);
  
  // Use React 19 patterns
  // const [data, action, isPending] = useActionState(serverAction);
  // const asyncData = use(promise); // Direct promise reading
  
  return <div ref={ref} {...props} />; // ref as prop
};
```

### Vue 3.5+ Adapter Patterns
```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const props = defineProps<{ state: ComponentState }>()
const emit = defineEmits<{ update: [value: string] }>()
const elementRef = useTemplateRef('element')
</script>
```

### Svelte 5 Runes Adapter Patterns
```svelte
<script lang="ts">
let { state, logic }: Props = $props();
let count = $state(0);
let doubled = $derived(count * 2);

$effect(() => {
  const cleanup = logic.initialize();
  return cleanup;
});
</script>
```

## 🔧 Adapter Implementation Patterns

### Hook Pattern for State Synchronization
```typescript
// Universal pattern for any reactive framework
function useStore<T>(store: StateStore<T>): T {
  const [state, setState] = useState(store.getState);
  
  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  }, [store]);
  
  return state;
}
```

### Event Handler Conversion
```typescript
// Convert StellarIX handlers to framework-specific handlers
const reactHandlers = Object.fromEntries(
  Object.entries(handlers).map(([event, handler]) => [
    `on${event.charAt(0).toUpperCase()}${event.slice(1)}`,
    handler
  ])
);
```

### Lifecycle Management
```typescript
function useComponentLifecycle(logic, state) {
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
```

## 📋 Adapter Development Process

### Step 1: Create Adapter Structure
```bash
# Create new adapter package
mkdir packages/adapters/[framework]
cp -r packages/adapters/react packages/adapters/[framework]
# Update package.json, dependencies, etc.
```

### Step 2: Implement Framework-Specific Patterns
```typescript
export const [framework]Adapter: FrameworkAdapter = {
  name: '[framework]',
  version: '[version]',
  
  createComponent: (core) => {
    // Framework-specific component factory
    return function StellarIXComponent(props) {
      // Use framework's reactive patterns
      // Connect to StellarIX state and logic
      // Return framework-specific component
    };
  },

  optimize: (component) => {
    // Framework-specific optimizations
    // e.g., React.memo, Vue shallowRef, Svelte $state
    return optimizedComponent;
  }
};
```

### Step 3: Framework-Specific Hooks/Composables
```typescript
// React hooks
export function useLogic(core) { /* ... */ }
export function useA11yProps(logic, elementId) { /* ... */ }

// Vue composables  
export function useLogic(core) { /* ... */ }
export function useA11yProps(logic, elementId) { /* ... */ }

// Svelte utilities
export function createLogicStore(core) { /* ... */ }
```

## 🧪 Adapter Testing Patterns

### Component Integration Tests
```typescript
describe('React Adapter', () => {
  it('should integrate with StellarIX core', () => {
    const button = createButton({ variant: 'primary' });
    const ReactButton = button.connect(reactAdapter);
    
    render(<ReactButton>Click me</ReactButton>);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('sx-button-primary');
  });
});
```

### State Synchronization Tests
```typescript
it('should sync state changes', () => {
  const component = createTestComponent();
  const FrameworkComponent = component.connect(adapter);
  
  render(<FrameworkComponent />);
  
  // Change state via StellarIX API
  component.state.setValue('new value');
  
  // Verify UI updates
  expect(screen.getByDisplayValue('new value')).toBeInTheDocument();
});
```

## 🎨 Framework-Specific Optimizations

### React Optimizations
```typescript
optimize: (component) => {
  return React.memo(component, (prevProps, nextProps) => {
    // Custom memoization logic
    return shallowEqual(prevProps, nextProps);
  });
}
```

### Vue Optimizations
```typescript
optimize: (component) => {
  return defineComponent({
    ...component,
    // Use Vue's reactivity optimizations
    __hmrId: 'stellarix-component'
  });
}
```

### Svelte Optimizations
```typescript
optimize: (component) => {
  // Use Svelte's compile-time optimizations
  return component; // Svelte compiler handles most optimizations
}
```

## 🌐 Context7 MCP Integration for Modern Patterns

When implementing adapters, use Context7 MCP for latest framework documentation:

### React 19 (Latest)
```bash
# Get latest React patterns
resolve-library-id("react") → "/reactjs/react.dev"
get-library-docs("/reactjs/react.dev", tokens=10000, topic="useActionState use hook ref prop")
```

### Vue 3.5+ (Latest Composition API)
```bash
# Get latest Vue patterns  
resolve-library-id("vue") → "/vuejs/docs"
get-library-docs("/vuejs/docs", tokens=10000, topic="composition api latest features")
```

### Svelte 5 (Revolutionary Runes)
```bash
# Get Svelte 5 runes system
get-library-docs("/svelte.dev-9b0d6d1/llmstxt", tokens=10000, topic="runes latest features svelte 5")
```

## 🚫 Adapter Anti-Patterns

### Forbidden Patterns
1. **Core Modifications**: Never require changes to core for adapter functionality
2. **Framework Bleeding**: Don't let framework specifics leak into core
3. **Performance Shortcuts**: Don't bypass StellarIX state management
4. **Version Lock-in**: Don't tie adapters to specific minor versions

### Memory Management
```typescript
// ✅ CORRECT - proper cleanup
useEffect(() => {
  const cleanup = logic.initialize();
  logic.connect(state);
  
  return () => {
    logic.cleanup();
    cleanup?.();
  };
}, []);

// ❌ FORBIDDEN - memory leaks
useEffect(() => {
  logic.initialize();
  logic.connect(state);
  // Missing cleanup!
}, []);
```

## ✅ Adapter Development Checklist

Before considering an adapter complete:

- [ ] Implements minimal FrameworkAdapter interface
- [ ] Uses latest framework patterns (React 19, Vue 3.5+, Svelte 5)
- [ ] Provides optimal developer experience for target framework
- [ ] No modifications required to core
- [ ] Proper state synchronization
- [ ] Memory leak prevention
- [ ] Framework-specific optimizations implemented
- [ ] Integration tests passing
- [ ] Documentation with framework-specific examples

## 📚 Framework Documentation

### Current Adapters
- **React**: `./react/` - React 19 with latest patterns
- **Vue**: `./vue/` - Vue 3.5+ Composition API (planned)
- **Svelte**: `./svelte/` - Svelte 5 Runes (planned)

### Adding New Adapters
1. Create package structure following existing patterns
2. Implement FrameworkAdapter interface
3. Add framework-specific optimizations
4. Create comprehensive tests
5. Document framework-specific usage patterns

## 🔗 Related Documentation

- Core Architecture: `../core/CLAUDE.md`
- Primitive Components: `../primitives/CLAUDE.md`
- React Adapter: `./react/README.md`