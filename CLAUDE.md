# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StellarIX UI is a framework-agnostic headless component library that provides a single, consistent component implementation adaptable to React, Vue, Svelte, Solid, Qwik, Angular, and Web Components. The project uses a monorepo structure with pnpm workspaces.

## 🎯 Critical Information Sources

### Where to Find Project Information
1. **Overall Plan**: `/plan.md` - Complete development plan with ultra-generic architecture
2. **AI Agent Tasks**: `/AI-AGENT-DEVELOPMENT-PLAN.md` - Detailed 45-task implementation plan
3. **Architecture Details**: `/memory-bank/architecture.md` - Three-layer architecture specs
4. **Component Specs**: `/memory-bank/component-catalog.md` - All 30 components with variants
5. **Development Priorities**: `/memory-bank/development-priorities.md` - Implementation order
6. **System Patterns**: `/memory-bank/systemPatterns.md` - Coding conventions and patterns
7. **Style Guide**: `/memory-bank/style-guide.md` - TypeScript and code style requirements
8. **Testing Guide**: `/memory-bank/testing-guide.md` - Testing approach and coverage goals

### Where to Track Current Work
1. **Active Context**: `/memory-bank/activeContext.md` - Current development state
2. **Task Tracking**: Use `TodoWrite` and `TodoRead` tools frequently
3. **Completed Work**: Update after each feature completion
4. **Test Results**: Document in component's test directory

### Progress Tracking Rules
1. **ALWAYS** use TodoWrite/TodoRead tools to track tasks
2. **NEVER** skip testing after implementing a feature
3. **UPDATE** activeContext.md after completing each component
4. **COMMIT** after each successful feature + tests

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

### Code Quality & Testing (MANDATORY AFTER EACH FEATURE)
```bash
# REQUIRED workflow after implementing ANY feature:
pnpm test                 # Run all tests (MUST pass before commit)
pnpm test:coverage       # Verify coverage goals (90%+ core, 80%+ components) 
pnpm lint                 # Run ESLint 9+ with flat config (MUST pass)
pnpm typecheck           # TypeScript 5.7+ strict checking (MUST pass)
pnpm format              # Format with Prettier 3.3+

# Component-specific testing:
pnpm --filter=@stellarix/[package] test        # Test specific package
pnpm --filter=@stellarix/[package] test:a11y   # Accessibility tests (required)
pnpm --filter=@stellarix/[package] build       # Verify build works
```

### 🚨 MANDATORY Feature Completion Workflow
```bash
# After implementing ANY feature, component, or fix:
1. pnpm test              # All tests MUST pass
2. pnpm lint              # No linting errors allowed  
3. pnpm typecheck         # TypeScript MUST compile
4. TodoWrite update       # Mark current task as completed
5. Update activeContext   # Document what was just completed
6. git add . && git commit -m "feat: [component/feature description]"

# NEVER skip testing - this is a hard requirement
# NEVER commit without all checks passing
```

### Package-Specific Operations
```bash
pnpm --filter=@stellarix/button build    # Build specific package
pnpm --filter=@stellarix/core dev        # Run dev mode for specific package
```

## 🏗️ Ultra-Generic Architecture (CRITICAL)

### Core Principle: Maximum Adapter Extensibility
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

### Framework-Agnostic Rules
- ❌ NEVER import framework code in `/packages/core/`
- ❌ NEVER use framework-specific patterns in core
- ✅ ALWAYS use pure functions in core
- ✅ ALWAYS make state updates immutable
- ✅ ALWAYS communicate via events, not direct calls

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
- **Fixing deprecated warnings or errors** - Use Context7 to find modern replacements
- **Resolving build/compilation issues** - Get state-of-the-art solutions

### 🚨 CRITICAL: Anti-Pattern Prevention & Context7 Mandatory Usage

#### MUST USE CONTEXT7 FOR ALL DEPRECATION WARNINGS - NO EXCEPTIONS:
- **Vite CJS API deprecation** (e.g., "The CJS build of Vite's Node API is deprecated")
- **Package deprecation warnings** (e.g., "@humanwhocodes/config-array@0.12.3: Use @eslint/config-array instead")
- **Any message containing "deprecated"** - STOP and use Context7 immediately
- **Build tool warnings** - Get proper migration paths from documentation
- **Test configuration errors** - Find Vitest 2.x solutions via Context7

#### FORBIDDEN PATTERNS - NEVER CREATE:
1. **Circular Dependencies**: 
   - No self-referencing imports
   - No A→B→A import chains
   - No recursive function calls without exit conditions
   - No state subscriptions that trigger themselves
   - No hooks that call other hooks in a way that creates cycles

2. **Infinite Loops**:
   - No while(true) without break conditions
   - No recursive setState within subscriptions
   - No event handlers that re-trigger the same event
   - Always add loop counters/timeouts as safeguards
   - No React hooks that cause cascading re-renders
   - ALWAYS test with limited iterations first

3. **Memory Leaks**:
   - Always cleanup subscriptions
   - Always remove event listeners
   - Always clear intervals/timeouts
   - Use WeakMap/WeakSet for object references
   - Properly cleanup useEffect dependencies

4. **Testing Safety Rules**:
   - ALWAYS run tests with system timeout: `timeout 30s command`
   - NEVER run build/test commands without timeout protection
   - Add `--bail` flag to test runners to stop on first failure
   - Use `--maxWorkers=1` to prevent resource exhaustion
   - If a test hangs, kill it immediately and investigate

#### WORKING WITH FACTS - NOT GUESSES:
- **DO NOT IMPROVISE** solutions for any error
- **DO NOT GUESS** fixes for deprecation warnings
- **ALWAYS** use Context7 for factual, documented solutions
- **ALWAYS** check official documentation before implementing
- **NEVER** create workarounds without understanding root cause

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

## 📋 Work Tracking & Current Status

### 🚀 Autonomous Development Mode

**CRITICAL**: Once tasks are completed successfully, Claude should **AUTOMATICALLY PROCEED** to the next tasks without waiting for user input. This ensures maximum development velocity during "one-shot" implementation sessions.

### Auto-Progression Rules
```bash
# When current todo tasks are completed:
1. TodoRead                           # Check if current tasks are done
2. if all_current_tasks_completed:    # Auto-proceed if true
   - Read AI-AGENT-DEVELOPMENT-PLAN.md
   - Add next 3-5 tasks to TodoWrite
   - Begin implementation immediately
   - NO user input required
3. Continue until blocked or all 45 tasks complete
```

### How to Check Current Status
```bash
# Always check current work state:
TodoRead                 # See active tasks and what's completed
cat memory-bank/activeContext.md    # Read current development context
git status              # Check uncommitted changes
pnpm test               # Verify current state is stable
```

### Progress Documentation Requirements
1. **Before Starting Work**: Use `TodoWrite` to create tasks for what you'll implement
2. **During Work**: Update todos with `in_progress` status
3. **After Completing Feature**: 
   - Mark todo as `completed`
   - Update `memory-bank/activeContext.md` with what was accomplished
   - Run full test suite and commit if all pass
   - **AUTO-PROCEED** to next tasks if available

### Autonomous Implementation Workflow
```bash
# Continuous development cycle:
while (tasks_remaining_in_AI_AGENT_PLAN):
  1. Complete current todos
  2. TodoWrite next task batch (3-5 tasks)
  3. Implement features following ultra-generic architecture
  4. Run mandatory testing workflow
  5. Commit successful changes
  6. Update activeContext.md
  7. CONTINUE to next task batch (NO user input needed)

# Only stop for:
- Build failures that can't be resolved
- Architecture decisions requiring user input
- All 45 tasks completed
```

### Current Work Location Tracking
- **Active Tasks**: Check `TodoRead` output
- **Component Status**: `/memory-bank/component-catalog.md` shows all 30 components
- **Implementation Plan**: `/AI-AGENT-DEVELOPMENT-PLAN.md` has detailed task breakdown
- **What's Built**: Check `packages/primitives/*/src/` directories
- **What's Tested**: Look for `*.test.ts` files and run `pnpm test:coverage`

### Implementation Priority Order (from memory-bank)
**Phase 1 (P0 - Foundation)**: Button, Container, Divider, Spinner, Input, Checkbox, Radio
**Phase 2 (P1 - Core)**: Toggle, Alert, Badge, Avatar, Textarea, Card, Popover, Tooltip, Dialog, Menu, Tabs, Select, Accordion, ProgressBar
**Phase 3 (P2 - Standard)**: Slider, Pagination, Breadcrumb, NavigationMenu, Stepper, FileUpload, DatePicker, Table, Calendar

### Testing Requirements Per Component
- ✅ Unit tests (`src/*.test.ts`) - 90%+ coverage for core, 80%+ for components
- ✅ Integration tests (`test/*-react.test.tsx`) - Framework adapter testing  
- ✅ Accessibility tests (`test/*-a11y.test.tsx`) - WCAG 2.1 AA compliance
- ✅ Build verification (`pnpm build` succeeds)
- ✅ Type checking (`pnpm typecheck` passes)

### 🎯 Key Success Metrics
- **Development Velocity**: Continue without user intervention when possible
- **Architecture Quality**: Ultra-generic design allowing infinite adapter extensibility  
- **Test Coverage**: 90%+ core, 80%+ components
- **Build Stability**: All packages build successfully
- **Framework Compatibility**: Support React 19, Vue 3.5+, Svelte 5 patterns