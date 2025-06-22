import React from 'react';
import { createButtonWithImplementation } from './index';

export default {
  title: 'Primitives/Button',
  component: 'Button',
  parameters: {
    docs: {
      description: {
        component:
          'A flexible button component with multiple variants, sizes, and states.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'outline', 'ghost'],
      },
      description: 'The visual style of the button',
      defaultValue: 'primary',
    },
    size: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
      },
      description: 'The size of the button',
      defaultValue: 'md',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      defaultValue: false,
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
      defaultValue: false,
    },
    onClick: { action: 'clicked' },
  },
  tags: ['autodocs'],
};

// Create component templates
const createButtonComponent = (args) => {
  const button = createButtonWithImplementation({
    variant: args.variant,
    size: args.size,
    onClick: args.onClick,
  });

  // For now, we'll create a simple React component that simulates the button
  // In a real implementation, the React adapter would handle this
  const ButtonComponent = () => {
    const state = button.state.getState();
    const a11yProps = button.logic.getA11yProps('root');
    const handlers = button.logic.getInteractionHandlers('root');
    
    // Set initial state based on args
    React.useEffect(() => {
      if (args.disabled !== undefined) {
        button.state.setDisabled(args.disabled);
      }
      if (args.loading !== undefined) {
        button.state.setLoading(args.loading);
      }
    }, [args.disabled, args.loading]);

    // Force re-render when state changes
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    React.useEffect(() => {
      const unsubscribe = button.state.subscribe(() => {
        forceUpdate();
      });
      return unsubscribe;
    }, []);

    // We add basic styling directly here, in a real app you'd use your styling solution
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      borderRadius: '4px',
      cursor: state.disabled ? 'not-allowed' : 'pointer',
      opacity: state.disabled ? 0.6 : 1,
      transition: 'all 0.2s',
    };

    const variantStyles = {
      primary: {
        backgroundColor: '#3182ce',
        color: 'white',
        border: 'none',
      },
      secondary: {
        backgroundColor: '#718096',
        color: 'white',
        border: 'none',
      },
      outline: {
        backgroundColor: 'transparent',
        color: '#3182ce',
        border: '1px solid #3182ce',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#3182ce',
        border: 'none',
      },
    };

    const sizeStyles = {
      sm: {
        height: '32px',
        fontSize: '0.875rem',
        padding: '0 0.75rem',
      },
      md: {
        height: '40px',
        fontSize: '1rem',
        padding: '0 1rem',
      },
      lg: {
        height: '48px',
        fontSize: '1.125rem',
        padding: '0 1.5rem',
      },
    };

    const styles = {
      ...baseStyles,
      ...variantStyles[state.variant || 'primary'],
      ...sizeStyles[state.size || 'md'],
    };

    return (
      <button
        style={styles}
        disabled={state.disabled}
        onClick={() => handlers.onClick?.()}
        {...a11yProps}
      >
        {state.loading ? 'Loading...' : args.children || 'Button Text'}
      </button>
    );
  };

  return <ButtonComponent />;
};

// Primary variant
export const Primary = {
  render: (args) =>
    createButtonComponent({
      ...args,
      variant: 'primary',
      children: 'Primary Button',
    }),
};

// Secondary variant
export const Secondary = {
  render: (args) =>
    createButtonComponent({
      ...args,
      variant: 'secondary',
      children: 'Secondary Button',
    }),
};

// Outline variant
export const Outline = {
  render: (args) =>
    createButtonComponent({
      ...args,
      variant: 'outline',
      children: 'Outline Button',
    }),
};

// Ghost variant
export const Ghost = {
  render: (args) =>
    createButtonComponent({
      ...args,
      variant: 'ghost',
      children: 'Ghost Button',
    }),
};

// Small size
export const Small = {
  render: (args) =>
    createButtonComponent({
      ...args,
      size: 'sm',
      children: 'Small Button',
    }),
};

// Large size
export const Large = {
  render: (args) =>
    createButtonComponent({
      ...args,
      size: 'lg',
      children: 'Large Button',
    }),
};

// Disabled state
export const Disabled = {
  render: (args) =>
    createButtonComponent({
      ...args,
      disabled: true,
      children: 'Disabled Button',
    }),
};

// Loading state
export const Loading = {
  render: (args) =>
    createButtonComponent({
      ...args,
      loading: true,
    }),
};

// Button showcase
export const Showcase = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
      <div>
        <h3>Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {createButtonComponent({ variant: 'primary', children: 'Primary' })}
          {createButtonComponent({ variant: 'secondary', children: 'Secondary' })}
          {createButtonComponent({ variant: 'outline', children: 'Outline' })}
          {createButtonComponent({ variant: 'ghost', children: 'Ghost' })}
        </div>
      </div>
      
      <div>
        <h3>Sizes</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {createButtonComponent({ size: 'sm', children: 'Small' })}
          {createButtonComponent({ size: 'md', children: 'Medium' })}
          {createButtonComponent({ size: 'lg', children: 'Large' })}
        </div>
      </div>
      
      <div>
        <h3>States</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {createButtonComponent({ children: 'Normal' })}
          {createButtonComponent({ disabled: true, children: 'Disabled' })}
          {createButtonComponent({ loading: true })}
        </div>
      </div>
    </div>
  ),
};