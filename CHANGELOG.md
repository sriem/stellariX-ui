# Changelog

All notable changes to StellarIX UI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-23

### Added

#### Core Infrastructure
- **@stellarix/core** (0.1.0) - Framework-agnostic state and logic system
  - Reactive state management with proxy-based subscriptions
  - Event handling system
  - Ultra-generic component factory pattern
- **@stellarix/themes** (0.1.0) - Comprehensive theming system
  - 7 built-in themes (light, dark, midnight, cyberpunk, pastel, forest, sunset)
  - CSS custom properties for all design tokens
  - WCAG AA compliant color contrasts

#### Primitive Components

##### Phase 1 - Foundation (P0)
- **@stellarix/button** (0.1.0) - Interactive button component
  - Variants: primary, secondary, outline, ghost, danger
  - Sizes: sm, md, lg
  - States: loading, disabled
  - Full keyboard navigation
- **@stellarix/container** (0.1.0) - Layout container component
  - Max-width constraints
  - Responsive padding
  - Centered content option
- **@stellarix/divider** (0.1.0) - Visual separator component
  - Horizontal and vertical orientations
  - Customizable spacing and color
- **@stellarix/spinner** (0.1.0) - Loading indicator component
  - Sizes: sm, md, lg
  - Customizable speed and color
- **@stellarix/input** (0.1.0) - Text input component
  - Types: text, email, password, number, tel, url
  - States: error, disabled, readonly
  - Built-in validation
- **@stellarix/checkbox** (0.1.0) - Checkbox input component
  - Indeterminate state support
  - Custom labels
  - Keyboard accessible
- **@stellarix/radio** (0.1.0) - Radio button component
  - Radio group management
  - Keyboard navigation
  - Custom styling

##### Phase 2 - Core (P1)
- **@stellarix/toggle** (0.1.0) - Toggle switch component
  - Smooth animations
  - Customizable colors
  - Accessible labels
- **@stellarix/alert** (0.1.0) - Alert/notification component
  - Types: info, success, warning, error
  - Dismissible option
  - Icon support
- **@stellarix/badge** (0.1.0) - Badge/tag component
  - Variants: primary, secondary, success, warning, error
  - Sizes: sm, md, lg
  - Rounded option
- **@stellarix/avatar** (0.1.0) - Avatar display component
  - Image support with fallback
  - Initial letters fallback
  - Sizes: sm, md, lg, xl
  - Status indicators
- **@stellarix/textarea** (0.1.0) - Multi-line text input
  - Auto-resize option
  - Character counting
  - Min/max rows
- **@stellarix/card** (0.1.0) - Card container component
  - Header, body, footer sections
  - Clickable variant
  - Shadow levels
- **@stellarix/popover** (0.1.0) - Popover/popup component
  - 12 placement options
  - Auto-positioning
  - Click-outside detection
  - Smooth animations
- **@stellarix/tooltip** (0.1.0) - Tooltip component
  - Hover/focus triggers
  - 12 placement options
  - Delay configuration
- **@stellarix/dialog** (0.1.0) - Modal dialog component
  - Focus trap
  - Backdrop click handling
  - Smooth open/close animations
  - Accessible (ARIA compliant)
- **@stellarix/menu** (0.1.0) - Dropdown menu component
  - Keyboard navigation
  - Nested submenus
  - Divider support
  - Icons and shortcuts
- **@stellarix/tabs** (0.1.0) - Tabbed interface component
  - Horizontal/vertical orientations
  - Keyboard navigation
  - Lazy loading support
  - Animated indicators
- **@stellarix/select** (0.1.0) - Select dropdown component
  - Single/multiple selection
  - Search/filter functionality
  - Custom option rendering
  - Keyboard navigation
- **@stellarix/accordion** (0.1.0) - Collapsible accordion component
  - Single/multiple expansion
  - Smooth animations
  - Icon customization
  - Nested accordions
- **@stellarix/progress-bar** (0.1.0) - Progress indicator component
  - Determinate/indeterminate modes
  - Custom colors
  - Label support
  - Animated stripes

### Framework Adapters
- **@stellarix/react** (0.1.0) - React 19 adapter
  - Full hooks integration
  - Ref forwarding
  - Event handling
  - TypeScript support

### Developer Experience
- TypeScript 5.7+ with ultra-strict configuration
- Comprehensive Storybook stories for all components
- 90%+ test coverage for core, 80%+ for components
- WCAG 2.2 AA accessibility compliance
- Zero-config usage with sensible defaults
- Minimal bundle size with tree-shaking support

### Documentation
- Complete API documentation
- Interactive Storybook demos
- Usage examples for all components
- Architecture and contribution guides