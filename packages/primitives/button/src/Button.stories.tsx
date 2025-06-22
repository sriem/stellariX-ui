import React from 'react';
import { createButton } from './index';
import { reactAdapter } from '@stellarix/react';

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
const createButtonComponent = args => {
  const button = createButton({
    variant: args.variant,
    size: args.size,
    onClick: args.onClick,
    defaultDisabled: args.disabled,
    defaultLoading: args.loading,
  });

  const Button = button.connect(reactAdapter);

  // We add basic styling directly here, in a real app you'd use your styling solution
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    borderRadius: '4px',
    cursor: args.disabled ? 'not-allowed' : 'pointer',
    opacity: args.disabled ? 0.6 : 1,
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
    ...variantStyles[args.variant || 'primary'],
    ...sizeStyles[args.size || 'md'],
  };

  return (
    <Button style={styles}>
      {args.loading ? 'Loading...' : args.children || 'Button Text'}
    </Button>
  );
};

// Primary variant
export const Primary = {
  render: args =>
    createButtonComponent({
      ...args,
      variant: 'primary',
      children: 'Primary Button',
    }),
};

// Secondary variant
export const Secondary = {
  render: args =>
    createButtonComponent({
      ...args,
      variant: 'secondary',
      children: 'Secondary Button',
    }),
};

// Outline variant
export const Outline = {
  render: args =>
    createButtonComponent({
      ...args,
      variant: 'outline',
      children: 'Outline Button',
    }),
};

// Ghost variant
export const Ghost = {
  render: args =>
    createButtonComponent({
      ...args,
      variant: 'ghost',
      children: 'Ghost Button',
    }),
};

// Small size
export const Small = {
  render: args =>
    createButtonComponent({
      ...args,
      size: 'sm',
      children: 'Small Button',
    }),
};

// Large size
export const Large = {
  render: args =>
    createButtonComponent({
      ...args,
      size: 'lg',
      children: 'Large Button',
    }),
};

// Disabled state
export const Disabled = {
  render: args =>
    createButtonComponent({
      ...args,
      disabled: true,
      children: 'Disabled Button',
    }),
};

// Loading state
export const Loading = {
  render: args =>
    createButtonComponent({
      ...args,
      loading: true,
    }),
};
