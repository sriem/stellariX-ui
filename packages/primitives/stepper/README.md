# @stellarix/stepper

A framework-agnostic stepper component for guiding users through multi-step processes.

## Installation

```bash
npm install @stellarix/stepper @stellarix-ui/core
```

## Features

- 🚀 **Ultra-generic architecture** - Works with React, Vue, Svelte, Solid, Qwik, Angular, and Web Components
- 📍 **Step tracking** - Current, completed, upcoming, and error states
- ✅ **Step validation** - Validate before progression with async support
- 🔄 **Linear and non-linear modes** - Control navigation flow
- 📐 **Horizontal and vertical layouts** - Adapt to your design needs
- 🎯 **Optional and required steps** - Flexible step requirements
- ⚠️ **Error states** - Built-in error handling with messages
- ⌨️ **Full keyboard navigation** - Arrow keys, Home, End support
- ♿ **WCAG 2.1 AA compliant** - Full accessibility support
- 🎨 **Unstyled by default** - Bring your own styles
- 📦 **Tiny bundle** - ~4KB minified + gzipped

## Basic Usage

```typescript
import { createStepper } from '@stellarix/stepper';

// Define your steps
const steps = [
  { id: 'account', label: 'Account Details' },
  { id: 'personal', label: 'Personal Information' },
  { id: 'payment', label: 'Payment Method' },
  { id: 'confirm', label: 'Confirmation' }
];

// Create the stepper
const stepper = createStepper({
  steps,
  onStepChange: (step, previousStep) => {
    console.log(`Changed from step ${previousStep} to ${step}`);
  }
});

// Navigate between steps
await stepper.next(); // Go to next step
await stepper.prev(); // Go to previous step
await stepper.goToStep(2); // Go to specific step
stepper.reset(); // Reset to first step
```

## Framework Integration

### React

```tsx
import { createStepper } from '@stellarix/stepper';
import { reactAdapter } from '@stellarix-ui/react';

function App() {
  const [stepper] = useState(() => createStepper({ steps }));
  const Component = useMemo(() => stepper.connect(reactAdapter), [stepper]);
  
  // Use the component...
}
```

### Vue

```vue
<script setup>
import { createStepper } from '@stellarix/stepper';
import { vueAdapter } from '@stellarix-ui/vue';

const stepper = createStepper({ steps });
const Component = stepper.connect(vueAdapter);
</script>
```

## API Reference

### Options

```typescript
interface StepperOptions {
  // Step definitions
  steps?: StepperStep[];
  
  // Initial active step (default: 0)
  activeStep?: number;
  
  // Disable all interactions (default: false)
  disabled?: boolean;
  
  // Layout orientation (default: 'horizontal')
  orientation?: 'horizontal' | 'vertical';
  
  // Allow jumping to any step (default: false)
  nonLinear?: boolean;
  
  // Show step numbers (default: true)
  showStepNumbers?: boolean;
  
  // Show connecting lines (default: true)
  showConnectors?: boolean;
  
  // Alternative label placement (default: false)
  alternativeLabel?: boolean;
  
  // Callbacks
  onStepChange?: (step: number, previousStep: number) => void;
  onStepValidate?: (step: number, direction: 'next' | 'prev') => boolean | Promise<boolean>;
  onStepClick?: (step: number) => void;
  onComplete?: () => void;
  
  // Accessibility
  ariaLabel?: string; // (default: 'Progress')
}
```

### Step Definition

```typescript
interface StepperStep {
  id: string;              // Unique identifier
  label: string;           // Display label
  description?: string;    // Optional description
  optional?: boolean;      // Mark as optional step
  disabled?: boolean;      // Disable this step
  error?: boolean;         // Show error state
  errorMessage?: string;   // Error message to display
  icon?: string;          // Icon identifier
  metadata?: any;         // Custom metadata
}
```

### Helper Methods

```typescript
// Navigation
await stepper.next();              // Go to next step
await stepper.prev();              // Go to previous step
await stepper.goToStep(index);     // Go to specific step
stepper.reset();                   // Reset to initial state

// State management
stepper.completeStep(index);       // Mark step as completed
stepper.setStepError(index, true, 'Error message');  // Set error state
stepper.getStepStatus(index);      // Get step status
stepper.isStepAccessible(index);   // Check if step is accessible
```

## Advanced Examples

### With Validation

```typescript
const stepper = createStepper({
  steps,
  onStepValidate: async (step, direction) => {
    // Validate current step before moving
    if (step === 1 && direction === 'next') {
      const isValid = await validatePersonalInfo();
      if (!isValid) {
        stepper.setStepError(1, true, 'Please fix the errors');
        return false;
      }
    }
    return true;
  }
});
```

### Non-Linear Mode

```typescript
const stepper = createStepper({
  steps,
  nonLinear: true, // Allow jumping to any step
  onStepClick: (step) => {
    console.log(`Clicked step ${step}`);
  }
});
```

### With Optional Steps

```typescript
const steps = [
  { id: 'required1', label: 'Required Step 1' },
  { id: 'optional', label: 'Optional Step', optional: true },
  { id: 'required2', label: 'Required Step 2' }
];

const stepper = createStepper({ steps });
// Users can skip optional steps
```

### Custom Rendering

The stepper provides complete control over rendering through its state and logic:

```typescript
// Get current state
const state = stepper.state.getState();

// Get A11y props
const rootProps = stepper.logic.getA11yProps('root', state);
const stepProps = stepper.logic.getA11yProps('step', state, { index: 0 });

// Get interaction handlers
const handlers = stepper.logic.getInteractionHandlers('stepButton', state);
```

## Styling

The component is unstyled by default. Use the provided data attributes and classes:

```css
/* Step states */
[data-status="active"] { /* Active step styles */ }
[data-status="completed"] { /* Completed step styles */ }
[data-status="upcoming"] { /* Upcoming step styles */ }
[data-status="error"] { /* Error step styles */ }

/* Optional steps */
[data-optional="true"] { /* Optional step styles */ }

/* Disabled state */
[aria-disabled="true"] { /* Disabled styles */ }
```

## Accessibility

The stepper is fully accessible out of the box:

- Semantic HTML with proper ARIA roles
- Keyboard navigation (Arrow keys, Home, End, Enter, Space)
- Screen reader announcements
- Focus management
- Error states announced to assistive technology

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  StepperStep,
  StepperOptions,
  StepperState,
  StepperEvents,
  StepStatus
} from '@stellarix/stepper';
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT