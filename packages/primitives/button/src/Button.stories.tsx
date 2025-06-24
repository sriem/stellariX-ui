/**
 * Button Component Stories
 * Comprehensive showcase of all button features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createButtonWithImplementation } from './index';
import { reactAdapter } from '@stellarix-ui/react';

// Create a wrapper component that creates individual Button instances
const ButtonWrapper = React.forwardRef((props: any, ref: any) => {
  const [button] = React.useState(() => createButtonWithImplementation(props));
  const Button = React.useMemo(() => button.connect(reactAdapter), [button]);
  
  // Update the component's state when props change
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      button.state.setDisabled(props.disabled);
    }
  }, [props.disabled, button]);
  
  React.useEffect(() => {
    if (props.loading !== undefined) {
      button.state.setLoading(props.loading);
    }
  }, [props.loading, button]);
  
  return <Button ref={ref} {...props} />;
});

ButtonWrapper.displayName = 'Button';

const meta: Meta<typeof ButtonWrapper> = {
  title: 'Primitives/Button',
  component: ButtonWrapper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A flexible button component with multiple variants, sizes, and states.

## Features
- ✅ Multiple variants (primary, secondary, outline, ghost)
- ✅ Three sizes (sm, md, lg)
- ✅ Disabled state
- ✅ Loading state
- ✅ Full accessibility support (WCAG 2.1 AA)
- ✅ Keyboard navigation
- ✅ Custom styling support

## Accessibility
- Uses semantic \`<button>\` element
- Supports keyboard navigation (Enter/Space)
- Focus management and visual indicators
- Screen reader friendly with proper ARIA attributes
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'The visual style of the button',
      defaultValue: 'primary',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button',
      defaultValue: 'md',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
    },
    onClick: { action: 'clicked' },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
  args: {
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

// Size Variations
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

// State Variations
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
};

// Interactive Examples
export const WithClickHandler: Story = {
  render: (args) => {
    const [clickCount, setClickCount] = React.useState(0);
    
    return (
      <div>
        <ButtonWrapper 
          {...args}
          onClick={() => {
            setClickCount(prev => prev + 1);
            args.onClick?.();
          }}
        >
          Clicked {clickCount} times
        </Button>
      </div>
    );
  },
};

// Comprehensive Showcase
export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Variants</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <ButtonWrapper variant="primary">Primary</Button>
          <ButtonWrapper variant="secondary">Secondary</Button>
          <ButtonWrapper variant="outline">Outline</Button>
          <ButtonWrapper variant="ghost">Ghost</Button>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Sizes</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ButtonWrapper size="sm">Small</Button>
          <ButtonWrapper size="md">Medium</Button>
          <ButtonWrapper size="lg">Large</Button>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>States</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <ButtonWrapper>Normal</Button>
          <ButtonWrapper disabled>Disabled</Button>
          <ButtonWrapper loading>Loading</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>All Combinations</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {(['primary', 'secondary', 'outline', 'ghost'] as const).map(variant => (
            <React.Fragment key={variant}>
              <ButtonWrapper variant={variant} size="sm">{variant} sm</Button>
              <ButtonWrapper variant={variant} size="md">{variant} md</Button>
              <ButtonWrapper variant={variant} size="lg">{variant} lg</Button>
              <ButtonWrapper variant={variant} disabled>{variant} disabled</Button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  ),
};

// Keyboard Navigation Test
export const KeyboardNavigation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        <strong>Keyboard Navigation Test:</strong><br />
        Use <kbd>Tab</kbd> to navigate between buttons<br />
        Use <kbd>Enter</kbd> or <kbd>Space</kbd> to activate the focused button
      </p>
      
      {[1, 2, 3, 4].map((num) => (
        <ButtonWrapper 
          key={num} 
          onClick={() => alert(`Button ${num} clicked!`)}
        >
          Button {num} (Press Enter/Space to activate)
        </Button>
      ))}
      
      <ButtonWrapper disabled>
        Disabled button (Not focusable)
      </Button>
    </div>
  ),
};

// Stress Test
export const StressTest: Story = {
  render: () => {
    const [lastClicked, setLastClicked] = React.useState<number | null>(null);
    
    return (
      <div>
        <p style={{ marginBottom: '16px' }}>
          <strong>Performance Test:</strong> 100 interactive buttons<br />
          Last clicked: {lastClicked !== null ? `Button ${lastClicked}` : 'None'}
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
          gap: '8px',
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          {Array.from({ length: 100 }, (_, index) => (
            <ButtonWrapper
              key={index}
              size="sm"
              variant={index % 4 === 0 ? 'primary' : index % 4 === 1 ? 'secondary' : index % 4 === 2 ? 'outline' : 'ghost'}
              onClick={() => setLastClicked(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    );
  },
};