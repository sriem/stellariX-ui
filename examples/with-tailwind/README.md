# StellarIX UI + Tailwind CSS Example

This example demonstrates how to use StellarIX UI's headless components with Tailwind CSS for complete styling control.

## 🚀 Features

- Complete Tailwind CSS integration
- State-based styling patterns
- Dark mode support
- Responsive design
- All StellarIX components styled with Tailwind
- Production-ready patterns

## 📋 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Basic knowledge of Tailwind CSS

### Installation

```bash
# Clone the example
git clone https://github.com/stellarix-ui/stellarix-ui.git
cd stellarix-ui/examples/with-tailwind

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🎨 Styling Patterns

### Basic Component Styling

```tsx
import { createButton } from '@stellarix-ui/button';
import { reactAdapter } from '@stellarix-ui/react';

const Button = createButton().connect(reactAdapter);

// Direct Tailwind classes
<Button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
  Click Me
</Button>
```

### State-Based Styling

```tsx
function StateAwareButton({ children, ...props }) {
  const button = createButton(props);
  const [state, setState] = useState(button.state.getState());
  
  useEffect(() => {
    return button.state.subscribe(setState);
  }, []);
  
  const Button = button.connect(reactAdapter);
  
  return (
    <Button 
      className={cn(
        "px-4 py-2 rounded-lg transition-all duration-200",
        state.disabled && "opacity-50 cursor-not-allowed",
        state.loading && "animate-pulse",
        state.pressed && "scale-95",
        state.focused && "ring-2 ring-blue-500 ring-offset-2"
      )}
    >
      {children}
    </Button>
  );
}
```

### Variant System

```tsx
const buttonVariants = {
  variant: {
    default: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
  },
  size: {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-11 px-8 text-lg",
  },
};

function Button({ variant = 'default', size = 'md', className, ...props }) {
  const button = createButton(props);
  const ReactButton = button.connect(reactAdapter);
  
  return (
    <ReactButton
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      {...props}
    />
  );
}
```

## 🌙 Dark Mode

### System Preference Detection

```tsx
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media' for system preference
  // ... rest of config
};

// Component with dark mode
<Button 
  className={cn(
    "bg-white text-gray-900 hover:bg-gray-100",
    "dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
  )}
>
  Adaptive Button
</Button>
```

### Theme Toggle

```tsx
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  
  const toggle = createToggle({
    checked: isDark,
    onChange: setIsDark
  });
  
  const Toggle = toggle.connect(reactAdapter);
  
  return (
    <Toggle 
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full",
        isDark ? "bg-blue-600" : "bg-gray-200"
      )}
    />
  );
}
```

## 📱 Responsive Design

### Mobile-First Approach

```tsx
<Button 
  className={cn(
    // Mobile (default)
    "px-3 py-2 text-sm",
    // Tablet
    "md:px-4 md:py-2 md:text-base",
    // Desktop
    "lg:px-6 lg:py-3 lg:text-lg",
    // Wide screens
    "xl:px-8 xl:py-4 xl:text-xl"
  )}
>
  Responsive Button
</Button>
```

### Container Queries

```tsx
<div className="@container">
  <Button 
    className={cn(
      "px-2 py-1 text-xs",
      "@sm:px-3 @sm:py-2 @sm:text-sm",
      "@md:px-4 @md:py-2 @md:text-base",
      "@lg:px-6 @lg:py-3 @lg:text-lg"
    )}
  >
    Container Query Button
  </Button>
</div>
```

## 🧩 Component Examples

### Input with Validation States

```tsx
function ValidatedInput({ error, ...props }) {
  const input = createInput(props);
  const Input = input.connect(reactAdapter);
  
  return (
    <div>
      <Input 
        className={cn(
          "w-full px-3 py-2 border rounded-md",
          "focus:outline-none focus:ring-2",
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        )}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
```

### Dialog with Backdrop Blur

```tsx
function Modal({ isOpen, onClose, children }) {
  const dialog = createDialog({
    open: isOpen,
    onOpenChange: onClose
  });
  
  const Dialog = dialog.connect(reactAdapter);
  
  return (
    <Dialog
      backdropClassName="fixed inset-0 bg-black/50 backdrop-blur-sm"
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
    >
      {children}
    </Dialog>
  );
}
```

### Select with Custom Options

```tsx
function CustomSelect({ options, ...props }) {
  const select = createSelect(props);
  const Select = select.connect(reactAdapter);
  
  return (
    <Select
      className="relative w-64"
      triggerClassName="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
      contentClassName="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
      optionClassName="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100"
    >
      {options.map(option => (
        <Select.Option key={option.value} value={option.value}>
          <span className="block truncate">{option.label}</span>
        </Select.Option>
      ))}
    </Select>
  );
}
```

## 🎯 Best Practices

### 1. Use Composition

```tsx
// Create your own component library
export const Button = createStyledComponent(createButton, {
  base: "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  variants: buttonVariants,
});

export const Input = createStyledComponent(createInput, {
  base: "w-full rounded-md border px-3 py-2",
  variants: inputVariants,
});
```

### 2. Centralize Tokens

```tsx
// tokens.ts
export const colors = {
  primary: {
    50: 'bg-blue-50',
    500: 'bg-blue-500',
    600: 'bg-blue-600',
  },
  // ... more colors
};

export const spacing = {
  button: {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  },
};
```

### 3. Handle Focus Properly

```tsx
// Always include focus styles for accessibility
className={cn(
  "focus:outline-none",
  "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
)}
```

### 4. Respect Motion Preferences

```tsx
// In your global CSS
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 📚 Resources

- [StellarIX UI Documentation](https://stellarix-ui.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Styling Guide](../../docs/styling-guide.md)
- [Component Examples](./src/components)

## 🤝 Contributing

Found a better pattern? Have suggestions? Please contribute!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT © StellarIX UI