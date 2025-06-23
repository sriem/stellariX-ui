/**
 * Avatar Component Stories
 * Comprehensive showcase of all avatar variants and features
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { createAvatarWithImplementation } from '../src';
import { reactAdapter } from '@stellarix-ui/react';

const meta = {
    title: 'Primitives/Avatar',
    component: () => <div />, // Placeholder since we're using the factory
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Avatar component displays user or entity representations with image, initials, icon, or placeholder variants.',
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component to create styled avatar instances
const AvatarDemo = ({ 
    label, 
    style = {}, 
    showBadge = false,
    ...options 
}: any) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(options.src ? true : false);
    
    const avatarFactory = createAvatarWithImplementation({
        ...options,
        onLoad: () => {
            setLoading(false);
            setError(false);
            console.log('Avatar loaded:', options.src);
        },
        onError: () => {
            setLoading(false);
            setError(true);
            console.log('Avatar failed to load:', options.src);
        },
    });
    
    const Avatar = avatarFactory.connect(reactAdapter);
    
    // Size styles
    const sizeStyles = {
        xs: { width: 24, height: 24, fontSize: '0.625rem' },
        sm: { width: 32, height: 32, fontSize: '0.75rem' },
        md: { width: 40, height: 40, fontSize: '0.875rem' },
        lg: { width: 48, height: 48, fontSize: '1rem' },
        xl: { width: 56, height: 56, fontSize: '1.125rem' },
    };
    
    const currentSize = sizeStyles[options.size || 'md'];
    
    return (
        <div style={{ textAlign: 'center', ...style }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                    style={{
                        ...currentSize,
                        borderRadius: options.shape === 'square' ? '8px' : '50%',
                        backgroundColor: error || !options.src ? '#e5e7eb' : 'transparent',
                        color: '#4b5563',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 500,
                        overflow: 'hidden',
                        position: 'relative',
                        border: '2px solid #e5e7eb',
                        cursor: options.onClick ? 'pointer' : 'default',
                    }}
                    renderContent={(state) => {
                        const currentVariant = avatarFactory.state.getCurrentVariant();
                        
                        if (loading) {
                            return (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <span style={{ fontSize: '0.75em' }}>...</span>
                                </div>
                            );
                        }
                        
                        if (currentVariant === 'image' && avatarFactory.state.shouldShowImage()) {
                            return (
                                <img
                                    src={state.src}
                                    alt={state.alt || state.name || 'Avatar'}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                    onLoad={() => setLoading(false)}
                                    onError={() => setError(true)}
                                />
                            );
                        }
                        
                        if (currentVariant === 'initials') {
                            return (
                                <span style={{ userSelect: 'none' }}>
                                    {avatarFactory.state.getDisplayInitials()}
                                </span>
                            );
                        }
                        
                        if (currentVariant === 'icon') {
                            return <span>{state.icon}</span>;
                        }
                        
                        // Placeholder
                        return (
                            <svg 
                                viewBox="0 0 24 24" 
                                fill="currentColor" 
                                style={{ width: '60%', height: '60%' }}
                            >
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        );
                    }}
                />
                {showBadge && (
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        backgroundColor: '#10b981',
                        borderRadius: '50%',
                        border: '2px solid white',
                    }} />
                )}
            </div>
            {label && (
                <div style={{ 
                    marginTop: '8px', 
                    fontSize: '0.75rem', 
                    color: '#6b7280' 
                }}>
                    {label}
                </div>
            )}
        </div>
    );
};

// Individual stories
export const Default: Story = {
    render: () => <AvatarDemo label="Default (Placeholder)" />,
};

export const WithImage: Story = {
    render: () => (
        <AvatarDemo 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
            alt="User avatar"
            name="John Doe"
            label="Image Avatar"
        />
    ),
};

export const WithInitials: Story = {
    render: () => (
        <AvatarDemo 
            name="Jane Smith"
            label="Initials from Name"
        />
    ),
};

export const WithCustomInitials: Story = {
    render: () => (
        <AvatarDemo 
            initials="AB"
            label="Custom Initials"
        />
    ),
};

export const WithIcon: Story = {
    render: () => (
        <AvatarDemo 
            icon="👤"
            label="Icon Avatar"
        />
    ),
};

export const ImageWithFallback: Story = {
    render: () => (
        <AvatarDemo 
            src="https://broken-image-url.com/404.jpg"
            name="Fallback User"
            label="Image with Fallback"
        />
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <AvatarDemo size="xs" name="XS" label="Extra Small" />
            <AvatarDemo size="sm" name="SM" label="Small" />
            <AvatarDemo size="md" name="MD" label="Medium" />
            <AvatarDemo size="lg" name="LG" label="Large" />
            <AvatarDemo size="xl" name="XL" label="Extra Large" />
        </div>
    ),
};

export const Shapes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '24px' }}>
            <AvatarDemo 
                shape="circle" 
                name="Circle Shape" 
                label="Circle (Default)" 
            />
            <AvatarDemo 
                shape="square" 
                name="Square Shape" 
                label="Square" 
            />
        </div>
    ),
};

export const WithBadge: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '24px' }}>
            <AvatarDemo 
                name="Online"
                showBadge={true}
                label="With Status Badge"
            />
            <AvatarDemo 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
                showBadge={true}
                label="Image with Badge"
            />
        </div>
    ),
};

export const Interactive: Story = {
    render: () => {
        const [clicked, setClicked] = useState(false);
        
        return (
            <div>
                <AvatarDemo 
                    name="Click Me"
                    onClick={() => {
                        setClicked(true);
                        setTimeout(() => setClicked(false), 1000);
                    }}
                    label={clicked ? "Clicked!" : "Clickable Avatar"}
                    style={{ 
                        transform: clicked ? 'scale(0.95)' : 'scale(1)',
                        transition: 'transform 0.1s',
                    }}
                />
            </div>
        );
    },
};

// Comprehensive showcase
export const Showcase: Story = {
    render: () => (
        <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '24px' }}>Avatar Component Showcase</h3>
            
            {/* Variants */}
            <div style={{ marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '16px', color: '#4b5563' }}>Variants</h4>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <AvatarDemo label="Placeholder" />
                    <AvatarDemo 
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400" 
                        label="Image" 
                    />
                    <AvatarDemo name="John Doe" label="Initials" />
                    <AvatarDemo icon="👤" label="Icon" />
                    <AvatarDemo initials="JD" label="Custom Initials" />
                </div>
            </div>
            
            {/* Sizes with different variants */}
            <div style={{ marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '16px', color: '#4b5563' }}>Size Variations</h4>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
                        <AvatarDemo 
                            key={size}
                            size={size}
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
                            name="User"
                            label={size.toUpperCase()}
                        />
                    ))}
                </div>
            </div>
            
            {/* Shape variations */}
            <div style={{ marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '16px', color: '#4b5563' }}>Shape Variations</h4>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <AvatarDemo shape="circle" name="Circle" label="Circle" />
                    <AvatarDemo shape="square" name="Square" label="Square" />
                    <AvatarDemo 
                        shape="circle" 
                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400" 
                        label="Circle Image" 
                    />
                    <AvatarDemo 
                        shape="square" 
                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400" 
                        label="Square Image" 
                    />
                </div>
            </div>
            
            {/* States */}
            <div style={{ marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '16px', color: '#4b5563' }}>States</h4>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <AvatarDemo 
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400" 
                        label="Normal" 
                    />
                    <AvatarDemo 
                        src="https://broken-url.com/404.jpg" 
                        name="Error Fallback" 
                        label="Error State" 
                    />
                    <AvatarDemo 
                        name="With Badge" 
                        showBadge={true} 
                        label="With Badge" 
                    />
                </div>
            </div>
            
            {/* Multiple names */}
            <div style={{ marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '16px', color: '#4b5563' }}>Name Variations</h4>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <AvatarDemo name="John" label="Single Name (J)" />
                    <AvatarDemo name="Jane Doe" label="Two Names (JD)" />
                    <AvatarDemo name="Mary Jane Smith" label="Three Names (MS)" />
                    <AvatarDemo name="X Æ A-12" label="Special Name (XA)" />
                </div>
            </div>
            
            {/* Icon variations */}
            <div style={{ marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '16px', color: '#4b5563' }}>Icon Variations</h4>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <AvatarDemo icon="👤" label="Person" />
                    <AvatarDemo icon="👨" label="Man" />
                    <AvatarDemo icon="👩" label="Woman" />
                    <AvatarDemo icon="🤖" label="Robot" />
                    <AvatarDemo icon="🐱" label="Cat" />
                    <AvatarDemo icon="⚡" label="Lightning" />
                </div>
            </div>
        </div>
    ),
};