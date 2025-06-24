/**
 * Divider Component Stories
 * Comprehensive showcase of all divider features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createDividerWithImplementation } from './index';
import { reactAdapter } from '@stellarix-ui/react';

// Create the React divider component
const divider = createDividerWithImplementation();
const Divider = divider.connect(reactAdapter);

const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A visual separator between content sections with multiple variants and orientations.

## Features
- ✅ Horizontal and vertical orientations
- ✅ Multiple variants (solid, dashed, dotted)
- ✅ Optional labels with positioning
- ✅ Customizable thickness and color
- ✅ Responsive spacing
- ✅ Full accessibility support

## Use Cases
- Section separators
- Content dividers
- Form field groups
- Navigation menus
- List item separators
        `,
      },
    },
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the divider',
      defaultValue: 'horizontal',
    },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted'],
      description: 'The visual style of the divider',
      defaultValue: 'solid',
    },
    label: {
      control: 'text',
      description: 'Optional label text for the divider',
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
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
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    spacing: '1rem',
    thickness: '1px',
    color: '#e2e8f0',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {};

export const Dashed: Story = {
  args: {
    variant: 'dashed',
  },
};

export const Dotted: Story = {
  args: {
    variant: 'dotted',
  },
};

// Orientation
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div style={{ height: '200px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <div>Content on the left</div>
      <Divider {...args} />
      <div>Content on the right</div>
    </div>
  ),
};

// With Labels
export const WithLabel: Story = {
  args: {
    label: 'OR',
  },
};

export const LabelStart: Story = {
  args: {
    label: 'Section Title',
    labelPosition: 'start',
  },
};

export const LabelEnd: Story = {
  args: {
    label: 'End of Section',
    labelPosition: 'end',
  },
};

// Custom Styling
export const Thick: Story = {
  args: {
    thickness: '3px',
  },
};

export const CustomColor: Story = {
  args: {
    color: '#3b82f6',
    thickness: '2px',
  },
};

export const WideSpacing: Story = {
  args: {
    spacing: '3rem',
  },
};

// Complex Examples
export const InForm: Story = {
  render: () => (
    <form style={{ maxWidth: '400px', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
        <input type="text" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
        <input type="email" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
      </div>
      
      <Divider label="Security Settings" labelPosition="start" spacing="1.5rem" />
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
        <input type="password" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
        <input type="password" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
      </div>
    </form>
  ),
};

export const InNavigation: Story = {
  render: () => (
    <nav style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ padding: '0.5rem 1rem' }}>Home</li>
        <li style={{ padding: '0.5rem 1rem' }}>About</li>
        <li style={{ padding: '0.5rem 1rem' }}>Services</li>
        <Divider spacing="0.5rem" />
        <li style={{ padding: '0.5rem 1rem' }}>Contact</li>
        <li style={{ padding: '0.5rem 1rem' }}>Support</li>
      </ul>
    </nav>
  ),
};

// Showcase
export const Showcase: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Divider Showcase</h2>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Variants</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p>Solid divider:</p>
            <Divider variant="solid" />
          </div>
          <div>
            <p>Dashed divider:</p>
            <Divider variant="dashed" />
          </div>
          <div>
            <p>Dotted divider:</p>
            <Divider variant="dotted" />
          </div>
        </div>
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>With Labels</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Divider label="Center Label" />
          <Divider label="Start Label" labelPosition="start" variant="dashed" />
          <Divider label="End Label" labelPosition="end" variant="dotted" />
        </div>
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Custom Styles</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Divider color="#ef4444" thickness="2px" />
          <Divider color="#10b981" thickness="3px" variant="dashed" />
          <Divider color="#3b82f6" thickness="4px" variant="dotted" />
        </div>
      </section>
      
      <section>
        <h3 style={{ marginBottom: '1rem' }}>Vertical Dividers</h3>
        <div style={{ display: 'flex', height: '100px', alignItems: 'center', gap: '2rem' }}>
          <div>Section 1</div>
          <Divider orientation="vertical" />
          <div>Section 2</div>
          <Divider orientation="vertical" variant="dashed" color="#ef4444" />
          <div>Section 3</div>
          <Divider orientation="vertical" variant="dotted" thickness="2px" />
          <div>Section 4</div>
        </div>
      </section>
    </div>
  ),
};

// Stress Test
export const StressTest: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Performance Test: 50 Dividers</h3>
      <div style={{ 
        maxHeight: '400px', 
        overflowY: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: '4px',
        padding: '1rem'
      }}>
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i}>
            <p>Section {i + 1}</p>
            <Divider 
              variant={['solid', 'dashed', 'dotted'][i % 3] as any}
              color={['#e2e8f0', '#3b82f6', '#10b981'][i % 3]}
              label={i % 5 === 0 ? `Group ${Math.floor(i / 5) + 1}` : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};