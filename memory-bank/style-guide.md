# StellarIX UI - Code Style Guide

## General Guidelines

- **TypeScript First**: Use TypeScript for all code.
- **Explicit Types**: Prefer explicit type annotations over inferred types.
- **Functional Approach**: Prefer functional programming patterns.
- **Immutability**: Prefer immutable data structures.
- **Pure Functions**: Avoid side effects where possible.

## Formatting

- **Indentation**: 2 spaces
- **Line Length**: 80 characters maximum
- **Semicolons**: Required
- **Quotes**: Single quotes for strings
- **Trailing Commas**: Required in multiline arrays and objects
- **Braces**: Same line for control statements, new line for function/class declarations

Example:
```typescript
// Function declaration with braces on new line
function createButton(options: ButtonOptions) 
{
  // Control statement with braces on same line
  if (options.disabled) {
    return {
      type: 'button',
      props: {
        disabled: true,
        'aria-disabled': 'true',
      },
    };
  }
}
```

## Naming Conventions

- **Files**: kebab-case.ts
- **Directories**: kebab-case
- **Interfaces**: PascalCase with prefix `I` (e.g., `IButtonProps`)
- **Types**: PascalCase (e.g., `ButtonVariant`)
- **Enums**: PascalCase (e.g., `ButtonSize`)
- **Constants**: UPPER_SNAKE_CASE
- **Functions**: camelCase
- **Component factories**: `create` + PascalCase (e.g., `createButton`)
- **Private variables**: camelCase with underscore prefix (e.g., `_privateVar`)

## Component Structure

- **Factory Design Pattern**: All components use factory pattern
- **File Organization**:
  - One component per file
  - Named export for component factory
  - Types in separate file
  - Tests in separate file

Example file structure:
```
button/
├── button.ts           # Component factory
├── button.types.ts     # Component types
├── button.test.ts      # Component tests
└── index.ts            # Re-export
```

## Import/Export Patterns

- **Named Exports**: Prefer named exports over default exports
- **Barrel Exports**: Use index files to re-export components
- **Import Order**:
  1. External dependencies
  2. Internal modules
  3. Types
  4. Styles

Example:
```typescript
// External dependencies
import { useState, useEffect } from 'react';

// Internal modules
import { createState } from '../../core/state';
import { createEvents } from '../../core/events';

// Types
import type { IButtonProps, ButtonVariant } from './button.types';

// Factory function
export function createButton(options: ButtonOptions) {
  // Implementation
}
```

## Comments and Documentation

- **JSDoc Comments**: Required for public APIs
- **Implementation Comments**: Use sparingly to explain complex logic
- **TODO Comments**: Include assignee and issue number

Example:
```typescript
/**
 * Creates a button component with the specified options.
 * 
 * @param options - The options for the button
 * @returns A button component factory
 */
export function createButton(options: ButtonOptions) {
  // TODO(username): Implement focus management (ISSUE-123)
  
  // This is a complex calculation that requires explanation
  const complexValue = calculateComplexValue(options);
  
  return {
    // Implementation
  };
}
```

## Testing Standards

- **Unit Tests**: Required for all components
- **Integration Tests**: Required for compound components
- **Accessibility Tests**: Required for all interactive components
- **Naming Convention**: `describe('Component', () => { it('should do something', () => {}) });`

## Linting and Enforcement

- **ESLint**: Required with strict configuration
- **Prettier**: Required for automatic formatting
- **Commit Hooks**: Required to enforce standards
- **CI Validation**: Required for all pull requests

## Accessibility Guidelines

- All components must be WCAG 2.1 AA compliant
- Support keyboard navigation
- Ensure proper focus management
- Provide appropriate ARIA attributes
- Test with screen readers
- Support high contrast mode
- Ensure touch targets are at least 44x44px

## Performance Guidelines

- Minimize component initialization time (<10ms)
- Optimize for frequent re-renders
- Minimize DOM operations
- Use memoization for expensive calculations
- Ensure tree-shaking compatibility
- Keep bundle size minimal (<10KB gzipped per compound component)

## Testing Guidelines

- Write unit tests for all components
- Test accessibility with automated tools
- Include visual regression tests
- Test across all supported frameworks
- Test SSR and hydration
- Test performance with benchmarks 