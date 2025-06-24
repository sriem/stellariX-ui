/**
 * Stepper Accessibility Tests
 * Tests for WCAG 2.1 AA compliance
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { createStepper } from '../src/index';
import { reactAdapter } from '@stellarix-ui/react';
import type { StepperStep } from '../src/types';

// Test component that renders the stepper
const TestStepper = (props: any) => {
  // Create a fresh stepper instance with cleaned props
  const [stepper] = React.useState(() => {
    const cleanedProps = {
      ...props,
      steps: Array.isArray(props.steps) ? props.steps : [],
    };
    return createStepper(cleanedProps);
  });
  const StepperComponent = React.useMemo(() => stepper.connect(reactAdapter), [stepper]);
  
  // Subscribe to state for rendering - use default structure
  const [state, setState] = React.useState(() => ({
    steps: Array.isArray(props.steps) ? props.steps : [],
    activeStep: typeof props.activeStep === 'number' ? props.activeStep : 0,
    completedSteps: new Set<number>(),
    disabled: Boolean(props.disabled),
    orientation: props.orientation || 'horizontal',
    nonLinear: Boolean(props.nonLinear),
    showStepNumbers: props.showStepNumbers !== false,
    showConnectors: props.showConnectors !== false,
    focusedStep: -1,
    validating: false,
    alternativeLabel: Boolean(props.alternativeLabel),
  }));
  
  React.useEffect(() => {
    const unsubscribe = stepper.state.subscribe((newState: any) => {
      if (newState && typeof newState === 'object') {
        // Ensure steps is always an array with valid objects
        const validatedState = {
          ...newState,
          steps: Array.isArray(newState.steps) 
            ? newState.steps.filter((step: any) => step && typeof step === 'object')
            : [],
          completedSteps: newState.completedSteps instanceof Set 
            ? newState.completedSteps 
            : new Set()
        };
        setState(validatedState);
      }
    });
    return unsubscribe;
  }, [stepper]);
  
  // Render with proper HTML structure
  const rootA11y = stepper.logic.getA11yProps('root');
  const listA11y = stepper.logic.getA11yProps('list');
  
  const getStepStatus = (index: number) => {
    const step = state.steps[index];
    if (step?.error) return 'error';
    if (state.activeStep === index) return 'active';
    if (state.completedSteps.has(index)) return 'completed';
    return 'upcoming';
  };
  
  const isStepAccessible = (index: number) => {
    if (state.disabled) return false;
    if (state.nonLinear) return !state.steps[index]?.disabled;
    if (index <= state.activeStep) return !state.steps[index]?.disabled;
    
    for (let i = 0; i < index; i++) {
      if (!state.completedSteps.has(i) && !state.steps[i]?.optional) {
        return false;
      }
    }
    
    return !state.steps[index]?.disabled;
  };
  
  // Ensure a11y props are safe for DOM
  const safeRootA11y = rootA11y && typeof rootA11y === 'object' ? 
    Object.fromEntries(Object.entries(rootA11y).filter(([_, value]) => 
      typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    )) : {};
  const safeListA11y = listA11y && typeof listA11y === 'object' ? 
    Object.fromEntries(Object.entries(listA11y).filter(([_, value]) => 
      typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    )) : {};

  return (
    <main>
      <h1>Stepper Test</h1>
      {/* Use the React adapter component */}
      <StepperComponent {...props} className="stepper" />
    </main>
  );
};

describe('Stepper Accessibility', () => {
  const mockSteps: StepperStep[] = [
    { id: 'step1', label: 'Account Details', description: 'Enter your account information' },
    { id: 'step2', label: 'Personal Info', description: 'Tell us about yourself' },
    { id: 'step3', label: 'Preferences', description: 'Customize your experience', optional: true },
    { id: 'step4', label: 'Confirmation', description: 'Review and confirm' },
  ];

  it('should have no accessibility violations in default state', async () => {
    const { container } = render(<TestStepper steps={mockSteps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with vertical orientation', async () => {
    const { container } = render(
      <TestStepper steps={mockSteps} orientation="vertical" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations in disabled state', async () => {
    const { container } = render(
      <TestStepper steps={mockSteps} disabled={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with completed steps', async () => {
    const { container } = render(
      <TestStepper steps={mockSteps} activeStep={2} />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with error states', async () => {
    const stepsWithError: StepperStep[] = [
      ...mockSteps.slice(0, 2),
      { ...mockSteps[2], error: true, errorMessage: 'Please fix this error' },
      mockSteps[3],
    ];
    
    const { container } = render(
      <TestStepper steps={stepsWithError} activeStep={2} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations in non-linear mode', async () => {
    const { container } = render(
      <TestStepper steps={mockSteps} nonLinear={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with mixed states', async () => {
    const mixedSteps: StepperStep[] = [
      { id: 'completed', label: 'Completed Step' },
      { id: 'active', label: 'Active Step' },
      { id: 'error', label: 'Error Step', error: true, errorMessage: 'Fix this' },
      { id: 'disabled', label: 'Disabled Step', disabled: true },
      { id: 'optional', label: 'Optional Step', optional: true },
    ];
    
    const { container } = render(
      <TestStepper steps={mixedSteps} activeStep={1} />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations without step numbers', async () => {
    const { container } = render(
      <TestStepper steps={mockSteps} showStepNumbers={false} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations without connectors', async () => {
    const { container } = render(
      <TestStepper steps={mockSteps} showConnectors={false} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    const { container } = render(
      <TestStepper steps={mockSteps} activeStep={1} ariaLabel="Registration Progress" />
    );
    
    // Check root element
    const root = container.querySelector('[role="group"]');
    expect(root).toHaveAttribute('aria-label', 'Registration Progress');
    
    // Check list structure
    const list = container.querySelector('[role="list"]');
    expect(list).toBeInTheDocument();
    
    const items = container.querySelectorAll('[role="listitem"]');
    expect(items).toHaveLength(4);
    
    // Check active step
    const activeStep = items[1];
    expect(activeStep).toHaveAttribute('aria-current', 'step');
    
    // Check buttons
    const buttons = container.querySelectorAll('button[role="button"]');
    expect(buttons).toHaveLength(4);
    
    // Check first button (completed)
    expect(buttons[0]).toHaveAttribute('aria-label', 'Step 1: Account Details');
    expect(buttons[0]).toHaveAttribute('tabindex', '0');
    
    // Check active button
    expect(buttons[1]).toHaveAttribute('aria-label', 'Step 2: Personal Info');
    expect(buttons[1]).toHaveAttribute('aria-describedby', 'step-1-description');
    
    // Check optional step
    expect(buttons[2]).toHaveAttribute('data-optional', 'true');
  });

  it('should handle focus management correctly', () => {
    const { container } = render(
      <TestStepper steps={mockSteps} nonLinear={true} />
    );
    
    const buttons = container.querySelectorAll('button[role="button"]');
    
    // All buttons should be focusable in non-linear mode
    buttons.forEach(button => {
      expect(button).toHaveAttribute('tabindex', '0');
    });
  });

  it('should announce errors properly', () => {
    const stepsWithError: StepperStep[] = [
      mockSteps[0],
      { ...mockSteps[1], error: true, errorMessage: 'Invalid information provided' },
      mockSteps[2],
    ];
    
    const { container } = render(
      <TestStepper steps={stepsWithError} activeStep={1} />
    );
    
    // Error message should have alert role
    const errorMessage = container.querySelector('[role="alert"]');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Invalid information provided');
    
    // Button should indicate invalid state
    const errorButton = container.querySelectorAll('button[role="button"]')[1];
    expect(errorButton).toHaveAttribute('aria-invalid', 'true');
  });
});