<p align="center">
  <img src="assets/stelariX_Logo.png" alt="StellarIX UI Logo" width="250">
</p>

# StellarIX UI

> **The DX-First Framework-Agnostic Headless Component Library** 🚀

<p align="center">
  <strong>47% Complete</strong> • 14/30 Components Implemented • 348 Tests Passing ✅
</p>

## What Makes StellarIX Different?

StellarIX UI isn't just another headless component library. It's a **developer experience revolution** that prioritizes your happiness while delivering true framework independence through an ultra-generic three-layer architecture.

### 🎯 DX-First Philosophy

**Developer Experience is our #1 priority**. Every decision optimizes for:

- **⌨️ Minimal Typing**: Use `sx` prefix (75% shorter!) - `sx-button` not `stellarix-button`
- **🚀 Zero Config**: Components work instantly with sensible defaults
- **🧠 Intuitive APIs**: If you need docs for basic usage, we've failed
- **⚡ Fast Feedback**: Instant hot-reload, clear errors, visual testing

### 🏗️ Ultra-Generic Architecture

Unlike other "headless" libraries with framework bias, StellarIX uses a **pure three-layer architecture**:

1. **State Layer**: Framework-agnostic reactive state management
2. **Logic Layer**: Pure business logic, completely separated from UI
3. **Presentation Layer**: Framework adapters without touching core code

### ✨ Key Features

- **🌍 True Framework Independence**: Same component works in React 19, Vue 3.5+, Svelte 5, and more
- **♿ WCAG 2.2 AA Accessibility**: Built-in, tested, and guaranteed
- **🎨 Beautiful Themes**: Ships with Stellar (glassmorphism), Aurora (nordic), and Nebula (neon) themes
- **📦 Tiny Bundle Size**: Tree-shakable, optimized for production
- **🧪 Test-Driven**: 348 tests passing, mandatory testing workflow
- **📚 Template System**: Consistent, evolving patterns across all components
- **🤖 AI-Friendly**: Memory bank system for perfect context awareness

## 📊 Project Status

<p align="center">
  <strong>Active Development</strong> • API Stabilizing • Production-Ready Components Available
</p>

### ✅ Implemented Components (14/30)

#### 🏗️ Foundation Components (100% Complete)
| Component | Tests | Description |
|-----------|-------|-------------|
| **Button** | 18/18 ✅ | Flexible button with variants, sizes, loading states |
| **Container** | 19/19 ✅ | Layout container with responsive behavior |
| **Divider** | 20/20 ✅ | Visual separator with multiple orientations |
| **Spinner** | 18/18 ✅ | Loading spinner with size variants |
| **Input** | 44/44 ✅ | Text input with validation, error states |
| **Checkbox** | 30/30 ✅ | Checkbox with indeterminate state |
| **Radio** | 29/29 ✅ | Radio button with group support |

#### 🎨 Core Components (50% Complete)
| Component | Tests | Description |
|-----------|-------|-------------|
| **Toggle** | 20/20 ✅ | Switch toggle with smooth animations |
| **Alert** | 25/25 ✅ | Alert messages with severity levels |
| **Badge** | 22/22 ✅ | Status badges with variants |
| **Avatar** | 22/22 ✅ | User avatars with image/initial support |
| **Card** | 24/24 ✅ | Content card with sections |
| **Textarea** | 24/24 ✅ | Auto-growing text area |
| **Popover** | 33/33 ✅ | Floating content with positioning |

### 🚧 In Development
Dialog, Tooltip, Menu, Tabs, Select, Accordion, ProgressBar, and 9 more components...

## 🆚 Comparison with Other Libraries

| Feature | StellarIX UI | Headless UI | Radix UI | Arco Design |
|---------|--------------|-------------|----------|-------------|
| **True Framework Agnostic** | ✅ All frameworks | ❌ React/Vue only | ❌ React only | ❌ React/Vue split |
| **DX-First Philosophy** | ✅ sx prefix, zero config | ⚠️ Verbose naming | ⚠️ Complex setup | ⚠️ Heavy config |
| **State Management** | ✅ Universal reactive | ❌ Framework-specific | ❌ React hooks | ❌ Framework-tied |
| **Component Factory** | ✅ Single source | ❌ Separate codebases | ❌ React only | ❌ Duplicated logic |
| **Latest Framework Support** | ✅ React 19, Vue 3.5+, Svelte 5 | ⚠️ Older versions | ⚠️ React 18 | ⚠️ Behind latest |
| **Built-in Themes** | ✅ 3 beautiful themes | ❌ None | ❌ None | ✅ Single theme |
| **Template System** | ✅ Evolving patterns | ❌ Manual | ❌ Manual | ❌ Manual |
| **Bundle Size** | ✅ Ultra-optimized | ✅ Good | ✅ Good | ❌ Large |

### Why Choose StellarIX?

1. **Write Once, Use Everywhere**: True framework independence means no duplicate implementations
2. **Future-Proof**: Add new framework support without changing core code
3. **Developer Joy**: Designed for happiness with minimal typing and instant feedback
4. **Production-Ready**: 348 tests, WCAG 2.2 AA compliance, and battle-tested patterns

## 🏗️ Architecture Deep Dive

### The Component Factory Pattern

```typescript
// 1. Create a framework-agnostic component
const button = createButton({
  variant: 'primary',
  size: 'md'
});

// 2. Connect to ANY framework
const ReactButton = button.connect(reactAdapter);    // React 19 with latest features
const VueButton = button.connect(vueAdapter);        // Vue 3.5+ Composition API
const SvelteButton = button.connect(svelteAdapter);  // Svelte 5 Runes

// 3. Use with framework-specific features
// React 19
function App() {
  const [data, submitAction, isPending] = useActionState(serverAction);
  return <ReactButton disabled={isPending}>Submit</ReactButton>;
}

// Vue 3.5+
<template>
  <VueButton :disabled="isPending">Submit</VueButton>
</template>

// Svelte 5
<SvelteButton disabled={$isPending}>Submit</SvelteButton>
```

### LogicLayerBuilder Pattern

Every component uses our declarative logic pattern:

```typescript
export function createButtonLogic(state, options) {
  return new LogicLayerBuilder()
    .onEvent('click', (currentState, payload) => {
      if (currentState.disabled) return null;
      state.setActive(true);
      options.onClick?.(payload);
      return 'activate';
    })
    .withA11y('root', (state) => ({
      'role': 'button',
      'aria-disabled': state.disabled,
      'aria-busy': state.loading
    }))
    .withInteraction('root', 'onClick', (currentState, event) => {
      if (currentState.disabled || currentState.loading) {
        event.preventDefault();
        return null;
      }
      return 'click';
    })
    .build();
}
```

## 🚀 Quick Start

### Installation

```bash
# npm
npm install @stellarix/core @stellarix/button @stellarix/react

# pnpm
pnpm add @stellarix/core @stellarix/button @stellarix/react

# yarn
yarn add @stellarix/core @stellarix/button @stellarix/react
```

### Basic Usage

```tsx
import { createButton } from '@stellarix/button';
import { reactAdapter } from '@stellarix/react';

// Create and connect
const Button = createButton().connect(reactAdapter);

// Use it!
function App() {
  return (
    <Button 
      variant="primary" 
      size="md"
      onClick={() => alert('Hello StellarIX!')}
    >
      Click Me
    </Button>
  );
}
```

### With Options

```tsx
// Configure once, use everywhere
const button = createButton({
  variant: 'primary',
  size: 'lg',
  ripple: true,
  hapticFeedback: true
});

// Different frameworks, same component
const ReactButton = button.connect(reactAdapter);
const VueButton = button.connect(vueAdapter);
const SvelteButton = button.connect(svelteAdapter);
```

### Theme Usage

```tsx
import { ThemeProvider, themes } from '@stellarix/themes';

function App() {
  return (
    <ThemeProvider theme={themes.stellar}>
      <Button>Glassmorphism Beauty</Button>
    </ThemeProvider>
  );
}

// Or use CSS variables directly
<style>
  .my-button {
    background: var(--sx-color-primary);
    padding: var(--sx-spacing-4);
    border-radius: var(--sx-radius-md);
  }
</style>
```

## 📁 Repository Structure

```
stellariX-ui/
├── packages/
│   ├── core/              # Framework-agnostic core (state, logic systems)
│   ├── utils/             # Shared utilities (a11y, DOM helpers)
│   ├── themes/            # Theme system with 3 built-in themes
│   ├── adapters/          # Framework adapters
│   │   ├── react/         # React 19 adapter with latest features
│   │   ├── vue/           # Vue 3.5+ Composition API (coming soon)
│   │   ├── svelte/        # Svelte 5 Runes (coming soon)
│   │   └── ...           # More frameworks
│   ├── primitives/        # UI primitives (14 implemented, 16 more coming)
│   │   ├── button/        # ✅ Complete with tests
│   │   ├── input/         # ✅ Complete with tests
│   │   ├── checkbox/      # ✅ Complete with tests
│   │   └── ...           # 27 more components
│   └── components/        # Compound components (Phase 2)
├── memory-bank/           # AI-friendly documentation system
├── templates/             # Component templates for consistency
├── examples/              # Framework-specific examples
└── apps/                  # Demo applications
    └── storybook/         # Component showcase
```

## 🛠️ Development

### Prerequisites

- Node.js 20+ (for latest features)
- pnpm 9+ (for workspace support)
- TypeScript 5.7+ knowledge

### Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/stellariX-ui.git
cd stellariX-ui

# Install dependencies
pnpm install

# Start development
pnpm dev

# Run Storybook
pnpm storybook

# Run tests (mandatory before commit!)
pnpm test
pnpm lint
pnpm typecheck
```

### Development Workflow

```bash
# 1. Create a new component from template
cp -r templates/component-template packages/primitives/new-component

# 2. Implement with TDD
pnpm test:watch

# 3. Create Storybook story
pnpm storybook

# 4. Verify everything passes
pnpm test && pnpm lint && pnpm typecheck

# 5. Commit with conventional commits
git commit -m "feat: implement new-component with full test coverage"
```

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (Complete)
- [x] Ultra-generic three-layer architecture
- [x] State management system
- [x] Logic layer with builder pattern
- [x] React adapter with React 19 support
- [x] 7/7 foundation components
- [x] 7/14 core components
- [x] 348 tests passing

### 🚧 Phase 2: Core Components (In Progress)
- [ ] Remaining 7 core components (Dialog, Tooltip, Menu, etc.)
- [ ] Vue 3.5+ adapter
- [ ] Svelte 5 adapter
- [ ] Solid.js adapter
- [ ] Theme customization API
- [ ] Advanced Storybook stories

### 📅 Phase 3: Advanced Features
- [ ] Compound components
- [ ] Form validation system
- [ ] Animation system
- [ ] Advanced accessibility features
- [ ] Performance monitoring
- [ ] Visual regression testing

### 🚀 Phase 4: Ecosystem
- [ ] CLI for component generation
- [ ] VS Code extension
- [ ] Figma plugin
- [ ] Online playground
- [ ] Component marketplace

## 🤝 Contributing

We love contributions! StellarIX UI is built with a strong focus on developer experience, and we extend that to our contributors.

### How to Contribute

1. **Pick a Component**: Check our roadmap and pick an unimplemented component
2. **Use the Template**: Start with `templates/component-template/`
3. **Follow the Guide**: Use `COMPONENT_CREATION_GUIDE.md`
4. **Test Everything**: Aim for 90%+ coverage
5. **Create Stories**: Show all variants in Storybook
6. **Submit PR**: We'll review within 48 hours

### Contribution Philosophy

- **Quality > Quantity**: One well-tested component > three rushed ones
- **Learn from Success**: Study Checkbox and Radio implementations
- **Ask Questions**: Open discussions for architecture decisions
- **Have Fun**: If it's not enjoyable, we're doing it wrong

See our [Contributing Guide](CONTRIBUTING.md) for detailed instructions.

## 📚 Documentation

- **[Component Docs](https://stellarix-ui.dev)** - Interactive component documentation
- **[API Reference](https://stellarix-ui.dev/api)** - Detailed API documentation
- **[Architecture Guide](./memory-bank/architecture.md)** - Deep dive into our design
- **[Memory Bank](./memory-bank/)** - Project context and decisions

## 🏆 Sponsors

StellarIX UI is an MIT-licensed open source project. If you'd like to support the project:

- ⭐ Star this repo
- 🐛 Report bugs
- 💡 Suggest features
- 🤝 Submit PRs
- ☕ [Buy us a coffee](https://github.com/sponsors/stellarix-ui)

## 📄 License

MIT © [StellarIX UI Contributors](https://github.com/stellarix-ui/stellarix-ui/graphs/contributors)

---

<p align="center">
  Built with ❤️ by developers, for developers
</p>

<p align="center">
  <a href="https://stellarix-ui.dev">Website</a> •
  <a href="https://github.com/stellarix-ui/stellarix-ui">GitHub</a> •
  <a href="https://twitter.com/stellarixui">Twitter</a> •
  <a href="https://discord.gg/stellarixui">Discord</a>
</p>