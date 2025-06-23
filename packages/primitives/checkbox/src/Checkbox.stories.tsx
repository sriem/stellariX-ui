/**
 * Checkbox Component Stories
 * Comprehensive showcase of all checkbox features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createCheckboxWithImplementation } from './index';
import { reactAdapter } from '@stellarix/react';

// Create a wrapper component that creates individual Checkbox instances
const CheckboxWrapper = React.forwardRef((props: any, ref: any) => {
  const [checkbox] = React.useState(() => createCheckboxWithImplementation(props));
  const Component = React.useMemo(() => checkbox.connect(reactAdapter), [checkbox]);
  
  // Update the checkbox's state when props change
  React.useEffect(() => {
    if (props.checked !== undefined) {
      if (props.checked === 'indeterminate') {
        checkbox.state.setIndeterminate(true);
      } else {
        checkbox.state.setChecked(props.checked);
        checkbox.state.setIndeterminate(false);
      }
    }
  }, [props.checked, checkbox]);
  
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      checkbox.state.setDisabled(props.disabled);
    }
  }, [props.disabled, checkbox]);
  
  React.useEffect(() => {
    if (props.error !== undefined) {
      checkbox.state.setError(props.error, props.errorMessage);
    }
  }, [props.error, props.errorMessage, checkbox]);
  
  // Connect onChange handler
  React.useEffect(() => {
    if (props.onChange) {
      const unsubscribe = checkbox.state.subscribe((state) => {
        // Only call onChange if it's a user interaction
        if (state.checked !== (props.checked === true)) {
          props.onChange(state.checked);
        }
      });
      return unsubscribe;
    }
  }, [props.onChange, props.checked, checkbox]);
  
  // Add size class for styling
  const className = `${props.className || ''} ${props.size ? `checkbox-${props.size}` : ''}`.trim();
  
  return <Component ref={ref} {...props} className={className} />;
});

CheckboxWrapper.displayName = 'Checkbox';

const Checkbox = CheckboxWrapper;

// Decorator to add visual styles to the headless checkbox
const withCheckboxStyles = (Story: any) => {
  return (
    <>
      <style>{`
        input[type="checkbox"] {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          background-color: white;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          margin: 0;
        }
        
        input[type="checkbox"]:checked {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
        
        input[type="checkbox"]:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 14px;
          font-weight: bold;
        }
        
        input[type="checkbox"]:indeterminate {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
        
        input[type="checkbox"]:indeterminate::after {
          content: '−';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 16px;
          font-weight: bold;
        }
        
        input[type="checkbox"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #f3f4f6;
        }
        
        input[type="checkbox"]:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        input[type="checkbox"]:hover:not(:disabled) {
          border-color: #3b82f6;
        }
        
        /* Error state */
        input[type="checkbox"][aria-invalid="true"] {
          border-color: #ef4444;
        }
        
        input[type="checkbox"][aria-invalid="true"]:focus {
          outline-color: #ef4444;
        }
        
        /* Size variants */
        input[type="checkbox"].checkbox-sm {
          width: 16px;
          height: 16px;
        }
        
        input[type="checkbox"].checkbox-sm::after {
          font-size: 12px;
        }
        
        input[type="checkbox"].checkbox-lg {
          width: 24px;
          height: 24px;
        }
        
        input[type="checkbox"].checkbox-lg::after {
          font-size: 18px;
        }
      `}</style>
      <Story />
    </>
  );
};

const meta: Meta<typeof Checkbox> = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  decorators: [withCheckboxStyles],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A framework-agnostic checkbox component that supports checked, unchecked, and indeterminate states.

## Features
- ✅ Checked, unchecked, and indeterminate states
- ✅ Disabled state
- ✅ Error state with custom messages
- ✅ Required field validation
- ✅ Keyboard navigation (Space key)
- ✅ Full accessibility support (WCAG 2.1 AA)
- ✅ Form integration
- ✅ Custom styling support

## Accessibility
- Uses semantic \`role="checkbox"\`
- Supports \`aria-checked="mixed"\` for indeterminate state
- Keyboard navigation with Space key
- Focus management and visual indicators
- Screen reader friendly labels and descriptions
        `,
      },
    },
  },
  argTypes: {
    checked: {
      control: { type: 'select' },
      options: [false, true, 'indeterminate'],
      description: 'The checked state of the checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the checkbox is required',
    },
    name: {
      control: 'text',
      description: 'Name attribute for form submission',
    },
    value: {
      control: 'text',
      description: 'Value attribute for form submission',
    },
    id: {
      control: 'text',
      description: 'ID attribute for the checkbox',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      control: 'text',
      description: 'Label text for the checkbox',
    },
  },
  args: {
    children: 'Accept terms and conditions',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    checked: 'indeterminate',
    children: 'Select all items (some selected)',
  },
};

// State Variations
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled checkbox',
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    children: 'Disabled checked checkbox',
  },
};

export const Required: Story = {
  args: {
    required: true,
    children: 'Required field *',
  },
};

export const WithError: Story = {
  render: (args) => {
    const errorCheckbox = createCheckboxWithImplementation({
      ...args,
    });
    
    // Set error state
    React.useEffect(() => {
      errorCheckbox.state.setError(true, 'This field is required');
    }, []);
    
    const ErrorCheckbox = errorCheckbox.connect(reactAdapter);
    
    return (
      <div>
        <ErrorCheckbox {...args} />
        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          This field is required
        </div>
      </div>
    );
  },
  args: {
    children: 'Checkbox with error',
    required: true,
  },
};

// Interactive Examples
export const WithFormIntegration: Story = {
  render: (args) => {
    const [formData, setFormData] = React.useState({
      newsletter: false,
      terms: false,
      marketing: 'indeterminate' as const,
    });

    const handleChange = (name: string) => (checked: boolean | 'indeterminate') => {
      setFormData(prev => ({ ...prev, [name]: checked }));
    };

    return (
      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Checkbox
            checked={formData.newsletter}
            onChange={handleChange('newsletter')}
            name="newsletter"
            value="yes"
          />
          Subscribe to newsletter
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Checkbox
            checked={formData.terms}
            onChange={handleChange('terms')}
            name="terms"
            value="accepted"
            required
          />
          Accept terms and conditions *
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Checkbox
            checked={formData.marketing}
            onChange={handleChange('marketing')}
            name="marketing"
            value="enabled"
          />
          Marketing preferences (indeterminate)
        </label>
        
        <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Form Data:</strong>
          <pre style={{ fontSize: '12px', margin: '8px 0 0 0' }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </form>
    );
  },
};

// Boundary and Edge Cases
export const AllStatesShowcase: Story = {
  render: () => {
    const states = [
      { checked: false, disabled: false, label: 'Unchecked' },
      { checked: true, disabled: false, label: 'Checked' },
      { checked: 'indeterminate' as const, disabled: false, label: 'Indeterminate' },
      { checked: false, disabled: true, label: 'Disabled unchecked' },
      { checked: true, disabled: true, label: 'Disabled checked' },
      { checked: 'indeterminate' as const, disabled: true, label: 'Disabled indeterminate' },
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {states.map((state, index) => (
          <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Checkbox
              checked={state.checked}
              disabled={state.disabled}
              name={`state-${index}`}
              value={state.label.toLowerCase().replace(/\s+/g, '-')}
            />
            {state.label}
          </label>
        ))}
      </div>
    );
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        <strong>Keyboard Navigation Test:</strong><br />
        Use <kbd>Tab</kbd> to navigate between checkboxes<br />
        Use <kbd>Space</kbd> to toggle the focused checkbox
      </p>
      
      {[1, 2, 3, 4].map((num) => (
        <label key={num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Checkbox
            name={`keyboard-${num}`}
            value={`option-${num}`}
            id={`checkbox-${num}`}
          />
          Checkbox {num} (Use Space to toggle)
        </label>
      ))}
      
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Checkbox
          disabled
          name="keyboard-disabled"
          value="disabled"
          id="checkbox-disabled"
        />
        Disabled checkbox (Not focusable)
      </label>
    </div>
  ),
};

// Stress Testing
export const StressTest: Story = {
  render: () => {
    const [checkedItems, setCheckedItems] = React.useState<Set<number>>(new Set());
    
    const handleToggle = (index: number) => (checked: boolean | 'indeterminate') => {
      setCheckedItems(prev => {
        const newSet = new Set(prev);
        if (checked) {
          newSet.add(index);
        } else {
          newSet.delete(index);
        }
        return newSet;
      });
    };

    return (
      <div>
        <p style={{ marginBottom: '16px' }}>
          <strong>Performance Test:</strong> 100 interactive checkboxes<br />
          Selected: {checkedItems.size}/100
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '8px',
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          {Array.from({ length: 100 }, (_, index) => (
            <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <Checkbox
                checked={checkedItems.has(index)}
                onChange={handleToggle(index)}
                name={`stress-${index}`}
                value={`item-${index}`}
                id={`stress-checkbox-${index}`}
              />
              Item {index + 1}
            </label>
          ))}
        </div>
      </div>
    );
  },
};

