import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState, useEffect } from 'react';
import { createPopover } from './index';

const meta: Meta = {
  title: 'Primitives/Popover',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj;

// Helper component to render popover
const PopoverDemo = ({ placement = 'bottom', closeOnClickOutside = true, closeOnEscape = true, offset = 8 }) => {
  const [popover] = useState(() => createPopover({
    placement,
    closeOnClickOutside,
    closeOnEscape,
    offset,
  }));

  const [state, setState] = useState(() => popover.state.getState());

  useEffect(() => {
    const unsubscribe = popover.state.subscribe(setState);
    return unsubscribe;
  }, [popover]);

  // Set up refs when elements are mounted
  useEffect(() => {
    const triggerElement = document.getElementById('popover-trigger');
    const contentElement = document.getElementById('popover-content');
    
    if (triggerElement) {
      popover.state.setTriggerElement(triggerElement as HTMLElement);
    }
    if (contentElement) {
      popover.state.setContentElement(contentElement as HTMLElement);
    }
  }, [popover, state.open]);

  // Get interaction handlers
  const triggerHandlers = popover.logic.getInteractionHandlers('trigger');
  const contentHandlers = popover.logic.getInteractionHandlers('content');
  const triggerA11y = popover.logic.getA11yProps('trigger');
  const contentA11y = popover.logic.getA11yProps('content');

  // Position the content when open
  useEffect(() => {
    if (state.open && state.triggerElement && state.contentElement) {
      const triggerRect = state.triggerElement.getBoundingClientRect();
      const contentRect = state.contentElement.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      switch (state.placement) {
        case 'bottom':
          top = triggerRect.bottom + offset;
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
          break;
        case 'top':
          top = triggerRect.top - contentRect.height - offset;
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
          left = triggerRect.left - contentRect.width - offset;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
          left = triggerRect.right + offset;
          break;
      }
      
      Object.assign(state.contentElement.style, {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: '1000'
      });
    }
  }, [state.open, state.placement, state.triggerElement, state.contentElement, offset]);

  return (
    <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button
        id="popover-trigger"
        className="sx-button sx-button-primary"
        {...triggerHandlers}
        {...triggerA11y}
      >
        Click to toggle popover
      </button>
      
      {state.open && (
        <div
          id="popover-content"
          className="sx-popover"
          style={{
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: '200px'
          }}
          {...contentHandlers}
          {...contentA11y}
        >
          <h3 style={{ margin: '0 0 8px 0' }}>Popover Content</h3>
          <p style={{ margin: 0 }}>This is the popover content. Click outside or press Escape to close.</p>
        </div>
      )}
    </div>
  );
};

export const Default: Story = {
  render: () => <PopoverDemo />,
};

export const TopPlacement: Story = {
  render: () => <PopoverDemo placement="top" />,
};

export const LeftPlacement: Story = {
  render: () => <PopoverDemo placement="left" />,
};

export const RightPlacement: Story = {
  render: () => <PopoverDemo placement="right" />,
};

export const NoCloseOnClickOutside: Story = {
  render: () => <PopoverDemo closeOnClickOutside={false} />,
};

export const NoCloseOnEscape: Story = {
  render: () => <PopoverDemo closeOnEscape={false} />,
};

export const LargeOffset: Story = {
  render: () => <PopoverDemo offset={24} />,
};

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '100px', gridTemplateColumns: 'repeat(2, 1fr)', padding: '100px' }}>
      <div>
        <h3>Bottom Placement</h3>
        <PopoverDemo placement="bottom" />
      </div>
      <div>
        <h3>Top Placement</h3>
        <PopoverDemo placement="top" />
      </div>
      <div>
        <h3>Left Placement</h3>
        <PopoverDemo placement="left" />
      </div>
      <div>
        <h3>Right Placement</h3>
        <PopoverDemo placement="right" />
      </div>
    </div>
  ),
};