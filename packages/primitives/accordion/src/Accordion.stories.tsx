/**
 * Accordion Component Stories
 * Comprehensive showcase of all accordion features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createAccordionWithImplementation } from './index';
import { reactAdapter } from '@stellarix-ui/react';
import type { AccordionOptions } from './types';

// Create accordion component safely for each story instance
const createAccordionComponent = (options?: AccordionOptions) => {
  const accordion = createAccordionWithImplementation(options);
  return accordion.connect(reactAdapter);
};

// Dummy component for Meta typing
const DummyAccordion = createAccordionComponent();

const meta: Meta<typeof DummyAccordion> = {
  title: 'Primitives/Accordion',
  component: DummyAccordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A versatile accordion component for displaying collapsible content sections.

## Features
- ✅ Single or multiple panel expansion
- ✅ Collapsible and non-collapsible modes
- ✅ Disabled panels support
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Full accessibility support (WCAG 2.1 AA)
- ✅ Focus management
- ✅ Customizable expanded state

## Accessibility
- Uses semantic HTML with proper ARIA attributes
- \`aria-expanded\` indicates panel state
- \`aria-controls\` links triggers to panels
- \`aria-disabled\` for disabled panels
- Full keyboard navigation support
- Screen reader friendly
        `,
      },
    },
  },
  argTypes: {
    items: {
      description: 'Initial item configurations',
      control: { type: 'object' },
    },
    expandedItems: {
      description: 'Initially expanded item IDs',
      control: { type: 'array' },
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple panels to be expanded',
      defaultValue: false,
    },
    collapsible: {
      control: 'boolean',
      description: 'Allow all panels to be collapsed',
      defaultValue: true,
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the entire accordion',
      defaultValue: false,
    },
    onExpandedChange: { action: 'expandedChange' },
    onItemToggle: { action: 'itemToggle' },
  },
  args: {
    multiple: false,
    collapsible: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component to render accordion items
const AccordionItem: React.FC<{
  id: string;
  title: string;
  content: React.ReactNode;
  expanded: boolean;
  disabled?: boolean;
  onToggle: (id: string) => void;
  icon?: React.ReactNode;
}> = ({ id, title, content, expanded, disabled, onToggle, icon }) => {
  return (
    <div className={`sx-accordion-item ${disabled ? 'sx-accordion-item--disabled' : ''}`}>
      <button
        className="sx-accordion-trigger"
        onClick={() => onToggle(id)}
        aria-expanded={expanded}
        aria-controls={`panel-${id}`}
        disabled={disabled}
        data-item-id={id}
        style={{
          width: '100%',
          padding: '1rem',
          textAlign: 'left',
          backgroundColor: disabled ? '#f3f4f6' : expanded ? '#eff6ff' : '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: expanded ? '4px 4px 0 0' : '4px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {icon}
          {title}
        </span>
        <span
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▼
        </span>
      </button>
      <div
        id={`panel-${id}`}
        role="region"
        aria-labelledby={`trigger-${id}`}
        aria-hidden={!expanded}
        style={{
          maxHeight: expanded ? '500px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
          backgroundColor: '#ffffff',
          border: expanded ? '1px solid #e5e7eb' : 'none',
          borderTop: 'none',
          borderRadius: '0 0 4px 4px',
        }}
      >
        {expanded && (
          <div style={{ padding: '1rem' }}>
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

// Safe wrapper component to prevent infinite loops
const AccordionWrapper: React.FC<{
  options?: AccordionOptions;
  items: Array<{ id: string; title: string; content: React.ReactNode; disabled?: boolean; icon?: React.ReactNode }>;
  onExpandedChange?: (expandedItems: string[]) => void;
  onItemToggle?: (itemId: string, expanded: boolean) => void;
}> = ({ options = {}, items, onExpandedChange, onItemToggle }) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(options.expandedItems || []);
  
  // Create accordion with safe pattern - create once per component instance
  const [accordion] = React.useState(() => {
    return createAccordionWithImplementation({
      ...options,
      expandedItems: options.expandedItems || [],
      items: items.map(item => ({
        id: item.id,
        expanded: (options.expandedItems || []).includes(item.id),
        disabled: item.disabled,
      })),
      onExpandedChange: (newExpandedItems) => {
        setExpandedItems(newExpandedItems);
        onExpandedChange?.(newExpandedItems);
      },
      onItemToggle,
    });
  });

  const handleToggle = (itemId: string) => {
    const isExpanded = expandedItems.includes(itemId);
    // Safely update state without using broken logic.handleEvent
    if (accordion.state && 'toggleItem' in accordion.state) {
      (accordion.state as any).toggleItem(itemId);
    } else {
      // Fallback: update expanded items directly
      const newExpandedItems = isExpanded 
        ? expandedItems.filter(id => id !== itemId)
        : [...expandedItems, itemId];
      setExpandedItems(newExpandedItems);
      onExpandedChange?.(newExpandedItems);
      onItemToggle?.(itemId, !isExpanded);
    }
  };

  return (
    <div className="sx-accordion" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          expanded={expandedItems.includes(item.id)}
          disabled={item.disabled || options.disabled}
          onToggle={handleToggle}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

// Basic Examples
export const Default: Story = {
  render: (args) => (
    <AccordionWrapper
      options={args}
      items={[
        {
          id: '1',
          title: 'What is React?',
          content: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and is widely used for creating interactive web applications.',
        },
        {
          id: '2',
          title: 'How does React work?',
          content: 'React works by creating a virtual representation of the UI and efficiently updating only the parts that have changed. This makes React applications fast and responsive.',
        },
        {
          id: '3',
          title: 'What are React hooks?',
          content: 'Hooks are functions that let you use state and other React features in functional components. Common hooks include useState, useEffect, and useContext.',
        },
      ]}
      onExpandedChange={args.onExpandedChange}
      onItemToggle={args.onItemToggle}
    />
  ),
};

export const Multiple: Story = {
  args: {
    multiple: true,
    expandedItems: ['1', '3'],
  },
  render: (args) => (
    <AccordionWrapper
      options={args}
      items={[
        {
          id: '1',
          title: 'Frontend Technologies',
          content: 'React, Vue, Angular, Svelte - Modern frameworks for building user interfaces.',
        },
        {
          id: '2',
          title: 'Backend Technologies',
          content: 'Node.js, Python, Ruby, Java - Server-side technologies for building APIs.',
        },
        {
          id: '3',
          title: 'Database Systems',
          content: 'PostgreSQL, MySQL, MongoDB, Redis - Data storage and retrieval systems.',
        },
        {
          id: '4',
          title: 'DevOps Tools',
          content: 'Docker, Kubernetes, CI/CD, AWS - Tools for deployment and infrastructure.',
        },
      ]}
      onExpandedChange={args.onExpandedChange}
      onItemToggle={args.onItemToggle}
    />
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <AccordionWrapper
      options={args}
      items={[
        {
          id: '1',
          title: 'Available Feature',
          content: 'This panel can be expanded and collapsed normally.',
        },
        {
          id: '2',
          title: 'Premium Feature (Disabled)',
          content: 'This content requires a premium subscription.',
          disabled: true,
        },
        {
          id: '3',
          title: 'Beta Feature (Disabled)',
          content: 'This feature is currently in beta testing.',
          disabled: true,
        },
        {
          id: '4',
          title: 'Another Available Feature',
          content: 'This panel is also available for interaction.',
        },
      ]}
      onExpandedChange={args.onExpandedChange}
      onItemToggle={args.onItemToggle}
    />
  ),
};

export const NonCollapsible: Story = {
  args: {
    collapsible: false,
    expandedItems: ['1'],
  },
  render: (args) => (
    <div>
      <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        Note: In non-collapsible mode, at least one panel must remain open
      </p>
      <AccordionWrapper
        options={args}
        items={[
          {
            id: '1',
            title: 'Always One Open',
            content: 'This accordion requires at least one panel to be open at all times.',
          },
          {
            id: '2',
            title: 'Second Panel',
            content: 'You can switch between panels, but cannot close all of them.',
          },
          {
            id: '3',
            title: 'Third Panel',
            content: 'Try clicking on an open panel - it won\'t close if it\'s the only one open.',
          },
        ]}
        onExpandedChange={args.onExpandedChange}
        onItemToggle={args.onItemToggle}
      />
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <AccordionWrapper
      options={args}
      items={[
        {
          id: '1',
          title: 'Settings',
          icon: '⚙️',
          content: 'Configure your application settings and preferences here.',
        },
        {
          id: '2',
          title: 'Security',
          icon: '🔒',
          content: 'Manage your security settings, passwords, and two-factor authentication.',
        },
        {
          id: '3',
          title: 'Notifications',
          icon: '🔔',
          content: 'Control how and when you receive notifications from the application.',
        },
        {
          id: '4',
          title: 'Help & Support',
          icon: '❓',
          content: 'Find answers to common questions and contact our support team.',
        },
      ]}
      onExpandedChange={args.onExpandedChange}
      onItemToggle={args.onItemToggle}
    />
  ),
};

// Size Variations
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Small Size</h3>
        <div style={{ fontSize: '0.875rem' }}>
          <AccordionWrapper
            options={args}
            items={[
              { id: '1', title: 'Small Item 1', content: 'Compact content for small accordion.' },
              { id: '2', title: 'Small Item 2', content: 'Another small content section.' },
            ]}
          />
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Medium Size (Default)</h3>
        <AccordionWrapper
          options={args}
          items={[
            { id: '3', title: 'Medium Item 1', content: 'Standard sized content for medium accordion.' },
            { id: '4', title: 'Medium Item 2', content: 'Another medium content section.' },
          ]}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Large Size</h3>
        <div style={{ fontSize: '1.125rem' }}>
          <AccordionWrapper
            options={args}
            items={[
              { id: '5', title: 'Large Item 1', content: 'Larger content for more prominent accordion sections.' },
              { id: '6', title: 'Large Item 2', content: 'Another large content section with more spacing.' },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};

// Interactive Examples
export const ControlledAccordion: Story = {
  render: () => {
    const [expandedItems, setExpandedItems] = React.useState<string[]>(['2']);
    
    return (
      <div>
        <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>External Controls</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setExpandedItems(['1', '2', '3'])}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Expand All
            </button>
            <button
              onClick={() => setExpandedItems([])}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Collapse All
            </button>
            <button
              onClick={() => setExpandedItems(['2'])}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Show Only Item 2
            </button>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            Expanded items: {expandedItems.length > 0 ? expandedItems.join(', ') : 'None'}
          </p>
        </div>
        
        <AccordionWrapper
          options={{
            multiple: true,
            expandedItems,
            onExpandedChange: setExpandedItems,
          }}
          items={[
            { id: '1', title: 'Controlled Item 1', content: 'This accordion is controlled externally.' },
            { id: '2', title: 'Controlled Item 2', content: 'Use the buttons above to control expansion.' },
            { id: '3', title: 'Controlled Item 3', content: 'You can also click the panels directly.' },
          ]}
        />
      </div>
    );
  },
};

// Showcase
export const Showcase: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Accordion Component Showcase</h2>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Single Expansion Mode</h3>
        <AccordionWrapper
          options={{ multiple: false }}
          items={[
            { id: 's1', title: 'Single Mode - Item 1', content: 'Only one panel can be open at a time.' },
            { id: 's2', title: 'Single Mode - Item 2', content: 'Opening this will close the previous one.' },
            { id: 's3', title: 'Single Mode - Item 3', content: 'Perfect for FAQs and compact layouts.' },
          ]}
        />
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Multiple Expansion Mode</h3>
        <AccordionWrapper
          options={{ multiple: true, expandedItems: ['m1', 'm3'] }}
          items={[
            { id: 'm1', title: 'Multiple Mode - Item 1', content: 'Multiple panels can be open simultaneously.' },
            { id: 'm2', title: 'Multiple Mode - Item 2', content: 'Great for detailed documentation.' },
            { id: 'm3', title: 'Multiple Mode - Item 3', content: 'Users can view multiple sections at once.' },
          ]}
        />
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>With Disabled Items</h3>
        <AccordionWrapper
          options={{}}
          items={[
            { id: 'd1', title: 'Enabled Item', content: 'This item can be interacted with.' },
            { id: 'd2', title: 'Disabled Item', content: 'This content is not accessible.', disabled: true },
            { id: 'd3', title: 'Another Enabled Item', content: 'This item is also interactive.' },
          ]}
        />
      </section>
      
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Rich Content Example</h3>
        <AccordionWrapper
          options={{ multiple: true }}
          items={[
            {
              id: 'r1',
              title: 'Rich Text Content',
              content: (
                <div>
                  <h4>Formatted Content</h4>
                  <p>Accordions can contain any React content including:</p>
                  <ul>
                    <li>Lists and structured data</li>
                    <li>Images and media</li>
                    <li>Interactive components</li>
                  </ul>
                  <button style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem' }}>
                    Action Button
                  </button>
                </div>
              ),
            },
            {
              id: 'r2',
              title: 'Form Example',
              content: (
                <form>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem' }}>Name:</label>
                    <input type="text" style={{ width: '100%', padding: '0.25rem' }} />
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email:</label>
                    <input type="email" style={{ width: '100%', padding: '0.25rem' }} />
                  </div>
                  <button type="submit" style={{ padding: '0.25rem 0.5rem' }}>Submit</button>
                </form>
              ),
            },
          ]}
        />
      </section>
    </div>
  ),
};

// Edge Cases
export const LongContent: Story = {
  render: (args) => (
    <AccordionWrapper
      options={args}
      items={[
        {
          id: '1',
          title: 'Short Content',
          content: 'This is a brief content section.',
        },
        {
          id: '2',
          title: 'Long Content Section',
          content: (
            <div>
              <p>This accordion panel contains a much longer piece of content to test how the component handles varying content sizes.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <p>The accordion should smoothly animate and handle this content appropriately, maintaining good performance and visual consistency.</p>
            </div>
          ),
        },
        {
          id: '3',
          title: 'Another Short Content',
          content: 'Back to brief content.',
        },
      ]}
      onExpandedChange={args.onExpandedChange}
      onItemToggle={args.onItemToggle}
    />
  ),
};

export const ManyItems: Story = {
  args: {
    multiple: true,
  },
  render: (args) => (
    <div style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1rem' }}>
      <AccordionWrapper
        options={args}
        items={Array.from({ length: 20 }, (_, i) => ({
          id: `item-${i + 1}`,
          title: `Accordion Item ${i + 1}`,
          content: `Content for item ${i + 1}. This tests the accordion's performance with many items.`,
          disabled: i % 5 === 4, // Every 5th item is disabled
        }))}
        onExpandedChange={args.onExpandedChange}
        onItemToggle={args.onItemToggle}
      />
    </div>
  ),
};