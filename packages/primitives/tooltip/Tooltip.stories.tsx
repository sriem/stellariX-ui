import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { createTooltip } from './src/index';
import type { TooltipPlacement } from './src/types';

const meta: Meta = {
  title: 'Primitives/Tooltip',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj;

// Helper component to render tooltip
interface TooltipDemoProps {
  content?: string;
  placement?: TooltipPlacement;
  showDelay?: number;
  hideDelay?: number;
  disabled?: boolean;
  controlled?: boolean;
  visible?: boolean;
  interactive?: boolean;
  customContent?: React.ReactNode;
}

const TooltipDemo = ({ 
  content = 'This is a tooltip',
  placement = 'top',
  showDelay = 200,
  hideDelay = 0,
  disabled = false,
  controlled = false,
  visible = false,
  interactive = false,
  customContent
}: TooltipDemoProps) => {
  const [tooltip] = useState(() => createTooltip({
    content,
    placement,
    showDelay,
    hideDelay,
    disabled,
    controlled,
    visible,
  }));

  const [state, setState] = useState(() => tooltip.state.getState());
  const [controlledVisible, setControlledVisible] = useState(visible);

  useEffect(() => {
    const unsubscribe = tooltip.state.subscribe(setState);
    return unsubscribe;
  }, [tooltip]);

  // Update controlled visibility
  useEffect(() => {
    if (controlled) {
      if (controlledVisible) {
        tooltip.state.show();
      } else {
        tooltip.state.hide();
      }
    }
  }, [controlled, controlledVisible, tooltip]);

  // Get interaction handlers
  const triggerHandlers = tooltip.logic.getInteractionHandlers('trigger');
  const triggerA11y = tooltip.logic.getA11yProps('trigger');
  const contentA11y = tooltip.logic.getA11yProps('content');

  // Position calculation helper
  const getTooltipPosition = (triggerEl: HTMLElement, tooltipEl: HTMLElement) => {
    const triggerRect = triggerEl.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const offset = 8;
    
    let top = 0;
    let left = 0;
    
    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + offset;
        break;
    }
    
    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8;
    }
    
    if (top < 8) top = 8;
    if (top + tooltipRect.height > viewportHeight - 8) {
      top = viewportHeight - tooltipRect.height - 8;
    }
    
    return { top, left };
  };

  // Position tooltip when visible
  useEffect(() => {
    if (state.visible) {
      const triggerEl = document.getElementById('tooltip-trigger');
      const tooltipEl = document.getElementById('tooltip-content');
      
      if (triggerEl && tooltipEl) {
        const { top, left } = getTooltipPosition(triggerEl, tooltipEl);
        
        Object.assign(tooltipEl.style, {
          position: 'fixed',
          top: `${top}px`,
          left: `${left}px`,
          zIndex: '9999'
        });
      }
    }
  }, [state.visible, placement]);

  return (
    <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button
        id="tooltip-trigger"
        className={`sx-button sx-button-primary ${disabled ? 'sx-button-disabled' : ''}`}
        {...triggerHandlers}
        {...triggerA11y}
        disabled={disabled}
        onClick={controlled ? () => setControlledVisible(!controlledVisible) : undefined}
      >
        {disabled ? 'Disabled Button' : 'Hover or Focus Me'}
      </button>
      
      {state.visible && (
        <div
          id="tooltip-content"
          className="sx-tooltip"
          style={{
            background: '#333',
            color: '#fff',
            padding: customContent ? '12px' : '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            lineHeight: customContent ? 'normal' : '1',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            maxWidth: customContent ? '300px' : '200px',
            pointerEvents: interactive ? 'auto' : 'none',
            ...(interactive && {
              cursor: 'default',
            })
          }}
          {...contentA11y}
          onMouseEnter={interactive ? () => tooltip.state.show() : undefined}
          onMouseLeave={interactive ? () => tooltip.state.hide() : undefined}
        >
          {customContent || state.content}
          
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              ...(placement === 'top' && {
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderWidth: '4px 4px 0 4px',
                borderColor: '#333 transparent transparent transparent',
              }),
              ...(placement === 'bottom' && {
                top: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderWidth: '0 4px 4px 4px',
                borderColor: 'transparent transparent #333 transparent',
              }),
              ...(placement === 'left' && {
                right: '-4px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderWidth: '4px 0 4px 4px',
                borderColor: 'transparent transparent transparent #333',
              }),
              ...(placement === 'right' && {
                left: '-4px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderWidth: '4px 4px 4px 0',
                borderColor: 'transparent #333 transparent transparent',
              }),
            }}
          />
        </div>
      )}
    </div>
  );
};

// Stories
export const Default: Story = {
  render: () => <TooltipDemo />,
};

export const BottomPlacement: Story = {
  render: () => <TooltipDemo placement="bottom" content="Tooltip positioned below" />,
};

export const LeftPlacement: Story = {
  render: () => <TooltipDemo placement="left" content="Tooltip positioned left" />,
};

export const RightPlacement: Story = {
  render: () => <TooltipDemo placement="right" content="Tooltip positioned right" />,
};

export const NoDelay: Story = {
  render: () => <TooltipDemo showDelay={0} content="Shows immediately" />,
};

export const LongDelay: Story = {
  render: () => <TooltipDemo showDelay={1000} content="Shows after 1 second" />,
};

export const HideDelay: Story = {
  render: () => <TooltipDemo hideDelay={500} content="Hides after 500ms" />,
};

export const ClickTrigger: Story = {
  render: () => <TooltipDemo controlled={true} content="Click to toggle" />,
};

export const FocusTrigger: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '20px' }}>Tab to focus the button and show tooltip</p>
      <TooltipDemo content="Shown on focus" />
    </div>
  ),
};

export const DisabledElement: Story = {
  render: () => <TooltipDemo disabled={true} content="This tooltip won't show" />,
};

export const CustomContent: Story = {
  render: () => (
    <TooltipDemo 
      customContent={
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Rich Content Tooltip</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>This tooltip contains formatted content.</p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
          </ul>
        </div>
      }
    />
  ),
};

export const Interactive: Story = {
  render: () => (
    <TooltipDemo 
      interactive={true}
      hideDelay={200}
      customContent={
        <div>
          <p style={{ margin: '0 0 8px 0' }}>This tooltip stays open when you hover over it.</p>
          <button 
            className="sx-button sx-button-sm"
            onClick={() => alert('Button clicked!')}
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            Click Me
          </button>
        </div>
      }
    />
  ),
};

export const LongContent: Story = {
  render: () => (
    <TooltipDemo 
      content="This is a very long tooltip content that should wrap properly when it exceeds the maximum width of the tooltip container"
    />
  ),
};

// Showcase with all variations
export const Showcase: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gap: '60px', 
      gridTemplateColumns: 'repeat(2, 1fr)', 
      padding: '100px',
      minHeight: '800px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h3>Top Placement</h3>
        <TooltipDemo placement="top" content="Top tooltip" />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h3>Bottom Placement</h3>
        <TooltipDemo placement="bottom" content="Bottom tooltip" />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h3>Left Placement</h3>
        <TooltipDemo placement="left" content="Left tooltip" />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h3>Right Placement</h3>
        <TooltipDemo placement="right" content="Right tooltip" />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h3>No Delay</h3>
        <TooltipDemo showDelay={0} content="Instant tooltip" />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h3>With Delays</h3>
        <TooltipDemo showDelay={500} hideDelay={300} content="Delayed tooltip" />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h3>Click Trigger</h3>
        <TooltipDemo controlled={true} content="Click-triggered" />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h3>Disabled</h3>
        <TooltipDemo disabled={true} content="Won't show" />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h3>Custom Content</h3>
        <TooltipDemo 
          customContent={
            <div>
              <strong>Custom tooltip</strong>
              <br />
              With multiple lines
            </div>
          }
        />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h3>Interactive</h3>
        <TooltipDemo 
          interactive={true}
          hideDelay={200}
          customContent={
            <div>
              Hover over me!
              <br />
              <button 
                onClick={() => console.log('Clicked!')}
                style={{ marginTop: '4px', fontSize: '12px' }}
              >
                Click
              </button>
            </div>
          }
        />
      </div>
    </div>
  ),
};

// Accessibility showcase
export const AccessibilityShowcase: Story = {
  render: () => (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Accessibility Features</h2>
      <p>The tooltip component includes comprehensive accessibility support:</p>
      
      <ul style={{ marginBottom: '40px' }}>
        <li><strong>Keyboard Support:</strong> Tooltips appear on focus and dismiss on blur</li>
        <li><strong>ARIA Attributes:</strong> Proper role="tooltip" and aria-describedby</li>
        <li><strong>Screen Reader Support:</strong> Content is announced when tooltip appears</li>
        <li><strong>Focus Management:</strong> Disabled elements prevent tooltip activation</li>
      </ul>
      
      <div style={{ display: 'grid', gap: '30px' }}>
        <div>
          <h3>Keyboard Navigation</h3>
          <p>Tab through these buttons to see tooltips on focus:</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <TooltipDemo content="First tooltip" />
            <TooltipDemo content="Second tooltip" />
            <TooltipDemo content="Third tooltip" />
          </div>
        </div>
        
        <div>
          <h3>Mixed Triggers</h3>
          <p>This tooltip responds to both hover and focus:</p>
          <TooltipDemo content="Accessible tooltip - try hover or keyboard focus" />
        </div>
        
        <div>
          <h3>Disabled State</h3>
          <p>Disabled elements don't show tooltips:</p>
          <TooltipDemo disabled={true} content="This won't show" />
        </div>
      </div>
    </div>
  ),
};