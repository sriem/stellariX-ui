# TypeScript 5.7+ Configuration Guide

This document outlines the state-of-the-art TypeScript configuration for StellarIX UI, leveraging the latest TypeScript 5.7+ features.

## 🚀 Core Configuration

### Base tsconfig.json

```json
{
  "compilerOptions": {
    // Target and Module Settings
    "target": "ES2022",                      // Modern JavaScript features
    "lib": ["ES2023", "DOM", "DOM.Iterable"], // Latest ECMAScript + DOM APIs
    "module": "ESNext",                      // ESM modules
    "moduleResolution": "Bundler",           // For Vite, webpack, esbuild, etc.
    
    // Strict Type Checking
    "strict": true,                          // Enable all strict flags
    "exactOptionalPropertyTypes": true,      // Distinguish undefined vs optional
    "noUncheckedIndexedAccess": true,        // Safe array/object access
    "noImplicitOverride": true,              // Explicit override keyword
    "noPropertyAccessFromIndexSignature": true, // Explicit undefined checks
    
    // Module System
    "verbatimModuleSyntax": true,            // Replaces importsNotUsedAsValues
    "isolatedModules": true,                 // For bundler compatibility
    "esModuleInterop": true,                 // CommonJS interop
    "allowSyntheticDefaultImports": true,    // Default imports from CJS
    "resolveJsonModule": true,               // Import JSON files
    
    // Output Control
    "declaration": true,                     // Generate .d.ts files
    "declarationMap": true,                  // Generate .d.ts.map files
    "sourceMap": true,                       // Generate source maps
    "removeComments": false,                 // Keep JSDoc comments
    
    // Development Experience
    "skipLibCheck": true,                    // Skip type checking of .d.ts files
    "forceConsistentCasingInFileNames": true, // Enforce consistent file names
    "allowImportingTsExtensions": true,      // Import .ts files directly
    
    // Path Mapping
    "baseUrl": ".",
    "paths": {
      "@stellarix/core": ["packages/core/src"],
      "@stellarix/core/*": ["packages/core/src/*"],
      "@stellarix/utils": ["packages/utils/src"],
      "@stellarix/utils/*": ["packages/utils/src/*"],
      "@stellarix/primitives/*": ["packages/primitives/*/src"],
      "@stellarix/adapters/*": ["packages/adapters/*/src"],
      "@stellarix/themes": ["packages/themes/src"],
      "@stellarix/themes/*": ["packages/themes/src/*"]
    }
  }
}
```

## 📦 Package-Specific Configurations

### For Core Library Package

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "declarationDir": "./dist",
    
    // Library specific
    "composite": true,                       // For project references
    "incremental": true,                     // Faster builds
    "tsBuildInfoFile": "./dist/.tsbuildinfo" // Build cache
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules", "**/*.test.ts", "**/*.spec.ts"]
}
```

### For Framework Adapter Package

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",                      // For React adapter
    "jsxImportSource": "react",              // For new JSX transform
    
    // Vue adapter would use:
    // "jsx": "preserve",
    // "jsxImportSource": "vue",
    
    "types": ["vite/client", "@types/node"]  // Include ambient types
  },
  "references": [
    { "path": "../../core" },
    { "path": "../../utils" }
  ]
}
```

## 🎯 Key TypeScript 5.7+ Features

### 1. Bundler Module Resolution

```typescript
// With "moduleResolution": "Bundler"
// You can import without extensions (bundler handles it)
import { createState } from './state'
import { Button } from '@stellarix/button'

// Can import TypeScript files directly (development)
import type { ComponentCore } from './types.ts'
```

### 2. verbatimModuleSyntax

```typescript
// ✅ Correct with verbatimModuleSyntax
import type { ComponentCore } from '@stellarix/core'
import { createComponent } from '@stellarix/core'

// Type-only imports are preserved exactly as written
// This helps bundlers with tree-shaking
```

### 3. exactOptionalPropertyTypes

```typescript
interface Props {
  name?: string;  // Can be undefined OR missing
  age: number | undefined;  // Must be present but can be undefined
}

// With exactOptionalPropertyTypes: true
function processProps(props: Props) {
  // TypeScript knows these are different:
  if ('name' in props) {
    // name exists but might be undefined
  }
  
  // age must always be present
  console.log(props.age); // number | undefined
}
```

### 4. noUncheckedIndexedAccess

```typescript
const colors = ['red', 'green', 'blue'];
const color = colors[3]; // Type: string | undefined (not just string)

const config: Record<string, number> = { a: 1, b: 2 };
const value = config['c']; // Type: number | undefined

// Forces explicit checks
if (color !== undefined) {
  console.log(color.toUpperCase()); // Safe!
}
```

### 5. satisfies Operator

```typescript
// Type checking without changing the inferred type
const config = {
  name: 'StellarIX',
  version: '1.0.0',
  features: ['themes', 'a11y', 'typescript']
} satisfies {
  name: string;
  version: string;
  features: string[];
};

// config.features is string[] not readonly string[]
config.features.push('new-feature'); // Allowed!
```

## 🛠️ Utility Types for Component Libraries

### Component Type Definitions

```typescript
// Strict component props with exact types
type ComponentProps<T> = {
  [K in keyof T]-?: T[K] extends undefined 
    ? never 
    : T[K]
} & {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

// Deep readonly for state
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

// Strict event handlers
type EventHandler<E = Event> = (event: E) => void | Promise<void>;

// Framework agnostic component
type FrameworkComponent<P = {}> = {
  (props: P): unknown;
  displayName?: string;
};
```

### Advanced Pattern Types

```typescript
// Discriminated unions for component variants
type ButtonVariant = 
  | { variant: 'primary'; color?: never }
  | { variant: 'secondary'; color?: never }
  | { variant: 'custom'; color: string };

// Template literal types for CSS classes
type Size = 'sm' | 'md' | 'lg';
type Variant = 'primary' | 'secondary';
type ButtonClass = `sx-button--${Size}-${Variant}`;

// Conditional types for props
type InputProps<T extends 'text' | 'number' | 'date'> = {
  type: T;
  value: T extends 'number' ? number : T extends 'date' ? Date : string;
  onChange: (value: InputProps<T>['value']) => void;
};
```

## 📝 TSDoc Standards

```typescript
/**
 * Creates a new StellarIX component instance
 * 
 * @template TState - The component state type
 * @template TLogic - The component logic type
 * 
 * @param options - Component configuration options
 * @param options.initialState - Initial state value
 * @param options.theme - Optional theme configuration
 * @param options.plugins - Optional plugins array
 * 
 * @returns A configured component factory
 * 
 * @example
 * ```typescript
 * const Button = createComponent<ButtonState, ButtonLogic>({
 *   initialState: { pressed: false },
 *   theme: 'dark'
 * });
 * ```
 * 
 * @since 1.0.0
 * @see {@link https://stellarix.dev/docs/api/createComponent}
 */
export function createComponent<TState, TLogic>(
  options: ComponentOptions<TState>
): ComponentFactory<TState, TLogic> {
  // Implementation
}
```

## 🚀 Performance Configurations

### For Build Performance

```json
{
  "compilerOptions": {
    // Incremental compilation
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    
    // Skip lib checking for faster builds
    "skipLibCheck": true,
    
    // Emit only declarations for type packages
    "emitDeclarationOnly": true,
    
    // Use project references
    "composite": true
  },
  
  // Project references for monorepo
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" },
    { "path": "./packages/primitives/button" }
  ]
}
```

### For Type Performance

```typescript
// Use interface instead of type for better performance
interface ComponentState {
  value: string;
  disabled: boolean;
}

// Use const assertions for literals
const SIZES = ['sm', 'md', 'lg'] as const;
type Size = typeof SIZES[number];

// Avoid complex conditional types in hot paths
// ❌ Slow
type ComplexType<T> = T extends string 
  ? T extends `${infer _}` 
    ? string 
    : never 
  : T;

// ✅ Fast
type SimpleType<T> = T extends string ? string : T;
```

## 🔧 IDE Configuration

### VS Code settings.json

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.preferences.importModuleSpecifier": "shortest",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.tsserver.maxTsServerMemory": 4096,
  "typescript.workspaceSymbols.scope": "allOpenProjects"
}
```

## 📚 Common Patterns

### Generic Component Factory

```typescript
export function createComponentFactory<
  TState extends Record<string, any>,
  TOptions extends Record<string, any> = {}
>(
  name: string,
  defaultState: TState
) {
  return function createComponent(options?: TOptions) {
    type MergedState = TState & {
      [K in keyof TOptions]: TOptions[K] extends boolean 
        ? boolean 
        : TOptions[K];
    };
    
    // Component implementation
    return {
      state: { ...defaultState, ...options } as MergedState,
      name
    };
  };
}
```

### Strict Event System

```typescript
type EventMap = {
  change: { value: string };
  focus: { target: HTMLElement };
  blur: { target: HTMLElement };
};

type EventHandler<K extends keyof EventMap> = (
  event: EventMap[K]
) => void | Promise<void>;

class TypedEventEmitter<T extends Record<string, any>> {
  private handlers = new Map<keyof T, Set<Function>>();
  
  on<K extends keyof T>(
    event: K,
    handler: (data: T[K]) => void
  ): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }
  
  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.handlers.get(event)?.forEach(handler => handler(data));
  }
}
```

## 🔗 Resources

- [TypeScript 5.7 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Strict TypeScript](https://www.typescriptlang.org/tsconfig#strict)
- [Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)