/**
 * Breadcrumb Component Stories
 * Comprehensive showcase of all breadcrumb features and edge cases
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createBreadcrumb } from './index';
import { reactAdapter } from '@stellarix-ui/react';
import type { BreadcrumbItem } from './types';

// Create a wrapper component that creates individual Breadcrumb instances
const BreadcrumbWrapper = React.forwardRef((props: any, ref: any) => {
  const [breadcrumb] = React.useState(() => createBreadcrumb(props));
  const Component = React.useMemo(() => breadcrumb.connect(reactAdapter), [breadcrumb]);
  
  // Update the breadcrumb's state when props change
  React.useEffect(() => {
    if (props.items !== undefined) {
      breadcrumb.state.setItems(props.items);
    }
  }, [props.items, breadcrumb]);
  
  React.useEffect(() => {
    if (props.disabled !== undefined) {
      breadcrumb.state.setDisabled(props.disabled);
    }
  }, [props.disabled, breadcrumb]);
  
  React.useEffect(() => {
    if (props.separator !== undefined) {
      breadcrumb.state.setSeparator(props.separator);
    }
  }, [props.separator, breadcrumb]);
  
  React.useEffect(() => {
    if (props.maxItems !== undefined) {
      breadcrumb.state.setMaxItems(props.maxItems);
    }
  }, [props.maxItems, breadcrumb]);
  
  React.useEffect(() => {
    if (props.showHomeIcon !== undefined) {
      breadcrumb.state.setShowHomeIcon(props.showHomeIcon);
    }
  }, [props.showHomeIcon, breadcrumb]);
  
  // Connect onChange handler
  React.useEffect(() => {
    if (props.onChange) {
      const unsubscribe = breadcrumb.state.subscribe((state) => {
        props.onChange(state.items);
      });
      return unsubscribe;
    }
  }, [props.onChange, breadcrumb]);
  
  // Subscribe to state for rendering
  const [state, setState] = React.useState(() => breadcrumb.state.getState());
  
  React.useEffect(() => {
    const unsubscribe = breadcrumb.state.subscribe(setState);
    return unsubscribe;
  }, [breadcrumb]);
  
  // Get displayed items based on truncation
  const getDisplayedItems = () => {
    if (!state.maxItems || state.items.length <= state.maxItems) {
      return state.items;
    }
    
    const firstCount = Math.floor((state.maxItems - 1) / 2);
    const lastCount = state.maxItems - 1 - firstCount;
    
    const firstItems = state.items.slice(0, firstCount);
    const lastItems = state.items.slice(-lastCount);
    
    return [
      ...firstItems,
      { id: '...', label: '...', disabled: true },
      ...lastItems
    ];
  };
  
  const displayedItems = getDisplayedItems();
  
  // Get A11y props from logic
  const rootA11y = breadcrumb.logic.getA11yProps('root', state);
  const listA11y = breadcrumb.logic.getA11yProps('list', state);
  
  // Get interaction handlers
  const rootHandlers = breadcrumb.logic.getInteractionHandlers('root', state);
  
  return (
    <nav {...rootA11y} {...rootHandlers} className={props.className} ref={ref}>
      <ol {...listA11y} style={{ display: 'flex', alignItems: 'center', listStyle: 'none', margin: 0, padding: 0 }}>
        {displayedItems.map((item, index) => {
          const itemA11y = breadcrumb.logic.getA11yProps('item', state, { index });
          const linkA11y = breadcrumb.logic.getA11yProps('link', state, { index });
          const linkHandlers = breadcrumb.logic.getInteractionHandlers('link', state);
          
          const isLast = index === displayedItems.length - 1;
          
          // Attach index to event handlers
          const handlersWithIndex = Object.entries(linkHandlers).reduce((acc, [key, handler]) => {
            acc[key] = (event: any) => {
              event.index = index;
              handler(event);
            };
            return acc;
          }, {} as any);
          
          return (
            <li key={item.id} {...itemA11y}>
              {index > 0 && state.separator && (
                <span aria-hidden="true" style={{ margin: '0 8px', color: '#6b7280' }}>
                  {state.separator}
                </span>
              )}
              
              {item.href && !state.disabled && !item.disabled ? (
                <a 
                  {...linkA11y}
                  {...handlersWithIndex}
                  style={{
                    color: item.current ? '#1f2937' : '#3b82f6',
                    textDecoration: item.current ? 'none' : 'underline',
                    cursor: item.disabled || item.id === '...' ? 'default' : 'pointer',
                    opacity: item.disabled ? 0.5 : 1,
                    fontWeight: item.current ? 'semibold' : 'normal',
                  }}
                >
                  {index === 0 && state.showHomeIcon && '🏠 '}
                  {item.label}
                </a>
              ) : (
                <span
                  {...linkA11y}
                  {...handlersWithIndex}
                  style={{
                    color: item.current ? '#1f2937' : '#6b7280',
                    cursor: item.disabled || item.id === '...' || state.disabled ? 'default' : 'pointer',
                    opacity: item.disabled || state.disabled ? 0.5 : 1,
                    fontWeight: item.current ? 'semibold' : 'normal',
                  }}
                >
                  {index === 0 && state.showHomeIcon && '🏠 '}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

BreadcrumbWrapper.displayName = 'Breadcrumb';

const Breadcrumb = BreadcrumbWrapper;

// Decorator to add visual styles
const withBreadcrumbStyles = (Story: any) => {
  return (
    <>
      <style>{`
        nav[role="navigation"] {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
        }
        
        nav[role="navigation"] a:focus,
        nav[role="navigation"] span[tabindex="0"]:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        nav[role="navigation"] a:hover:not([aria-disabled="true"]),
        nav[role="navigation"] span[tabindex="0"]:hover:not([aria-disabled="true"]) {
          opacity: 0.8;
        }
      `}</style>
      <Story />
    </>
  );
};

const meta: Meta<typeof Breadcrumb> = {
  title: 'Primitives/Breadcrumb',
  component: Breadcrumb,
  decorators: [withBreadcrumbStyles],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A framework-agnostic breadcrumb navigation component with full accessibility support.

## Features
- ✅ Item management (add, remove, update items)
- ✅ Customizable separators
- ✅ Active/current item indication
- ✅ Truncation for long breadcrumbs
- ✅ Click navigation support
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Full accessibility support (WCAG 2.1 AA)
- ✅ Disabled state support
- ✅ Home icon option

## Accessibility
- Uses semantic \`role="navigation"\` with \`aria-label\`
- Proper list structure with \`role="list"\` and \`role="listitem"\`
- Current page marked with \`aria-current="page"\`
- Full keyboard navigation support
- Focus management and visual indicators
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of breadcrumb items',
    },
    separator: {
      control: 'text',
      description: 'Separator between items',
    },
    maxItems: {
      control: 'number',
      description: 'Maximum items to display before truncation',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the breadcrumb is disabled',
    },
    showHomeIcon: {
      control: 'boolean',
      description: 'Whether to show home icon for first item',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the navigation',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    separator: '/',
    disabled: false,
    showHomeIcon: false,
    ariaLabel: 'Breadcrumb',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample breadcrumb items
const sampleItems: BreadcrumbItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'products', label: 'Products', href: '/products' },
  { id: 'electronics', label: 'Electronics', href: '/products/electronics' },
  { id: 'phones', label: 'Mobile Phones', href: '/products/electronics/phones' },
  { id: 'current', label: 'iPhone 15 Pro', current: true },
];

// Basic Examples
export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

export const WithHomeIcon: Story = {
  args: {
    items: sampleItems,
    showHomeIcon: true,
  },
};

export const CustomSeparator: Story = {
  args: {
    items: sampleItems,
    separator: '>',
  },
};

export const ChevronSeparator: Story = {
  args: {
    items: sampleItems,
    separator: '›',
  },
};

// State Variations
export const Disabled: Story = {
  args: {
    items: sampleItems,
    disabled: true,
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'admin', label: 'Admin', href: '/admin', disabled: true },
      { id: 'settings', label: 'Settings', href: '/admin/settings' },
      { id: 'current', label: 'Security', current: true },
    ],
  },
};

export const NoLinks: Story = {
  args: {
    items: [
      { id: 'step1', label: 'Step 1' },
      { id: 'step2', label: 'Step 2' },
      { id: 'step3', label: 'Step 3', current: true },
    ],
  },
};

// Truncation Examples
export const Truncated: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'cat1', label: 'Category 1', href: '/cat1' },
      { id: 'cat2', label: 'Category 2', href: '/cat2' },
      { id: 'cat3', label: 'Category 3', href: '/cat3' },
      { id: 'cat4', label: 'Category 4', href: '/cat4' },
      { id: 'cat5', label: 'Category 5', href: '/cat5' },
      { id: 'current', label: 'Current Page', current: true },
    ],
    maxItems: 4,
  },
};

export const VeryLongPath: Story = {
  args: {
    items: Array.from({ length: 10 }, (_, i) => ({
      id: `level-${i}`,
      label: `Level ${i + 1}`,
      href: `/level-${i + 1}`,
      ...(i === 9 ? { current: true } : {}),
    })),
    maxItems: 5,
  },
};

// Interactive Examples
export const InteractiveNavigation: Story = {
  render: (args) => {
    const [clickedItem, setClickedItem] = React.useState<string | null>(null);
    
    const handleItemClick = (item: BreadcrumbItem, index: number) => {
      setClickedItem(`${item.label} (index: ${index})`);
    };
    
    return (
      <div>
        <Breadcrumb {...args} onItemClick={handleItemClick} />
        {clickedItem && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#e0f2fe', borderRadius: '4px' }}>
            Clicked: <strong>{clickedItem}</strong>
          </div>
        )}
      </div>
    );
  },
  args: {
    items: sampleItems,
  },
};

export const DynamicBreadcrumb: Story = {
  render: () => {
    const [items, setItems] = React.useState<BreadcrumbItem[]>([
      { id: 'home', label: 'Home', href: '/' },
    ]);
    
    const addLevel = () => {
      const newLevel = items.length;
      setItems([
        ...items.map(item => ({ ...item, current: false })),
        { 
          id: `level-${newLevel}`, 
          label: `Level ${newLevel}`, 
          href: `/level-${newLevel}`,
          current: true,
        },
      ]);
    };
    
    const removeLevel = () => {
      if (items.length > 1) {
        const newItems = items.slice(0, -1);
        newItems[newItems.length - 1].current = true;
        setItems(newItems);
      }
    };
    
    return (
      <div>
        <Breadcrumb items={items} />
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button onClick={addLevel} style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ddd' }}>
            Add Level
          </button>
          <button onClick={removeLevel} style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ddd' }}>
            Remove Level
          </button>
        </div>
      </div>
    );
  },
};

// Keyboard Navigation Demo
export const KeyboardNavigation: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        <strong>Keyboard Navigation Test:</strong><br />
        Use <kbd>Tab</kbd> to focus the breadcrumb<br />
        Use <kbd>←</kbd> <kbd>→</kbd> to navigate between items<br />
        Use <kbd>Home</kbd> to go to first item<br />
        Use <kbd>End</kbd> to go to last item<br />
        Use <kbd>Enter</kbd> or <kbd>Space</kbd> to activate items
      </p>
      
      <Breadcrumb 
        items={[
          { id: 'home', label: 'Home', href: '/' },
          { id: 'docs', label: 'Documentation', href: '/docs' },
          { id: 'api', label: 'API Reference', href: '/docs/api' },
          { id: 'components', label: 'Components', href: '/docs/api/components' },
          { id: 'breadcrumb', label: 'Breadcrumb', current: true },
        ]}
      />
    </div>
  ),
};

// Boundary and Edge Cases
export const EmptyBreadcrumb: Story = {
  args: {
    items: [],
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', current: true },
    ],
  },
};

export const VeryLongLabels: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'long1', label: 'This is a very long breadcrumb label that might cause layout issues', href: '/long1' },
      { id: 'long2', label: 'Another extremely long label to test text wrapping and overflow behavior', href: '/long2' },
      { id: 'current', label: 'Current page with a moderately long title', current: true },
    ],
  },
};

export const AllVariationsShowcase: Story = {
  render: () => {
    const variations = [
      {
        title: 'Default',
        items: sampleItems,
      },
      {
        title: 'With Home Icon',
        items: sampleItems,
        showHomeIcon: true,
      },
      {
        title: 'Custom Separator (>)',
        items: sampleItems.slice(0, 3),
        separator: '>',
      },
      {
        title: 'Disabled',
        items: sampleItems.slice(0, 3),
        disabled: true,
      },
      {
        title: 'Truncated',
        items: Array.from({ length: 8 }, (_, i) => ({
          id: `item-${i}`,
          label: `Item ${i + 1}`,
          href: `/item-${i + 1}`,
        })),
        maxItems: 4,
      },
      {
        title: 'No Links',
        items: [
          { id: 'step1', label: 'Step 1' },
          { id: 'step2', label: 'Step 2' },
          { id: 'step3', label: 'Step 3', current: true },
        ],
      },
    ];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {variations.map((variation, index) => (
          <div key={index}>
            <h3 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              {variation.title}
            </h3>
            <Breadcrumb {...variation} />
          </div>
        ))}
      </div>
    );
  },
};

// Performance Test
export const StressTest: Story = {
  render: () => {
    const [itemCount, setItemCount] = React.useState(50);
    
    const items = Array.from({ length: itemCount }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i + 1}`,
      href: `/item-${i + 1}`,
      ...(i === itemCount - 1 ? { current: true } : {}),
    }));
    
    return (
      <div>
        <p style={{ marginBottom: '16px' }}>
          <strong>Performance Test:</strong> Large breadcrumb with {itemCount} items<br />
          <label>
            Items: 
            <input 
              type="range" 
              min="10" 
              max="200" 
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              style={{ marginLeft: '8px' }}
            />
            {itemCount}
          </label>
        </p>
        
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '16px', 
          borderRadius: '4px',
          overflowX: 'auto',
        }}>
          <Breadcrumb items={items} maxItems={7} />
        </div>
      </div>
    );
  },
};