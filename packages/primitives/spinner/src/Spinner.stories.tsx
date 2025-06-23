import React from 'react';
import { createSpinnerWithImplementation } from './index';

export default {
  title: 'Primitives/Spinner',
  component: 'Spinner',
  parameters: {
    docs: {
      description: {
        component:
          'A loading indicator component that shows a spinning animation to indicate ongoing activity.',
      },
    },
  },
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
      description: 'The size of the spinner',
      defaultValue: 'md',
    },
    color: {
      control: 'color',
      description: 'The color of the spinner',
      defaultValue: '#3182ce',
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
      control: {
        type: 'number',
        min: 100,
        max: 3000,
        step: 100,
      },
      description: 'Animation speed in milliseconds',
      defaultValue: 750,
    },
  },
  tags: ['autodocs'],
};

// Create component template
const createSpinnerComponent = (args) => {
  const spinner = createSpinnerWithImplementation({
    size: args.size,
    color: args.color,
    spinning: args.spinning,
    label: args.label,
    speed: args.speed,
  });

  const SpinnerComponent = () => {
    const [componentState, setComponentState] = React.useState(() => spinner.state.getState());
    const a11yProps = spinner.logic.getA11yProps('root');
    const handlers = spinner.logic.getInteractionHandlers('root');

    // Update state based on args
    React.useEffect(() => {
      if (args.spinning !== undefined) {
        if (args.spinning) spinner.state.start();
        else spinner.state.stop();
      }
      if (args.size) spinner.state.setSize(args.size);
      if (args.color) spinner.state.setColor(args.color);
      if (args.label) spinner.state.setLabel(args.label);
      if (args.speed) spinner.state.setSpeed(args.speed);
    }, [args]);

    // Subscribe to state changes
    React.useEffect(() => {
      const unsubscribe = spinner.state.subscribe(setComponentState);
      return unsubscribe;
    }, []);

    // Size dimensions
    const sizeMap = {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 48,
    };

    const size = sizeMap[componentState.size] || 24;

    const spinnerStyles = {
      width: `${size}px`,
      height: `${size}px`,
      display: 'inline-block',
      position: 'relative' as const,
    };

    const circleStyles = {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: `${Math.max(2, size / 8)}px solid transparent`,
      borderTopColor: componentState.color || 'currentColor',
      borderRadius: '50%',
      animation: componentState.spinning ? `spin ${componentState.speed}ms linear infinite` : 'none',
    };

    // Add keyframes for animation
    React.useEffect(() => {
      const styleId = 'spinner-animation';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
    }, []);

    return (
      <div 
        style={spinnerStyles} 
        {...a11yProps} 
        {...handlers}
        aria-busy={componentState.spinning}
        aria-label={componentState.label}
      >
        <div style={circleStyles} />
      </div>
    );
  };

  return <SpinnerComponent />;
};

// Default spinner
export const Default = {
  render: (args) => createSpinnerComponent(args),
};

// Extra small size
export const ExtraSmall = {
  render: (args) => createSpinnerComponent({ ...args, size: 'xs' }),
};

// Small size
export const Small = {
  render: (args) => createSpinnerComponent({ ...args, size: 'sm' }),
};

// Large size
export const Large = {
  render: (args) => createSpinnerComponent({ ...args, size: 'lg' }),
};

// Extra large size
export const ExtraLarge = {
  render: (args) => createSpinnerComponent({ ...args, size: 'xl' }),
};

// Custom color
export const CustomColor = {
  render: (args) => createSpinnerComponent({ ...args, color: '#ef4444' }),
};

// Not spinning
export const NotSpinning = {
  render: (args) => createSpinnerComponent({ ...args, spinning: false }),
};

// Slow animation
export const SlowAnimation = {
  render: (args) => createSpinnerComponent({ ...args, speed: 2000 }),
};

// Fast animation
export const FastAnimation = {
  render: (args) => createSpinnerComponent({ ...args, speed: 300 }),
};

// With custom label
export const WithCustomLabel = {
  render: (args) => createSpinnerComponent({ 
    ...args, 
    label: 'Processing your request...' 
  }),
};

// Loading states example
export const LoadingStates = {
  render: () => {
    const [loadingStates, setLoadingStates] = React.useState({
      button: false,
      form: false,
      data: false,
    });

    const toggleLoading = (key: string) => {
      setLoadingStates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const ButtonWithSpinner = ({ loading, onClick, children }) => (
      <button
        onClick={onClick}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          border: '1px solid #e5e7eb',
          backgroundColor: loading ? '#f3f4f6' : 'white',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          minWidth: '120px',
        }}
        disabled={loading}
      >
        {loading && createSpinnerComponent({ size: 'sm', color: '#6b7280' })}
        {children}
      </button>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3>Button Loading State</h3>
          <ButtonWithSpinner
            loading={loadingStates.button}
            onClick={() => {
              toggleLoading('button');
              setTimeout(() => toggleLoading('button'), 2000);
            }}
          >
            {loadingStates.button ? 'Loading...' : 'Click Me'}
          </ButtonWithSpinner>
        </div>

        <div>
          <h3>Form Submission</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            toggleLoading('form');
            setTimeout(() => toggleLoading('form'), 3000);
          }}>
            <input
              type="text"
              placeholder="Enter text..."
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                marginRight: '0.5rem',
              }}
              disabled={loadingStates.form}
            />
            <ButtonWithSpinner loading={loadingStates.form}>
              {loadingStates.form ? 'Submitting...' : 'Submit'}
            </ButtonWithSpinner>
          </form>
        </div>

        <div>
          <h3>Data Loading</h3>
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
                {createSpinnerComponent({ size: 'lg' })}
                <p>Loading data...</p>
              </div>
            ) : (
              <div>
                <p>Data loaded successfully!</p>
                <button
                  onClick={() => {
                    toggleLoading('data');
                    setTimeout(() => toggleLoading('data'), 2500);
                  }}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid #3182ce',
                    backgroundColor: 'white',
                    color: '#3182ce',
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

// Showcase
export const Showcase = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h3>Spinner Sizes</h3>
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          alignItems: 'center',
          marginTop: '1rem' 
        }}>
          <div style={{ textAlign: 'center' }}>
            {createSpinnerComponent({ size: 'xs' })}
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>XS</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            {createSpinnerComponent({ size: 'sm' })}
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>SM</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            {createSpinnerComponent({ size: 'md' })}
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>MD</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            {createSpinnerComponent({ size: 'lg' })}
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>LG</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            {createSpinnerComponent({ size: 'xl' })}
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>XL</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h3>Spinner Colors</h3>
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          alignItems: 'center',
          marginTop: '1rem' 
        }}>
          {createSpinnerComponent({ color: '#3182ce' })}
          {createSpinnerComponent({ color: '#ef4444' })}
          {createSpinnerComponent({ color: '#10b981' })}
          {createSpinnerComponent({ color: '#f59e0b' })}
          {createSpinnerComponent({ color: '#8b5cf6' })}
          {createSpinnerComponent({ color: '#ec4899' })}
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h3>Animation Speeds</h3>
        <div style={{ 
          display: 'flex', 
          gap: '3rem', 
          alignItems: 'center',
          marginTop: '1rem' 
        }}>
          <div style={{ textAlign: 'center' }}>
            {createSpinnerComponent({ speed: 300 })}
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Fast (300ms)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            {createSpinnerComponent({ speed: 750 })}
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Normal (750ms)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            {createSpinnerComponent({ speed: 1500 })}
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Slow (1500ms)</p>
          </div>
        </div>
      </div>

      <div>
        <h3>Spinner States</h3>
        <div style={{ 
          display: 'flex', 
          gap: '3rem', 
          alignItems: 'center',
          marginTop: '1rem' 
        }}>
          <div style={{ textAlign: 'center' }}>
            {createSpinnerComponent({ spinning: true })}
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Spinning</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            {createSpinnerComponent({ spinning: false })}
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Not Spinning</p>
          </div>
        </div>
      </div>
    </div>
  ),
};