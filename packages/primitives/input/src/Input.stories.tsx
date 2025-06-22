import React from 'react';
import { createInputWithImplementation } from './index';

export default {
  title: 'Primitives/Input',
  component: 'Input',
  parameters: {
    docs: {
      description: {
        component:
          'A versatile input component supporting various types, sizes, and states.',
      },
    },
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      },
      description: 'The type of input',
      defaultValue: 'text',
    },
    size: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
      },
      description: 'The size of the input',
      defaultValue: 'md',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      defaultValue: 'Enter text...',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      defaultValue: false,
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the input is readonly',
      defaultValue: false,
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
      defaultValue: false,
    },
    error: {
      control: 'boolean',
      description: 'Whether the input has an error',
      defaultValue: false,
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display',
    },
  },
  tags: ['autodocs'],
};

// Create component template
const createInputComponent = (args) => {
  const input = createInputWithImplementation({
    type: args.type,
    size: args.size,
    placeholder: args.placeholder,
    disabled: args.disabled,
    readonly: args.readonly,
    required: args.required,
    error: args.error,
    errorMessage: args.errorMessage,
    onChange: args.onChange,
  });

  const InputComponent = () => {
    const state = input.state.getState();
    const a11yProps = input.logic.getA11yProps('root');
    const handlers = input.logic.getInteractionHandlers('root');

    // Update state based on args
    React.useEffect(() => {
      if (args.disabled !== undefined) input.state.setDisabled(args.disabled);
      if (args.readonly !== undefined) input.state.setReadonly(args.readonly);
      if (args.required !== undefined) input.state.setRequired(args.required);
      if (args.error !== undefined) input.state.setError(args.error, args.errorMessage);
      if (args.type) input.state.setType(args.type);
      if (args.size) input.state.setSize(args.size);
    }, [args]);

    // Force re-render when state changes
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    React.useEffect(() => {
      const unsubscribe = input.state.subscribe(() => {
        forceUpdate();
      });
      return unsubscribe;
    }, []);

    const baseStyles = {
      fontFamily: 'sans-serif',
      borderRadius: '4px',
      border: '1px solid',
      borderColor: state.error ? '#ef4444' : state.focused ? '#3182ce' : '#e5e7eb',
      backgroundColor: state.disabled ? '#f3f4f6' : 'white',
      color: state.disabled ? '#9ca3af' : '#111827',
      outline: 'none',
      transition: 'all 0.2s',
      width: '100%',
      boxSizing: 'border-box',
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
        padding: '0 1.25rem',
      },
    };

    const styles = {
      ...baseStyles,
      ...sizeStyles[state.size || 'md'],
      cursor: state.disabled ? 'not-allowed' : state.readonly ? 'default' : 'text',
    };

    return (
      <div style={{ width: '100%' }}>
        <input
          {...handlers}
          {...a11yProps}
          type={state.type}
          style={styles}
          placeholder={args.placeholder}
          disabled={state.disabled}
          readOnly={state.readonly}
          required={state.required}
          value={state.value}
          onChange={handlers.onChange}
          onFocus={handlers.onFocus}
          onBlur={handlers.onBlur}
          onInput={handlers.onInput}
          onKeyDown={handlers.onKeyDown}
        />
        {state.error && state.errorMessage && (
          <div style={{ 
            color: '#ef4444', 
            fontSize: '0.875rem', 
            marginTop: '0.25rem' 
          }}>
            {state.errorMessage}
          </div>
        )}
      </div>
    );
  };

  return <InputComponent />;
};

// Default input
export const Default = {
  render: (args) => createInputComponent(args),
};

// With placeholder
export const WithPlaceholder = {
  render: (args) => createInputComponent({ 
    ...args, 
    placeholder: 'Enter your name...' 
  }),
};

// Email input
export const Email = {
  render: (args) => createInputComponent({ 
    ...args, 
    type: 'email',
    placeholder: 'email@example.com' 
  }),
};

// Password input
export const Password = {
  render: (args) => createInputComponent({ 
    ...args, 
    type: 'password',
    placeholder: 'Enter password' 
  }),
};

// Number input
export const Number = {
  render: (args) => createInputComponent({ 
    ...args, 
    type: 'number',
    placeholder: 'Enter a number' 
  }),
};

// Search input
export const Search = {
  render: (args) => createInputComponent({ 
    ...args, 
    type: 'search',
    placeholder: 'Search...' 
  }),
};

// Small size
export const Small = {
  render: (args) => createInputComponent({ 
    ...args, 
    size: 'sm',
    placeholder: 'Small input' 
  }),
};

// Large size
export const Large = {
  render: (args) => createInputComponent({ 
    ...args, 
    size: 'lg',
    placeholder: 'Large input' 
  }),
};

// Disabled state
export const Disabled = {
  render: (args) => createInputComponent({ 
    ...args, 
    disabled: true,
    placeholder: 'Disabled input' 
  }),
};

// Readonly state
export const Readonly = {
  render: (args) => {
    const InputWithValue = () => {
      const input = createInputWithImplementation({
        ...args,
        readonly: true,
      });
      
      // Set initial value
      React.useEffect(() => {
        input.state.setValue('Read-only value');
        input.state.setReadonly(true);
      }, []);
      
      const InputComponent = () => {
        const state = input.state.getState();
        const a11yProps = input.logic.getA11yProps('root');
        const handlers = input.logic.getInteractionHandlers('root');
        
        const [, forceUpdate] = React.useReducer(x => x + 1, 0);
        React.useEffect(() => {
          const unsubscribe = input.state.subscribe(() => {
            forceUpdate();
          });
          return unsubscribe;
        }, []);
        
        const baseStyles = {
          fontFamily: 'sans-serif',
          borderRadius: '4px',
          border: '1px solid',
          borderColor: state.error ? '#ef4444' : state.focused ? '#3182ce' : '#e5e7eb',
          backgroundColor: state.disabled ? '#f3f4f6' : 'white',
          color: state.disabled ? '#9ca3af' : '#111827',
          outline: 'none',
          transition: 'all 0.2s',
          width: '100%',
          boxSizing: 'border-box',
          height: '40px',
          fontSize: '1rem',
          padding: '0 1rem',
          cursor: state.disabled ? 'not-allowed' : state.readonly ? 'default' : 'text',
        };
        
        return (
          <div style={{ width: '100%' }}>
            <input
              {...handlers}
              {...a11yProps}
              type={state.type}
              style={baseStyles}
              placeholder="Read-only input"
              disabled={state.disabled}
              readOnly={state.readonly}
              required={state.required}
              value={state.value}
              onChange={handlers.onChange}
              onFocus={handlers.onFocus}
              onBlur={handlers.onBlur}
              onInput={handlers.onInput}
              onKeyDown={handlers.onKeyDown}
            />
          </div>
        );
      };
      
      return <InputComponent />;
    };
    
    return <InputWithValue />;
  },
};

// Required input
export const Required = {
  render: (args) => createInputComponent({ 
    ...args, 
    required: true,
    placeholder: 'Required field' 
  }),
};

// Error state
export const Error = {
  render: (args) => createInputComponent({ 
    ...args, 
    error: true,
    errorMessage: 'This field is required',
    placeholder: 'Invalid input' 
  }),
};

// Form example
export const FormExample = {
  render: () => {
    const EmailInput = createInputComponent({ 
      type: 'email', 
      placeholder: 'Email address',
      required: true 
    });
    const PasswordInput = createInputComponent({ 
      type: 'password', 
      placeholder: 'Password',
      required: true 
    });
    
    return (
      <div style={{ maxWidth: '400px', padding: '2rem' }}>
        <h3>Login Form</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Email
            </label>
            <EmailInput />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Password
            </label>
            <PasswordInput />
          </div>
          
          <button type="submit" style={{
            backgroundColor: '#3182ce',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
          }}>
            Sign In
          </button>
        </form>
      </div>
    );
  },
};

// Showcase
export const Showcase = {
  render: () => (
    <div style={{ padding: '2rem', display: 'grid', gap: '2rem', maxWidth: '600px' }}>
      <div>
        <h3>Input Types</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {createInputComponent({ type: 'text', placeholder: 'Text input' })}
          {createInputComponent({ type: 'email', placeholder: 'Email input' })}
          {createInputComponent({ type: 'password', placeholder: 'Password input' })}
          {createInputComponent({ type: 'number', placeholder: 'Number input' })}
          {createInputComponent({ type: 'search', placeholder: 'Search input' })}
        </div>
      </div>
      
      <div>
        <h3>Input Sizes</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {createInputComponent({ size: 'sm', placeholder: 'Small input' })}
          {createInputComponent({ size: 'md', placeholder: 'Medium input' })}
          {createInputComponent({ size: 'lg', placeholder: 'Large input' })}
        </div>
      </div>
      
      <div>
        <h3>Input States</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {createInputComponent({ placeholder: 'Normal input' })}
          {createInputComponent({ disabled: true, placeholder: 'Disabled input' })}
          {(() => {
            const input = createInputWithImplementation({ readonly: true });
            React.useEffect(() => {
              input.state.setValue('Readonly input');
              input.state.setReadonly(true);
            }, []);
            
            const ReadonlyInput = () => {
              const state = input.state.getState();
              const a11yProps = input.logic.getA11yProps('root');
              const handlers = input.logic.getInteractionHandlers('root');
              
              const [, forceUpdate] = React.useReducer(x => x + 1, 0);
              React.useEffect(() => {
                const unsubscribe = input.state.subscribe(() => {
                  forceUpdate();
                });
                return unsubscribe;
              }, []);
              
              const styles = {
                fontFamily: 'sans-serif',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                color: '#111827',
                outline: 'none',
                transition: 'all 0.2s',
                width: '100%',
                boxSizing: 'border-box',
                height: '40px',
                fontSize: '1rem',
                padding: '0 1rem',
                cursor: 'default',
              };
              
              return (
                <input
                  {...handlers}
                  {...a11yProps}
                  type={state.type}
                  style={styles}
                  disabled={state.disabled}
                  readOnly={state.readonly}
                  required={state.required}
                  value={state.value}
                  onChange={handlers.onChange}
                  onFocus={handlers.onFocus}
                  onBlur={handlers.onBlur}
                  onInput={handlers.onInput}
                  onKeyDown={handlers.onKeyDown}
                />
              );
            };
            
            return <ReadonlyInput />;
          })()}
          {createInputComponent({ 
            error: true, 
            errorMessage: 'Invalid input', 
            placeholder: 'Error state' 
          })}
        </div>
      </div>
    </div>
  ),
};