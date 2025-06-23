# StellarIX UI Styling Guide

> **Complete Styling Freedom with Zero Compromises** 🎨

StellarIX UI's headless architecture gives you complete control over styling while maintaining all functionality, accessibility, and state management. This guide covers all styling approaches with a focus on modern solutions like Tailwind CSS.

## Table of Contents

- [Core Philosophy](#core-philosophy)
- [Tailwind CSS Integration](#tailwind-css-integration)
- [CSS-in-JS Solutions](#css-in-js-solutions)
- [CSS Modules & Vanilla CSS](#css-modules--vanilla-css)
- [Design Tokens & Theming](#design-tokens--theming)
- [Dark Mode Patterns](#dark-mode-patterns)
- [Responsive Design](#responsive-design)
- [Animation & Transitions](#animation--transitions)
- [Best Practices](#best-practices)

## Core Philosophy

StellarIX UI components are **truly headless**:

- ✅ **No forced styles** - Components ship with zero CSS
- ✅ **No style conflicts** - Your styles are the only styles
- ✅ **Framework agnostic** - Works with any styling solution
- ✅ **State-driven styling** - Style based on component state
- ✅ **Full control** - Override anything, customize everything

## Tailwind CSS Integration

### Basic Usage

StellarIX UI works seamlessly with Tailwind CSS out of the box:

```tsx
import { createButton } from '@stellarix-ui/button';
import { reactAdapter } from '@stellarix-ui/react';

const Button = createButton().connect(reactAdapter);

// Direct className application
<Button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
  Click Me
</Button>
```

### State-Based Styling

Access component state for dynamic Tailwind classes:

```tsx
function MyButton({ children, ...props }) {
  const button = createButton(props);
  const [state, setState] = useState(button.state.getState());
  
  useEffect(() => {
    return button.state.subscribe(setState);
  }, []);
  
  const Button = button.connect(reactAdapter);
  
  return (
    <Button 
      className={cn(
        // Base styles
        "px-4 py-2 font-medium rounded-lg transition-all duration-200",
        
        // State-based styles
        state.disabled && "opacity-50 cursor-not-allowed",
        state.loading && "animate-pulse",
        state.pressed && "scale-95",
        state.focused && "ring-2 ring-blue-500 ring-offset-2",
        
        // Variant styles
        state.variant === 'primary' && "bg-blue-600 text-white hover:bg-blue-700",
        state.variant === 'secondary' && "bg-gray-200 text-gray-900 hover:bg-gray-300",
        state.variant === 'danger' && "bg-red-600 text-white hover:bg-red-700"
      )}
    >
      {state.loading && <Spinner className="mr-2" />}
      {children}
    </Button>
  );
}
```

### Creating a Tailwind Component Library

Build your own component library on top of StellarIX:

```tsx
// components/ui/button.tsx
import { createButton } from '@stellarix-ui/button';
import { reactAdapter } from '@stellarix-ui/react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  },
};

export interface ButtonProps {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  className?: string;
  // ... other props
}

export function Button({ 
  variant = 'default', 
  size = 'default', 
  className,
  ...props 
}: ButtonProps) {
  const button = createButton(props);
  const ReactButton = button.connect(reactAdapter);
  
  return (
    <ReactButton
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      {...props}
    />
  );
}
```

### Advanced Tailwind Patterns

#### 1. Compound Variants with CVA

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonStyles = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
      loading: {
        true: "opacity-50 cursor-wait",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        size: "lg",
        className: "text-base", // Larger text for large default buttons
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function Button({ variant, size, loading, className, ...props }) {
  const button = createButton({ ...props, loading });
  const ReactButton = button.connect(reactAdapter);
  
  return (
    <ReactButton
      className={cn(buttonStyles({ variant, size, loading }), className)}
      {...props}
    />
  );
}
```

#### 2. Dark Mode Support

```tsx
<Button 
  className={cn(
    // Light mode
    "bg-white text-gray-900 border-gray-300",
    // Dark mode
    "dark:bg-gray-800 dark:text-white dark:border-gray-600",
    // Hover states for both
    "hover:bg-gray-50 dark:hover:bg-gray-700"
  )}
/>
```

#### 3. Responsive Design

```tsx
<Button 
  className={cn(
    // Mobile
    "px-3 py-2 text-sm",
    // Tablet
    "md:px-4 md:py-2 md:text-base",
    // Desktop
    "lg:px-6 lg:py-3 lg:text-lg"
  )}
/>
```

## CSS-in-JS Solutions

### Styled Components

```tsx
import styled from 'styled-components';
import { createButton } from '@stellarix-ui/button';
import { reactAdapter } from '@stellarix-ui/react';

const BaseButton = createButton().connect(reactAdapter);

const StyledButton = styled(BaseButton)`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  
  background-color: ${props => props.variant === 'primary' ? '#3b82f6' : '#e5e7eb'};
  color: ${props => props.variant === 'primary' ? 'white' : '#111827'};
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#2563eb' : '#d1d5db'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.$loading && `
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 1rem;
      height: 1rem;
      top: 50%;
      left: 50%;
      margin-left: -0.5rem;
      margin-top: -0.5rem;
      border: 2px solid #f3f3f3;
      border-radius: 50%;
      border-top: 2px solid #3498db;
      animation: spin 1s linear infinite;
    }
  `}
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
```

### Emotion

```tsx
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const buttonStyles = (props: ButtonProps) => css`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  
  ${props.variant === 'primary' && css`
    background-color: #3b82f6;
    color: white;
    
    &:hover {
      background-color: #2563eb;
    }
  `}
  
  ${props.size === 'large' && css`
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  `}
`;

const EmotionButton = styled(BaseButton)<ButtonProps>`
  ${buttonStyles}
`;
```

### Stitches

```tsx
import { styled } from '@stitches/react';

const StitchesButton = styled(BaseButton, {
  // Base styles
  padding: '0.5rem 1rem',
  borderRadius: '0.375rem',
  fontWeight: 500,
  transition: 'all 0.2s',
  
  // Variants
  variants: {
    variant: {
      primary: {
        backgroundColor: '#3b82f6',
        color: 'white',
        '&:hover': {
          backgroundColor: '#2563eb',
        },
      },
      secondary: {
        backgroundColor: '#e5e7eb',
        color: '#111827',
        '&:hover': {
          backgroundColor: '#d1d5db',
        },
      },
    },
    size: {
      small: {
        padding: '0.25rem 0.75rem',
        fontSize: '0.875rem',
      },
      large: {
        padding: '0.75rem 1.5rem',
        fontSize: '1.125rem',
      },
    },
  },
  
  // Compound variants
  compoundVariants: [
    {
      variant: 'primary',
      size: 'large',
      css: {
        fontSize: '1.25rem',
      },
    },
  ],
  
  // Default variants
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});
```

## CSS Modules & Vanilla CSS

### CSS Modules

```tsx
// Button.module.css
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.primary {
  background-color: #3b82f6;
  color: white;
}

.primary:hover {
  background-color: #2563eb;
}

.secondary {
  background-color: #e5e7eb;
  color: #111827;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  position: relative;
  color: transparent;
}

// Button.tsx
import styles from './Button.module.css';

function Button({ variant = 'primary', disabled, loading, ...props }) {
  const button = createButton({ disabled, loading, ...props });
  const ReactButton = button.connect(reactAdapter);
  
  return (
    <ReactButton
      className={cn(
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        loading && styles.loading
      )}
      {...props}
    />
  );
}
```

### Vanilla CSS with Data Attributes

```css
/* stellarix-theme.css */
[data-sx-button] {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  outline: none;
}

[data-sx-button][data-variant="primary"] {
  background-color: var(--sx-color-primary, #3b82f6);
  color: var(--sx-color-primary-foreground, white);
}

[data-sx-button][data-variant="primary"]:hover {
  background-color: var(--sx-color-primary-hover, #2563eb);
}

[data-sx-button][data-state~="disabled"] {
  opacity: 0.5;
  cursor: not-allowed;
}

[data-sx-button][data-state~="loading"] {
  position: relative;
  color: transparent;
}

[data-sx-button][data-state~="pressed"] {
  transform: scale(0.98);
}
```

```tsx
// Component usage
function Button(props) {
  const button = createButton(props);
  const [state] = useState(button.state.getState());
  const ReactButton = button.connect(reactAdapter);
  
  const dataState = [
    state.disabled && 'disabled',
    state.loading && 'loading',
    state.pressed && 'pressed',
  ].filter(Boolean).join(' ');
  
  return (
    <ReactButton
      data-sx-button
      data-variant={state.variant}
      data-state={dataState}
      {...props}
    />
  );
}
```

## Design Tokens & Theming

### Creating a Design Token System

```tsx
// design-tokens.ts
export const tokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      500: '#6b7280',
      900: '#111827',
    },
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
  },
  radii: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
};

// Using with StellarIX
function Button({ colorScheme = 'primary', ...props }) {
  const button = createButton(props);
  const ReactButton = button.connect(reactAdapter);
  
  return (
    <ReactButton
      style={{
        backgroundColor: tokens.colors[colorScheme][500],
        color: 'white',
        padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
        borderRadius: tokens.radii.md,
        transition: `background-color ${tokens.transitions.base}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = tokens.colors[colorScheme][600];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = tokens.colors[colorScheme][500];
      }}
      {...props}
    />
  );
}
```

### Theme Provider Pattern

```tsx
// theme-context.tsx
const ThemeContext = createContext<Theme>();

export function ThemeProvider({ theme, children }) {
  return (
    <ThemeContext.Provider value={theme}>
      <div className={theme.className} style={theme.cssVars}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Button with theme
function ThemedButton(props) {
  const theme = useTheme();
  const button = createButton(props);
  const ReactButton = button.connect(reactAdapter);
  
  return (
    <ReactButton
      className={cn(
        theme.components.button.base,
        theme.components.button.variants[props.variant]
      )}
      {...props}
    />
  );
}
```

## Dark Mode Patterns

### System Preference Detection

```tsx
function useDarkMode() {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', listener);
    
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);
  
  return isDark;
}

// Usage with StellarIX
function AdaptiveButton(props) {
  const isDark = useDarkMode();
  const button = createButton(props);
  const ReactButton = button.connect(reactAdapter);
  
  return (
    <ReactButton
      className={cn(
        "px-4 py-2 rounded-lg transition-colors",
        isDark 
          ? "bg-gray-800 text-white hover:bg-gray-700" 
          : "bg-white text-gray-900 hover:bg-gray-100"
      )}
      {...props}
    />
  );
}
```

### CSS Variables for Dark Mode

```css
:root {
  --sx-bg-button: #ffffff;
  --sx-text-button: #111827;
  --sx-bg-button-hover: #f3f4f6;
}

[data-theme="dark"] {
  --sx-bg-button: #1f2937;
  --sx-text-button: #f9fafb;
  --sx-bg-button-hover: #374151;
}

.sx-button {
  background-color: var(--sx-bg-button);
  color: var(--sx-text-button);
}

.sx-button:hover {
  background-color: var(--sx-bg-button-hover);
}
```

## Responsive Design

### Container Queries

```css
/* Future-proof with container queries */
.button-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  [data-sx-button] {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

@container (min-width: 600px) {
  [data-sx-button] {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
}
```

### Responsive Component Props

```tsx
function ResponsiveButton(props) {
  const button = createButton(props);
  const ReactButton = button.connect(reactAdapter);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const size = windowWidth < 640 ? 'sm' : windowWidth < 1024 ? 'md' : 'lg';
  
  return (
    <ReactButton
      className={cn(
        "transition-all",
        size === 'sm' && "px-3 py-1.5 text-sm",
        size === 'md' && "px-4 py-2 text-base",
        size === 'lg' && "px-6 py-3 text-lg"
      )}
      {...props}
    />
  );
}
```

## Animation & Transitions

### Framer Motion Integration

```tsx
import { motion } from 'framer-motion';

const MotionButton = motion(createButton().connect(reactAdapter));

function AnimatedButton(props) {
  return (
    <MotionButton
      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    />
  );
}
```

### CSS Animations

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

[data-sx-button][data-state~="loading"] {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

[data-sx-button][data-state~="loading"]::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: inherit;
  animation: spin 0.6s linear infinite;
}
```

## Best Practices

### 1. Component Wrapper Pattern

Create wrapper components for consistent styling:

```tsx
// ui/button.tsx
export const Button = createStyledComponent(
  createButton,
  {
    base: "px-4 py-2 rounded-lg font-medium transition-colors",
    variants: {
      primary: "bg-blue-500 hover:bg-blue-600 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    },
    sizes: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    },
  }
);
```

### 2. Style Composition

Compose styles from multiple sources:

```tsx
function Button({ variant, size, intent, className, ...props }) {
  const styles = useStyles({
    base: buttonStyles.base,
    variant: buttonStyles.variants[variant],
    size: buttonStyles.sizes[size],
    intent: intentStyles[intent],
    custom: className,
  });
  
  return <ReactButton className={styles} {...props} />;
}
```

### 3. Performance Optimization

Memoize style calculations:

```tsx
const useButtonStyles = (variant, size, state) => {
  return useMemo(() => {
    return cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      state.disabled && disabledStyles,
      state.loading && loadingStyles
    );
  }, [variant, size, state.disabled, state.loading]);
};
```

### 4. Accessibility in Styling

Ensure styles don't break accessibility:

```css
/* Good: Visible focus styles */
[data-sx-button]:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Good: Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  [data-sx-button] {
    transition: none;
  }
}

/* Good: Sufficient color contrast */
[data-sx-button][data-variant="primary"] {
  background-color: #2563eb; /* 4.5:1 contrast ratio with white text */
}
```

### 5. Documentation

Document your styling patterns:

```tsx
/**
 * Button component with Tailwind CSS styling
 * 
 * @example
 * // Primary button
 * <Button variant="primary" size="md">Click me</Button>
 * 
 * // Custom styled button
 * <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
 *   Gradient Button
 * </Button>
 * 
 * @example State-based styling
 * <Button 
 *   className={cn(
 *     "base-styles",
 *     isUrgent && "animate-pulse bg-red-500"
 *   )}
 * >
 *   Urgent Action
 * </Button>
 */
```

## Conclusion

StellarIX UI's headless architecture provides the perfect foundation for any styling approach. Whether you prefer utility-first CSS with Tailwind, CSS-in-JS solutions, or traditional CSS, our components adapt to your workflow while maintaining all their functionality and accessibility features.

The key is that **you** are in control - no fighting with built-in styles, no specificity battles, just pure functionality ready for your design vision.