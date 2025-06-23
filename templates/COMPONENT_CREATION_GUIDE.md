# Component Creation Guide

This guide explains how to create new components using the component template.

## Quick Start

1. **Copy the template**:
   ```bash
   cp -r templates/component-template packages/primitives/[component-name]
   cd packages/primitives/[component-name]
   ```

2. **Replace placeholders** (use your editor's find & replace):
   - `Template` → `YourComponent` (PascalCase, e.g., `Input`, `Checkbox`)
   - `template` → `yourComponent` (camelCase, e.g., `input`, `checkbox`)
   - `TEMPLATE` → `YOUR_COMPONENT` (SCREAMING_CASE, e.g., `INPUT`, `CHECKBOX`)

3. **Update package.json**:
   - Change `name` to `@stellarix-ui/[component-name]`
   - Update `description`

4. **Implement component-specific logic**:
   - Update `types.ts` with your component's state and events
   - Update `state.ts` with state management logic
   - Update `logic.ts` with event handlers and interactions
   - Update `index.ts` metadata (role, element type, etc.)

5. **Run tests**:
   ```bash
   timeout 30s pnpm test
   ```

## Component Checklist

- [ ] Types defined in `types.ts`
- [ ] State management in `state.ts`
- [ ] Logic layer in `logic.ts`
- [ ] Metadata updated in `index.ts`
- [ ] All tests passing
- [ ] No circular dependencies
- [ ] No framework-specific code
- [ ] Accessibility props implemented
- [ ] Event handlers working
- [ ] Package builds successfully

## Common Patterns

### Input Components (Input, Textarea)
```typescript
export interface InputState {
    value: string;
    focused: boolean;
    disabled: boolean;
    error?: string;
}
```

### Toggle Components (Checkbox, Radio, Switch)
```typescript
export interface ToggleState {
    checked: boolean;
    focused: boolean;
    disabled: boolean;
    indeterminate?: boolean;
}
```

### Layout Components (Container, Divider)
```typescript
export interface LayoutState {
    variant: 'fluid' | 'fixed' | 'responsive';
    spacing: 'sm' | 'md' | 'lg';
}
```

## Testing Requirements

Every component MUST have:
1. **State tests** (90%+ coverage)
2. **Logic tests** (90%+ coverage)
3. **Integration tests** with React adapter
4. **Accessibility tests** (WCAG 2.1 AA)

## Safety Rules

1. **ALWAYS use timeout** when running tests:
   ```bash
   timeout 30s pnpm test
   ```

2. **NEVER create circular dependencies**:
   - Don't import the component into itself
   - Don't create state→logic→state cycles
   - Don't have hooks calling each other

3. **ALWAYS test incrementally**:
   - Implement one feature at a time
   - Test after each change
   - Commit working code frequently

## Example: Creating an Input Component

```bash
# 1. Copy template
cp -r templates/component-template packages/primitives/input

# 2. Navigate to component
cd packages/primitives/input

# 3. Replace all placeholders (in your editor)
# Template → Input
# template → input
# TEMPLATE → INPUT

# 4. Update package.json name
# "@stellarix-ui/template" → "@stellarix-ui/input"

# 5. Implement Input-specific logic
# - Update types for text input
# - Add value handling in state
# - Add input/change events in logic

# 6. Test
timeout 30s pnpm test

# 7. Build
timeout 30s pnpm build
```

## Troubleshooting

### Tests hanging?
- Check for infinite loops in state subscriptions
- Ensure no circular dependencies
- Use `timeout` command always

### TypeScript errors?
- Run `pnpm typecheck` to see all errors
- Check that all imports use `.js` extension
- Ensure `"type": "module"` in package.json

### Build failing?
- Check tsup.config.ts configuration
- Ensure all dependencies are listed
- Verify no syntax errors