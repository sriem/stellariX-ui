/**
 * Badge Component Stories
 * Comprehensive showcase of all badge features and states
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createBadgeWithImplementation } from './index';
import { reactAdapter } from '@stellarix/react';

// Create a wrapper component that creates individual Badge instances
const BadgeWrapper = React.forwardRef((props: any, ref: any) => {
  const [badge] = React.useState(() => createBadgeWithImplementation(props));
  const [state, setState] = React.useState(() => badge.state.getState());
  
  React.useEffect(() => {
    const unsubscribe = badge.state.subscribe(setState);
    return unsubscribe;
  }, [badge]);

  const a11yProps = badge.logic.getA11yProps('root');
  
  // Check if badge should be displayed
  if (!badge.state.shouldDisplay()) {
    return null;
  }

  const displayContent = badge.state.getDisplayContent();

  // Determine badge style based on type
  const getBadgeClassName = () => {
    const classes = ['badge', `badge-${state.variant}`];
    if (state.type === 'dot') classes.push('badge-dot');
    if (state.type === 'status') classes.push('badge-status');
    if (props.className) classes.push(props.className);
    return classes.join(' ');
  };

  return (
    <span
      ref={ref}
      {...a11yProps}
      className={getBadgeClassName()}
      data-type={state.type}
    >
      {state.type !== 'dot' && displayContent}
    </span>
  );
});

BadgeWrapper.displayName = 'Badge';

const Badge = BadgeWrapper;

// Create a wrapper for badges that can wrap other content
const BadgeContainer = ({ children, badge, ...props }: any) => {
  return (
    <div className="badge-container" style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <div className="badge-position">
        <Badge {...badge} {...props} />
      </div>
    </div>
  );
};

// Decorator to add visual styles to the headless badge
const withBadgeStyles = (Story: any) => {
  return (
    <>
      <style>{`
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          line-height: 1;
          padding: 2px 6px;
          min-width: 20px;
          height: 20px;
          border-radius: 10px;
          white-space: nowrap;
          transition: all 0.2s;
        }
        
        /* Dot badge style */
        .badge-dot {
          width: 8px;
          height: 8px;
          min-width: 8px;
          padding: 0;
          border-radius: 50%;
        }
        
        /* Status badge style */
        .badge-status {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 500;
        }
        
        /* Variant colors */
        .badge-default {
          background-color: #e5e7eb;
          color: #374151;
        }
        
        .badge-primary {
          background-color: #3b82f6;
          color: white;
        }
        
        .badge-secondary {
          background-color: #6b7280;
          color: white;
        }
        
        .badge-success {
          background-color: #10b981;
          color: white;
        }
        
        .badge-warning {
          background-color: #f59e0b;
          color: white;
        }
        
        .badge-error {
          background-color: #ef4444;
          color: white;
        }
        
        .badge-info {
          background-color: #06b6d4;
          color: white;
        }
        
        /* Badge container for positioning */
        .badge-container {
          position: relative;
          display: inline-block;
        }
        
        .badge-position {
          position: absolute;
          top: -4px;
          right: -4px;
          z-index: 1;
        }
        
        /* Demo button style */
        .demo-button {
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          background-color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .demo-button:hover {
          background-color: #f9fafb;
          border-color: #d1d5db;
        }
        
        /* Demo icon button */
        .demo-icon-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e5e7eb;
          background-color: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.2s;
        }
        
        .demo-icon-button:hover {
          background-color: #f9fafb;
          border-color: #d1d5db;
        }
        
        /* Demo avatar */
        .demo-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #6b7280;
        }
      `}</style>
      <Story />
    </>
  );
};

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  decorators: [withBadgeStyles],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A badge component for displaying small status indicators, counts, or labels.

## Features
- ✅ Multiple variants (default, primary, secondary, success, warning, error, info)
- ✅ Three types: numeric, dot, status
- ✅ Automatic overflow handling (99+)
- ✅ Hide/show zero values
- ✅ Full accessibility support
- ✅ Can wrap other components

## Use Cases
- Notification counts
- Status indicators
- Labels and tags
- Unread message counts
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'The color variant of the badge',
    },
    type: {
      control: { type: 'select' },
      options: ['numeric', 'dot', 'status'],
      description: 'The type of badge',
    },
    content: {
      control: 'text',
      description: 'The content to display in the badge',
    },
    visible: {
      control: 'boolean',
      description: 'Whether the badge is visible',
    },
    max: {
      control: { type: 'number', min: 1, max: 9999 },
      description: 'Maximum value before showing overflow (e.g., 99+)',
    },
    showZero: {
      control: 'boolean',
      description: 'Whether to show the badge when content is 0',
    },
    onContentChange: { action: 'content changed' },
    onVisibilityChange: { action: 'visibility changed' },
  },
  args: {
    variant: 'primary',
    type: 'numeric',
    content: 5,
    visible: true,
    max: 99,
    showZero: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Default: Story = {};

export const Dot: Story = {
  args: {
    type: 'dot',
    variant: 'error',
  },
};

export const Status: Story = {
  args: {
    type: 'status',
    content: 'New',
    variant: 'success',
  },
};

// Variant Examples
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Badge variant="default" content={5} />
      <Badge variant="primary" content={10} />
      <Badge variant="secondary" content={15} />
      <Badge variant="success" content={20} />
      <Badge variant="warning" content={25} />
      <Badge variant="error" content={30} />
      <Badge variant="info" content={35} />
    </div>
  ),
};

// Overflow Example
export const Overflow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Badge content={50} max={99} />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>50 / 99</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Badge content={99} max={99} />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>99 / 99</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Badge content={150} max={99} />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>150 / 99</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Badge content={1000} max={999} />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>1000 / 999</p>
      </div>
    </div>
  ),
};

// Zero Handling
export const ZeroHandling: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div>
        <Badge content={0} showZero={false} />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
          showZero: false (hidden)
        </p>
      </div>
      <div>
        <Badge content={0} showZero={true} />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
          showZero: true
        </p>
      </div>
    </div>
  ),
};

// With Buttons
export const WithButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <BadgeContainer badge={{ content: 3, variant: 'primary' }}>
        <button className="demo-button">Messages</button>
      </BadgeContainer>
      
      <BadgeContainer badge={{ content: 12, variant: 'error' }}>
        <button className="demo-button">Notifications</button>
      </BadgeContainer>
      
      <BadgeContainer badge={{ type: 'dot', variant: 'success' }}>
        <button className="demo-button">Online</button>
      </BadgeContainer>
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <BadgeContainer badge={{ content: 5, variant: 'primary' }}>
        <button className="demo-icon-button">🔔</button>
      </BadgeContainer>
      
      <BadgeContainer badge={{ content: 99, variant: 'error' }}>
        <button className="demo-icon-button">📧</button>
      </BadgeContainer>
      
      <BadgeContainer badge={{ type: 'dot', variant: 'warning' }}>
        <button className="demo-icon-button">⚙️</button>
      </BadgeContainer>
    </div>
  ),
};

// With Avatars
export const WithAvatars: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <BadgeContainer badge={{ type: 'dot', variant: 'success' }}>
        <div className="demo-avatar">JD</div>
      </BadgeContainer>
      
      <BadgeContainer badge={{ content: 3, variant: 'primary' }}>
        <div className="demo-avatar">AB</div>
      </BadgeContainer>
      
      <BadgeContainer badge={{ type: 'status', content: 'Pro', variant: 'info' }}>
        <div className="demo-avatar">XY</div>
      </BadgeContainer>
    </div>
  ),
};

// Interactive Example
export const Interactive: Story = {
  render: () => {
    const [count, setCount] = React.useState(0);
    const [visible, setVisible] = React.useState(true);
    const [showZero, setShowZero] = React.useState(false);
    
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <BadgeContainer badge={{ content: count, visible, showZero }}>
            <button className="demo-button">Notifications</button>
          </BadgeContainer>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <button
            onClick={() => setCount(c => Math.max(0, c - 1))}
            style={{
              padding: '6px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            -1
          </button>
          <button
            onClick={() => setCount(c => c + 1)}
            style={{
              padding: '6px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            +1
          </button>
          <button
            onClick={() => setCount(0)}
            style={{
              padding: '6px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
            />
            Show badge
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={showZero}
              onChange={(e) => setShowZero(e.target.checked)}
            />
            Show when zero
          </label>
        </div>
        
        <div style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
          Current count: {count}
        </div>
      </div>
    );
  },
};

// Status Badges
export const StatusBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Badge type="status" variant="success" content="Active" />
      <Badge type="status" variant="warning" content="Pending" />
      <Badge type="status" variant="error" content="Failed" />
      <Badge type="status" variant="info" content="Processing" />
      <Badge type="status" variant="secondary" content="Archived" />
      <Badge type="status" variant="primary" content="Featured" />
    </div>
  ),
};

// Showcase
export const Showcase: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px' }}>Badge Component Showcase</h2>
      
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Badge Types</h3>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div>
            <Badge content={42} />
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Numeric</p>
          </div>
          <div>
            <Badge type="dot" variant="error" />
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Dot</p>
          </div>
          <div>
            <Badge type="status" variant="success" content="New" />
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Status</p>
          </div>
        </div>
      </section>
      
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>With Components</h3>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <BadgeContainer badge={{ content: 5 }}>
            <button className="demo-button">Button</button>
          </BadgeContainer>
          
          <BadgeContainer badge={{ content: 23, variant: 'error' }}>
            <button className="demo-icon-button">📧</button>
          </BadgeContainer>
          
          <BadgeContainer badge={{ type: 'dot', variant: 'success' }}>
            <div className="demo-avatar">JD</div>
          </BadgeContainer>
          
          <BadgeContainer badge={{ type: 'status', content: 'Beta', variant: 'warning' }}>
            <div style={{ 
              padding: '12px 20px', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: 'white' 
            }}>
              Feature Card
            </div>
          </BadgeContainer>
        </div>
      </section>
      
      <section>
        <h3 style={{ marginBottom: '16px' }}>Color Variants</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '16px' }}>
          {['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'].map((variant) => (
            <div key={variant} style={{ textAlign: 'center' }}>
              <Badge variant={variant as any} content={10} />
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};