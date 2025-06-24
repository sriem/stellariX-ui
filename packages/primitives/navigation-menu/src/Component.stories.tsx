import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { createNavigationMenu } from './index';
import { reactAdapter } from '@stellarix-ui/react';
import { getMenuItemA11yProps, getSubmenuA11yProps, createMenuItemHandlers } from './logic';
import type { NavigationMenuItem } from './types';

const meta = {
    title: 'Primitives/NavigationMenu',
    parameters: {
        docs: {
            description: {
                component: 'A flexible and accessible navigation menu component with support for nested menus, keyboard navigation, and responsive behavior.'
            }
        }
    },
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample navigation items
const sampleItems: NavigationMenuItem[] = [
    {
        id: 'home',
        label: 'Home',
        href: '/',
        active: true,
    },
    {
        id: 'products',
        label: 'Products',
        children: [
            {
                id: 'electronics',
                label: 'Electronics',
                children: [
                    { id: 'phones', label: 'Phones', href: '/products/electronics/phones' },
                    { id: 'laptops', label: 'Laptops', href: '/products/electronics/laptops' },
                    { id: 'tablets', label: 'Tablets', href: '/products/electronics/tablets' },
                ],
            },
            {
                id: 'clothing',
                label: 'Clothing',
                children: [
                    { id: 'mens', label: "Men's", href: '/products/clothing/mens' },
                    { id: 'womens', label: "Women's", href: '/products/clothing/womens' },
                    { id: 'kids', label: "Kids", href: '/products/clothing/kids' },
                ],
            },
            { id: 'books', label: 'Books', href: '/products/books' },
        ],
    },
    {
        id: 'services',
        label: 'Services',
        children: [
            { id: 'consulting', label: 'Consulting', href: '/services/consulting' },
            { id: 'support', label: 'Support', href: '/services/support' },
            { id: 'training', label: 'Training', href: '/services/training', disabled: true },
        ],
    },
    {
        id: 'about',
        label: 'About',
        href: '/about',
    },
    {
        id: 'contact',
        label: 'Contact',
        href: '/contact',
    },
];

// Helper component to render navigation menu
function NavigationMenuDemo({ 
    items = sampleItems,
    orientation = 'horizontal' as const,
    trigger = 'click' as const,
    disabled = false,
    showMobileMenu = true,
    activeItemId = 'home',
    expandedItemIds = [] as string[],
    onItemClick,
}: {
    items?: NavigationMenuItem[];
    orientation?: 'horizontal' | 'vertical';
    trigger?: 'click' | 'hover' | 'both';
    disabled?: boolean;
    showMobileMenu?: boolean;
    activeItemId?: string | null;
    expandedItemIds?: string[];
    onItemClick?: (item: NavigationMenuItem) => void;
}) {
    const [navigationMenu] = useState(() => createNavigationMenu({
        items,
        orientation,
        trigger,
        disabled,
        showMobileMenu,
        activeItemId,
        expandedItemIds,
        onItemClick: (item, event) => {
            console.log('Item clicked:', item);
            onItemClick?.(item);
        },
        onActiveChange: (itemId) => {
            console.log('Active item changed:', itemId);
        },
        onExpandedChange: (expandedIds) => {
            console.log('Expanded items changed:', expandedIds);
        },
        onCollapsedChange: (collapsed) => {
            console.log('Collapsed state changed:', collapsed);
        },
    }));
    
    const [state, setState] = useState(navigationMenu.state.getState());
    
    useEffect(() => {
        return navigationMenu.state.subscribe(setState);
    }, [navigationMenu]);
    
    const NavMenuComponent = reactAdapter.createComponent({
        state: navigationMenu.state,
        logic: navigationMenu.logic,
        metadata: navigationMenu.metadata,
        render: ({ state, a11y, interactions }) => {
            const renderMenuItem = (item: NavigationMenuItem, level: number = 0) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = state.expandedItemIds.includes(item.id);
                
                return (
                    <li key={item.id} style={{ position: 'relative' }}>
                        {hasChildren ? (
                            <button
                                {...getMenuItemA11yProps(state, item.id, hasChildren)}
                                {...createMenuItemHandlers(navigationMenu.state, navigationMenu.options, item.id)}
                                data-item-id={item.id}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    background: item.active ? '#e0e0e0' : 'transparent',
                                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                                    opacity: item.disabled ? 0.5 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    width: '100%',
                                    textAlign: 'left',
                                }}
                            >
                                {item.label}
                                <span style={{ marginLeft: 'auto' }}>
                                    {isExpanded ? '▼' : '►'}
                                </span>
                            </button>
                        ) : (
                            <a
                                {...getMenuItemA11yProps(state, item.id, hasChildren)}
                                {...createMenuItemHandlers(navigationMenu.state, navigationMenu.options, item.id)}
                                data-item-id={item.id}
                                style={{
                                    padding: '8px 16px',
                                    textDecoration: 'none',
                                    color: item.active ? '#0066cc' : 'inherit',
                                    background: item.active ? '#e0e0e0' : 'transparent',
                                    display: 'block',
                                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                                    opacity: item.disabled ? 0.5 : 1,
                                }}
                            >
                                {item.label}
                            </a>
                        )}
                        
                        {hasChildren && isExpanded && (
                            <ul
                                {...getSubmenuA11yProps(state, item.id)}
                                style={{
                                    position: orientation === 'horizontal' && level === 0 ? 'absolute' : 'static',
                                    top: orientation === 'horizontal' && level === 0 ? '100%' : 'auto',
                                    left: orientation === 'horizontal' && level === 0 ? '0' : 'auto',
                                    background: 'white',
                                    border: '1px solid #ccc',
                                    listStyle: 'none',
                                    padding: '4px 0',
                                    margin: 0,
                                    minWidth: '200px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    marginLeft: orientation === 'vertical' ? '16px' : '0',
                                }}
                            >
                                {item.children.map((child) => renderMenuItem(child, level + 1))}
                            </ul>
                        )}
                    </li>
                );
            };
            
            return (
                <nav {...a11y.root} style={{ background: '#f5f5f5', padding: '8px' }}>
                    {state.showMobileMenu && (
                        <button
                            {...a11y.mobileMenuButton}
                            {...interactions.mobileMenuButton}
                            style={{
                                display: 'none',
                                padding: '8px 16px',
                                border: '1px solid #ccc',
                                background: 'white',
                                cursor: 'pointer',
                                marginBottom: '8px',
                            }}
                            className="mobile-menu-button"
                        >
                            ☰ Menu
                        </button>
                    )}
                    
                    <ul
                        {...a11y.menuList}
                        style={{
                            display: state.collapsed ? 'none' : 'flex',
                            flexDirection: orientation === 'horizontal' ? 'row' : 'column',
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            gap: orientation === 'horizontal' ? '8px' : '0',
                        }}
                        className="menu-list"
                    >
                        {state.items.map((item) => renderMenuItem(item))}
                    </ul>
                    
                    <style>{`
                        @media (max-width: ${state.mobileBreakpoint}px) {
                            .mobile-menu-button {
                                display: block !important;
                            }
                            .menu-list {
                                flex-direction: column !important;
                            }
                        }
                    `}</style>
                </nav>
            );
        }
    });
    
    return <NavMenuComponent />;
}

// Stories

export const Default: Story = {
    render: () => <NavigationMenuDemo />,
};

export const Vertical: Story = {
    render: () => <NavigationMenuDemo orientation="vertical" />,
};

export const HoverTrigger: Story = {
    render: () => <NavigationMenuDemo trigger="hover" />,
};

export const BothTriggers: Story = {
    render: () => <NavigationMenuDemo trigger="both" />,
};

export const WithActiveItem: Story = {
    render: () => <NavigationMenuDemo activeItemId="consulting" />,
};

export const WithExpandedItems: Story = {
    render: () => <NavigationMenuDemo expandedItemIds={['products', 'electronics']} />,
};

export const Disabled: Story = {
    render: () => <NavigationMenuDemo disabled />,
};

export const SimpleMenu: Story = {
    render: () => (
        <NavigationMenuDemo
            items={[
                { id: 'home', label: 'Home', href: '/', active: true },
                { id: 'about', label: 'About', href: '/about' },
                { id: 'services', label: 'Services', href: '/services' },
                { id: 'contact', label: 'Contact', href: '/contact' },
            ]}
        />
    ),
};

export const WithIcons: Story = {
    render: () => (
        <NavigationMenuDemo
            items={[
                { id: 'home', label: '🏠 Home', href: '/', active: true },
                { id: 'products', label: '📦 Products', href: '/products' },
                { id: 'services', label: '🛠️ Services', href: '/services' },
                { id: 'contact', label: '📧 Contact', href: '/contact' },
            ]}
        />
    ),
};

export const DeeplyNested: Story = {
    render: () => (
        <NavigationMenuDemo
            items={[
                {
                    id: 'root',
                    label: 'Root Menu',
                    children: [
                        {
                            id: 'level1',
                            label: 'Level 1',
                            children: [
                                {
                                    id: 'level2',
                                    label: 'Level 2',
                                    children: [
                                        { id: 'level3-1', label: 'Level 3 Item 1', href: '/deep/1' },
                                        { id: 'level3-2', label: 'Level 3 Item 2', href: '/deep/2' },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ]}
            orientation="vertical"
            expandedItemIds={['root', 'level1', 'level2']}
        />
    ),
};

export const InteractiveDemo: Story = {
    render: () => {
        const [clickedItem, setClickedItem] = useState<string | null>(null);
        
        return (
            <div>
                <NavigationMenuDemo
                    onItemClick={(item) => setClickedItem(item.label)}
                />
                {clickedItem && (
                    <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
                        Last clicked: {clickedItem}
                    </div>
                )}
            </div>
        );
    },
};

export const Showcase: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div>
                <h3>Horizontal Navigation (Default)</h3>
                <NavigationMenuDemo />
            </div>
            
            <div>
                <h3>Vertical Navigation</h3>
                <NavigationMenuDemo orientation="vertical" />
            </div>
            
            <div>
                <h3>Hover Trigger</h3>
                <NavigationMenuDemo trigger="hover" />
            </div>
            
            <div>
                <h3>Disabled State</h3>
                <NavigationMenuDemo disabled />
            </div>
            
            <div>
                <h3>Simple Menu Without Submenus</h3>
                <NavigationMenuDemo
                    items={[
                        { id: 'home', label: 'Home', href: '/', active: true },
                        { id: 'about', label: 'About', href: '/about' },
                        { id: 'services', label: 'Services', href: '/services' },
                        { id: 'contact', label: 'Contact', href: '/contact' },
                    ]}
                />
            </div>
            
            <div>
                <h3>With Icons and Mixed States</h3>
                <NavigationMenuDemo
                    items={[
                        { id: 'home', label: '🏠 Home', href: '/', active: true },
                        { id: 'products', label: '📦 Products', href: '/products' },
                        { id: 'services', label: '🛠️ Services', href: '/services', disabled: true },
                        { id: 'contact', label: '📧 Contact', href: '/contact' },
                    ]}
                />
            </div>
        </div>
    ),
};