import React from 'react';
import { createDividerWithImplementation } from './index';
import { reactAdapter } from '@stellarix/react';

export default {
  title: 'Primitives/Divider',
  component: 'Divider',
  parameters: {
    docs: {
      description: {
        component:
          'A visual separator between content sections with multiple variants and orientations.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical'],
      },
      description: 'The orientation of the divider',
      defaultValue: 'horizontal',
    },
    variant: {
      control: {
        type: 'select',
        options: ['solid', 'dashed', 'dotted'],
      },
      description: 'The visual style of the divider',
      defaultValue: 'solid',
    },
    label: {
      control: 'text',
      description: 'Optional label text for the divider',
    },
    labelPosition: {
      control: {
        type: 'select',
        options: ['start', 'center', 'end'],
      },
      description: 'Position of the label',
      defaultValue: 'center',
    },
    spacing: {
      control: 'text',
      description: 'Spacing around the divider (CSS units)',
      defaultValue: '1rem',
    },
    thickness: {
      control: 'text',
      description: 'Thickness of the divider line (CSS units)',
      defaultValue: '1px',
    },
    color: {
      control: 'color',
      description: 'Color of the divider',
      defaultValue: '#e2e8f0',
    },
  },
  tags: ['autodocs'],
};

// Create component template
const createDividerComponent = (args) => {
  const divider = createDividerWithImplementation({
    orientation: args.orientation,
    variant: args.variant,
    label: args.label,
    labelPosition: args.labelPosition,
    spacing: args.spacing,
    thickness: args.thickness,
    color: args.color,
  });

  // For now, we'll create a simple React component manually
  // In a real implementation, the adapter would handle this
  const DividerComponent = () => {
    const [componentState, setComponentState] = React.useState(() => divider.state.getState());
    const a11yProps = divider.logic.getA11yProps('root');
    const interactionProps = divider.logic.getInteractionHandlers('root');
    
    // Subscribe to state changes
    React.useEffect(() => {
      const unsubscribe = divider.state.subscribe(setComponentState);
      return unsubscribe;
    }, []);
    
    const baseStyles = {
      ...interactionProps.style,
      backgroundColor: componentState.variant === 'solid' ? (args.color || '#e2e8f0') : 'transparent',
      border: componentState.variant !== 'solid' ? `${args.thickness || '1px'} ${componentState.variant} ${args.color || '#e2e8f0'}` : 'none',
    };

    if (args.label) {
      // With label - more complex layout
      return (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            width: componentState.orientation === 'horizontal' ? '100%' : 'auto',
            height: componentState.orientation === 'vertical' ? '100%' : 'auto',
          }}
        >
          {args.labelPosition !== 'start' && (
            <div style={{ ...baseStyles, flex: args.labelPosition === 'center' ? 1 : 0 }} {...a11yProps} />
          )}
          <span style={{ 
            color: '#64748b', 
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
          }}>
            {args.label}
          </span>
          {args.labelPosition !== 'end' && (
            <div style={{ ...baseStyles, flex: args.labelPosition === 'center' ? 1 : 0 }} {...a11yProps} />
          )}
        </div>
      );
    }

    // Simple divider without label
    return <hr style={baseStyles} {...a11yProps} />;
  };

  return <DividerComponent />;
};

// Default horizontal divider
export const Default = {
  render: (args) => createDividerComponent(args),
};

// Vertical divider
export const Vertical = {
  render: (args) => (
    <div style={{ height: '200px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <div>Content on the left</div>
      {createDividerComponent({ ...args, orientation: 'vertical' })}
      <div>Content on the right</div>
    </div>
  ),
};

// Dashed variant
export const Dashed = {
  render: (args) => createDividerComponent({ ...args, variant: 'dashed' }),
};

// Dotted variant
export const Dotted = {
  render: (args) => createDividerComponent({ ...args, variant: 'dotted' }),
};

// With centered label
export const WithLabel = {
  render: (args) => createDividerComponent({ ...args, label: 'OR' }),
};

// With start-aligned label
export const LabelStart = {
  render: (args) => createDividerComponent({ 
    ...args, 
    label: 'Section Title',
    labelPosition: 'start',
  }),
};

// With end-aligned label
export const LabelEnd = {
  render: (args) => createDividerComponent({ 
    ...args, 
    label: 'End of Section',
    labelPosition: 'end',
  }),
};

// Custom styling
export const CustomStyling = {
  render: (args) => createDividerComponent({ 
    ...args, 
    color: '#3182ce',
    thickness: '3px',
    spacing: '2rem',
  }),
};

// Multiple dividers showcase
export const Showcase = {
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3>Basic Dividers</h3>
        {createDividerComponent({ variant: 'solid' })}
        <p>Some content here</p>
        {createDividerComponent({ variant: 'dashed' })}
        <p>More content</p>
        {createDividerComponent({ variant: 'dotted' })}
      </div>
      
      <div>
        <h3>With Labels</h3>
        {createDividerComponent({ label: 'OR', color: '#64748b' })}
        {createDividerComponent({ label: 'Section Break', labelPosition: 'start', variant: 'dashed' })}
        {createDividerComponent({ label: 'End', labelPosition: 'end', color: '#ef4444' })}
      </div>
    </div>
  ),
};