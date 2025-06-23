/**
 * Toggle Component Stories
 * Comprehensive showcase of all toggle features and states
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createToggleWithImplementation } from './index';
import { reactAdapter } from '@stellarix/react';

// Create the React toggle component
const toggle = createToggleWithImplementation();
const Toggle = toggle.connect(reactAdapter);

// Toggle visual styles for Storybook
const toggleStyles = {
  sm: { width: '36px', height: '20px', thumbSize: '16px' },
  md: { width: '48px', height: '26px', thumbSize: '22px' },
  lg: { width: '60px', height: '32px', thumbSize: '28px' },
};

// Decorator to add visual styles to the headless toggle
const withToggleStyles = (Story: any, context: any) => {
  const size = context.args.size || 'md';
  const sizeStyle = toggleStyles[size];
  
  // Use a wrapper to apply styles
  const StyledToggle = () => {
    const storyElement = Story();
    const [isChecked, setIsChecked] = React.useState(context.args.checked || false);
    
    React.useEffect(() => {
      // Listen for toggle state changes
      const handleChange = (e: any) => {
        if (e.target.getAttribute('role') === 'switch') {
          setIsChecked(e.target.getAttribute('aria-checked') === 'true');
        }
      };
      
      document.addEventListener('click', handleChange);
      return () => document.removeEventListener('click', handleChange);
    }, []);
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <style>{`
            button[role="switch"] {
              appearance: none;
              position: relative;
              width: ${sizeStyle.width};
              height: ${sizeStyle.height};
              background-color: ${isChecked ? '#4CAF50' : '#ccc'};
              border-radius: 100px;
              cursor: ${context.args.disabled ? 'not-allowed' : 'pointer'};
              opacity: ${context.args.disabled ? 0.5 : 1};
              transition: background-color 0.2s;
              border: none;
              padding: 0;
            }
            
            button[role="switch"]:focus {
              outline: 2px solid #2196F3;
              outline-offset: 2px;
            }
            
            button[role="switch"]::after {
              content: '';
              position: absolute;
              top: 50%;
              left: ${isChecked ? `calc(100% - ${sizeStyle.thumbSize} - 2px)` : '2px'};
              transform: translateY(-50%);
              width: ${sizeStyle.thumbSize};
              height: ${sizeStyle.thumbSize};
              background-color: white;
              border-radius: 50%;
              transition: left 0.2s;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
          `}</style>
          {storyElement}
        </div>
        {context.args.label && <span>{context.args.label}</span>}
      </div>
    );
  };
  
  return <StyledToggle />;
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