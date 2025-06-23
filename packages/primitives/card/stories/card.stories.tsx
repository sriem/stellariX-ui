/**
 * Card Component Stories
 * Comprehensive showcase of all card variants and features
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { createCardWithImplementation } from '../src';
import { reactAdapter } from '@stellarix-ui/react';

const meta = {
    title: 'Primitives/Card',
    component: () => <div />, // Placeholder since we're using the factory
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Card component provides a flexible container for grouping related content with various styling options.',
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component to create styled card instances
const CardDemo = ({ 
    title,
    subtitle,
    content,
    footer,
    media,
    style = {},
    ...options 
}: any) => {
    const [selected, setSelected] = useState(options.selected || false);
    
    const cardFactory = createCardWithImplementation({
        ...options,
        selected,
        onSelectionChange: (newSelected) => {
            setSelected(newSelected);
            console.log('Card selection changed:', newSelected);
        },
        onClick: (event) => {
            console.log('Card clicked');
            options.onClick?.(event);
        },
    });
    
    const Card = cardFactory.connect(reactAdapter);
    
    // Variant styles
    const variantStyles = {
        simple: {
            backgroundColor: '#ffffff',
            border: 'none',
        },
        outlined: {
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
        },
        elevated: {
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: 'none',
        },
        filled: {
            backgroundColor: '#f3f4f6',
            border: 'none',
        },
    };
    
    // Padding styles
    const paddingStyles = {
        none: 0,
        sm: 12,
        md: 16,
        lg: 24,
        xl: 32,
    };
    
    const currentVariant = variantStyles[options.variant || 'simple'];
    const currentPadding = paddingStyles[options.padding || 'md'];
    
    return (
        <Card
            style={{
                ...currentVariant,
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                cursor: options.interactive ? 'pointer' : 'default',
                opacity: options.disabled ? 0.6 : 1,
                outline: cardFactory.state.getState().focused ? '2px solid #3b82f6' : 'none',
                outlineOffset: '2px',
                transform: cardFactory.state.getState().hovered && !options.disabled ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: cardFactory.state.getState().hovered && options.variant === 'elevated' && !options.disabled
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    : currentVariant.boxShadow,
                ...style,
            }}
            renderContent={(state) => (
                <>
                    {media && options.hasMedia && (
                        <div style={{ 
                            marginBottom: title || content ? currentPadding : 0,
                        }}>
                            {media}
                        </div>
                    )}
                    
                    {(title || subtitle) && options.hasHeader && (
                        <header style={{ 
                            padding: currentPadding,
                            paddingBottom: content ? currentPadding / 2 : currentPadding,
                        }}>
                            {title && (
                                <h3 style={{ 
                                    margin: 0, 
                                    fontSize: '1.125rem', 
                                    fontWeight: 600,
                                    color: '#111827',
                                }}>
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p style={{ 
                                    margin: 0, 
                                    marginTop: '4px',
                                    fontSize: '0.875rem',
                                    color: '#6b7280',
                                }}>
                                    {subtitle}
                                </p>
                            )}
                        </header>
                    )}
                    
                    {content && (
                        <div style={{ 
                            padding: currentPadding,
                            paddingTop: options.hasHeader ? currentPadding / 2 : currentPadding,
                            paddingBottom: options.hasFooter ? currentPadding / 2 : currentPadding,
                        }}>
                            {content}
                        </div>
                    )}
                    
                    {footer && options.hasFooter && (
                        <footer style={{ 
                            padding: currentPadding,
                            paddingTop: currentPadding / 2,
                            borderTop: '1px solid #e5e7eb',
                        }}>
                            {footer}
                        </footer>
                    )}
                    
                    {state.interactive && state.selected !== undefined && (
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            border: '2px solid #3b82f6',
                            backgroundColor: state.selected ? '#3b82f6' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {state.selected && (
                                <svg 
                                    width="12" 
                                    height="12" 
                                    viewBox="0 0 12 12" 
                                    fill="white"
                                >
                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </div>
                    )}
                </>
            )}
        />
    );
};

// Individual stories
export const Simple: Story = {
    render: () => (
        <CardDemo
            variant="simple"
            hasHeader
            title="Simple Card"
            subtitle="Basic card with minimal styling"
            content="This is a simple card variant with no border or shadow."
        />
    ),
};

export const Outlined: Story = {
    render: () => (
        <CardDemo
            variant="outlined"
            hasHeader
            title="Outlined Card"
            subtitle="Card with border"
            content="This card has a subtle border to define its boundaries."
        />
    ),
};

export const Elevated: Story = {
    render: () => (
        <CardDemo
            variant="elevated"
            hasHeader
            title="Elevated Card"
            subtitle="Card with shadow"
            content="This card appears elevated with a shadow effect."
        />
    ),
};

export const Filled: Story = {
    render: () => (
        <CardDemo
            variant="filled"
            hasHeader
            title="Filled Card"
            subtitle="Card with background color"
            content="This card has a subtle background color."
        />
    ),
};

export const Interactive: Story = {
    render: () => (
        <CardDemo
            variant="elevated"
            interactive
            hasHeader
            title="Interactive Card"
            subtitle="Click to select"
            content="This card can be clicked and selected. Try hovering and clicking!"
        />
    ),
};

export const WithMedia: Story = {
    render: () => (
        <CardDemo
            variant="outlined"
            hasMedia
            hasHeader
            title="Card with Media"
            subtitle="Features an image"
            content="Cards can display media content like images or videos at the top."
            media={
                <img 
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=200&fit=crop"
                    alt="Nature landscape"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
            }
        />
    ),
};

export const WithFooter: Story = {
    render: () => (
        <CardDemo
            variant="elevated"
            hasHeader
            hasFooter
            title="Card with Footer"
            subtitle="Complete structure"
            content="This card demonstrates the use of header, content, and footer sections."
            footer={
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ 
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        cursor: 'pointer',
                    }}>
                        Action
                    </button>
                    <button style={{ 
                        padding: '8px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                    }}>
                        Cancel
                    </button>
                </div>
            }
        />
    ),
};

export const PaddingSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(['none', 'sm', 'md', 'lg', 'xl'] as const).map(padding => (
                <CardDemo
                    key={padding}
                    variant="outlined"
                    padding={padding}
                    hasHeader
                    title={`Padding: ${padding}`}
                    content="Content area shows the padding size."
                />
            ))}
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <CardDemo
            variant="elevated"
            interactive
            disabled
            hasHeader
            title="Disabled Card"
            subtitle="Cannot be interacted with"
            content="This card is disabled and cannot be clicked or selected."
        />
    ),
};

export const Selected: Story = {
    render: () => (
        <CardDemo
            variant="elevated"
            interactive
            selected
            hasHeader
            title="Pre-selected Card"
            subtitle="Already selected"
            content="This card starts in a selected state."
        />
    ),
};

// Comprehensive showcase
export const Showcase: Story = {
    render: () => (
        <div style={{ maxWidth: '1200px' }}>
            <h3 style={{ marginBottom: '24px' }}>Card Component Showcase</h3>
            
            {/* Variants */}
            <div style={{ marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '16px', color: '#4b5563' }}>Variants</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    {(['simple', 'outlined', 'elevated', 'filled'] as const).map(variant => (
                        <CardDemo
                            key={variant}
                            variant={variant}
                            hasHeader
                            title={variant.charAt(0).toUpperCase() + variant.slice(1)}
                            content={`This is a ${variant} card variant.`}
                        />
                    ))}
                </div>
            </div>
            
            {/* Interactive Examples */}
            <div style={{ marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '16px', color: '#4b5563' }}>Interactive Cards</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <CardDemo
                        variant="elevated"
                        interactive
                        hasHeader
                        title="Selectable"
                        content="Click to select/deselect this card."
                    />
                    <CardDemo
                        variant="elevated"
                        interactive
                        selected
                        hasHeader
                        title="Pre-selected"
                        content="This card is already selected."
                    />
                    <CardDemo
                        variant="elevated"
                        interactive
                        disabled
                        hasHeader
                        title="Disabled"
                        content="This card cannot be interacted with."
                    />
                </div>
            </div>
            
            {/* Complex Examples */}
            <div style={{ marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '16px', color: '#4b5563' }}>Complex Cards</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    <CardDemo
                        variant="elevated"
                        hasMedia
                        hasHeader
                        hasFooter
                        title="Complete Card"
                        subtitle="With all sections"
                        content="This card demonstrates media, header, content, and footer sections working together."
                        media={
                            <img 
                                src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=150&fit=crop"
                                alt="Technology"
                                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                            />
                        }
                        footer={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>2 hours ago</span>
                                <button style={{ 
                                    padding: '4px 12px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                }}>
                                    Read More
                                </button>
                            </div>
                        }
                    />
                    
                    <CardDemo
                        variant="outlined"
                        interactive
                        hasHeader
                        title="Product Card"
                        subtitle="$99.99"
                        content={
                            <div>
                                <p style={{ margin: '0 0 8px 0' }}>Premium wireless headphones with active noise cancellation.</p>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <span key={i} style={{ color: i <= 4 ? '#f59e0b' : '#d1d5db' }}>★</span>
                                    ))}
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '4px' }}>(128)</span>
                                </div>
                            </div>
                        }
                    />
                </div>
            </div>
            
            {/* Padding Examples */}
            <div style={{ marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '16px', color: '#4b5563' }}>Padding Variations</h4>
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
                    {(['none', 'sm', 'md', 'lg', 'xl'] as const).map(padding => (
                        <CardDemo
                            key={padding}
                            variant="outlined"
                            padding={padding}
                            style={{ minWidth: '200px' }}
                            content={`Padding: ${padding}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    ),
};