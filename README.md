<p align="center">
  <img src="stelariX_Logo.png" alt="StellarIX UI Logo" width="250">
</p>

# StellarIX UI

> A next-generation framework-agnostic headless component library

## Vision

StellarIX UI is a truly framework-agnostic headless component library that decouples UI logic and behavior from presentation while maintaining exceptional developer experience, accessibility, and performance across all modern frontend frameworks.

## Core Features

- **📦 Universal Framework Compatibility**: Native support for React, Vue, Svelte, Solid, QWIK, Angular, and Web Components through a unified core with framework-specific adapters.
- **♿ Zero-Configuration Accessibility**: Every component is WCAG 2.1 AA compliant by default.
- **🎛️ Progressive API Complexity**: Simple, intuitive defaults with the ability to progressively unlock advanced customization.
- **🔄 Framework-Agnostic State Management**: A lightweight, optimized state management system that preserves reactivity across framework boundaries.
- **🎨 Styling-Solution Agnostic**: Complete freedom to use any styling approach (CSS, CSS-in-JS, Tailwind, etc.).
- **🧩 Comprehensive Component Coverage**: A complete set of UI primitives and compound components covering all common UI patterns.
- **🛠️ Developer-Centric Tooling**: Integrated developer tools, intelligent error messaging, and comprehensive documentation.
- **📏 Optimized Bundle Size**: Tree-shakable architecture with micro-bundles for minimal impact on application size.

## Project Status

> ⚠️ **Early Development**: StellarIX UI is currently in the initial planning and development phase. The API is subject to change.

### Current Components

| Component | Status | Description |
|-----------|--------|-------------|
| Button | Available | A flexible button component with multiple variants, sizes, and states |
| Dialog | Planned | A modal dialog with focus management and keyboard navigation |
| Dropdown | Planned | A dropdown menu with multi-level support |
| Tabs | Planned | Accessible tabbed interface |
| Toggle | Planned | Toggle switch component |
| Select | Planned | Customizable select/dropdown component |
| ... | ... | More components coming soon |

## Architecture

StellarIX UI uses a three-layer architecture:

1. **State Layer**: Framework-agnostic reactive state management
2. **Logic Layer**: Behavioral logic, user interactions, and accessibility requirements
3. **Presentation Layer**: Framework-specific rendering and composition

Components are built using a factory pattern that allows connection to any supported framework:

```typescript
// Framework-agnostic component creation
const button = createButton({ /* options */ });

// Framework-specific usage
const ReactButton = button.connect(reactAdapter);
const VueButton = button.connect(vueAdapter);
const SvelteButton = button.connect(svelteAdapter);
```

## Usage Example

### React

```tsx
import { createButton } from '@stellarix/button';
import { reactAdapter } from '@stellarix/react';

// Create a framework-agnostic button
const button = createButton({
  variant: 'primary',
  size: 'md',
  onClick: (e) => console.log('Button clicked!', e)
});

// Connect it to React
const Button = button.connect(reactAdapter);

// Use it in your React component
function MyComponent() {
  return (
    <Button className="my-custom-class">
      Click Me
    </Button>
  );
}
```

## Repository Structure

```
stellariX-ui/
├── packages/
│   ├── core/           # Framework-agnostic core
│   ├── utils/          # Shared utilities
│   ├── adapters/       # Framework adapters
│   │   ├── react/
│   │   ├── vue/
│   │   └── ...
│   ├── primitives/     # UI primitives 
│   │   ├── button/
│   │   ├── dialog/
│   │   └── ...
│   └── components/     # Compound components (upcoming)
├── memory-bank/        # Project tracking and documentation
└── examples/           # Example applications (upcoming)
```

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/stellariX-ui.git
cd stellariX-ui

# Install dependencies
pnpm install

# Start development environment
pnpm dev
```

### Building Components

```bash
# Build all packages
pnpm build

# Build a specific package
pnpm --filter=@stellarix/button build
```

## Roadmap

- [x] Core architecture and state management
- [x] React adapter implementation
- [x] Button component
- [ ] Testing infrastructure and unit tests
- [ ] Dialog component
- [ ] Dropdown component
- [ ] Documentation system
- [ ] Vue and Svelte adapters
- [ ] Additional UI primitives
- [ ] Compound components

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

MIT