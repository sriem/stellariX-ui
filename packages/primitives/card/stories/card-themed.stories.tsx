/**
 * Themed Card Component Stories
 * Showcases cards with the StellarIX UI theme system
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { createCardWithImplementation } from '../src';
import { reactAdapter } from '@stellarix/react';
import { themes, themeToCSSVariables } from '@stellarix/themes';

const meta = {
    title: 'Themed/Card',
    component: () => <div />,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Card component with StellarIX UI theme system showcasing modern card designs.',
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Theme context
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('stellar-light');
    
    useEffect(() => {
        const theme = themes[currentTheme];
        const cssVars = themeToCSSVariables(theme);
        
        Object.entries(cssVars).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
        
        document.documentElement.style.colorScheme = theme.mode;
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, [currentTheme]);
    
    return (
        <div style={{ 
            minHeight: '600px',
            padding: '40px',
            backgroundColor: 'var(--sx-background)',
            color: 'var(--sx-foreground)',
            transition: 'all 0.3s ease',
        }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <select 
                    value={currentTheme}
                    onChange={(e) => setCurrentTheme(e.target.value as keyof typeof themes)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--sx-radius)',
                        border: '1px solid var(--sx-border)',
                        backgroundColor: 'var(--sx-card)',
                        color: 'var(--sx-card-foreground)',
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                >
                    {Object.keys(themes).map(theme => (
                        <option key={theme} value={theme}>
                            {theme.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </option>
                    ))}
                </select>
            </div>
            {children}
        </div>
    );
};

// Themed Card Component
const ThemedCard = ({ 
    title,
    subtitle,
    content,
    footer,
    media,
    variant = 'simple',
    glassEffect = false,
    gradientBorder = false,
    style = {},
    ...options 
}: any) => {
    const [selected, setSelected] = useState(options.selected || false);
    
    const cardFactory = createCardWithImplementation({
        ...options,
        variant: 'simple', // We'll apply our own styling
        selected,
        onSelectionChange: setSelected,
    });
    
    const Card = cardFactory.connect(reactAdapter);
    
    // Variant styles using CSS variables
    const variantStyles = {
        simple: {
            backgroundColor: 'var(--sx-card)',
            border: 'none',
            boxShadow: 'none',
        },
        outlined: {
            backgroundColor: 'var(--sx-card)',
            border: '1px solid var(--sx-border)',
            boxShadow: 'none',
        },
        elevated: {
            backgroundColor: 'var(--sx-card)',
            border: 'none',
            boxShadow: 'var(--sx-shadow)',
        },
        filled: {
            backgroundColor: 'var(--sx-muted)',
            border: 'none',
            boxShadow: 'none',
        },
    };
    
    const currentVariant = variantStyles[variant as keyof typeof variantStyles] || variantStyles.simple;
    const isHovered = cardFactory.state.getState().hovered;
    const isFocused = cardFactory.state.getState().focused;
    
    // Effect classes
    const effectClasses = [
        glassEffect && 'sx-glass',
        gradientBorder && 'sx-gradient-border',
        options.interactive && gradientBorder && 'sx-gradient-border-animated',
    ].filter(Boolean).join(' ');
    
    return (
        <Card
            className={`sx-component ${effectClasses}`}
            style={{
                ...currentVariant,
                borderRadius: 'var(--sx-radius-lg)',
                color: 'var(--sx-card-foreground)',
                overflow: 'hidden',
                transition: 'all var(--sx-duration-normal) var(--sx-easing-spring)',
                cursor: options.interactive ? 'pointer' : 'default',
                transform: isHovered && options.interactive ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered && variant === 'elevated' 
                    ? 'var(--sx-shadow-lg)' 
                    : currentVariant.boxShadow,
                outline: isFocused ? '2px solid var(--sx-ring)' : 'none',
                outlineOffset: '2px',
                position: 'relative',
                ...style,
            }}
            renderContent={(state) => (
                <>
                    {media && (
                        <div style={{ 
                            marginBottom: title || content ? '0' : 0,
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {media}
                            {glassEffect && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '60px',
                                    background: 'linear-gradient(to top, var(--sx-card), transparent)',
                                }} />
                            )}
                        </div>
                    )}
                    
                    {(title || subtitle) && (
                        <header style={{ 
                            padding: 'var(--sx-spacing-6)',
                            paddingBottom: content ? 'var(--sx-spacing-2)' : 'var(--sx-spacing-6)',
                        }}>
                            {title && (
                                <h3 style={{ 
                                    margin: 0, 
                                    fontSize: 'var(--sx-font-size-xl)', 
                                    fontWeight: 'var(--sx-font-weight-semibold)',
                                    color: 'var(--sx-foreground)',
                                }}>
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p style={{ 
                                    margin: 0, 
                                    marginTop: 'var(--sx-spacing-1)',
                                    fontSize: 'var(--sx-font-size-sm)',
                                    color: 'var(--sx-muted-foreground)',
                                }}>
                                    {subtitle}
                                </p>
                            )}
                        </header>
                    )}
                    
                    {content && (
                        <div style={{ 
                            padding: 'var(--sx-spacing-6)',
                            paddingTop: title ? 'var(--sx-spacing-4)' : 'var(--sx-spacing-6)',
                            paddingBottom: footer ? 'var(--sx-spacing-4)' : 'var(--sx-spacing-6)',
                            color: 'var(--sx-muted-foreground)',
                        }}>
                            {content}
                        </div>
                    )}
                    
                    {footer && (
                        <footer style={{ 
                            padding: 'var(--sx-spacing-6)',
                            paddingTop: 'var(--sx-spacing-4)',
                            borderTop: '1px solid var(--sx-border)',
                            backgroundColor: glassEffect ? 'var(--sx-glass-background)' : 'transparent',
                        }}>
                            {footer}
                        </footer>
                    )}
                    
                    {state.interactive && state.selected !== undefined && (
                        <div style={{
                            position: 'absolute',
                            top: 'var(--sx-spacing-4)',
                            right: 'var(--sx-spacing-4)',
                            width: '24px',
                            height: '24px',
                            borderRadius: 'var(--sx-radius)',
                            border: '2px solid var(--sx-primary)',
                            backgroundColor: state.selected ? 'var(--sx-primary)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all var(--sx-duration-fast) var(--sx-easing-out)',
                        }}>
                            {state.selected && (
                                <svg 
                                    width="14" 
                                    height="14" 
                                    viewBox="0 0 14 14" 
                                    fill="var(--sx-primary-foreground)"
                                >
                                    <path d="M12 3L5 10L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
export const SimpleCards: Story = {
    render: () => (
        <ThemeProvider>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <ThemedCard
                    variant="simple"
                    title="Simple Card"
                    subtitle="Basic card with no effects"
                    content="This is a simple card variant with clean styling and no special effects."
                />
                <ThemedCard
                    variant="outlined"
                    title="Outlined Card"
                    subtitle="Card with border"
                    content="This card has a subtle border to define its boundaries."
                />
                <ThemedCard
                    variant="elevated"
                    title="Elevated Card"
                    subtitle="Card with shadow"
                    content="This card appears elevated with a dynamic shadow effect."
                />
            </div>
        </ThemeProvider>
    ),
};

export const GlassCards: Story = {
    render: () => (
        <ThemeProvider>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <ThemedCard
                    variant="elevated"
                    glassEffect
                    title="Glass Morphism"
                    subtitle="Modern frosted glass effect"
                    content="This card uses backdrop blur and transparency to create a glass-like appearance."
                    footer={
                        <div style={{ fontSize: 'var(--sx-font-size-sm)', color: 'var(--sx-muted-foreground)' }}>
                            Glass effect adapts to theme
                        </div>
                    }
                />
                <ThemedCard
                    variant="simple"
                    glassEffect
                    gradientBorder
                    title="Combined Effects"
                    subtitle="Glass + Gradient Border"
                    content="Multiple effects can be combined for unique designs."
                />
            </div>
        </ThemeProvider>
    ),
};

export const InteractiveCards: Story = {
    render: () => (
        <ThemeProvider>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <ThemedCard
                    variant="elevated"
                    interactive
                    gradientBorder
                    title="Selectable Card"
                    subtitle="Click to select"
                    content="This card can be selected and shows hover effects. Try clicking it!"
                />
                <ThemedCard
                    variant="elevated"
                    interactive
                    selected
                    glassEffect
                    title="Pre-selected"
                    subtitle="Already selected"
                    content="This card starts in a selected state with glass morphism effect."
                />
            </div>
        </ThemeProvider>
    ),
};

export const MediaCards: Story = {
    render: () => (
        <ThemeProvider>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                <ThemedCard
                    variant="elevated"
                    glassEffect
                    title="Beautiful Landscapes"
                    subtitle="Nature photography"
                    content="Explore stunning natural vistas from around the world."
                    media={
                        <img 
                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop"
                            alt="Mountain landscape"
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                    }
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 'var(--sx-font-size-sm)', color: 'var(--sx-muted-foreground)' }}>
                                Photography
                            </span>
                            <button style={{
                                padding: 'var(--sx-spacing-2) var(--sx-spacing-4)',
                                borderRadius: 'var(--sx-radius)',
                                border: 'none',
                                backgroundColor: 'var(--sx-primary)',
                                color: 'var(--sx-primary-foreground)',
                                fontSize: 'var(--sx-font-size-sm)',
                                fontWeight: 'var(--sx-font-weight-medium)',
                                cursor: 'pointer',
                                transition: 'all var(--sx-duration-fast) var(--sx-easing-out)',
                            }}>
                                View Gallery
                            </button>
                        </div>
                    }
                />
                <ThemedCard
                    variant="elevated"
                    gradientBorder
                    interactive
                    title="Tech Innovation"
                    subtitle="Latest in technology"
                    content="Discover cutting-edge developments in AI and machine learning."
                    media={
                        <div style={{
                            height: '200px',
                            background: 'linear-gradient(135deg, var(--sx-gradient-from), var(--sx-gradient-via), var(--sx-gradient-to))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <span className="sx-gradient-text" style={{
                                fontSize: 'var(--sx-font-size-4xl)',
                                fontWeight: 'var(--sx-font-weight-bold)',
                                filter: 'invert(1)',
                            }}>
                                AI
                            </span>
                        </div>
                    }
                />
            </div>
        </ThemeProvider>
    ),
};

// Comprehensive showcase
export const Showcase: Story = {
    render: () => (
        <ThemeProvider>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ 
                    marginBottom: '32px',
                    fontSize: 'var(--sx-font-size-3xl)',
                    fontWeight: 'var(--sx-font-weight-bold)',
                    textAlign: 'center',
                }}>
                    <span className="sx-gradient-text">StellarIX UI</span> Card Showcase
                </h2>
                
                {/* Feature Cards */}
                <div style={{ marginBottom: '48px' }}>
                    <h3 style={{ 
                        marginBottom: '24px',
                        fontSize: 'var(--sx-font-size-xl)',
                        color: 'var(--sx-muted-foreground)',
                    }}>
                        Feature Cards
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        <ThemedCard
                            variant="elevated"
                            glassEffect
                            gradientBorder
                            title="Glass Morphism"
                            content={
                                <>
                                    <p style={{ marginBottom: '16px' }}>
                                        Modern frosted glass effect with backdrop blur
                                    </p>
                                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--sx-font-size-sm)' }}>
                                        <li>Adaptive transparency</li>
                                        <li>Dynamic blur radius</li>
                                        <li>Theme-aware colors</li>
                                    </ul>
                                </>
                            }
                        />
                        <ThemedCard
                            variant="elevated"
                            gradientBorder
                            title="Gradient Borders"
                            content={
                                <>
                                    <p style={{ marginBottom: '16px' }}>
                                        Animated gradient borders on hover/focus
                                    </p>
                                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--sx-font-size-sm)' }}>
                                        <li>Smooth animations</li>
                                        <li>Theme gradients</li>
                                        <li>Interactive states</li>
                                    </ul>
                                </>
                            }
                        />
                        <ThemedCard
                            variant="elevated"
                            interactive
                            title="Spring Animations"
                            subtitle="Click me!"
                            content={
                                <>
                                    <p style={{ marginBottom: '16px' }}>
                                        Natural-feeling animations with spring physics
                                    </p>
                                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--sx-font-size-sm)' }}>
                                        <li>Hover effects</li>
                                        <li>Click feedback</li>
                                        <li>Smooth transitions</li>
                                    </ul>
                                </>
                            }
                        />
                    </div>
                </div>
                
                {/* Product Cards */}
                <div style={{ marginBottom: '48px' }}>
                    <h3 style={{ 
                        marginBottom: '24px',
                        fontSize: 'var(--sx-font-size-xl)',
                        color: 'var(--sx-muted-foreground)',
                    }}>
                        Product Cards
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        <ThemedCard
                            variant="elevated"
                            glassEffect
                            interactive
                            media={
                                <div style={{
                                    height: '200px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <span style={{ fontSize: '48px' }}>🎨</span>
                                </div>
                            }
                            title="Pro Design System"
                            subtitle="$99/month"
                            content="Complete design system with all components and themes"
                            footer={
                                <button style={{
                                    width: '100%',
                                    padding: 'var(--sx-spacing-3)',
                                    borderRadius: 'var(--sx-radius)',
                                    border: 'none',
                                    background: 'var(--sx-primary)',
                                    color: 'var(--sx-primary-foreground)',
                                    fontWeight: 'var(--sx-font-weight-semibold)',
                                    cursor: 'pointer',
                                }}>
                                    Get Started
                                </button>
                            }
                        />
                        <ThemedCard
                            variant="elevated"
                            gradientBorder
                            interactive
                            media={
                                <div style={{
                                    height: '200px',
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <span style={{ fontSize: '48px' }}>⚡</span>
                                </div>
                            }
                            title="Enterprise"
                            subtitle="Custom pricing"
                            content="Everything in Pro plus custom themes and priority support"
                            footer={
                                <button style={{
                                    width: '100%',
                                    padding: 'var(--sx-spacing-3)',
                                    borderRadius: 'var(--sx-radius)',
                                    border: '2px solid var(--sx-border)',
                                    background: 'transparent',
                                    color: 'var(--sx-foreground)',
                                    fontWeight: 'var(--sx-font-weight-semibold)',
                                    cursor: 'pointer',
                                }}>
                                    Contact Sales
                                </button>
                            }
                        />
                    </div>
                </div>
            </div>
        </ThemeProvider>
    ),
};