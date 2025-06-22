# Component Input

This input provides the standard structure for creating new StellarIX UI components.
Follow this pattern to ensure consistency and avoid common mistakes.

## Usage

1. Copy this entire input folder to `packages/primitives/[component-name]/`
2. Replace all instances of:
   - `Input` with `YourComponent` (PascalCase)
   - `input` with `yourComponent` (camelCase)
   - `INPUT` with `YOUR_COMPONENT` (SCREAMING_CASE)
3. Update the component-specific logic in each file
4. Add tests following the existing patterns

## Structure

```
packages/primitives/[component-name]/
├── src/
│   ├── index.ts      # Public API exports
│   ├── types.ts      # TypeScript interfaces
│   ├── state.ts      # State management
│   ├── logic.ts      # Business logic
│   ├── state.test.ts # State tests
│   └── logic.test.ts # Logic tests
├── package.json      # Package configuration
├── tsconfig.json     # TypeScript config
├── tsup.config.ts    # Build config
└── vitest.config.ts  # Test config
```

## Important Rules

1. **NO circular dependencies** - Never import components into themselves
2. **NO framework code** - Keep everything framework-agnostic
3. **ALWAYS test with timeout** - Use `timeout 30s pnpm test`
4. **Follow ultra-generic architecture** - Allow any adapter to be added