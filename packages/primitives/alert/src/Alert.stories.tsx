/**
 * Alert Component Stories
 * Comprehensive showcase of all alert features and states
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createAlertWithImplementation } from './index';
import { reactAdapter } from '@stellarix/react';

// Create a wrapper component that creates individual Alert instances
const AlertWrapper = React.forwardRef((props: any, ref: any) => {
  const [alert] = React.useState(() => createAlertWithImplementation(props));
  const [state, setState] = React.useState(() => alert.state.getState());
  
  React.useEffect(() => {
    const unsubscribe = alert.state.subscribe(setState);
    return unsubscribe;
  }, [alert]);

  const a11yProps = alert.logic.getA11yProps('root');
  const closeButtonA11y = alert.logic.getA11yProps('closeButton');
  const closeHandlers = alert.logic.getInteractionHandlers('closeButton');

  if (!state.visible) {
    return null;
  }

  const variantStyles = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  };

  const variantIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div
      ref={ref}
      {...a11yProps}
      className={`alert ${variantStyles[state.variant]} ${state.dismissing ? 'alert-dismissing' : ''} ${props.className || ''}`}
    >
      {state.showIcon && (
        <span className="alert-icon">{variantIcons[state.variant]}</span>
      )}
      <div className="alert-content">
        {state.title && <h4 className="alert-title">{state.title}</h4>}
        <div className="alert-message">{state.message || props.children}</div>
      </div>
      {state.dismissible && (
        <button
          {...closeButtonA11y}
          {...closeHandlers}
          className="alert-close"
        >
          ×
        </button>
      )}
    </div>
  );
});

AlertWrapper.displayName = 'Alert';

const Alert = AlertWrapper;

// Decorator to add visual styles to the headless alert
const withAlertStyles = (Story: any) => {
  return (
    <>
      <style>{`
        .alert {
          position: relative;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          animation: slideIn 0.3s ease-out;
          border: 1px solid;
          background-color: var(--alert-bg);
          border-color: var(--alert-border);
          color: var(--alert-text);
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .alert-dismissing {
          animation: slideOut 0.3s ease-out forwards;
        }
        
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        
        /* Variant styles */
        .alert-info {
          --alert-bg: #e3f2fd;
          --alert-border: #90caf9;
          --alert-text: #1565c0;
        }
        
        .alert-success {
          --alert-bg: #e8f5e9;
          --alert-border: #81c784;
          --alert-text: #2e7d32;
        }
        
        .alert-warning {
          --alert-bg: #fff3e0;
          --alert-border: #ffb74d;
          --alert-text: #e65100;
        }
        
        .alert-error {
          --alert-bg: #ffebee;
          --alert-border: #ef5350;
          --alert-text: #c62828;
        }
        
        .alert-icon {
          font-size: 20px;
          flex-shrink: 0;
        }
        
        .alert-content {
          flex: 1;
        }
        
        .alert-title {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .alert-message {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .alert-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          font-size: 24px;
          line-height: 1;
          color: inherit;
          opacity: 0.6;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .alert-close:hover {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .alert-close:focus {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
        
        /* Size variants */
        .alert-sm {
          padding: 8px 12px;
          font-size: 13px;
        }
        
        .alert-sm .alert-icon {
          font-size: 16px;
        }
        
        .alert-lg {
          padding: 20px 24px;
          font-size: 16px;
        }
        
        .alert-lg .alert-icon {
          font-size: 24px;
        }
        
        .alert-lg .alert-title {
          font-size: 18px;
        }
      `}</style>
      <Story />
    </>
  );
};

const meta: Meta<typeof Alert> = {
  title: 'Primitives/Alert',
  component: Alert,
  decorators: [withAlertStyles],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
An alert component for displaying important messages to users.

## Features
- ✅ Multiple variants (info, success, warning, error)
- ✅ Dismissible alerts with animation
- ✅ Auto-close functionality
- ✅ Title and message support
- ✅ Icon display options
- ✅ Full accessibility (WCAG 2.1 AA)
- ✅ Live region announcements
- ✅ Keyboard dismissible (Escape)

## Accessibility
- Uses semantic \`role="alert"\`
- Live region support with appropriate urgency
- Keyboard accessible close button
- Screen reader friendly
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error'],
      description: 'The type/variant of the alert',
    },
    message: {
      control: 'text',
      description: 'The alert message',
    },
    title: {
      control: 'text',
      description: 'Optional title for the alert',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert can be dismissed',
    },
    visible: {
      control: 'boolean',
      description: 'Whether the alert is visible',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show an icon',
    },
    autoClose: {
      control: { type: 'number', min: 0, step: 1000 },
      description: 'Auto-dismiss after milliseconds (0 = disabled)',
    },
    onDismiss: { action: 'dismissed' },
    onVisibilityChange: { action: 'visibility changed' },
  },
  args: {
    variant: 'info',
    message: 'This is an informational alert message.',
    dismissible: false,
    visible: true,
    showIcon: true,
    autoClose: 0,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {};

export const Success: Story = {
  args: {
    variant: 'success',
    message: 'Your changes have been saved successfully!',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    message: 'Please review your input before proceeding.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    message: 'An error occurred while processing your request.',
  },
};

// With Title
export const WithTitle: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    message: 'This alert includes both a title and a message for better organization.',
  },
};

// Dismissible
export const Dismissible: Story = {
  args: {
    variant: 'info',
    message: 'This alert can be dismissed by clicking the close button.',
    dismissible: true,
  },
};

// Auto-Close
export const AutoClose: Story = {
  args: {
    variant: 'success',
    message: 'This alert will automatically close after 5 seconds.',
    dismissible: true,
    autoClose: 5000,
  },
};

// Without Icon
export const NoIcon: Story = {
  args: {
    variant: 'info',
    message: 'This alert is displayed without an icon.',
    showIcon: false,
  },
};

// Long Content
export const LongContent: Story = {
  args: {
    variant: 'info',
    title: 'Terms of Service Update',
    message: 'We have updated our Terms of Service to better reflect our commitment to user privacy and data protection. These changes include enhanced transparency about data collection, improved user controls, and clearer language throughout. Please review the updated terms at your earliest convenience.',
    dismissible: true,
  },
};

// Interactive Example
export const Interactive: Story = {
  render: () => {
    const [alerts, setAlerts] = React.useState<Array<{
      id: number;
      variant: 'info' | 'success' | 'warning' | 'error';
      message: string;
    }>>([]);
    
    const addAlert = (variant: 'info' | 'success' | 'warning' | 'error') => {
      const id = Date.now();
      const messages = {
        info: 'This is an informational message.',
        success: 'Operation completed successfully!',
        warning: 'Please check your input.',
        error: 'An error has occurred.',
      };
      
      setAlerts(prev => [...prev, { id, variant, message: messages[variant] }]);
    };
    
    const removeAlert = (id: number) => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    };
    
    return (
      <div>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={() => addAlert('info')} style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #90caf9',
            backgroundColor: '#e3f2fd',
            color: '#1565c0',
            cursor: 'pointer',
          }}>
            Add Info
          </button>
          <button onClick={() => addAlert('success')} style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #81c784',
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            cursor: 'pointer',
          }}>
            Add Success
          </button>
          <button onClick={() => addAlert('warning')} style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #ffb74d',
            backgroundColor: '#fff3e0',
            color: '#e65100',
            cursor: 'pointer',
          }}>
            Add Warning
          </button>
          <button onClick={() => addAlert('error')} style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #ef5350',
            backgroundColor: '#ffebee',
            color: '#c62828',
            cursor: 'pointer',
          }}>
            Add Error
          </button>
        </div>
        
        <div>
          {alerts.map(alert => (
            <Alert
              key={alert.id}
              variant={alert.variant}
              message={alert.message}
              dismissible={true}
              autoClose={5000}
              onDismiss={() => removeAlert(alert.id)}
            />
          ))}
        </div>
      </div>
    );
  },
};

// Form Validation Example
export const FormValidation: Story = {
  render: () => {
    const [showError, setShowError] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const email = (form.elements.namedItem('email') as HTMLInputElement).value;
      
      if (!email || !email.includes('@')) {
        setShowError(true);
        setShowSuccess(false);
      } else {
        setShowError(false);
        setShowSuccess(true);
      }
    };
    
    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        {showError && (
          <Alert
            variant="error"
            message="Please enter a valid email address."
            dismissible={true}
            onDismiss={() => setShowError(false)}
          />
        )}
        
        {showSuccess && (
          <Alert
            variant="success"
            message="Email submitted successfully!"
            dismissible={true}
            autoClose={3000}
            onDismiss={() => setShowSuccess(false)}
          />
        )}
        
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '4px' }}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          />
        </div>
        
        <button type="submit" style={{
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#1976d2',
          color: 'white',
          cursor: 'pointer',
        }}>
          Submit
        </button>
      </form>
    );
  },
};

// Showcase
export const Showcase: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px' }}>Alert Component Showcase</h2>
      
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Variants</h3>
        <Alert
          variant="info"
          message="This is an informational alert for general messages."
        />
        <Alert
          variant="success"
          message="This is a success alert for positive feedback."
        />
        <Alert
          variant="warning"
          message="This is a warning alert for cautionary messages."
        />
        <Alert
          variant="error"
          message="This is an error alert for problem notifications."
        />
      </section>
      
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>With Titles</h3>
        <Alert
          variant="info"
          title="Did you know?"
          message="Alerts can have titles to provide additional context."
        />
        <Alert
          variant="success"
          title="Success!"
          message="Your profile has been updated."
          dismissible={true}
        />
      </section>
      
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Dismissible Alerts</h3>
        <Alert
          variant="info"
          message="Click the × button to dismiss this alert."
          dismissible={true}
        />
        <Alert
          variant="warning"
          title="Limited Time Offer"
          message="This alert will automatically close in 10 seconds."
          dismissible={true}
          autoClose={10000}
        />
      </section>
      
      <section>
        <h3 style={{ marginBottom: '16px' }}>Without Icons</h3>
        <Alert
          variant="info"
          message="This alert is displayed without an icon for a cleaner look."
          showIcon={false}
        />
        <Alert
          variant="success"
          title="Minimalist Design"
          message="Sometimes less is more."
          showIcon={false}
          dismissible={true}
        />
      </section>
    </div>
  ),
};