/**
 * Toggle Component Stories
 * Comprehensive showcase of all toggle features and states
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createToggleWithImplementation } from './index';
import { reactAdapter } from '@stellarix-ui/react';

// Safe wrapper component to prevent infinite loops  
const ToggleWrapper = React.forwardRef((props: any, ref: any) => {
  const [toggle] = React.useState(() => createToggleWithImplementation(props));
  const Component = React.useMemo(() => toggle.connect(reactAdapter), [toggle]);
  
  // Track current checked state to avoid unnecessary updates
  const [currentChecked, setCurrentChecked] = React.useState(props.checked || false);
  
  // Update the toggle's state when props change (safely)
  React.useEffect(() => {
    if (props.checked !== undefined && props.checked !== currentChecked) {
      toggle.state.setChecked(props.checked);
      setCurrentChecked(props.checked);
    }
  }, [props.checked, currentChecked, toggle]);
  
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      toggle.state.setDisabled(props.disabled);
    }
  }, [props.disabled, toggle]);
  
  // Safe state subscription without monkey patching
  React.useEffect(() => {
    const unsubscribe = toggle.state.subscribe((state) => {
      if (state.checked !== currentChecked) {
        setCurrentChecked(state.checked);
        // Call onChange callback safely
        if (props.onChange) {
          props.onChange(state.checked);
        }
      }
    });
    return unsubscribe;
  }, [props.onChange, currentChecked, toggle]);
  
  // Add size class for styling
  const className = `${props.className || ''} ${props.size ? `toggle-${props.size}` : ''}`.trim();
  
  return <Component ref={ref} {...props} className={className} />;
});

ToggleWrapper.displayName = 'Toggle';

const Toggle = ToggleWrapper;

// Toggle visual styles for Storybook
const toggleStyles = {
  sm: { width: '36px', height: '20px', thumbSize: '16px' },
  md: { width: '48px', height: '26px', thumbSize: '22px' },
  lg: { width: '60px', height: '32px', thumbSize: '28px' },
};

// Decorator to add visual styles to the headless toggle
const withToggleStyles = (Story: any) => {
  return (
    <>
      <style>{`
        button[role="switch"] {
          appearance: none;
          position: relative;
          width: var(--toggle-width, 48px);
          height: var(--toggle-height, 26px);
          background-color: var(--toggle-bg, #ccc);
          border-radius: 100px;
          cursor: pointer;
          transition: background-color 0.2s;
          border: none;
          padding: 0;
        }
        
        button[role="switch"][aria-checked="true"] {
          background-color: #4CAF50;
        }
        
        button[role="switch"]:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        button[role="switch"]:focus {
          outline: 2px solid #2196F3;
          outline-offset: 2px;
        }
        
        button[role="switch"]::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 2px;
          transform: translateY(-50%);
          width: var(--toggle-thumb, 22px);
          height: var(--toggle-thumb, 22px);
          background-color: white;
          border-radius: 50%;
          transition: left 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        button[role="switch"][aria-checked="true"]::after {
          left: calc(100% - var(--toggle-thumb, 22px) - 2px);
        }
        
        /* Size variants */
        button[role="switch"].toggle-sm {
          --toggle-width: 36px;
          --toggle-height: 20px;
          --toggle-thumb: 16px;
        }
        
        button[role="switch"].toggle-lg {
          --toggle-width: 60px;
          --toggle-height: 32px;
          --toggle-thumb: 28px;
        }
      `}</style>
      <Story />
    </>
  );
};

const meta: Meta<typeof Toggle> = {
  title: 'Primitives/Toggle',
  component: Toggle,
  decorators: [withToggleStyles],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A toggle switch component for binary on/off states.

## Features
- ✅ Binary on/off states
- ✅ Three sizes (sm, md, lg)
- ✅ Disabled state support
- ✅ Optional labels
- ✅ Full accessibility support (WCAG 2.1 AA)
- ✅ Keyboard navigation (Space to toggle)
- ✅ Smooth transition animations

## Use Cases
- Settings toggles
- Feature flags
- Preferences switches
- Binary options
- Enable/disable controls
        `,
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the toggle is checked (on)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the toggle',
      defaultValue: 'md',
    },
    label: {
      control: 'text',
      description: 'Optional label for the toggle',
    },
    id: {
      control: 'text',
      description: 'ID attribute for the toggle',
    },
    name: {
      control: 'text',
      description: 'Name attribute for form submission',
    },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
  },
  args: {
    checked: false,
    disabled: false,
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

// Size Variations
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

// With Labels
export const WithLabel: Story = {
  args: {
    label: 'Enable notifications',
  },
};

export const LabelledExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle label="Wi-Fi" />
      <Toggle label="Bluetooth" checked />
      <Toggle label="Airplane Mode" disabled />
      <Toggle label="Location Services" disabled checked />
    </div>
  ),
};

// Interactive Example
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    const [changeCount, setChangeCount] = React.useState(0);
    
    return (
      <div>
        <Toggle 
          checked={checked}
          onChange={(newChecked) => {
            setChecked(newChecked);
            setChangeCount(count => count + 1);
          }}
        />
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <p>Toggle is: <strong style={{ color: checked ? '#10b981' : '#6b7280' }}>{checked ? 'On' : 'Off'}</strong></p>
          <p>Changed {changeCount} times</p>
        </div>
      </div>
    );
  },
};

// Form Integration
export const FormExample: Story = {
  render: () => {
    const [settings, setSettings] = React.useState({
      notifications: true,
      darkMode: false,
      autoSave: true,
      analytics: false,
    });
    
    const handleChange = (setting: keyof typeof settings) => (checked: boolean) => {
      setSettings(prev => ({ ...prev, [setting]: checked }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Settings saved:\n${JSON.stringify(settings, null, 2)}`);
    };
    
    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>App Settings</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="notifications">Push Notifications</label>
            <Toggle
              id="notifications"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange('notifications')}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="darkMode">Dark Mode</label>
            <Toggle
              id="darkMode"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleChange('darkMode')}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="autoSave">Auto-save</label>
            <Toggle
              id="autoSave"
              name="autoSave"
              checked={settings.autoSave}
              onChange={handleChange('autoSave')}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="analytics" style={{ color: '#9ca3af' }}>Analytics (Pro only)</label>
            <Toggle
              id="analytics"
              name="analytics"
              checked={settings.analytics}
              onChange={handleChange('analytics')}
              disabled
            />
          </div>
        </div>
        
        <button type="submit" style={{
          marginTop: '2rem',
          width: '100%',
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}>
          Save Settings
        </button>
      </form>
    );
  },
};

// Accessibility Demo
export const AccessibilityFeatures: Story = {
  render: () => (
    <div style={{ padding: '1rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Accessibility Features</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
          <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Keyboard Navigation</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            Press Tab to focus, Space to toggle
          </p>
          <Toggle label="Keyboard accessible toggle" />
        </div>
        
        <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
          <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Screen Reader Support</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            Proper ARIA attributes for state announcement
          </p>
          <Toggle label="Screen reader friendly" />
        </div>
        
        <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
          <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Focus Indicators</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            Clear visual focus state for keyboard users
          </p>
          <Toggle label="Visible focus state" />
        </div>
      </div>
    </div>
  ),
};

// Showcase
export const Showcase: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Toggle Component Showcase</h2>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>States</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <Toggle checked={false} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Off</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Toggle checked={true} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>On</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Toggle disabled checked={false} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Disabled Off</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Toggle disabled checked={true} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Disabled On</p>
          </div>
        </div>
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Sizes</h3>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Toggle size="sm" />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Small</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Toggle size="md" />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Medium</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Toggle size="lg" />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Large</p>
          </div>
        </div>
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Common Use Cases</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '4px'
          }}>
            <span>Enable notifications</span>
            <Toggle checked />
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '4px'
          }}>
            <span>Dark mode</span>
            <Toggle />
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '4px'
          }}>
            <span style={{ color: '#9ca3af' }}>Premium feature (Pro only)</span>
            <Toggle disabled />
          </div>
        </div>
      </section>
      
      <section>
        <h3 style={{ marginBottom: '1rem' }}>Interactive Playground</h3>
        <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
            Try toggling these switches to see state changes:
          </p>
          {['Feature A', 'Feature B', 'Feature C'].map((feature) => {
            const [checked, setChecked] = React.useState(false);
            return (
              <div 
                key={feature}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}
              >
                <span>{feature}: {checked ? 'Enabled' : 'Disabled'}</span>
                <Toggle checked={checked} onChange={setChecked} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  ),
};