/**
 * Spinner Component Stories
 * Comprehensive showcase of all spinner features and states
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSpinnerWithImplementation } from './index';
import { reactAdapter } from '@stellarix-ui/react';

// Create a wrapper component that creates individual Spinner instances
const SpinnerWrapper = React.forwardRef((props: any, ref: any) => {
  const [spinner] = React.useState(() => createSpinnerWithImplementation(props));
  const Component = React.useMemo(() => spinner.connect(reactAdapter), [spinner]);
  
  // Add size class for styling
  const className = `spinner ${props.className || ''} ${props.size ? `spinner-${props.size}` : 'spinner-md'}`.trim();
  
  return <Component ref={ref} {...props} className={className} />;
});

SpinnerWrapper.displayName = 'Spinner';

const Spinner = SpinnerWrapper;

// Decorator to add visual styles to the headless spinner
const withSpinnerStyles = (Story: any) => {
  return (
    <>
      <style>{`
        .spinner {
          display: inline-block;
          border: 3px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: #3b82f6;
          animation: spin 1s linear infinite;
        }
        
        /* Size variants */
        .spinner-xs {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }
        
        .spinner-sm {
          width: 20px;
          height: 20px;
          border-width: 2px;
        }
        
        .spinner-md {
          width: 32px;
          height: 32px;
          border-width: 3px;
        }
        
        .spinner-lg {
          width: 48px;
          height: 48px;
          border-width: 4px;
        }
        
        .spinner-xl {
          width: 64px;
          height: 64px;
          border-width: 5px;
        }
        
        /* Animation speeds */
        .spinner[data-speed="slow"] {
          animation-duration: 2s;
        }
        
        .spinner[data-speed="normal"] {
          animation-duration: 1s;
        }
        
        .spinner[data-speed="fast"] {
          animation-duration: 0.5s;
        }
        
        /* Stopped state */
        .spinner[aria-busy="false"] {
          animation-play-state: paused;
          opacity: 0.5;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Color variants */
        .spinner.spinner-primary {
          border-top-color: #3b82f6;
        }
        
        .spinner.spinner-success {
          border-top-color: #10b981;
        }
        
        .spinner.spinner-warning {
          border-top-color: #f59e0b;
        }
        
        .spinner.spinner-danger {
          border-top-color: #ef4444;
        }
        
        .spinner.spinner-white {
          border-color: rgba(255, 255, 255, 0.2);
          border-top-color: white;
        }
      `}</style>
      <Story />
    </>
  );
};

const meta: Meta<typeof Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  decorators: [withSpinnerStyles],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A loading indicator component that shows a spinning animation to indicate ongoing activity.

## Features
- ✅ Multiple sizes (xs, sm, md, lg, xl)
- ✅ Customizable colors
- ✅ Adjustable animation speed
- ✅ Start/stop control
- ✅ Accessible with ARIA labels
- ✅ Screen reader friendly

## Use Cases
- Loading states
- Form submissions
- Data fetching
- Async operations
- Progress indication
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The size of the spinner',
      defaultValue: 'md',
    },
    color: {
      control: 'color',
      description: 'The color of the spinner',
      defaultValue: '#3b82f6',
    },
    spinning: {
      control: 'boolean',
      description: 'Whether the spinner is currently spinning',
      defaultValue: true,
    },
    label: {
      control: 'text',
      description: 'Accessible label for screen readers',
      defaultValue: 'Loading...',
    },
    speed: {
      control: { type: 'number', min: 100, max: 3000, step: 100 },
      description: 'Animation speed in milliseconds',
      defaultValue: 750,
    },
  },
  args: {
    size: 'md',
    color: '#3b82f6',
    spinning: true,
    label: 'Loading...',
    speed: 750,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};

// Color Variations
export const CustomColor: Story = {
  args: {
    color: '#ef4444',
  },
};

export const SuccessColor: Story = {
  args: {
    color: '#10b981',
  },
};

export const WarningColor: Story = {
  args: {
    color: '#f59e0b',
  },
};

// State Variations
export const NotSpinning: Story = {
  args: {
    spinning: false,
  },
};

export const SlowAnimation: Story = {
  args: {
    speed: 2000,
  },
};

export const FastAnimation: Story = {
  args: {
    speed: 300,
  },
};

export const WithCustomLabel: Story = {
  args: {
    label: 'Processing your request...',
  },
};

// Interactive Examples
export const ToggleSpinner: Story = {
  render: (args) => {
    const [spinning, setSpinning] = React.useState(true);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <Spinner {...args} spinning={spinning} />
        <button
          onClick={() => setSpinning(!spinning)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          {spinning ? 'Stop' : 'Start'} Spinner
        </button>
      </div>
    );
  },
};

// Loading States Example
export const LoadingStates: Story = {
  render: () => {
    const [loadingStates, setLoadingStates] = React.useState({
      button: false,
      form: false,
      data: false,
    });

    const toggleLoading = (key: keyof typeof loadingStates) => {
      setLoadingStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Button Loading State</h3>
          <button
            onClick={() => toggleLoading('button')}
            disabled={loadingStates.button}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
              backgroundColor: loadingStates.button ? '#f3f4f6' : 'white',
              cursor: loadingStates.button ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: '120px',
            }}
          >
            {loadingStates.button && <Spinner size="sm" color="#6b7280" />}
            {loadingStates.button ? 'Loading...' : 'Click Me'}
          </button>
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem' }}>Form Submission</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            toggleLoading('form');
          }}>
            <input
              type="text"
              placeholder="Enter text..."
              disabled={loadingStates.form}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                marginRight: '0.5rem',
              }}
            />
            <button
              type="submit"
              disabled={loadingStates.form}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                backgroundColor: loadingStates.form ? '#f3f4f6' : 'white',
                cursor: loadingStates.form ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {loadingStates.form && <Spinner size="sm" color="#6b7280" />}
              {loadingStates.form ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem' }}>Data Loading</h3>
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            minHeight: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {loadingStates.data ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Spinner size="lg" />
                <p>Loading data...</p>
              </div>
            ) : (
              <div>
                <p>Data loaded successfully!</p>
                <button
                  onClick={() => toggleLoading('data')}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid #3b82f6',
                    backgroundColor: 'white',
                    color: '#3b82f6',
                    cursor: 'pointer',
                  }}
                >
                  Reload Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
};

// Inline Usage
export const InlineWithText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Spinner size="xs" /> Loading comments...
      </p>
      <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Spinner size="sm" color="#10b981" /> Saving changes...
      </p>
      <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Spinner size="md" color="#f59e0b" /> Processing payment...
      </p>
    </div>
  ),
};

// Showcase
export const Showcase: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Spinner Component Showcase</h2>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Sizes</h3>
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="xs" />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>XS (16px)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="sm" />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>SM (20px)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="md" />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>MD (24px)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="lg" />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>LG (32px)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="xl" />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>XL (48px)</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Colors</h3>
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          alignItems: 'center',
        }}>
          <Spinner color="#3b82f6" />
          <Spinner color="#ef4444" />
          <Spinner color="#10b981" />
          <Spinner color="#f59e0b" />
          <Spinner color="#8b5cf6" />
          <Spinner color="#ec4899" />
          <Spinner color="#6b7280" />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Animation Speeds</h3>
        <div style={{ 
          display: 'flex', 
          gap: '3rem', 
          alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner speed={300} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Fast (300ms)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner speed={750} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Normal (750ms)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner speed={1500} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Slow (1500ms)</p>
          </div>
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: '1rem' }}>Common Patterns</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '1rem',
            textAlign: 'center'
          }}>
            <Spinner size="lg" color="#3b82f6" />
            <p style={{ marginTop: '0.5rem' }}>Page Loading</p>
          </div>
          
          <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Spinner size="sm" color="#10b981" />
            <span>Saving...</span>
          </div>
          
          <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '1rem',
          }}>
            <button disabled style={{
              width: '100%',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '4px',
              cursor: 'not-allowed',
            }}>
              <Spinner size="xs" />
              Processing
            </button>
          </div>
        </div>
      </section>
    </div>
  ),
};