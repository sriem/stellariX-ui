import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { createMenu } from './src/index';
import { handleMenuItemClick, handleMenuItemMouseEnter, getMenuItemA11yProps } from './src/logic';
import type { MenuItem } from './src/types';

const meta: Meta = {
  title: 'Primitives/Menu',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj;

// Sample icons for stories
const Icons = {
  file: '📄',
  folder: '📁',
  save: '💾',
  print: '🖨️',
  share: '🔗',
  edit: '✏️',
  delete: '🗑️',
  settings: '⚙️',
  help: '❓',
  user: '👤',
  star: '⭐',
  heart: '❤️',
};

// Helper component to render menu
const MenuDemo = ({ 
  items = [], 
  closeOnSelect = true,
  typeAhead = true,
  initialOpen = false,
  triggerText = 'Open Menu',
  triggerType = 'button'
}: {
  items?: MenuItem[];
  closeOnSelect?: boolean;
  typeAhead?: boolean;
  initialOpen?: boolean;
  triggerText?: string;
  triggerType?: 'button' | 'icon' | 'custom';
}) => {
  const [menu] = useState(() => createMenu({
    items,
    closeOnSelect,
    typeAhead,
    open: initialOpen,
    id: 'menu-demo',
    onOpen: () => console.log('Menu opened'),
    onClose: () => console.log('Menu closed'),
    onSelect: (item) => console.log('Selected:', item.label),
  }));

  const [state, setState] = useState(() => menu.state.getState());

  useEffect(() => {
    const unsubscribe = menu.state.subscribe(setState);
    return unsubscribe;
  }, [menu]);

  // Get interaction handlers
  const triggerHandlers = menu.logic.getInteractionHandlers('trigger');
  const menuHandlers = menu.logic.getInteractionHandlers('menu');
  const triggerA11y = menu.logic.getA11yProps('trigger');
  const menuA11y = menu.logic.getA11yProps('menu');

  // Render a menu item recursively
  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const itemA11y = getMenuItemA11yProps(state, item.id);
    const currentItems = menu.state.getCurrentItems();
    const itemIndex = currentItems.findIndex(i => i.id === item.id);
    const isActive = state.activeIndex === itemIndex;

    return (
      <li
        key={item.id}
        className={`sx-menu-item ${item.disabled ? 'sx-menu-item-disabled' : ''} ${isActive ? 'sx-menu-item-active' : ''}`}
        onClick={(e) => handleMenuItemClick(menu.state, menu.logic, state, item.id, e)}
        onMouseEnter={() => handleMenuItemMouseEnter(menu.state, menu.logic, state, item.id)}
        {...itemA11y}
        style={{
          padding: '8px 16px',
          cursor: item.disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: isActive ? '#f0f0f0' : 'transparent',
          color: item.disabled ? '#999' : 'inherit',
          transition: 'background-color 0.2s',
          position: 'relative',
        }}
      >
        {item.icon && <span style={{ width: '20px' }}>{item.icon}</span>}
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.items && <span style={{ marginLeft: 'auto' }}>▶</span>}
        
        {/* Render submenu if this item is expanded */}
        {item.items && state.submenuStack.includes(item.id) && (
          <ul
            className="sx-submenu"
            style={{
              position: 'absolute',
              left: '100%',
              top: 0,
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              minWidth: '200px',
              listStyle: 'none',
              padding: '4px 0',
              margin: 0,
              zIndex: 1001,
            }}
          >
            {item.items.map(subItem => renderMenuItem(subItem, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  // Render trigger based on type
  const renderTrigger = () => {
    const triggerProps = {
      id: 'menu-demo-trigger',
      ...triggerHandlers,
      ...triggerA11y,
    };

    switch (triggerType) {
      case 'icon':
        return (
          <button
            {...triggerProps}
            className="sx-icon-button"
            style={{
              background: 'transparent',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            ☰
          </button>
        );
      case 'custom':
        return (
          <div
            {...triggerProps}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              background: '#f0f0f0',
              borderRadius: '4px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <span>{Icons.user}</span>
            <span>{triggerText}</span>
            <span style={{ fontSize: '12px' }}>▼</span>
          </div>
        );
      default:
        return (
          <button
            {...triggerProps}
            className="sx-button sx-button-primary"
            style={{
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {triggerText}
          </button>
        );
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '300px' }}>
      {renderTrigger()}
      
      {state.open && (
        <div
          className="sx-menu"
          {...menuHandlers}
          {...menuA11y}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: '200px',
            zIndex: 1000,
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              padding: '4px 0',
              margin: 0,
            }}
          >
            {menu.state.getCurrentItems().map(item => renderMenuItem(item))}
          </ul>
          
          {typeAhead && state.searchQuery && (
            <div
              style={{
                padding: '4px 16px',
                fontSize: '12px',
                color: '#666',
                borderTop: '1px solid #eee',
              }}
            >
              Search: "{state.searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Basic menu items
const basicItems: MenuItem[] = [
  { id: 'new', label: 'New File' },
  { id: 'open', label: 'Open...' },
  { id: 'save', label: 'Save' },
  { id: 'save-as', label: 'Save As...' },
  { id: 'print', label: 'Print', disabled: true },
  { id: 'exit', label: 'Exit' },
];

// Menu items with icons
const itemsWithIcons: MenuItem[] = [
  { id: 'new', label: 'New File', icon: Icons.file },
  { id: 'open', label: 'Open Folder', icon: Icons.folder },
  { id: 'save', label: 'Save', icon: Icons.save },
  { id: 'print', label: 'Print', icon: Icons.print, disabled: true },
  { id: 'share', label: 'Share', icon: Icons.share },
];

// Nested menu items
const nestedItems: MenuItem[] = [
  { 
    id: 'file', 
    label: 'File',
    icon: Icons.file,
    items: [
      { id: 'new', label: 'New' },
      { id: 'open', label: 'Open...' },
      { id: 'recent', label: 'Recent Files', items: [
        { id: 'recent1', label: 'Document1.txt' },
        { id: 'recent2', label: 'Document2.txt' },
        { id: 'recent3', label: 'Document3.txt' },
      ]},
      { id: 'save', label: 'Save' },
      { id: 'save-as', label: 'Save As...' },
    ]
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: Icons.edit,
    items: [
      { id: 'undo', label: 'Undo' },
      { id: 'redo', label: 'Redo' },
      { id: 'cut', label: 'Cut' },
      { id: 'copy', label: 'Copy' },
      { id: 'paste', label: 'Paste', disabled: true },
    ]
  },
  {
    id: 'help',
    label: 'Help',
    icon: Icons.help,
    items: [
      { id: 'docs', label: 'Documentation' },
      { id: 'about', label: 'About' },
    ]
  }
];

// Menu with separators (using disabled items as visual separators)
const itemsWithSeparators: MenuItem[] = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'sep1', label: '───────────', disabled: true },
  { id: 'delete', label: 'Delete', icon: Icons.delete },
  { id: 'sep2', label: '───────────', disabled: true },
  { id: 'selectAll', label: 'Select All' },
];

// Menu with mixed disabled states
const itemsWithDisabled: MenuItem[] = [
  { id: 'new', label: 'New Project', icon: Icons.star },
  { id: 'open', label: 'Open Project', icon: Icons.folder },
  { id: 'recent', label: 'Recent Projects', icon: Icons.heart, disabled: true },
  { id: 'save', label: 'Save', icon: Icons.save },
  { id: 'save-as', label: 'Save As...', disabled: true },
  { id: 'settings', label: 'Settings', icon: Icons.settings },
];

export const Default: Story = {
  render: () => <MenuDemo items={basicItems} />,
};

export const WithIcons: Story = {
  render: () => <MenuDemo items={itemsWithIcons} />,
};

export const Nested: Story = {
  render: () => <MenuDemo items={nestedItems} />,
};

export const Disabled: Story = {
  render: () => <MenuDemo items={itemsWithDisabled} />,
};

export const Separator: Story = {
  render: () => <MenuDemo items={itemsWithSeparators} />,
};

export const CustomTrigger: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <MenuDemo items={basicItems} triggerType="button" triggerText="Button Trigger" />
      <MenuDemo items={basicItems} triggerType="icon" />
      <MenuDemo items={basicItems} triggerType="custom" triggerText="John Doe" />
    </div>
  ),
};

export const NoCloseOnSelect: Story = {
  render: () => <MenuDemo items={basicItems} closeOnSelect={false} />,
};

export const NoTypeAhead: Story = {
  render: () => <MenuDemo items={itemsWithIcons} typeAhead={false} />,
};

export const InitiallyOpen: Story = {
  render: () => <MenuDemo items={basicItems} initialOpen={true} />,
};

export const Showcase: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gap: '40px', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      padding: '40px',
      alignItems: 'start',
    }}>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Basic Menu</h3>
        <MenuDemo items={basicItems} />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>With Icons</h3>
        <MenuDemo items={itemsWithIcons} />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>Nested Menus</h3>
        <MenuDemo items={nestedItems} />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>Disabled Items</h3>
        <MenuDemo items={itemsWithDisabled} />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>Icon Trigger</h3>
        <MenuDemo items={basicItems} triggerType="icon" />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>Custom Trigger</h3>
        <MenuDemo items={itemsWithIcons} triggerType="custom" triggerText="User Menu" />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>With Separators</h3>
        <MenuDemo items={itemsWithSeparators} />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px' }}>No Close on Select</h3>
        <MenuDemo items={basicItems} closeOnSelect={false} />
      </div>
    </div>
  ),
};

// Interactive demo showing keyboard navigation
export const KeyboardNavigation: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h3>Keyboard Navigation Demo</h3>
      <p style={{ marginBottom: '20px' }}>
        Try these keyboard shortcuts:
        <br />• <kbd>Enter</kbd> or <kbd>Space</kbd> - Open menu / Select item
        <br />• <kbd>↑</kbd> <kbd>↓</kbd> - Navigate items
        <br />• <kbd>→</kbd> - Enter submenu
        <br />• <kbd>←</kbd> or <kbd>Esc</kbd> - Exit submenu / Close menu
        <br />• <kbd>Home</kbd> / <kbd>End</kbd> - Jump to first/last item
        <br />• Type letters for type-ahead search
      </p>
      <MenuDemo items={nestedItems} />
    </div>
  ),
};