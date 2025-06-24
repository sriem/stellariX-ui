# Theme Development Guide

This file provides comprehensive guidance for creating and maintaining state-of-the-art themes in the StellarIX UI library.

## 🚨 CRITICAL: Accessibility & Contrast Requirements

**EVERY color combination MUST meet WCAG 2.2 AA standards**. This is non-negotiable for accessibility.

### Minimum Contrast Ratios
- **Normal text**: 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): 3:1 contrast ratio
- **UI components & graphics**: 3:1 contrast ratio
- **Hover/focus states**: Must maintain required contrast ratios

### 🚫 Common Contrast Failures to Avoid
1. **White text on light backgrounds** - NEVER use white (#ffffff) on light colors
2. **Dark text on dark backgrounds** - NEVER use dark colors on dark backgrounds
3. **Low-contrast hover states** - Hover states must maintain readability
4. **Neon colors with wrong foregrounds** - Bright colors often need white text, not black

## 📋 Theme Structure Requirements

Every theme MUST include these color definitions:

```typescript
interface ThemeColors {
  // Base colors
  background: string;
  foreground: string;
  
  // Component colors
  card: string;
  cardForeground: string;
  
  // Interactive colors WITH hover states
  primary: string;
  primaryForeground: string;
  primaryHover: string;          // REQUIRED for proper hover states
  primaryHoverForeground: string; // REQUIRED for contrast on hover
  
  secondary: string;
  secondaryForeground: string;
  secondaryHover: string;
  secondaryHoverForeground: string;
  
  // Semantic colors WITH hover states
  destructive: string;
  destructiveForeground: string;
  destructiveHover: string;
  destructiveHoverForeground: string;
  
  success: string;
  successForeground: string;
  successHover: string;
  successHoverForeground: string;
  
  warning: string;
  warningForeground: string;
  warningHover: string;
  warningHoverForeground: string;
  
  info: string;
  infoForeground: string;
  infoHover: string;
  infoHoverForeground: string;
  
  // UI colors
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
}
```

## 🎨 Color Selection Best Practices

### 1. Start with Base Colors
- **Light theme**: White/near-white background (#ffffff, #fafafa) with dark foreground (#0f172a, #1a1a2e)
- **Dark theme**: Dark background (#0f172a, #1a1a2e) with light foreground (#f8fafc, #e0e0ff)

### 2. Interactive Color Guidelines
- **Primary**: Your main brand color - ensure it works on both light and dark backgrounds
- **Secondary**: Complementary color - should harmonize with primary
- **Hover states**: Typically 10-20% darker/lighter than base color
- **Always test**: Check contrast for BOTH base and hover states

### 3. Semantic Color Rules
- **Success**: Green tones (#10b981, #00b874) - avoid very bright greens
- **Warning**: Amber/yellow tones (#f59e0b, #ffb700) - be careful with contrast
- **Error/Destructive**: Red tones (#ef4444, #e63946) - ensure sufficient contrast
- **Info**: Blue tones (#3b82f6, #0090cc) - avoid very light blues

### 4. Hover State Calculations
```typescript
// Good hover state examples:
primary: '#6366f1'      → primaryHover: '#4f46e5' (darker)
success: '#10b981'      → successHover: '#059669' (darker)
warning: '#f59e0b'      → warningHover: '#d97706' (darker)

// For dark themes, consider going lighter:
primary: '#818cf8'      → primaryHover: '#6366f1' (lighter/more saturated)
```

## 🧪 Testing Your Theme

### 1. Contrast Testing Tools
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Chrome DevTools**: Built-in contrast ratio checker
- **axe DevTools**: Browser extension for accessibility testing

### 2. Manual Testing Checklist
- [ ] All text is readable on its background
- [ ] Hover states maintain contrast
- [ ] Disabled states are visually distinct but still readable
- [ ] Focus indicators are clearly visible
- [ ] No color combinations cause eye strain

### 3. Component Testing
Test your theme with ALL components:
- Buttons (all variants: primary, secondary, outline, ghost, danger)
- Form inputs (normal, focused, disabled, error states)
- Cards and containers
- Badges and alerts
- All interactive elements

## 📝 Theme Template

Use this template when creating a new theme:

```typescript
export const myThemeLight: Theme = {
  name: 'my-theme-light',
  mode: 'light',
  colors: {
    // Base colors
    background: '#ffffff',
    foreground: '#0f172a', // Dark text on light background
    
    // Component colors
    card: '#ffffff',
    cardForeground: '#0f172a',
    
    // Interactive colors - ensure all have hover states
    primary: '#[your-color]',
    primaryForeground: '#ffffff', // or '#0f172a' depending on contrast
    primaryHover: '#[darker-shade]',
    primaryHoverForeground: '#ffffff',
    
    // ... rest of colors with hover states
  },
  // ... typography, spacing, etc.
};

export const myThemeDark: Theme = {
  ...myThemeLight,
  name: 'my-theme-dark',
  mode: 'dark',
  colors: {
    // Invert base colors
    background: '#0f172a',
    foreground: '#f8fafc', // Light text on dark background
    
    // Adjust all colors for dark mode
    // ... ensure all combinations meet contrast requirements
  },
};
```

## ❌ Common Mistakes to Avoid

1. **Missing Hover Colors**
   ```typescript
   // ❌ BAD - Missing hover states
   primary: '#6366f1',
   primaryForeground: '#ffffff',
   
   // ✅ GOOD - Includes hover states
   primary: '#6366f1',
   primaryForeground: '#ffffff',
   primaryHover: '#4f46e5',
   primaryHoverForeground: '#ffffff',
   ```

2. **Poor Contrast Choices**
   ```typescript
   // ❌ BAD - Light text on light background
   warning: '#fbbf24',
   warningForeground: '#fef3c7',
   
   // ✅ GOOD - Dark text on light background
   warning: '#fbbf24',
   warningForeground: '#78350f',
   ```

3. **Inconsistent Hover Behavior**
   ```typescript
   // ❌ BAD - Hover makes text unreadable
   accent: '#f1f5f9',
   accentForeground: '#0f172a',
   // No hover colors defined, component might use white background
   
   // ✅ GOOD - Hover states defined
   accent: '#f1f5f9',
   accentForeground: '#0f172a',
   accentHover: '#e2e8f0',
   accentHoverForeground: '#0f172a',
   ```

## 🔄 Updating Existing Themes

When updating themes:
1. Run contrast tests on ALL color combinations
2. Test in Storybook with the theme showcase
3. Verify hover states work correctly
4. Check both light and dark modes
5. Test with actual users if possible

## 📊 Contrast Quick Reference

| Background | Foreground | Use Case | Min Ratio |
|------------|------------|----------|-----------|
| White (#fff) | Dark (#0f172a) | Body text | 4.5:1 ✅ |
| Primary (#6366f1) | White (#fff) | Button text | 4.5:1 ✅ |
| Warning (#f59e0b) | White (#fff) | Alert text | 3.1:1 ⚠️ |
| Warning (#f59e0b) | Dark (#78350f) | Alert text | 4.5:1 ✅ |
| Success (#06ffa5) | Black (#000) | Badge text | 2.1:1 ❌ |
| Success (#00b874) | White (#fff) | Badge text | 4.5:1 ✅ |

## 🎨 State-of-the-Art Theme Design Principles

### 1. **Use HSL Color Format**
HSL provides better color relationships and easier adjustments:
```typescript
// ✅ GOOD - HSL format
primary: 'hsl(237.7, 85.6%, 67.5%)',

// ❌ AVOID - Hex format (harder to adjust)
primary: '#6366f1',
```

## 🚨🚨🚨 ABSOLUTE RULE: NO INLINE COMMENTS

**THIS IS A ZERO-TOLERANCE RULE**: Absolutely NO inline comments are allowed in ANY file within the themes package!

### ❌❌❌ COMPLETELY FORBIDDEN:
```typescript
// The following are ALL violations:
primary: 'hsl(237.7, 85.6%, 62%)', // Darkened for 4.5:1 contrast ❌
success: '#059669', // WCAG AA compliant ❌
background: '#ffffff', // Pure white background ❌
// TODO: Add more color variations ❌
// NOTE: This follows Material Design ❌
// Updated for better contrast ❌
```

### ✅✅✅ ONLY ALLOWED:
```typescript
// Clean code with NO comments:
primary: 'hsl(237.7, 85.6%, 62%)',
success: '#059669',
background: '#ffffff',

// JSDoc for PUBLIC APIs only:
/**
 * Creates a theme configuration
 * @param options - Theme options
 * @returns Theme object
 */
export function createTheme(options) { ... }
```

**ZERO inline comments** - No exceptions, no "temporary" comments!

### Code Style for Themes
- NO inline comments explaining color adjustments
- NO implementation notes in theme files
- Document color decisions in PR/commit messages
- Keep theme files clean and readable

### 2. **Sophisticated Shadow System**
Modern themes need layered shadows for depth:
```typescript
shadows: {
  // Base shadows - subtle and layered
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  
  // Component-specific shadows
  card: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
  button: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  dropdown: '0 10px 20px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
}
```

### 3. **Refined Color Palette**
State-of-the-art themes use:
- **Base colors**: Pure whites/blacks with slight temperature
- **Grays**: Blue-tinted grays for sophistication
- **Accents**: Carefully chosen brand colors
- **Semantic**: Accessible yet vibrant

### 4. **Smooth Transitions**
```css
/* Use spring easings for natural motion */
--sx-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Different durations for different actions */
--sx-duration-fast: 150ms;    /* Hover states */
--sx-duration-normal: 300ms;  /* Transitions */
--sx-duration-slow: 500ms;    /* Page transitions */
```

### 5. **Visual Hierarchy**
- **Elevation**: Use shadows to show depth
- **Color contrast**: Guide attention
- **Size & spacing**: Create breathing room
- **Hover states**: Provide clear feedback

## 🏆 Premium Theme Characteristics

### What Makes a Theme "State-of-the-Art"

1. **Subtle Background Variations**
   ```typescript
   // Instead of pure white
   background: 'hsl(0, 0%, 98%)',  // Slight off-white
   card: 'hsl(0, 0%, 100%)',       // Pure white for contrast
   ```

2. **Multi-layered Shadows**
   ```css
   /* Combine multiple shadows for realism */
   box-shadow: 
     0 2px 4px -1px rgb(0 0 0 / 0.06),
     0 2px 2px -2px rgb(0 0 0 / 0.04);
   ```

3. **Glass Morphism Effects**
   ```typescript
   glass: {
     background: 'rgba(255, 255, 255, 0.9)',
     border: 'rgba(255, 255, 255, 0.2)',
     blur: '12px',
   }
   ```

4. **Thoughtful Hover States**
   - Slight color shift (not just opacity)
   - Subtle elevation change
   - Smooth transitions
   - Clear visual feedback

## 🚀 Theme Development Workflow

1. **Research & Inspiration**
   - Study leading design systems (shadcn/ui, Radix, Material)
   - Understand the brand/purpose
   - Create mood boards

2. **Color Science**
   - Start with HSL base colors
   - Calculate harmonious relationships
   - Test all combinations for contrast

3. **Shadow Engineering**
   - Layer multiple shadows
   - Use rgb() with opacity for better blending
   - Test on different backgrounds

4. **Interactive States**
   - Define all hover/active/focus states
   - Ensure smooth transitions
   - Add micro-interactions

5. **Testing & Refinement**
   - Test in Storybook showcase
   - Check all components
   - Verify accessibility
   - Get user feedback

6. **Performance**
   - Use CSS variables efficiently
   - Minimize redundancy
   - Optimize for runtime switching

## 📐 Technical Implementation

### CSS Variable Naming
```css
/* Color variables */
--sx-primary: hsl(237.7, 85.6%, 67.5%);
--sx-primary-foreground: hsl(0, 0%, 100%);
--sx-primary-hover: hsl(237.5, 77.8%, 59.6%);

/* Shadow variables */
--sx-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--sx-shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.04);

/* Effect variables */
--sx-blur-sm: 4px;
--sx-blur-md: 8px;
--sx-blur-lg: 12px;
```

### Component-Specific Enhancements
```css
/* Buttons need special attention */
.sx-button {
  transform: translateZ(0); /* Hardware acceleration */
  will-change: transform, box-shadow; /* Optimize for animations */
}

/* Cards benefit from subtle effects */
.sx-card {
  backdrop-filter: blur(var(--sx-blur-sm));
  background: var(--sx-card);
}
```

Remember: **Great themes feel invisible but make everything better**. They enhance the user experience without calling attention to themselves.