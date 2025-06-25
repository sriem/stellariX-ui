/**
 * Component Component Stories
 * Comprehensive showcase of all component features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createTemplate } from './index';
import { reactAdapter } from '@stellarix-ui/react';

// Create a wrapper component that creates individual Component instances
const ComponentWrapper = React.forwardRef((props: any, ref: any) => {
  const [component] = React.useState(() => createTemplate(props));
  const Component = React.useMemo(() => component.connect(reactAdapter), [component]);
  
  // Update the component's state when props change
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      component.state.setDisabled(props.disabled);
    }
  }, [props.disabled, component]);
  
  React.useEffect(() => {
    if (props.value !== undefined) {
      component.state.setValue(props.value);
    }
  }, [props.value, component]);
  
  return <Component ref={ref} {...props} />;
});

ComponentWrapper.displayName = 'Component';

const meta: Meta<typeof ComponentWrapper> = {
  title: 'Primitives/Component',
  component: ComponentWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible component that [describe what it does].',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The value of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    onChange: {
      action: 'changed',
      description: 'Called when the value changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {},
};

export const WithValue: Story = {
  args: {
    value: 'Example value',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Disabled component',
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    
    return (
      <div className="flex flex-col gap-4">
        <ComponentWrapper
          value={value}
          onChange={(newValue: string) => setValue(newValue)}
        />
        <p className="text-sm text-gray-600">Current value: {value || '(empty)'}</p>
      </div>
    );
  },
};

// Showcase of all variations
export const Showcase: Story = {
  render: () => (
    <div className="grid gap-8">
      <section>
        <h3 className="text-lg font-semibold mb-4">States</h3>
        <div className="flex flex-wrap gap-4">
          <ComponentWrapper />
          <ComponentWrapper value="With value" />
          <ComponentWrapper disabled />
          <ComponentWrapper value="Disabled with value" disabled />
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <ComponentWrapper size="sm" value="Small" />
          <ComponentWrapper size="md" value="Medium" />
          <ComponentWrapper size="lg" value="Large" />
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">Variants</h3>
        <div className="flex flex-wrap gap-4">
          <ComponentWrapper variant="default" value="Default" />
          <ComponentWrapper variant="primary" value="Primary" />
          <ComponentWrapper variant="secondary" value="Secondary" />
        </div>
      </section>
    </div>
  ),
};

// Accessibility demonstration
export const AccessibilityShowcase: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Accessibility Features</h3>
      <ComponentWrapper aria-label="Example accessible component" />
      <div className="text-sm space-y-2 text-gray-600">
        <p>✓ Keyboard navigation support</p>
        <p>✓ ARIA attributes properly set</p>
        <p>✓ Focus indicators</p>
        <p>✓ Screen reader announcements</p>
      </div>
    </div>
  ),
};