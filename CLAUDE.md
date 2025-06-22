# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StellarIX UI is a framework-agnostic headless component library that provides a single, consistent component implementation adaptable to React, Vue, Svelte, Solid, Qwik, Angular, and Web Components. The project uses a monorepo structure with pnpm workspaces.

## Essential Commands (State-of-the-Art 2025)

### Development
```bash
pnpm install              # Install all dependencies (latest versions)
pnpm dev                  # Start development mode
pnpm build                # Build all packages with Turbo 2.0+
pnpm storybook            # Start Storybook dev server
```

### Testing (Vitest 2.x + Modern DOM)
```bash
pnpm test                 # Run all tests with Vitest 2.1+
pnpm test:watch          # Run tests in watch mode with HMR
pnpm test:coverage       # Run tests with coverage via v8
pnpm test:ui             # Open Vitest UI for visual testing
pnpm --filter=@stellarix/[package] test  # Test specific package
```

### Code Quality (Modern ESLint 9+ & TypeScript 5.7+)
```bash
pnpm lint                 # Run ESLint 9+ with flat config
pnpm format              # Format with Prettier 3.3+
pnpm typecheck           # TypeScript 5.7+ strict checking
pnpm typecheck:watch     # Watch mode type checking
```

### Package-Specific Operations
```bash
pnpm --filter=@stellarix/button build    # Build specific package
pnpm --filter=@stellarix/core dev        # Run dev mode for specific package
```

## Architecture

The codebase follows a three-layer architecture:

1. **State Layer**: Framework-agnostic reactive state management in `packages/core/src/state.ts`
2. **Logic Layer**: Business logic and event handling in `packages/core/src/logic.ts`
3. **Presentation Layer**: Framework-specific adapters in `packages/adapters/`

### Component Creation Pattern
```typescript
import { createButton } from '@stellarix/button';
import { reactAdapter } from '@stellarix/react';

const button = createButton(options);
const ReactButton = button.connect(reactAdapter);
```

### Package Structure
- `/packages/core/` - Core state and logic systems
- `/packages/utils/` - Shared utilities (accessibility, DOM helpers)
- `/packages/adapters/` - Framework-specific adapters
- `/packages/primitives/` - UI primitive components (button, dialog, etc.)
- `/memory-bank/` - Project documentation and context tracking

### Component Package Structure
Each component follows this pattern:
```
packages/primitives/[component]/
├── src/
│   ├── index.ts      # Public API exports
│   ├── types.ts      # TypeScript interfaces
│   ├── state.ts      # State management
│   ├── logic.ts      # Business logic
│   └── *.test.ts     # Unit tests
├── test/             # Integration tests
├── examples/         # Usage examples
└── package.json
```

## State-of-the-Art Development Patterns (2025)

### TypeScript 5.7+ Configuration
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true
  }
}
```
- Ultra-strict mode with exactOptionalPropertyTypes
- Bundler module resolution for modern tools
- Path aliases: `@stellarix/core`, `@stellarix/utils`, etc.
- ESM-first with verbatimModuleSyntax

### Latest Framework Patterns
1. **React 19 Adapter**:
   ```typescript
   // Use latest React patterns
   const Component = ({ ref, ...props }) => {
     const [data, action, isPending] = useActionState(serverAction);
     const asyncData = use(promise); // Direct promise reading
     return <div ref={ref} {...props} />; // ref as prop
   };
   ```

2. **Vue 3.5+ Adapter**:
   ```vue
   <script setup lang="ts">
   import { useTemplateRef } from 'vue'
   
   const props = defineProps<{ state: ComponentState }>()
   const emit = defineEmits<{ update: [value: string] }>()
   const elementRef = useTemplateRef('element')
   </script>
   ```

3. **Svelte 5 Runes Adapter**:
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

### Modern Testing (Vitest 2.x + happy-dom)
- Use Vitest 2.1+ for all unit tests
- Use @testing-library/react@16+ for component tests
- happy-dom for faster, modern DOM simulation
- jest-axe@10+ for accessibility testing
- Test files: `*.test.ts`, `*.test.tsx`, `*.spec.ts`

### Accessibility Standards (WCAG 2.2)
- WCAG 2.2 AA compliance required (latest standard)
- Use utilities from `@stellarix/utils/accessibility`
- Test with jest-axe@10+ for automated checks
- Follow latest ARIA 1.2 patterns

### Code Style (ESM-First)
- ESM modules with named exports only
- Use latest framework conventions in adapters
- Consistent index.ts exports with proper types
- Modern bundler-friendly patterns

## Current Focus Areas

1. **Dialog Component**: Currently implementing in `packages/primitives/dialog/`
2. **TypeScript Enhancement**: Standardizing TypeScript 5.0+ configurations
3. **React Adapter**: Completing the React adapter implementation

## Important Context Files

Before making architectural decisions, review:
- `/memory-bank/architecture.md` - Technical architecture details
- `/memory-bank/systemPatterns.md` - Coding patterns and conventions
- `/memory-bank/component-catalog.md` - Component specifications
- `/memory-bank/development-priorities.md` - Current priorities and roadmap

## Build System

- **Turbo**: Orchestrates monorepo builds with caching
- **tsup**: Bundles individual packages
- **Vitest**: Test runner with jsdom environment
- Build outputs go to `dist/` in each package
- Declaration files (.d.ts) are generated for all packages

## Common Development Tasks

### Adding a New Component
1. Create package structure under `packages/primitives/[name]/`
2. Implement state.ts, logic.ts, types.ts following existing patterns
3. Export public API through index.ts
4. Add unit tests alongside implementation
5. Create examples in `examples/` directory
6. Update exports in adapter packages

### Debugging Build Issues
1. Check `turbo.json` for pipeline configuration
2. Verify package.json dependencies are correct
3. Run `pnpm build --filter=[package]` to isolate issues
4. Check TypeScript project references in tsconfig.json

### Working with the State System
- State uses XState v5 patterns
- Always define proper TypeScript types for state
- Use the proxy-based subscription system from core
- Test state transitions thoroughly

## Context7 MCP Integration (State-of-the-Art 2025)

Context7 MCP provides access to latest framework documentation. **Always use 10000 tokens** for comprehensive coverage.

### Verified State-of-the-Art Library IDs:

1. **React 19 (Latest)**:
   - **ID**: `/reactjs/react.dev` (2791 snippets, Trust: 9.0)
   - **Key Features**: `use` hook, `useActionState`, ref as prop, React 19 Suspense
   - **Usage**: `get-library-docs("/reactjs/react.dev", tokens=10000, topic="latest features hooks patterns")`

2. **Vue 3.5+ (Latest Composition API)**:
   - **ID**: `/vuejs/docs` (1490 snippets, Trust: 9.7)
   - **Key Features**: `<script setup>`, `defineProps<T>()`, `useTemplateRef()`
   - **Usage**: `get-library-docs("/vuejs/docs", tokens=10000, topic="composition api latest features")`

3. **Svelte 5 (Revolutionary Runes)**:
   - **ID**: `/svelte.dev-9b0d6d1/llmstxt` (5934 snippets)
   - **Key Features**: `$state`, `$derived`, `$effect`, `$props()`, `$inspect()`
   - **Usage**: `get-library-docs("/svelte.dev-9b0d6d1/llmstxt", tokens=10000, topic="runes latest features svelte 5")`

4. **TypeScript 5.7+ (Latest)**:
   - **ID**: `/microsoft/typescript` (26981 snippets, Trust: 9.9)
   - **Key Features**: Bundler module resolution, verbatimModuleSyntax
   - **Usage**: `get-library-docs("/microsoft/typescript", tokens=10000, topic="latest features typescript 5.x")`

### When to Use Context7:
- Implementing latest React 19 patterns (useActionState, use hook)
- Vue 3.5+ script setup and defineProps patterns
- Svelte 5 runes system implementation
- TypeScript 5.7+ configuration and features
- Modern accessibility patterns (WCAG 2.2)
- Latest testing patterns (Vitest 2.x)

### Advanced Implementation Workflow:
```bash
# For React 19 adapter implementation:
1. resolve-library-id("react") → "/reactjs/react.dev"
2. get-library-docs("/reactjs/react.dev", tokens=10000, topic="useActionState use hook ref prop")
3. Implement adapter using latest React 19 patterns

# For Svelte 5 runes implementation:
1. Use direct ID: "/svelte.dev-9b0d6d1/llmstxt"
2. get-library-docs(id, tokens=10000, topic="$state $derived $effect runes")
3. Implement using Svelte 5 runes system

# For TypeScript configuration:
1. resolve-library-id("typescript") → "/microsoft/typescript"
2. get-library-docs(id, tokens=10000, topic="bundler module resolution strict config")
3. Configure ultra-strict TypeScript 5.7+ setup
```

Remember to check memory-bank documentation for detailed architectural decisions and patterns specific to each component.