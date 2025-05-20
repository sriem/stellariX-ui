# StellarIX UI Testing Guide

This document outlines the testing approach for the StellarIX UI component library.

## Testing Philosophy

StellarIX UI follows a comprehensive testing strategy that focuses on:

1. **Framework Agnosticism**: Testing components at each architectural layer, independent of framework
2. **Accessibility**: Ensuring components meet WCAG 2.1 AA standards
3. **Cross-Framework Compatibility**: Verifying consistent behavior across supported frameworks
4. **Developer Experience**: Creating helpful error messages and clear testing utilities

## Test Types

### 1. Unit Tests

Unit tests focus on testing individual functions and classes in isolation. For StellarIX UI, we have unit tests for:

- **State Layer**: Testing state creation, updates, and reactivity
- **Logic Layer**: Testing behavior logic and DOM interaction utilities
- **Utils**: Testing shared utility functions

### 2. Component Tests

Component tests verify that components render and function correctly within a specific framework:

- **Rendering**: Testing that components render correctly with different props
- **Events**: Testing event handling and callbacks
- **Accessibility**: Testing keyboard navigation and screen reader compatibility
- **Styling**: Testing that style props are applied correctly

### 3. Integration Tests

Integration tests verify that different parts of the system work together:

- **Framework Adapters**: Testing that state/logic layers connect properly with framework adapters
- **Component Composition**: Testing that components can be composed together
- **Real-world Usage**: Testing components in realistic usage scenarios

### 4. Accessibility Tests

Accessibility tests ensure that components meet accessibility standards:

- **WCAG Compliance**: Testing against WCAG 2.1 AA guidelines
- **Screen Reader Testing**: Testing with screen reader compatibility
- **Keyboard Navigation**: Testing keyboard navigation and focus management
- **Color Contrast**: Testing color contrast ratios

## Testing Tools

StellarIX UI uses the following testing tools:

- **Vitest**: Test runner for unit and component tests
- **Testing Library**: Utilities for testing components from a user perspective
- **jest-axe**: Accessibility testing for automated a11y checks
- **JSDOM**: Simulated browser environment for testing

## Test Structure

Each package in the monorepo follows a consistent test structure:

```
packages/
  primitives/
    button/
      src/
        state.ts
        state.test.ts  // Unit tests for state
        logic.ts
        logic.test.ts  // Unit tests for logic
      test/
        button-react.test.tsx  // Framework-specific tests
        button-a11y.test.tsx   // Accessibility tests
  adapters/
    react/
      src/
        adapter.ts
        adapter.test.tsx  // Adapter-specific tests
```

## Writing Tests

### Unit Test Example

```typescript
// Testing state management
import { createButtonState } from './state';

describe('Button State', () => {
  it('should initialize with default values', () => {
    const state = createButtonState({});
    expect(state.disabled).toBe(false);
    expect(state.loading).toBe(false);
  });
});
```

### Component Test Example

```tsx
// Testing React component
import { render, screen } from '@testing-library/react';
import { createButton } from '../src';
import { reactAdapter } from '@stellarix/react';

describe('Button Component', () => {
  it('should render correctly', () => {
    const button = createButton({});
    const Button = button.connect(reactAdapter);
    
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

### Accessibility Test Example

```tsx
// Testing accessibility
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { createButton } from '../src';
import { reactAdapter } from '@stellarix/react';

describe('Button Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const button = createButton({});
    const Button = button.connect(reactAdapter);
    
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Running Tests

To run tests for the entire project:

```bash
pnpm test
```

To run tests for a specific package:

```bash
pnpm --filter=@stellarix/button test
```

To run tests in watch mode:

```bash
pnpm test:watch
```

To run tests with coverage:

```bash
pnpm test:coverage
```

## Test Coverage Goals

StellarIX UI aims for high test coverage:

- **Core packages**: 90%+ coverage
- **Framework adapters**: 85%+ coverage
- **UI primitives**: 80%+ coverage
- **Compound components**: 75%+ coverage

## Continuous Integration

All tests run on every pull request and before every release to ensure quality and prevent regressions. 