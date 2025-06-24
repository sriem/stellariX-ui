/**
 * Stepper React Integration Tests
 * Tests for React adapter integration
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStepper } from '../src/index';
import { reactAdapter } from '@stellarix-ui/react';
import type { StepperStep } from '../src/types';

// Test component that uses the stepper
const TestStepper = (props: any) => {
  // Create a fresh stepper instance for each test component to prevent pollution
  const [stepper] = React.useState(() => {
    // Ensure props.steps is a proper array to prevent issues
    const cleanedProps = {
      ...props,
      steps: Array.isArray(props.steps) ? props.steps : [],
    };
    return createStepper(cleanedProps);
  });
  const StepperComponent = React.useMemo(() => stepper.connect(reactAdapter), [stepper]);
  
  // Subscribe to state for rendering - use default structure that matches state.ts
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
      // Validate state to prevent React child errors
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
  
  // Update props
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      stepper.state.setDisabled(props.disabled);
    }
  }, [props.disabled, stepper]);
  
  React.useEffect(() => {
    if (props.activeStep !== undefined) {
      stepper.state.setActiveStep(props.activeStep);
    }
  }, [props.activeStep, stepper]);
  
  // Render simple UI
  const rootA11y = stepper.logic.getA11yProps('root');
  const listA11y = stepper.logic.getA11yProps('list');
  
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
    <>
      {/* Use the React adapter component */}
      <StepperComponent {...props} />
      
      {/* Navigation controls for testing */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => stepper.prev()} data-testid="prev-button">
          Previous
        </button>
        <button onClick={() => stepper.next()} data-testid="next-button">
          Next
        </button>
        <button onClick={() => stepper.reset()} data-testid="reset-button">
          Reset
        </button>
      </div>
    </>
  );
};

describe('Stepper React Integration', () => {
  const mockSteps: StepperStep[] = [
    { id: 'step1', label: 'Step 1' },
    { id: 'step2', label: 'Step 2' },
    { id: 'step3', label: 'Step 3' },
  ];

  // Clean up any global state between tests to prevent pollution
  afterEach(() => {
    // Clear any setTimeout/setInterval that might be running
    vi.clearAllTimers();
  });

  it('should render stepper with steps', () => {
    render(<TestStepper steps={mockSteps} />);
    
    expect(screen.getByTestId('stepper-root')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('should show active step', () => {
    render(<TestStepper steps={mockSteps} activeStep={1} />);
    
    const step0 = screen.getByTestId('step-0');
    const step1 = screen.getByTestId('step-1');
    const step2 = screen.getByTestId('step-2');
    
    expect(step0).toHaveAttribute('data-status', 'upcoming');
    expect(step1).toHaveAttribute('data-status', 'active');
    expect(step2).toHaveAttribute('data-status', 'upcoming');
  });

  it('should handle step click in non-linear mode', async () => {
    const onStepClick = vi.fn();
    const onStepChange = vi.fn();
    
    render(
      <TestStepper 
        steps={mockSteps} 
        nonLinear={true}
        onStepClick={onStepClick}
        onStepChange={onStepChange}
      />
    );
    
    const step2 = screen.getByTestId('step-2');
    await userEvent.click(step2);
    
    expect(onStepClick).toHaveBeenCalledWith(2);
    expect(onStepChange).toHaveBeenCalledWith(2, 0);
    expect(step2).toHaveAttribute('data-status', 'active');
  });

  it('should not allow clicking inaccessible steps in linear mode', async () => {
    const onStepClick = vi.fn();
    const onStepChange = vi.fn();
    
    render(
      <TestStepper 
        steps={mockSteps}
        onStepClick={onStepClick}
        onStepChange={onStepChange}
      />
    );
    
    const step2 = screen.getByTestId('step-2');
    await userEvent.click(step2);
    
    expect(onStepClick).not.toHaveBeenCalled();
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it('should navigate with next/prev buttons', async () => {
    const onStepChange = vi.fn();
    
    render(
      <TestStepper 
        steps={mockSteps}
        onStepChange={onStepChange}
      />
    );
    
    const nextButton = screen.getByTestId('next-button');
    const prevButton = screen.getByTestId('prev-button');
    
    // Go to next step
    await userEvent.click(nextButton);
    expect(onStepChange).toHaveBeenCalledWith(1, 0);
    expect(screen.getByTestId('step-1')).toHaveAttribute('data-status', 'active');
    expect(screen.getByTestId('step-0')).toHaveAttribute('data-status', 'completed');
    
    // Go to previous step
    await userEvent.click(prevButton);
    expect(onStepChange).toHaveBeenCalledWith(0, 1);
    expect(screen.getByTestId('step-0')).toHaveAttribute('data-status', 'active');
  });

  it('should handle validation', async () => {
    const onStepValidate = vi.fn().mockImplementation((step, direction) => {
      // Fail validation on step 1 going forward
      return !(step === 1 && direction === 'next');
    });
    
    render(
      <TestStepper 
        steps={mockSteps}
        onStepValidate={onStepValidate}
      />
    );
    
    const nextButton = screen.getByTestId('next-button');
    
    // First step should pass
    await userEvent.click(nextButton);
    expect(screen.getByTestId('step-1')).toHaveAttribute('data-status', 'active');
    
    // Second step should fail validation
    await userEvent.click(nextButton);
    expect(onStepValidate).toHaveBeenCalledWith(1, 'next');
    expect(screen.getByTestId('step-1')).toHaveAttribute('data-status', 'active'); // Still on step 1
  });

  it('should reset stepper', async () => {
    render(<TestStepper steps={mockSteps} activeStep={2} />);
    
    const resetButton = screen.getByTestId('reset-button');
    
    // Initial state
    expect(screen.getByTestId('step-2')).toHaveAttribute('data-status', 'active');
    
    // Reset
    await userEvent.click(resetButton);
    
    expect(screen.getByTestId('step-0')).toHaveAttribute('data-status', 'active');
    expect(screen.getByTestId('step-1')).toHaveAttribute('data-status', 'upcoming');
    expect(screen.getByTestId('step-2')).toHaveAttribute('data-status', 'upcoming');
  });

  it('should handle keyboard navigation', async () => {
    render(<TestStepper steps={mockSteps} nonLinear={true} />);
    
    const step0 = screen.getByTestId('step-0');
    const step1 = screen.getByTestId('step-1');
    const step2 = screen.getByTestId('step-2');
    
    // Focus first step
    step0.focus();
    expect(document.activeElement).toBe(step0);
    
    // Arrow right
    fireEvent.keyDown(step0, { key: 'ArrowRight' });
    await waitFor(() => expect(document.activeElement).toBe(step1));
    
    // Arrow right again
    fireEvent.keyDown(step1, { key: 'ArrowRight' });
    await waitFor(() => expect(document.activeElement).toBe(step2));
    
    // Arrow left
    fireEvent.keyDown(step2, { key: 'ArrowLeft' });
    await waitFor(() => expect(document.activeElement).toBe(step1));
    
    // Home key
    fireEvent.keyDown(step1, { key: 'Home' });
    await waitFor(() => expect(document.activeElement).toBe(step0));
    
    // End key
    fireEvent.keyDown(step0, { key: 'End' });
    await waitFor(() => expect(document.activeElement).toBe(step2));
  });

  it('should handle disabled state', () => {
    render(<TestStepper steps={mockSteps} disabled={true} />);
    
    const step0 = screen.getByTestId('step-0');
    const step1 = screen.getByTestId('step-1');
    
    expect(step0).toHaveAttribute('aria-disabled', 'true');
    expect(step0).toHaveAttribute('tabindex', '-1');
    expect(step1).toHaveAttribute('aria-disabled', 'true');
    expect(step1).toHaveAttribute('tabindex', '-1');
  });

  it('should handle step with errors', () => {
    const stepsWithError: StepperStep[] = [
      { id: 'step1', label: 'Step 1' },
      { id: 'step2', label: 'Step 2', error: true, errorMessage: 'Validation failed' },
      { id: 'step3', label: 'Step 3' },
    ];
    
    render(<TestStepper steps={stepsWithError} activeStep={1} />);
    
    const step1 = screen.getByTestId('step-1');
    expect(step1).toHaveAttribute('data-status', 'error');
    expect(step1).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByTestId('error-1')).toHaveTextContent('Validation failed');
  });

  it('should handle optional steps', () => {
    const stepsWithOptional: StepperStep[] = [
      { id: 'step1', label: 'Step 1' },
      { id: 'step2', label: 'Step 2', optional: true },
      { id: 'step3', label: 'Step 3' },
    ];
    
    render(<TestStepper steps={stepsWithOptional} />);
    
    const step1 = screen.getByTestId('step-1');
    expect(step1).toHaveAttribute('data-optional', 'true');
  });

  it('should handle complete callback', async () => {
    const onComplete = vi.fn();
    
    render(
      <TestStepper 
        steps={mockSteps.slice(0, 2)} // Only 2 steps
        onComplete={onComplete}
      />
    );
    
    const nextButton = screen.getByTestId('next-button');
    
    // Go to last step
    await userEvent.click(nextButton);
    
    // Try to go past last step
    await userEvent.click(nextButton);
    
    expect(onComplete).toHaveBeenCalled();
  });

  it('should update when props change', () => {
    const { rerender } = render(<TestStepper steps={mockSteps} activeStep={0} />);
    
    expect(screen.getByTestId('step-0')).toHaveAttribute('data-status', 'active');
    
    // Update active step
    rerender(<TestStepper steps={mockSteps} activeStep={2} />);
    
    expect(screen.getByTestId('step-0')).toHaveAttribute('data-status', 'upcoming');
    expect(screen.getByTestId('step-2')).toHaveAttribute('data-status', 'active');
  });
});