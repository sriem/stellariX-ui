# @stellarix/themes

State-of-the-art theme system for StellarIX UI with beautiful, accessible, and customizable design tokens.

## Installation

```bash
pnpm add @stellarix/themes
```

## Features

- ✅ **6 Premium Themes** - Stellar, Aurora, and Nebula in light/dark variants
- ✅ **State-of-the-Art Design** - Modern shadows, transitions, and visual depth
- ✅ **WCAG 2.2 AA Compliant** - All color combinations meet accessibility standards
- ✅ **CSS Variables Based** - Runtime theme switching with zero JavaScript overhead
- ✅ **Hover State System** - Sophisticated hover colors and effects
- ✅ **TypeScript Support** - Full type safety for theme objects
- ✅ **Framework Agnostic** - Works with any framework or vanilla JS
- ✅ **Optimized Performance** - Efficient CSS generation and minimal bundle size

## Basic Usage

### Import Themes in JavaScript/TypeScript

```typescript
import { themes, injectTheme } from '@stellarix/themes';

// Inject a theme into the document
injectTheme('stellar-light');

// Or inject a custom theme object
injectTheme(themes['stellar-dark']);
```

### Import Pre-built CSS

```css
/* Import all themes */
@import '@stellarix/themes/css';

/* Or import specific themes */
@import '@stellarix/themes/css/stellar-light.css';
@import '@stellarix/themes/css/stellar-dark.css';
```

### HTML Usage

```html
<!-- Link to pre-built CSS -->
<link rel="stylesheet" href="node_modules/@stellarix/themes/css/stellar-light.css">

<!-- Apply theme with data attribute -->
<body data-theme="stellar-light">
  <!-- Your content -->
</body>
```

## Available Themes

### 🌟 Stellar (Default)
**Modern & Professional** - Clean design with sophisticated shadows and refined color palette
- Light: Clean whites with deep blue-grays
- Dark: Rich darkness with vibrant accents
- Perfect for: SaaS, dashboards, professional applications

### 🌌 Aurora
**Soft & Elegant** - Nordic-inspired palette with ethereal shadows and gentle transitions
- Light: Soft pastels with warm undertones
- Dark: Deep Nord nights with luminous accents
- Perfect for: Content sites, blogs, reading applications

### 🌠 Nebula
**Futuristic & Bold** - Cyberpunk aesthetics with neon glows and dramatic contrasts
- Light: Clean canvas with tech-blue accents
- Dark: Deep space with electric neon highlights
- Perfect for: Gaming, tech products, creative applications

## Theme Structure

Each theme provides these design tokens:

```typescript
{
  // Base colors
  background: 'hsl(...)',
  foreground: 'hsl(...)',
  
  // Interactive colors with hover states
  primary: 'hsl(...)',
  primaryForeground: 'hsl(...)',
  primaryHover: 'hsl(...)',
  primaryHoverForeground: 'hsl(...)',
  
  // Semantic colors
  success: 'hsl(...)',
  warning: 'hsl(...)',
  error: 'hsl(...)',
  info: 'hsl(...)',
  
  // UI colors
  card: 'hsl(...)',
  border: 'hsl(...)',
  input: 'hsl(...)',
  
  // Effects
  shadows: { sm, md, lg, xl, glow, glass },
  gradients: { from, via, to },
  glass: { background, border, blur }
}
```

## Advanced Usage

### Theme Switching

```typescript
import { injectTheme, removeTheme } from '@stellarix/themes';

// Switch themes dynamically
function switchTheme(themeName: string) {
  removeTheme(); // Remove current theme
  injectTheme(themeName); // Inject new theme
  document.documentElement.setAttribute('data-theme', themeName);
}

// Example: Theme toggle button
const toggleButton = document.querySelector('#theme-toggle');
toggleButton.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'stellar-light' ? 'stellar-dark' : 'stellar-light';
  switchTheme(newTheme);
});
```

### Custom Theme Creation

```typescript
import { Theme, injectTheme } from '@stellarix/themes';

const myCustomTheme: Theme = {
  name: 'my-custom-theme',
  mode: 'light',
  colors: {
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(222, 84%, 5%)',
    primary: 'hsl(262, 83%, 58%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    // ... rest of colors
  },
  // ... typography, spacing, shadows, etc.
};

injectTheme(myCustomTheme);
```

### CSS Variables Access

All themes expose CSS variables you can use directly:

```css
.my-component {
  background: var(--sx-background);
  color: var(--sx-foreground);
  border: 1px solid var(--sx-border);
  box-shadow: var(--sx-shadow-md);
}

.my-button:hover {
  background: var(--sx-primary-hover);
  color: var(--sx-primary-hover-foreground);
  transform: translateY(-1px);
  box-shadow: var(--sx-shadow-button);
}
```

### React Integration

```tsx
import { ThemeProvider } from '@stellarix/themes/react';

function App() {
  return (
    <ThemeProvider theme="stellar-light">
      <YourComponents />
    </ThemeProvider>
  );
}
```

### Vue Integration

```vue
<template>
  <div :data-theme="currentTheme">
    <slot />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { injectTheme } from '@stellarix/themes'

const currentTheme = ref('stellar-light')

watch(currentTheme, (theme) => {
  injectTheme(theme)
})
</script>
```

## Design Principles

### 1. **Accessibility First**
Every color combination meets WCAG 2.2 AA standards (4.5:1 contrast ratio) ensuring readability for all users.

### 2. **Sophisticated Shadows**
Multi-layered shadows create depth and hierarchy without being heavy or distracting.

### 3. **Smooth Transitions**
Carefully tuned animations using spring easings for natural, responsive interactions.

### 4. **Consistent Hover States**
Every interactive element has proper hover states with appropriate color shifts and effects.

### 5. **Modern Color Science**
Using HSL color space for better color relationships and easier customization.

## Theme Customization

### Extending a Theme

```typescript
import { themes } from '@stellarix/themes';

const myExtendedTheme = {
  ...themes['stellar-light'],
  name: 'my-extended-theme',
  colors: {
    ...themes['stellar-light'].colors,
    primary: 'hsl(280, 80%, 60%)', // Override primary
  }
};
```

### CSS Variable Overrides

```css
:root {
  /* Override specific variables */
  --sx-primary: hsl(280, 80%, 60%);
  --sx-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.2);
}
```

## Performance

- **Minimal Runtime**: ~3KB gzipped for theme engine
- **Tree-shakeable**: Import only what you need
- **CSS Variables**: No JavaScript required for theme application
- **Efficient Updates**: Only changed variables are updated

## Browser Support

- Chrome/Edge 90+ (for HSL color syntax)
- Firefox 90+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for development setup and [CLAUDE.md](./CLAUDE.md) for theme development guidelines.

## License

MIT © StellarIX UI