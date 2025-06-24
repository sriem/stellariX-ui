/**
 * Stepper Component Stories
 * Comprehensive showcase of all stepper features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createStepper } from './index';
import { reactAdapter } from '@stellarix-ui/react';
import type { StepperStep } from './types';

// Create a wrapper component that creates individual Stepper instances
const StepperWrapper = React.forwardRef((props: any, ref: any) => {
  const [stepper] = React.useState(() => createStepper(props));
  const Component = React.useMemo(() => stepper.connect(reactAdapter), [stepper]);
  
  // Update the stepper's state when props change
  React.useEffect(() => {
    if (props.steps !== undefined) {
      stepper.state.setSteps(props.steps);
    }
  }, [props.steps, stepper]);
  
  React.useEffect(() => {
    if (props.activeStep !== undefined) {
      stepper.state.setActiveStep(props.activeStep);
    }
  }, [props.activeStep, stepper]);
  
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      stepper.state.setDisabled(props.disabled);
    }
  }, [props.disabled, stepper]);
  
  React.useEffect(() => {
    if (props.orientation !== undefined) {
      stepper.state.setOrientation(props.orientation);
    }
  }, [props.orientation, stepper]);
  
  React.useEffect(() => {
    if (props.nonLinear !== undefined) {
      stepper.state.setNonLinear(props.nonLinear);
    }
  }, [props.nonLinear, stepper]);
  
  // Subscribe to state for rendering
  const [state, setState] = React.useState(() => stepper.state.getState());
  
  React.useEffect(() => {
    const unsubscribe = stepper.state.subscribe(setState);
    return unsubscribe;
  }, [stepper]);
  
  // Get A11y props from logic
  const rootA11y = stepper.logic.getA11yProps('root', state);
  const listA11y = stepper.logic.getA11yProps('list', state);
  
  // Get interaction handlers
  const rootHandlers = stepper.logic.getInteractionHandlers('root', state);
  
  // Helper to get step status
  const getStepStatus = (index: number) => {
    const step = state.steps[index];
    if (step?.error) return 'error';
    if (state.activeStep === index) return 'active';
    if (state.completedSteps.has(index)) return 'completed';
    return 'upcoming';
  };
  
  // Helper to check if step is accessible
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
  
  return (
    <div {...rootA11y} {...rootHandlers} className={props.className} ref={ref}>
      <ol 
        {...listA11y} 
        style={{ 
          display: 'flex',
          flexDirection: state.orientation === 'vertical' ? 'column' : 'row',
          alignItems: state.orientation === 'vertical' ? 'flex-start' : 'center',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          gap: state.orientation === 'vertical' ? '24px' : '8px',
        }}
      >
        {state.steps.map((step, index) => {
          const stepA11y = stepper.logic.getA11yProps('step', state, { index });
          const buttonA11y = stepper.logic.getA11yProps('stepButton', state, { index });
          const labelA11y = stepper.logic.getA11yProps('stepLabel', state, { index });
          const descA11y = stepper.logic.getA11yProps('stepDescription', state, { index });
          const buttonHandlers = stepper.logic.getInteractionHandlers('stepButton', state);
          
          const status = getStepStatus(index);
          const accessible = isStepAccessible(index);
          const isLast = index === state.steps.length - 1;
          
          // Attach index to event handlers
          const handlersWithIndex = Object.entries(buttonHandlers).reduce((acc, [key, handler]) => {
            acc[key] = (event: any) => {
              event.index = index;
              handler(event);
            };
            return acc;
          }, {} as any);
          
          return (
            <li 
              key={step.id} 
              {...stepA11y}
              style={{
                display: 'flex',
                flexDirection: state.orientation === 'vertical' ? 'row' : 'column',
                alignItems: 'center',
                flex: state.orientation === 'horizontal' && !isLast ? 1 : undefined,
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: state.orientation === 'vertical' ? 'row' : 'column',
                  alignItems: 'center',
                  gap: state.orientation === 'vertical' ? '16px' : '8px',
                }}
              >
                <button
                  {...buttonA11y}
                  {...handlersWithIndex}
                  data-testid={`step-button-${index}`}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: `2px solid ${
                      status === 'error' ? '#ef4444' :
                      status === 'completed' ? '#10b981' :
                      status === 'active' ? '#3b82f6' :
                      '#d1d5db'
                    }`,
                    backgroundColor: 
                      status === 'error' ? '#fef2f2' :
                      status === 'completed' ? '#10b981' :
                      status === 'active' ? '#3b82f6' :
                      'white',
                    color: 
                      status === 'completed' || status === 'active' ? 'white' :
                      status === 'error' ? '#ef4444' :
                      '#6b7280',
                    cursor: accessible && !state.disabled ? 'pointer' : 'not-allowed',
                    opacity: accessible || status === 'active' ? 1 : 0.5,
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                >
                  {status === 'completed' ? '✓' : 
                   status === 'error' ? '!' :
                   state.showStepNumbers ? index + 1 : '•'}
                </button>
                
                <div 
                  style={{
                    textAlign: state.orientation === 'vertical' ? 'left' : 'center',
                    minWidth: state.orientation === 'vertical' ? '200px' : 'auto',
                  }}
                >
                  <div 
                    {...labelA11y}
                    style={{
                      fontSize: '14px',
                      fontWeight: status === 'active' ? '600' : '400',
                      color: 
                        status === 'error' ? '#ef4444' :
                        status === 'active' ? '#1f2937' :
                        accessible ? '#374151' : '#9ca3af',
                      marginBottom: step.description ? '4px' : 0,
                    }}
                  >
                    {step.label}
                    {step.optional && (
                      <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '4px' }}>
                        (Optional)
                      </span>
                    )}
                  </div>
                  
                  {step.description && (
                    <div 
                      {...descA11y}
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                      }}
                    >
                      {step.description}
                    </div>
                  )}
                  
                  {step.error && step.errorMessage && (
                    <div 
                      style={{
                        fontSize: '12px',
                        color: '#ef4444',
                        marginTop: '4px',
                      }}
                    >
                      {step.errorMessage}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Connector */}
              {!isLast && state.showConnectors && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    backgroundColor: 
                      state.completedSteps.has(index) ? '#10b981' : '#e5e7eb',
                    ...(state.orientation === 'horizontal' ? {
                      top: '20px',
                      left: '50%',
                      width: 'calc(100% - 48px)',
                      height: '2px',
                      marginLeft: '24px',
                    } : {
                      top: '48px',
                      left: '19px',
                      width: '2px',
                      height: 'calc(100% - 16px)',
                    }),
                  }}
                />
              )}
            </li>
          );
        })}
      </ol>
      
      {/* Navigation Controls */}
      {props.showControls && (
        <div style={{ 
          marginTop: '32px', 
          display: 'flex', 
          gap: '12px',
          justifyContent: state.orientation === 'vertical' ? 'flex-start' : 'center',
        }}>
          <button
            onClick={() => stepper.prev()}
            disabled={state.activeStep === 0 || state.disabled || state.validating}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              cursor: state.activeStep === 0 || state.disabled ? 'not-allowed' : 'pointer',
              opacity: state.activeStep === 0 || state.disabled ? 0.5 : 1,
            }}
          >
            Previous
          </button>
          
          <button
            onClick={() => stepper.next()}
            disabled={state.activeStep === state.steps.length - 1 || state.disabled || state.validating}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              cursor: state.activeStep === state.steps.length - 1 || state.disabled ? 'not-allowed' : 'pointer',
              opacity: state.activeStep === state.steps.length - 1 || state.disabled ? 0.5 : 1,
            }}
          >
            {state.activeStep === state.steps.length - 1 ? 'Finish' : 'Next'}
          </button>
          
          {state.activeStep === state.steps.length - 1 && (
            <button
              onClick={() => stepper.reset()}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
});

StepperWrapper.displayName = 'Stepper';

const Stepper = StepperWrapper;

// Decorator to add visual styles
const withStepperStyles = (Story: any) => {
  return (
    <>
      <style>{`
        div[role="group"] {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        button[role="button"]:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        button[role="button"]:hover:not(:disabled) {
          transform: scale(1.05);
        }
        
        button[role="button"]:active:not(:disabled) {
          transform: scale(0.95);
        }
      `}</style>
      <Story />
    </>
  );
};

const meta: Meta<typeof Stepper> = {
  title: 'Primitives/Stepper',
  component: Stepper,
  decorators: [withStepperStyles],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A framework-agnostic stepper component for guiding users through multi-step processes.

## Features
- ✅ Step tracking (current, completed, upcoming, error states)
- ✅ Step validation before progression
- ✅ Horizontal and vertical layouts
- ✅ Optional and required steps
- ✅ Error states with messages
- ✅ Linear and non-linear navigation modes
- ✅ Progress indication
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Full accessibility support (WCAG 2.1 AA)
- ✅ Customizable appearance
- ✅ Helper methods (next, prev, goToStep, reset)

## Accessibility
- Uses semantic list structure with \`role="list"\` and \`role="listitem"\`
- Current step marked with \`aria-current="step"\`
- Full keyboard navigation support
- Focus management and visual indicators
- Error states announced to screen readers
        `,
      },
    },
  },
  argTypes: {
    steps: {
      control: 'object',
      description: 'Array of step definitions',
    },
    activeStep: {
      control: 'number',
      description: 'Currently active step index',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation',
    },
    nonLinear: {
      control: 'boolean',
      description: 'Allow jumping to any step',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the stepper is disabled',
    },
    showStepNumbers: {
      control: 'boolean',
      description: 'Show step numbers in circles',
    },
    showConnectors: {
      control: 'boolean',
      description: 'Show connecting lines between steps',
    },
    showControls: {
      control: 'boolean',
      description: 'Show navigation controls (for demo)',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the stepper',
    },
  },
  args: {
    orientation: 'horizontal',
    nonLinear: false,
    disabled: false,
    showStepNumbers: true,
    showConnectors: true,
    showControls: true,
    ariaLabel: 'Progress',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample step data
const basicSteps: StepperStep[] = [
  { id: 'step1', label: 'Account Details' },
  { id: 'step2', label: 'Personal Information' },
  { id: 'step3', label: 'Payment Method' },
  { id: 'step4', label: 'Review & Submit' },
];

const detailedSteps: StepperStep[] = [
  { 
    id: 'account', 
    label: 'Create Account',
    description: 'Choose username and password',
  },
  { 
    id: 'profile', 
    label: 'Profile Setup',
    description: 'Add your personal information',
  },
  { 
    id: 'preferences', 
    label: 'Preferences',
    description: 'Customize your experience',
    optional: true,
  },
  { 
    id: 'verify', 
    label: 'Verify Email',
    description: 'Confirm your email address',
  },
  { 
    id: 'complete', 
    label: 'Complete',
    description: 'Your account is ready!',
  },
];

// Basic Examples
export const Default: Story = {
  args: {
    steps: basicSteps,
    activeStep: 0,
  },
};

export const VerticalOrientation: Story = {
  args: {
    steps: detailedSteps,
    orientation: 'vertical',
    activeStep: 0,
  },
};

export const WithDescriptions: Story = {
  args: {
    steps: detailedSteps,
    activeStep: 1,
  },
};

export const NonLinearMode: Story = {
  args: {
    steps: basicSteps,
    nonLinear: true,
    activeStep: 0,
  },
};

// State Variations
export const PartiallyCompleted: Story = {
  render: (args) => {
    const Component = () => {
      const [stepper] = React.useState(() => {
        const s = createStepper(args);
        // Mark first two steps as completed
        s.state.setCompletedSteps([0, 1]);
        s.state.setActiveStep(2);
        return s;
      });
      
      return <Stepper {...args} />;
    };
    
    return <Component />;
  },
  args: {
    steps: basicSteps,
  },
};

export const WithErrors: Story = {
  args: {
    steps: [
      { id: 'step1', label: 'Account Details' },
      { 
        id: 'step2', 
        label: 'Verification',
        error: true,
        errorMessage: 'Invalid verification code',
      },
      { id: 'step3', label: 'Payment Method' },
      { id: 'step4', label: 'Complete' },
    ],
    activeStep: 1,
  },
};

export const OptionalSteps: Story = {
  args: {
    steps: [
      { id: 'required1', label: 'Required Step 1' },
      { id: 'optional1', label: 'Optional Step', optional: true },
      { id: 'required2', label: 'Required Step 2' },
      { id: 'optional2', label: 'Additional Info', optional: true },
      { id: 'required3', label: 'Final Step' },
    ],
    activeStep: 0,
  },
};

export const DisabledStepper: Story = {
  args: {
    steps: basicSteps,
    disabled: true,
    activeStep: 1,
  },
};

export const DisabledSteps: Story = {
  args: {
    steps: [
      { id: 'step1', label: 'Available' },
      { id: 'step2', label: 'Disabled Step', disabled: true },
      { id: 'step3', label: 'Available' },
      { id: 'step4', label: 'Also Disabled', disabled: true },
    ],
    nonLinear: true,
    activeStep: 0,
  },
};

// Customization Examples
export const NoStepNumbers: Story = {
  args: {
    steps: basicSteps,
    showStepNumbers: false,
    activeStep: 1,
  },
};

export const NoConnectors: Story = {
  args: {
    steps: basicSteps,
    showConnectors: false,
    activeStep: 2,
  },
};

export const AlternativeLabel: Story = {
  args: {
    steps: basicSteps,
    alternativeLabel: true,
    activeStep: 1,
  },
};

// Interactive Examples
export const WithValidation: Story = {
  render: () => {
    const [validationMessage, setValidationMessage] = React.useState('');
    
    const handleStepValidate = async (step: number, direction: 'next' | 'prev') => {
      setValidationMessage(`Validating step ${step + 1}...`);
      
      // Simulate async validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fail validation for step 2 when going forward
      if (step === 1 && direction === 'next') {
        setValidationMessage('Step 2 validation failed! Please fix errors.');
        return false;
      }
      
      setValidationMessage('');
      return true;
    };
    
    return (
      <div>
        <Stepper
          steps={basicSteps}
          onStepValidate={handleStepValidate}
          showControls
        />
        {validationMessage && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: validationMessage.includes('failed') ? '#fee2e2' : '#e0f2fe', 
            borderRadius: '4px',
            color: validationMessage.includes('failed') ? '#dc2626' : '#0369a1',
          }}>
            {validationMessage}
          </div>
        )}
      </div>
    );
  },
};

export const InteractiveStepper: Story = {
  render: () => {
    const [events, setEvents] = React.useState<string[]>([]);
    
    const addEvent = (event: string) => {
      setEvents(prev => [...prev.slice(-4), event]);
    };
    
    return (
      <div>
        <Stepper
          steps={detailedSteps}
          onStepChange={(step, prev) => addEvent(`Changed: ${prev} → ${step}`)}
          onStepClick={(step) => addEvent(`Clicked: Step ${step + 1}`)}
          onComplete={() => addEvent('Completed!')}
          showControls
        />
        
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ marginBottom: '8px' }}>Event Log:</h4>
          <div style={{ 
            padding: '12px', 
            background: '#f3f4f6', 
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}>
            {events.length === 0 ? (
              <div style={{ color: '#6b7280' }}>No events yet...</div>
            ) : (
              events.map((event, i) => (
                <div key={i}>{event}</div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  },
};

export const DynamicSteps: Story = {
  render: () => {
    const [steps, setSteps] = React.useState<StepperStep[]>([
      { id: 'step1', label: 'Step 1' },
      { id: 'step2', label: 'Step 2' },
    ]);
    
    const addStep = () => {
      const newId = `step${steps.length + 1}`;
      setSteps([...steps, { id: newId, label: `Step ${steps.length + 1}` }]);
    };
    
    const removeStep = () => {
      if (steps.length > 2) {
        setSteps(steps.slice(0, -1));
      }
    };
    
    return (
      <div>
        <Stepper steps={steps} showControls />
        
        <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={addStep}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '4px', 
              border: '1px solid #ddd' 
            }}
          >
            Add Step
          </button>
          <button 
            onClick={removeStep}
            disabled={steps.length <= 2}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '4px', 
              border: '1px solid #ddd',
              opacity: steps.length <= 2 ? 0.5 : 1,
              cursor: steps.length <= 2 ? 'not-allowed' : 'pointer',
            }}
          >
            Remove Step
          </button>
        </div>
      </div>
    );
  },
};

// Keyboard Navigation Demo
export const KeyboardNavigation: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        <strong>Keyboard Navigation Test:</strong><br />
        Click on any step to focus<br />
        Use <kbd>←</kbd> <kbd>→</kbd> or <kbd>↑</kbd> <kbd>↓</kbd> to navigate<br />
        Use <kbd>Home</kbd> to go to first step<br />
        Use <kbd>End</kbd> to go to last step<br />
        Use <kbd>Enter</kbd> or <kbd>Space</kbd> to activate step
      </p>
      
      <Stepper 
        steps={[
          { id: 'kb1', label: 'First Step' },
          { id: 'kb2', label: 'Second Step' },
          { id: 'kb3', label: 'Third Step' },
          { id: 'kb4', label: 'Fourth Step' },
          { id: 'kb5', label: 'Final Step' },
        ]}
        nonLinear
        showControls={false}
      />
    </div>
  ),
};

// Edge Cases
export const SingleStep: Story = {
  args: {
    steps: [{ id: 'only', label: 'Only Step' }],
    showControls: true,
  },
};

export const ManySteps: Story = {
  args: {
    steps: Array.from({ length: 10 }, (_, i) => ({
      id: `step${i}`,
      label: `Step ${i + 1}`,
      description: i % 3 === 0 ? `Description for step ${i + 1}` : undefined,
    })),
    activeStep: 4,
  },
};

export const LongLabels: Story = {
  args: {
    steps: [
      { id: 'short', label: 'Short' },
      { id: 'long', label: 'This is a very long step label that might cause layout issues' },
      { id: 'longer', label: 'This is an even longer step label that definitely will cause wrapping in most layouts' },
      { id: 'normal', label: 'Normal Label' },
    ],
    orientation: 'vertical',
  },
};

// Showcase
export const AllVariationsShowcase: Story = {
  render: () => {
    const variations = [
      {
        title: 'Horizontal (Default)',
        steps: basicSteps.slice(0, 3),
        activeStep: 1,
      },
      {
        title: 'Vertical',
        steps: basicSteps.slice(0, 3),
        orientation: 'vertical' as const,
        activeStep: 1,
      },
      {
        title: 'Non-Linear',
        steps: basicSteps.slice(0, 3),
        nonLinear: true,
        activeStep: 0,
      },
      {
        title: 'With Errors',
        steps: [
          { id: 's1', label: 'Completed' },
          { id: 's2', label: 'Error', error: true, errorMessage: 'Fix this' },
          { id: 's3', label: 'Upcoming' },
        ],
        activeStep: 1,
      },
      {
        title: 'Optional Steps',
        steps: [
          { id: 's1', label: 'Required' },
          { id: 's2', label: 'Optional', optional: true },
          { id: 's3', label: 'Required' },
        ],
        activeStep: 0,
      },
      {
        title: 'No Connectors',
        steps: basicSteps.slice(0, 3),
        showConnectors: false,
        activeStep: 1,
      },
    ];
    
    return (
      <div style={{ display: 'grid', gap: '32px' }}>
        {variations.map((variation, index) => (
          <div key={index}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>
              {variation.title}
            </h3>
            <Stepper {...variation} showControls={false} />
          </div>
        ))}
      </div>
    );
  },
};