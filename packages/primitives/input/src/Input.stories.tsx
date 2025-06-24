/**
 * Input Component Stories
 * Comprehensive showcase of all input features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createInputWithImplementation } from './index';
import { reactAdapter } from '@stellarix-ui/react';

// Create a wrapper component that creates individual Input instances
const InputWrapper = React.forwardRef((props: any, ref: any) => {
  const [input] = React.useState(() => createInputWithImplementation(props));
  const Input = React.useMemo(() => input.connect(reactAdapter), [input]);
  
  // Update the component's state when props change
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      input.state.setDisabled(props.disabled);
    }
  }, [props.disabled, input]);
  
  React.useEffect(() => {
    if (props.readonly !== undefined) {
      input.state.setReadonly(props.readonly);
    }
  }, [props.readonly, input]);
  
  React.useEffect(() => {
    if (props.required !== undefined) {
      input.state.setRequired(props.required);
    }
  }, [props.required, input]);
  
  React.useEffect(() => {
    if (props.error !== undefined) {
      input.state.setError(props.error);
    }
  }, [props.error, input]);
  
  React.useEffect(() => {
    if (props.value !== undefined) {
      input.state.setValue(props.value);
    }
  }, [props.value, input]);
  
  return <Input ref={ref} {...props} />;
});

InputWrapper.displayName = 'Input';

const meta: Meta<typeof InputWrapper> = {
  title: 'Primitives/Input',
  component: InputWrapper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A versatile input component supporting various types, sizes, and states.

## Features
- ✅ Multiple input types (text, email, password, number, tel, url, search)
- ✅ Three sizes (sm, md, lg)
- ✅ Disabled and readonly states
- ✅ Error states with messages
- ✅ Required field validation
- ✅ Full accessibility support
- ✅ Keyboard navigation
- ✅ Form integration

## Accessibility
- Uses semantic \`<input>\` element
- Proper ARIA attributes for states
- Keyboard accessible
- Screen reader friendly
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'The type of input',
      defaultValue: 'text',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the input',
      defaultValue: 'md',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    value: {
      control: 'text',
      description: 'InputWrapper value',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the input is readonly',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input has an error',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display',
    },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
  },
  args: {
    type: 'text',
    size: 'md',
    placeholder: 'Enter text...',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Enter your name...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Hello, World!',
  },
};

// InputWrapper Types
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

export const Tel: Story = {
  args: {
    type: 'tel',
    placeholder: '+1 (555) 123-4567',
  },
};

export const Url: Story = {
  args: {
    type: 'url',
    placeholder: 'https://example.com',
  },
};

// Size Variations
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium input',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
};

// State Variations
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    value: 'Cannot edit this',
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
    value: 'Read-only value',
  },
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Required field *',
  },
};

export const Error: Story = {
  args: {
    error: true,
    errorMessage: 'This field is required',
    placeholder: 'Invalid input',
  },
};

// Interactive Examples
export const ControlledInputWrapper: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('');
    
    return (
      <div>
        <InputWrapperWrapper 
          {...args}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            args.onChange?.(e);
          }}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Current value: "{value}"
        </p>
      </div>
    );
  },
};

export const WithValidation: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    
    const validate = (email: string) => {
      if (!email) {
        setError(true);
        setErrorMessage('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError(true);
        setErrorMessage('Please enter a valid email address');
      } else {
        setError(false);
        setErrorMessage('');
      }
    };
    
    return (
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Email Address
        </label>
        <InputWrapper 
          type="email"
          placeholder="email@example.com"
          value={value}
          error={error}
          errorMessage={errorMessage}
          onChange={(e) => {
            setValue(e.target.value);
            validate(e.target.value);
          }}
          onBlur={() => validate(value)}
        />
      </div>
    );
  },
};

// Form Example
export const LoginForm: Story = {
  render: () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Login with: ${email}`);
    };
    
    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Login Form</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Email
          </label>
          <InputWrapper
            type="email"
            placeholder="email@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Password
          </label>
          <InputWrapper
            type="password"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
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
          Sign In
        </button>
      </form>
    );
  },
};

// Showcase
export const Showcase: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>InputWrapper Component Showcase</h2>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>InputWrapper Types</h3>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
          <InputWrapper type="text" placeholder="Text input" />
          <InputWrapper type="email" placeholder="Email input" />
          <InputWrapper type="password" placeholder="Password input" />
          <InputWrapper type="number" placeholder="Number input" />
          <InputWrapper type="search" placeholder="Search input" />
          <InputWrapper type="tel" placeholder="Phone input" />
          <InputWrapper type="url" placeholder="URL input" />
        </div>
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Sizes</h3>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
          <InputWrapper size="sm" placeholder="Small input" />
          <InputWrapper size="md" placeholder="Medium input" />
          <InputWrapper size="lg" placeholder="Large input" />
        </div>
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>States</h3>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
          <InputWrapper placeholder="Normal input" />
          <InputWrapper disabled placeholder="Disabled input" />
          <InputWrapper readonly value="Read-only value" />
          <InputWrapper required placeholder="Required field *" />
          <InputWrapper error errorMessage="This field has an error" placeholder="Error state" />
        </div>
      </section>
    </div>
  ),
};

// Edge Cases
export const LongText: Story = {
  args: {
    value: 'This is a very long text that might overflow the input field and should be handled gracefully by the component',
  },
};

export const SpecialCharacters: Story = {
  args: {
    value: '!@#$%^&*()_+-=[]{}|;\':",./<>?',
  },
};

// Stress Test
export const StressTest: Story = {
  render: () => {
    const [values, setValues] = React.useState<Record<number, string>>({});
    
    return (
      <div style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Performance Test: 50 InputWrappers</h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.5rem',
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          padding: '1rem'
        }}>
          {Array.from({ length: 50 }, (_, i) => (
            <InputWrapper
              key={i}
              size="sm"
              placeholder={`InputWrapper ${i + 1}`}
              value={values[i] || ''}
              onChange={(e) => setValues(prev => ({ ...prev, [i]: e.target.value }))}
            />
          ))}
        </div>
      </div>
    );
  },
};