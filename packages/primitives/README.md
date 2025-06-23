# StellarIX UI Primitives

This directory contains all primitive UI components for the StellarIX framework-agnostic component library.

## 📚 Component Development

**IMPORTANT**: Before creating or modifying any component, read `./CLAUDE.md` for critical development guidelines including:
- State management patterns to prevent infinite loops
- Component creation process using templates
- Testing requirements and patterns
- Reference implementations

## 🧩 Available Components

### ✅ Implemented (Phase 1 - Foundation)
- `button` - Interactive button component
- `checkbox` - Checkbox with indeterminate state support
- `container` - Layout container with responsive variants
- `divider` - Visual separator component
- `input` - Text input with validation
- `radio` - Radio button component
- `spinner` - Loading indicator

### ✅ Implemented (Phase 2 - Core)
- `alert` - Alert/notification component
- `avatar` - User avatar display
- `badge` - Badge/chip component
- `card` - Content card container
- `dialog` - Modal dialog with focus trap
- `menu` - Dropdown menu with keyboard navigation
- `popover` - Floating content container
- `tabs` - Tab navigation component
- `textarea` - Multi-line text input
- `toggle` - Toggle switch component
- `tooltip` - Hover/focus tooltips

### 🚧 Planned (Phase 2 - Core)
- `select` - Dropdown select component
- `accordion` - Collapsible content panels
- `progressbar` - Progress indicator

### 📋 Planned (Phase 3 - Standard)
- `slider` - Range input slider
- `pagination` - Page navigation
- `breadcrumb` - Navigation breadcrumb
- `navigationmenu` - Site navigation
- `stepper` - Multi-step wizard
- `fileupload` - File upload component
- `datepicker` - Date selection
- `table` - Data table
- `calendar` - Calendar display

## 🛠️ Creating a New Component

```bash
# From this directory:
cp -r ../../templates/component-template ./[component-name]
cd [component-name]

# Follow the guide in CLAUDE.md
```

## 🧪 Testing

All components must have:
- 100% test coverage
- Accessibility compliance (WCAG 2.2 AA)
- Storybook stories showing all states
- No circular dependencies or infinite loops

```bash
# Test specific component
pnpm --filter=@stellarix/[component] test

# Build component
pnpm --filter=@stellarix/[component] build
```

## 📖 Documentation

Each component should have:
- TypeScript types in `types.ts`
- State management in `state.ts`
- Business logic in `logic.ts`
- Public API in `index.ts`
- Comprehensive tests
- Storybook stories

See `./CLAUDE.md` for detailed patterns and examples.