# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StellarIX UI is a framework-agnostic headless component library that provides a single, consistent component implementation adaptable to React, Vue, Svelte, Solid, Qwik, Angular, and Web Components. The project uses a monorepo structure with pnpm workspaces.

**Main Developer**: This project is primarily developed by Anthropic's Claude Code, monitored and guided by Sergej Riemann.

## 🎯 DX-First Philosophy

**Developer Experience is our #1 priority**. Every decision should optimize for:

1. **Minimal Typing**: Use `sx` prefix (not `stellarix`) - it's 75% shorter!
2. **Zero Config**: Components work out-of-the-box with sensible defaults
3. **Intuitive APIs**: If a developer has to check docs for basic usage, we've failed
4. **Fast Feedback**: Instant hot-reload, clear error messages, visual testing

### Naming Conventions
- **CSS Classes**: `sx-button`, `sx-card`, `sx-input` (NOT `stellarix-button`)
- **CSS Variables**: `--sx-primary`, `--sx-spacing-4` (NOT `--stellarix-primary`)
- **Component Exports**: Simple names like `Button`, `Card` (not `StellarixButton`)
- **Why "sx"?**: Stellar + X = sx. It's memorable, fast to type, and follows patterns like MUI's sx prop

### Import Aliases (Even Shorter!)
Configure your bundler to use `@sx/` instead of `@stellarix/` for ultra-minimal typing:
```tsx
// Before
import { createButton } from '@stellarix/button';

// After (with alias)
import { createButton } from '@sx/button';
```
See `/ALIAS_SETUP.md` for bundler configuration.

## 🎯 Critical Information Sources

### Where to Find Project Information
1. **Package Documentation**: Each package has its own README.md and CLAUDE.md files
2. **Component Specifications**: Defined in each component's types.ts file
3. **Architecture**: Implemented in `/packages/core/` with state, logic, and component systems
4. **Testing Patterns**: See existing test files for reference patterns

### Where to Track Current Work
1. **Task Tracking**: Use `TodoWrite` and `TodoRead` tools frequently
2. **Git History**: Track progress through commits
3. **Test Results**: Run `pnpm test` to verify current state
4. **Build Status**: Run `pnpm build` to check all packages

### Progress Tracking Rules
1. **ALWAYS** use TodoWrite/TodoRead tools to track tasks
2. **NEVER** skip testing after implementing a feature
3. **COMMIT** after each successful feature + tests

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
pnpm --filter=@stellarix-ui/[package] test  # Test specific package
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
pnpm --filter=@stellarix-ui/[package] test        # Test specific package
pnpm --filter=@stellarix-ui/[package] test:a11y   # Accessibility tests (required)
pnpm --filter=@stellarix-ui/[package] build       # Verify build works
```

### 🚨 MANDATORY Feature Completion Workflow
```bash
# After implementing ANY feature, component, or fix:
1. pnpm test              # All tests MUST pass
2. pnpm lint              # No linting errors allowed  
3. pnpm typecheck         # TypeScript MUST compile
4. Create Storybook story # REQUIRED: Show ALL features and edge cases
5. pnpm changeset         # Create changeset describing your changes
6. TodoWrite update       # Mark current task as completed
7. Update activeContext   # Document what was just completed
8. git add . && git commit -m "feat: [component/feature description]"

# NEVER skip testing - this is a hard requirement
# NEVER commit without all checks passing
# NEVER skip creating stories - visual testing is mandatory
# NEVER skip changesets - version tracking is critical
```

### 📖 Storybook Story Requirements (MANDATORY)

After implementing each primitive component, you MUST create a comprehensive Storybook story that:

1. **Shows ALL Component Features**:
   - Every variant (primary, secondary, outline, etc.)
   - Every size option (sm, md, lg)
   - Every state (normal, hover, focus, disabled, loading, error)
   - Every prop combination that affects behavior

2. **Tests Boundary Conditions**:
   - Disabled inputs should NOT be interactive
   - Readonly inputs should display text but NOT allow editing
   - Loading states should prevent user interaction
   - Error states should display proper messaging
   - Required fields should show validation

3. **Story Structure**:
   ```tsx
   // Individual stories for each variant/state
   export const Default = { ... }
   export const Disabled = { ... }
   export const Readonly = { ... }
   export const Loading = { ... }
   export const Error = { ... }
   
   // Showcase story showing ALL variations
   export const Showcase = {
     render: () => (
       // Grid showing all variants, sizes, states
     )
   }
   ```

4. **Interactive Behavior Validation**:
   - Readonly inputs must have value but prevent changes
   - Disabled elements must not respond to clicks
   - Loading states must block interaction
   - Focus/blur must work correctly
   - Keyboard navigation must be proper

5. **Edge Case Testing**:
   - Long text overflow
   - Empty states
   - Invalid prop combinations
   - Accessibility features

### Package-Specific Operations
```bash
pnpm --filter=@stellarix-ui/button build    # Build specific package
pnpm --filter=@stellarix-ui/core dev        # Run dev mode for specific package
```

### Version Management with Changesets
```bash
pnpm changeset              # Create a new changeset for your changes
pnpm changeset version      # Update package versions based on changesets
pnpm changeset publish      # Publish packages to npm (maintainers only)
pnpm changeset status       # Check current changeset status

# Changeset types:
# patch - Bug fixes and small changes (0.0.X)
# minor - New features, backwards compatible (0.X.0)
# major - Breaking changes (X.0.0)
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

**IMPORTANT**: We're moving towards a single factory pattern. Instead of having separate `createComponent` and `createComponentWithImplementation` functions, use a unified approach:

```typescript
// Preferred: Single factory pattern
import { createButton } from '@stellarix/button';
import { reactAdapter } from '@stellarix/react';

// The factory handles both cases internally
const button = createButton(options);
const ReactButton = button.connect(reactAdapter);
```

This simplifies the API and reduces cognitive load. The factory function internally determines whether to use a default implementation or a custom one based on the provided options.

### Package Structure
- `/packages/core/` - Core state and logic systems
- `/packages/utils/` - Shared utilities (accessibility, DOM helpers)
- `/packages/adapters/` - Framework-specific adapters
- `/packages/primitives/` - UI primitive components (button, dialog, etc.)

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
    "isolatedModules": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```
- **Ultra-strict mode**: `exactOptionalPropertyTypes` ensures undefined handling
- **Bundler module resolution**: Compatible with Vite, webpack, esbuild, etc.
- **verbatimModuleSyntax**: Replaces deprecated `importsNotUsedAsValues`
- **ESM-first**: Modern module syntax with proper tree-shaking
- **Path aliases**: `@stellarix/core`, `@stellarix/utils` (no -ui suffix)

### Latest Framework Patterns
1. **React 19 Adapter**:
   ```typescript
   // React 19 - ref as prop (no forwardRef needed)
   function MyInput({ placeholder, ref }) {
     return <input placeholder={placeholder} ref={ref} />;
   }
   
   // React 19 - useActionState for forms
   function Form() {
     const [error, submitAction, isPending] = useActionState(
       async (previousState, formData) => {
         const error = await updateName(formData.get("name"));
         if (error) return error;
         redirect("/path");
         return null;
       },
       null
     );
     
     return (
       <form action={submitAction}>
         <input type="text" name="name" />
         <button type="submit" disabled={isPending}>Update</button>
         {error && <p>{error}</p>}
       </form>
     );
   }
   
   // React 19 - use hook for promises and context
   function Component() {
     const data = use(fetchDataPromise); // Suspends until resolved
     const theme = use(ThemeContext); // Can be conditional
     return <div theme={theme}>{data}</div>;
   }
   ```

2. **Vue 3.5+ Adapter**:
   ```vue
   <script setup lang="ts">
   import { useTemplateRef, onMounted } from 'vue'
   
   // Type-safe props with generic argument
   const props = defineProps<{
     foo: string
     bar?: number
   }>()
   
   // Type-safe emits with call signatures
   const emit = defineEmits<{
     (e: 'change', id: number): void
     (e: 'update', value: string): void
   }>()
   
   // Vue 3.5+ useTemplateRef for DOM access
   const input = useTemplateRef('my-input')
   
   onMounted(() => {
     input.value?.focus()
   })
   </script>
   
   <template>
     <input ref="my-input" />
   </template>
   ```

3. **Svelte 5 Runes Adapter**:
   ```svelte
   <script lang="ts">
   // Svelte 5 - $props() rune for component props
   let { state, logic }: Props = $props();
   
   // $state for reactive variables
   let count = $state(0);
   
   // $derived for computed values
   let doubled = $derived(count * 2);
   let large = $derived(count > 10);
   
   // $derived.by for complex derivations
   let total = $derived.by(() => {
     let sum = 0;
     for (const n of numbers) {
       sum += n;
     }
     return sum;
   });
   
   // $effect for side effects and cleanup
   $effect(() => {
     const cleanup = logic.initialize();
     
     // Cleanup function
     return () => {
       cleanup();
     };
   });
   
   // $inspect for development debugging
   $inspect(count, state); // Auto-logs changes
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
- Use utilities from `@stellarix-ui/utils/accessibility`
- Test with jest-axe@10+ for automated checks
- Follow latest ARIA 1.2 patterns

### Code Style (ESM-First)
- ESM modules with named exports only
- Use latest framework conventions in adapters
- Consistent index.ts exports with proper types
- Modern bundler-friendly patterns
- NO inline comments for code changes (e.g., `// Updated for WCAG compliance`)
- Keep code clean without implementation notes

## Current Focus Areas

1. **Dialog Component**: Currently implementing in `packages/primitives/dialog/`
2. **TypeScript Enhancement**: Standardizing TypeScript 5.0+ configurations
3. **React Adapter**: Completing the React adapter implementation

## 🚨 ABSOLUTE RULE: NO INLINE COMMENTS

**ZERO TOLERANCE**: NO inline comments allowed in ANY code files!

This includes:
- NO `// temporary comments`  
- NO `// TODO: fix later`
- NO `// NOTE: important`
- NO `// Updated for X`
- NO `// Changed to Y`
- NO explanatory comments after code

**ONLY ALLOWED**: JSDoc for public API documentation.

If you feel you need a comment, refactor the code to be clearer instead!

## 📖 Framework Pattern Guides

Detailed guides for each framework's latest patterns:

- **React 19**: `/packages/adapters/react/REACT19-PATTERNS.md`
- **Vue 3.5+**: `/packages/adapters/vue/VUE3-PATTERNS.md`
- **Svelte 5**: `/packages/adapters/svelte/SVELTE5-PATTERNS.md`

These guides include:
- Latest framework features and syntax
- Integration examples with StellarIX components
- Migration guides from older versions
- Best practices and advanced patterns

## 📋 Task Tracking System

### Two Primary Tracking Points:
1. **`/AI-AGENT-DEVELOPMENT-PLAN.md`** - Master task list with 45 detailed implementation tasks
   - Complete step-by-step implementation plan
   - Task status tracking (✅ completed, 🚧 in progress, ❌ not started)
   - Time estimates and dependencies
   - Current progress summary at bottom

2. **`/memory-bank/activeContext.md`** - Current working state and recent progress
   - Real-time component implementation status
   - Test results and issues
   - Recent achievements
   - Next priority steps

### Important Context Files

Before making architectural decisions, review:
- `/memory-bank/architecture.md` - Technical architecture details
- `/memory-bank/systemPatterns.md` - Coding patterns and conventions
- `/memory-bank/component-catalog.md` - Component specifications
- `/memory-bank/development-priorities.md` - Current priorities and roadmap

## Build System

- **Turbo**: Orchestrates monorepo builds with caching
- **tsup**: Bundles individual packages
- **Vitest**: Test runner with jsdom environment
- **Changesets**: Version management and changelog generation
- Build outputs go to `dist/` in each package
- Declaration files (.d.ts) are generated for all packages

## 📦 Version Management with Changesets

Changesets manages versioning and changelogs across our monorepo. Every change that affects package functionality MUST have a changeset.

### 🚨 AI Agent Restrictions

**AI agents (including Claude) must NEVER:**
- Run `pnpm changeset version` - This updates package.json versions
- Run `pnpm changeset publish` - This publishes to npm
- Modify version numbers in package.json files directly
- Create automated publishing workflows

**AI agents SHOULD:**
- Create changesets with `pnpm changeset` after implementing features
- Help users understand which version bump to use (patch/minor/major)
- Document changes clearly in changeset descriptions

### Creating a Changeset

After implementing a feature, fix, or change:

```bash
pnpm changeset
```

Follow the prompts to:
1. Select which packages have changed
2. Choose version bump type:
   - **patch**: Bug fixes, documentation (0.0.X)
   - **minor**: New features, backwards compatible (0.X.0)  
   - **major**: Breaking changes (X.0.0)
3. Write a summary of your changes

### Changeset Guidelines

#### When to Use Each Version Type:

**Patch (0.0.X)**:
- Bug fixes
- Documentation updates
- Performance improvements (no API changes)
- Internal refactoring (no API changes)

**Minor (0.X.0)**:
- New components
- New features added to existing components
- New utility functions
- New configuration options (with defaults)

**Major (X.0.0)**:
- Breaking API changes
- Removing features
- Changing default behavior
- Renaming exports
- Changing required options

#### Changeset Message Format:
```
feat(button): add loading state and spinner animation

- Added `loading` prop to show spinner
- Added `loadingText` prop for custom loading message
- Spinner automatically inherits button variant colors
```

### Working with Changesets

```bash
# View current changesets
pnpm changeset status

# Version packages (USER INITIATED ONLY - NEVER RUN AUTOMATICALLY)
pnpm changeset version

# Publish to npm (USER INITIATED ONLY - NEVER RUN AUTOMATICALLY)
pnpm changeset publish

# ⚠️ IMPORTANT: AI agents must NEVER run version or publish commands
# These commands should only be executed by human maintainers
```

### Monorepo Considerations

- Changesets automatically handles dependency updates across our package structure:
  - `@stellarix-ui/core` - Core state and logic systems
  - `@stellarix-ui/primitives/*` - All UI components (button, select, etc.)
  - `@stellarix-ui/themes` - Theme system and CSS
  - `@stellarix-ui/adapters/*` - Framework adapters (react, vue, svelte, etc.)
- If `@stellarix-ui/core` changes, all dependent packages get version bumps
- Internal dependencies use workspace protocol: `"@stellarix-ui/core": "workspace:*"`
- All packages are published under the `stellarix-ui` npm organization

### Package Naming Convention
All packages follow the `@stellarix/[package-name]` convention:
- `@stellarix/button` ✅ (NOT `@stellarix/primitives-button`)
- `@stellarix/react` ✅ (NOT `@stellarix/adapter-react`)
- `@stellarix/themes` ✅ (single themes package)

### Example Changeset Workflow

```bash
# 1. Implement new Select component
pnpm --filter=@stellarix/select test

# 2. Create changeset
pnpm changeset
# Select: @stellarix/select
# Type: minor
# Summary: "Add Select component with search and keyboard navigation"

# 3. Commit with changeset
git add .
git commit -m "feat: implement Select component"
```

## Common Development Tasks

### Adding a New Component
See `/packages/primitives/CLAUDE.md` for the detailed component creation process using templates.

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
   
   **🚨 CRITICAL: state.getState() INFINITE LOOP PREVENTION**:
   - **FORBIDDEN**: NEVER call `state.getState()` inside ANY logic layer method
   - **FORBIDDEN**: NEVER call `state.getState()` in event handlers
   - **FORBIDDEN**: NEVER call `state.getState()` in getInteractionHandlers()
   - **FORBIDDEN**: NEVER call `state.getState()` in getA11yProps()
   - **FORBIDDEN**: NEVER call `state.getState()` in interactions generator
   - **FORBIDDEN**: NEVER call `state.getState()` in reactive contexts
   - **FORBIDDEN**: NEVER use `expect(state.getState())` in tests
   - **FORBIDDEN**: NEVER use `component.state.getState()` in Storybook stories
   
   **✅ CORRECT PATTERNS**:
   - Use `(currentState, handleEvent)` parameters in interactions
   - Use `(state)` parameter in a11y functions  
   - Call state setters directly: `state.setValue()`, `state.setActive()`
   - Call onChange callbacks directly in interactions for proper value passing
   - Test using callbacks: `expect(onChange).toHaveBeenCalledWith(value)`
   - Test state changes: `state.subscribe(listener); expect(listener).toHaveBeenCalledWith()`
   - Storybook state: `const [state, setState] = useState(); useEffect(() => subscribe...)`
   
   **WHY**: Calling `state.getState()` in reactive contexts creates circular dependencies that cause infinite loops and crash the application. This has happened 10+ times and MUST be prevented.

   **🚨🚨🚨 ULTRA-CRITICAL: setState PARTIAL UPDATE PREVENTION**:
   - **FORBIDDEN**: NEVER use `state.setState({ field: value })` - WILL NOT WORK
   - **FORBIDDEN**: NEVER use `store.setState({ field: value })` - CAUSES NaN/undefined
   - **FORBIDDEN**: NEVER use partial object updates with setState
   - **FORBIDDEN**: NEVER try to update single fields without spread operator
   - **FORBIDDEN**: NEVER assume setState accepts partial updates like React
   
   **✅ ONLY CORRECT PATTERN FOR setState**:
   ```typescript
   // ✅ ALWAYS use function updater pattern:
   store.setState((prev: any) => ({ ...prev, field: value }));
   
   // ✅ For multiple fields:
   store.setState((prev: any) => ({ 
     ...prev, 
     field1: value1,
     field2: value2 
   }));
   
   // ❌❌❌ NEVER do this (WILL BREAK):
   store.setState({ field: value }); // FORBIDDEN!
   state.setState({ field: value }); // FORBIDDEN!
   ```
   
   **WHY**: The core setState expects either a full state object or a function updater. Partial objects cause the state to lose all other fields, resulting in NaN/undefined errors. This pattern has caused critical failures 5+ times and MUST be prevented.

   **🚨🚨🚨 NO-OP setState CIRCULAR SUBSCRIPTION PREVENTION**:
   - **FORBIDDEN**: NEVER use `state.setState((prev) => ({ ...prev }))` to trigger subscribers
   - **FORBIDDEN**: NEVER use no-op setState calls like `setState((prev) => prev)`
   - **FORBIDDEN**: NEVER create temporary subscriptions with forced state updates
   - **FORBIDDEN**: NEVER use setTimeout + subscribe + setState patterns
   
   **❌❌❌ FORBIDDEN PATTERN (Causes Browser Freeze)**:
   ```typescript
   // This pattern from accordion bug causes infinite loops:
   setTimeout(() => {
     const unsubscribe = state.subscribe(callback);
     state.setState((prev) => ({ ...prev })); // 🚨 CIRCULAR!
     unsubscribe();
   }, 0);
   ```
   
   **✅ CORRECT PATTERN**:
   ```typescript
   // Calculate the new state and call callbacks directly:
   const newValue = calculateNewState(currentState);
   if (options.onChange) {
     options.onChange(newValue);
   }
   ```
   
   **WHY**: No-op setState triggers ALL subscribers, causing circular dependencies and infinite loops that freeze the browser. This caused the accordion Storybook freeze and MUST be prevented.

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

Remember to check:
- `/packages/primitives/CLAUDE.md` for primitive component development

## 🎯 Component Development

### For Primitive Components
See `/packages/primitives/CLAUDE.md` for detailed component development guide including:
- Critical state management patterns
- Component creation process
- Testing patterns
- Reference implementations

### Component Templates
- **Location**: `/templates/component-template/`
- **Guide**: `/templates/COMPONENT_CREATION_GUIDE.md`

## 📚 Additional Documentation

### Framework-Specific Guides
- **React 19 Patterns**: `/packages/adapters/react/REACT19-PATTERNS.md`
- **Vue 3.5+ Patterns**: `/packages/adapters/vue/VUE3-PATTERNS.md`
- **Svelte 5 Patterns**: `/packages/adapters/svelte/SVELTE5-PATTERNS.md`
- **TypeScript 5.7+ Config**: `/TYPESCRIPT-CONFIG.md`

These guides provide:
- Latest syntax and best practices
- Migration guides from older versions
- Integration examples with StellarIX
- Performance optimization tips

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
git status              # Check uncommitted changes
pnpm test               # Verify current state is stable
```

### Progress Documentation Requirements
1. **Before Starting Work**: Use `TodoWrite` to create tasks for what you'll implement
2. **During Work**: Update todos with `in_progress` status
3. **After Completing Feature**: 
   - Mark todo as `completed`
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
  6. CONTINUE to next task batch (NO user input needed)

# Only stop for:
- Build failures that can't be resolved
- Architecture decisions requiring user input
- All 45 tasks completed
```

### Current Work Location Tracking
- **Active Tasks**: Check `TodoRead` output
- **What's Built**: Check `packages/primitives/*/src/` directories
- **What's Tested**: Look for `*.test.ts` files and run `pnpm test:coverage`

### Implementation Priority Order
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