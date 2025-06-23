/**
 * Container Component Stories
 * Comprehensive showcase of all container features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createContainerWithImplementation } from './index';
import { reactAdapter } from '@stellarix/react';

// Create the React container component
const container = createContainerWithImplementation();
const Container = container.connect(reactAdapter);

const meta: Meta<typeof Container> = {
  title: 'Primitives/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A flexible container component that constrains content width and provides consistent spacing.

## Features
- ✅ Multiple max-width sizes (sm, md, lg, xl, 2xl, full)
- ✅ Configurable padding (none, sm, md, lg)
- ✅ Center alignment option
- ✅ Responsive behavior
- ✅ Nestable containers
- ✅ Full accessibility support

## Use Cases
- Page layout containers
- Content width constraints
- Section wrappers
- Card containers
- Form layouts
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
      description: 'Maximum width of the container',
      defaultValue: 'lg',
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding inside the container',
      defaultValue: 'md',
    },
    center: {
      control: 'boolean',
      description: 'Whether to center the container horizontally',
      defaultValue: true,
    },
    children: {
      control: 'text',
      description: 'Container content',
    },
  },
  args: {
    size: 'lg',
    padding: 'md',
    center: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {
  render: (args) => (
    <Container {...args}>
      <div style={{ backgroundColor: '#e2e8f0', padding: '2rem', borderRadius: '8px' }}>
        <h2>Container Content</h2>
        <p>This content is wrapped in a container with max-width constraints and padding.</p>
        <p>The container helps maintain readable line lengths and consistent spacing.</p>
      </div>
    </Container>
  ),
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => (
    <Container {...args}>
      <div style={{ backgroundColor: '#fef3c7', padding: '2rem', borderRadius: '8px' }}>
        <h3>Small Container</h3>
        <p>This container has a small max-width, suitable for narrow content like forms or cards.</p>
      </div>
    </Container>
  ),
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
  render: (args) => (
    <Container {...args}>
      <div style={{ backgroundColor: '#e0e7ff', padding: '2rem', borderRadius: '8px' }}>
        <h3>Medium Container</h3>
        <p>A medium-sized container suitable for most content types.</p>
      </div>
    </Container>
  ),
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => (
    <Container {...args}>
      <div style={{ backgroundColor: '#dbeafe', padding: '2rem', borderRadius: '8px' }}>
        <h3>Large Container</h3>
        <p>A large container for wide content layouts.</p>
      </div>
    </Container>
  ),
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
  render: (args) => (
    <Container {...args}>
      <div style={{ backgroundColor: '#dcfce7', padding: '2rem', borderRadius: '8px' }}>
        <h3>Extra Large Container</h3>
        <p>An extra large container for expansive content.</p>
      </div>
    </Container>
  ),
};

export const FullWidth: Story = {
  args: {
    size: 'full',
  },
  render: (args) => (
    <Container {...args}>
      <div style={{ backgroundColor: '#fce7f3', padding: '2rem', borderRadius: '8px' }}>
        <h3>Full Width Container</h3>
        <p>This container spans the full width of its parent.</p>
      </div>
    </Container>
  ),
};

// Padding Variations
export const NoPadding: Story = {
  args: {
    padding: 'none',
  },
  render: (args) => (
    <Container {...args}>
      <div style={{ backgroundColor: '#fee2e2', padding: '2rem' }}>
        <h3>No Padding Container</h3>
        <p>This container has no horizontal padding, allowing content to reach the edges.</p>
      </div>
    </Container>
  ),
};

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
  },
  render: (args) => (
    <Container {...args}>
      <div style={{ backgroundColor: '#ffedd5', padding: '2rem', borderRadius: '8px' }}>
        <h3>Small Padding</h3>
        <p>Minimal padding for compact layouts.</p>
      </div>
    </Container>
  ),
};

export const LargePadding: Story = {
  args: {
    padding: 'lg',
  },
  render: (args) => (
    <Container {...args}>
      <div style={{ backgroundColor: '#ecfccb', padding: '2rem', borderRadius: '8px' }}>
        <h3>Large Padding</h3>
        <p>Generous padding for spacious layouts.</p>
      </div>
    </Container>
  ),
};

// Alignment
export const NotCentered: Story = {
  args: {
    center: false,
  },
  render: (args) => (
    <Container {...args}>
      <div style={{ backgroundColor: '#f0f9ff', padding: '2rem', borderRadius: '8px' }}>
        <h3>Left-Aligned Container</h3>
        <p>This container is not centered and aligns to the left edge of its parent.</p>
      </div>
    </Container>
  ),
};

// Complex Examples
export const NestedContainers: Story = {
  render: () => (
    <Container size="xl" padding="lg">
      <div style={{ backgroundColor: '#f3f4f6', padding: '2rem', borderRadius: '8px' }}>
        <h2>Outer Container (XL)</h2>
        <p>This is the outer container with XL max-width.</p>
        
        <Container size="md" padding="md">
          <div style={{ backgroundColor: '#e5e7eb', padding: '2rem', borderRadius: '8px', marginTop: '1rem' }}>
            <h3>Inner Container (MD)</h3>
            <p>This nested container has a smaller max-width, creating a narrower content area.</p>
            
            <Container size="sm" padding="sm">
              <div style={{ backgroundColor: '#d1d5db', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                <h4>Deeply Nested (SM)</h4>
                <p>Multiple levels of nesting for complex layouts.</p>
              </div>
            </Container>
          </div>
        </Container>
      </div>
    </Container>
  ),
};

// Showcase
export const Showcase: Story = {
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Container Sizes Comparison</h2>
      
      {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <div key={size} style={{ marginBottom: '2rem' }}>
          <Container size={size}>
            <div style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <strong>{size.toUpperCase()}</strong> Container - {
                size === 'sm' ? '640px' :
                size === 'md' ? '768px' :
                size === 'lg' ? '1024px' :
                size === 'xl' ? '1280px' :
                size === '2xl' ? '1536px' : 'Unknown'
              } max-width
            </div>
          </Container>
        </div>
      ))}
      
      <h3 style={{ marginTop: '3rem', marginBottom: '2rem', textAlign: 'center' }}>Padding Options</h3>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
          <Container key={padding} size="md" padding={padding}>
            <div style={{ 
              backgroundColor: '#10b981', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              {padding === 'none' ? 'No' : padding.toUpperCase()} Padding
            </div>
          </Container>
        ))}
      </div>
    </div>
  ),
};

// Responsive Example
export const ResponsiveContent: Story = {
  render: () => (
    <Container size="lg" padding="md">
      <div style={{ backgroundColor: '#f9fafb', padding: '2rem', borderRadius: '8px' }}>
        <h2>Responsive Container</h2>
        <p>This container maintains consistent padding and centers content at different screen sizes.</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginTop: '2rem'
        }}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} style={{
              backgroundColor: '#e0e7ff',
              padding: '1rem',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <h4>Card {item}</h4>
              <p>Content adapts to container width</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  ),
};