/**
 * Radio Component Stories
 * Comprehensive showcase of all radio features and states
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createRadio } from './index';
import { reactAdapter } from '@stellarix-ui/react';

// Create the React radio component using the direct pattern
const RadioComponent = ({ ...props }) => {
  const radio = React.useMemo(() => createRadio(props), []);
  const [state, setState] = React.useState(() => radio.state.getState());
  
  React.useEffect(() => {
    const unsubscribe = radio.state.subscribe(setState);
    return unsubscribe;
  }, [radio]);

  const a11yProps = radio.logic.getA11yProps('root');
  const handlers = radio.logic.getInteractionHandlers('root');

  return (
    <input
      type="radio"
      {...a11yProps}
      {...handlers}
      checked={state.checked}
      disabled={state.disabled}
      name={props.name}
      value={props.value}
      style={{ cursor: state.disabled ? 'not-allowed' : 'pointer' }}
    />
  );
};

const Radio = RadioComponent;

// Decorator to add visual styles to the headless radio
const withRadioStyles = (Story: any) => {
  return (
    <>
      <style>{`
        input[type="radio"] {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          background-color: white;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          margin: 0;
        }
        
        input[type="radio"]:checked {
          border-color: #3b82f6;
        }
        
        input[type="radio"]:checked::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #3b82f6;
        }
        
        input[type="radio"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #f3f4f6;
        }
        
        input[type="radio"]:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        input[type="radio"]:hover:not(:disabled) {
          border-color: #3b82f6;
        }
        
        /* Size variants */
        input[type="radio"].radio-sm {
          width: 16px;
          height: 16px;
        }
        
        input[type="radio"].radio-sm::after {
          width: 8px;
          height: 8px;
        }
        
        input[type="radio"].radio-lg {
          width: 24px;
          height: 24px;
        }
        
        input[type="radio"].radio-lg::after {
          width: 12px;
          height: 12px;
        }
        
        /* Radio group styling */
        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .radio-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .radio-item label {
          cursor: pointer;
          user-select: none;
        }
        
        .radio-item input[type="radio"]:disabled + label {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
      <Story />
    </>
  );
};

const meta: Meta<typeof Radio> = {
  title: 'Primitives/Radio',
  component: Radio,
  decorators: [withRadioStyles],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A radio input component for selecting one option from a group.

## Features
- ✅ Radio buttons are mutually exclusive within a group
- ✅ Disabled state support
- ✅ Required field validation
- ✅ Error state with messages
- ✅ Full accessibility support (WCAG 2.1 AA)
- ✅ Keyboard navigation (Space to select)
- ✅ Form integration

## Accessibility
- Uses semantic \`role="radio"\`
- Proper ARIA attributes for states
- Keyboard accessible with Space key
- Screen reader friendly labels
        `,
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Name attribute for radio group (required)',
    },
    value: {
      control: 'text',
      description: 'Value attribute for this radio option (required)',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the radio is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the radio is required',
    },
    id: {
      control: 'text',
      description: 'ID attribute for the radio',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      control: 'text',
      description: 'Label text for the radio',
    },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
  },
  args: {
    name: 'example-radio',
    value: 'option1',
    children: 'Radio Option',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {
  args: {
    children: 'Default Radio',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    children: 'Checked Radio',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Radio',
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    children: 'Disabled Checked Radio',
  },
};

export const Required: Story = {
  args: {
    required: true,
    children: 'Required Radio *',
  },
};

// Radio Group Example
export const RadioGroup: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState<string>('option2');
    
    const handleChange = (checked: boolean, value: string) => {
      if (checked) {
        setSelectedValue(value);
      }
    };

    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2 (Default)' },
      { value: 'option3', label: 'Option 3' },
      { value: 'option4', label: 'Option 4 (Disabled)', disabled: true },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
          Select an option:
        </h3>
        {options.map((option) => {
          return (
            <label
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: option.disabled ? 'not-allowed' : 'pointer',
                opacity: option.disabled ? 0.6 : 1,
              }}
            >
              <Radio
                name="radio-group"
                value={option.value}
                checked={selectedValue === option.value}
                disabled={option.disabled}
                onChange={handleChange}
              />
              {option.label}
            </label>
          );
        })}
        <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Selected:</strong> {selectedValue}
        </div>
      </div>
    );
  },
};

// Form Integration
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      plan: '',
      frequency: 'monthly',
    });
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Selected plan: ${formData.plan}\nBilling: ${formData.frequency}`);
    };
    
    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Choose Your Plan</h3>
        
        <fieldset style={{ border: '1px solid #e5e7eb', padding: '1rem', marginBottom: '1.5rem' }}>
          <legend style={{ fontWeight: 'bold', padding: '0 0.5rem' }}>Plan Type *</legend>
          {['basic', 'pro', 'enterprise'].map((plan) => {
            return (
              <label key={plan} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                <Radio
                  name="plan"
                  value={plan}
                  checked={formData.plan === plan}
                  required={true}
                  onChange={(checked) => {
                    if (checked) setFormData(prev => ({ ...prev, plan }));
                  }}
                />
                {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
              </label>
            );
          })}
        </fieldset>
        
        <fieldset style={{ border: '1px solid #e5e7eb', padding: '1rem', marginBottom: '1.5rem' }}>
          <legend style={{ fontWeight: 'bold', padding: '0 0.5rem' }}>Billing Frequency</legend>
          {[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly (Save 20%)' },
          ].map((freq) => {
            return (
              <label key={freq.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                <Radio
                  name="frequency"
                  value={freq.value}
                  checked={formData.frequency === freq.value}
                  onChange={(checked) => {
                    if (checked) setFormData(prev => ({ ...prev, frequency: freq.value }));
                  }}
                />
                {freq.label}
              </label>
            );
          })}
        </fieldset>
        
        <button type="submit" style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          fontSize: '1rem',
        }}>
          Continue
        </button>
      </form>
    );
  },
};

// Error State
export const WithError: Story = {
  render: () => {
    const [error, setError] = React.useState(true);
    const [errorMessage] = React.useState('Please select an option');
    
    return (
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio
            name="error-radio"
            value="option1"
            id="error-radio"
            error={error}
            errorMessage={errorMessage}
          />
          <span>Option with Error</span>
        </label>
        <div id="error-radio-error" style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
          {errorMessage}
        </div>
      </div>
    );
  },
};

// Accessibility Features
export const AccessibilityDemo: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState<string>('');
    
    const options = [
      { value: 'tab', label: 'Navigate with Tab key' },
      { value: 'space', label: 'Select with Space key' },
      { value: 'screen-reader', label: 'Accessible to screen readers' },
    ];

    return (
      <fieldset style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '4px' }}>
        <legend style={{ fontWeight: '600', padding: '0 8px' }}>
          Accessibility Features (Required)
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          {options.map((option) => {
            return (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Radio
                  name="accessibility-group"
                  value={option.value}
                  checked={selectedValue === option.value}
                  required={true}
                  onChange={(checked) => {
                    if (checked) setSelectedValue(option.value);
                  }}
                />
                {option.label}
              </label>
            );
          })}
        </div>
        <div style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
          <p><strong>Keyboard Navigation:</strong></p>
          <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
            <li>Tab: Move focus between radio buttons</li>
            <li>Space: Select the focused radio button</li>
            <li>All radios have proper ARIA attributes</li>
          </ul>
        </div>
      </fieldset>
    );
  },
};

// Comprehensive Showcase
export const Showcase: Story = {
  render: () => {
    const [values, setValues] = React.useState<Record<string, string>>({
      size: 'medium',
      color: 'blue',
      priority: 'normal',
    });
    
    const handleChange = (group: string, value: string) => {
      setValues(prev => ({ ...prev, [group]: value }));
    };

    return (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Radio Component Showcase</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
              Size Selection
            </h4>
            {['small', 'medium', 'large'].map((size) => {
              return (
                <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                  <Radio
                    name="size"
                    value={size}
                    checked={values.size === size}
                    onChange={(checked) => {
                      if (checked) handleChange('size', size);
                    }}
                  />
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </label>
              );
            })}
          </div>
          
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
              Color Theme
            </h4>
            {[
              { value: 'blue', label: 'Blue', disabled: false },
              { value: 'green', label: 'Green', disabled: false },
              { value: 'red', label: 'Red (Disabled)', disabled: true },
            ].map((color) => {
              return (
                <label 
                  key={color.value} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '8px', 
                    cursor: color.disabled ? 'not-allowed' : 'pointer',
                    opacity: color.disabled ? 0.6 : 1,
                  }}
                >
                  <Radio
                    name="color"
                    value={color.value}
                    checked={values.color === color.value}
                    disabled={color.disabled}
                    onChange={(checked) => {
                      if (checked) handleChange('color', color.value);
                    }}
                  />
                  {color.label}
                </label>
              );
            })}
          </div>
          
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
              Priority Level *
            </h4>
            {['low', 'normal', 'high', 'urgent'].map((priority) => {
              return (
                <label key={priority} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                  <Radio
                    name="priority"
                    value={priority}
                    checked={values.priority === priority}
                    required={true}
                    onChange={(checked) => {
                      if (checked) handleChange('priority', priority);
                    }}
                  />
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </label>
              );
            })}
          </div>
        </div>
        
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Current Selections:</strong>
          <pre style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            {JSON.stringify(values, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};