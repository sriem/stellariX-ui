/**
 * Themed Button Component Stories
 * Showcases buttons with the new StellarIX UI theme system
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { createButtonWithImplementation } from '../src';
import { reactAdapter } from '@stellarix-ui/react';
import { themes, themeToCSSVariables, generateCSSString } from '@stellarix-ui/themes';

const meta = {
    title: 'Themed/Button',
    component: () => <div />,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Button component with StellarIX UI theme system showcasing beautiful default styles.',
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Theme switcher component
const ThemeSwitcher = ({ children }: { children: React.ReactNode }) => {
    const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('stellar-light');
    
    useEffect(() => {
        // Apply theme CSS variables
        const theme = themes[currentTheme];
        const cssVars = themeToCSSVariables(theme);
        
        Object.entries(cssVars).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
        
        // Update color scheme
        document.documentElement.style.colorScheme = theme.mode;
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, [currentTheme]);
    
    return (
        <div style={{ 
            minHeight: '400px',
            padding: '40px',
            borderRadius: '12px',
            backgroundColor: 'var(--sx-background)',
            color: 'var(--sx-foreground)',
            transition: 'all 0.3s ease',
        }}>
            <div style={{ marginBottom: '32px' }}>
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
                    <optgroup label="Stellar Theme">
                        <option value="stellar-light">Stellar Light</option>
                        <option value="stellar-dark">Stellar Dark</option>
                    </optgroup>
                    <optgroup label="Aurora Theme">
                        <option value="aurora-light">Aurora Light</option>
                        <option value="aurora-dark">Aurora Dark</option>
                    </optgroup>
                    <optgroup label="Nebula Theme">
                        <option value="nebula-light">Nebula Light</option>
                        <option value="nebula-dark">Nebula Dark</option>
                    </optgroup>
                </select>
            </div>
            {children}
        </div>
    );
};

// Themed button component
const ThemedButton = ({ 
    variant = 'primary',
    size = 'md',
    children,
    loading = false,
    disabled = false,
    onClick,
    className = '',
    style = {},
    glassEffect = false,
    gradientBorder = false,
    ...props 
}: any) => {
    const buttonFactory = createButtonWithImplementation({
        variant,
        size,
        loading,
        disabled,
        onClick,
    });
    
    const Button = buttonFactory.connect(reactAdapter);
    
    // Size styles
    const sizeStyles = {
        sm: {
            padding: 'var(--sx-spacing-2) var(--sx-spacing-4)',
            fontSize: 'var(--sx-font-size-sm)',
            height: '32px',
        },
        md: {
            padding: 'var(--sx-spacing-2_5) var(--sx-spacing-6)',
            fontSize: 'var(--sx-font-size-base)',
            height: '40px',
        },
        lg: {
            padding: 'var(--sx-spacing-3) var(--sx-spacing-8)',
            fontSize: 'var(--sx-font-size-lg)',
            height: '48px',
        },
    };
    
    // Variant styles
    const variantStyles = {
        primary: {
            backgroundColor: 'var(--sx-primary)',
            color: 'var(--sx-primary-foreground)',
            border: 'none',
        },
        secondary: {
            backgroundColor: 'var(--sx-secondary)',
            color: 'var(--sx-secondary-foreground)',
            border: 'none',
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--sx-primary)',
            border: '2px solid var(--sx-border)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--sx-foreground)',
            border: 'none',
        },
        destructive: {
            backgroundColor: 'var(--sx-destructive)',
            color: 'var(--sx-destructive-foreground)',
            border: 'none',
        },
    };
    
    const currentSize = sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.md;
    const currentVariant = variantStyles[variant as keyof typeof variantStyles] || variantStyles.primary;
    
    // Glass effect classes
    const effectClasses = [
        glassEffect && 'sx-glass',
        gradientBorder && 'sx-gradient-border sx-gradient-border-animated',
    ].filter(Boolean).join(' ');
    
    return (
        <Button
            className={`sx-component sx-focus-ring sx-shadow-dynamic ${effectClasses} ${className}`}
            style={{
                ...currentSize,
                ...currentVariant,
                borderRadius: 'var(--sx-radius)',
                fontWeight: 'var(--sx-font-weight-medium)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--sx-spacing-2)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all var(--sx-duration-normal) var(--sx-easing-spring)',
                transform: buttonFactory.state.getState().pressed ? 'scale(0.98)' : 'scale(1)',
                boxShadow: !disabled && variant === 'primary' ? 'var(--sx-shadow-glow-sm)' : 'var(--sx-shadow)',
                ...style,
            }}
            onMouseEnter={(e) => {
                if (!disabled && variant === 'primary') {
                    e.currentTarget.style.boxShadow = 'var(--sx-shadow-glow)';
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled && variant === 'primary') {
                    e.currentTarget.style.boxShadow = 'var(--sx-shadow-glow-sm)';
                }
            }}
            {...props}
        >
            {loading && (
                <span 
                    className="sx-animate-pulse"
                    style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: 'currentColor',
                        opacity: 0.6,
                    }}
                />
            )}
            {children}
        </Button>
    );
};

// Individual stories
export const Default: Story = {
    render: () => (
        <ThemeSwitcher>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <ThemedButton>Default Button</ThemedButton>
                <ThemedButton variant="secondary">Secondary</ThemedButton>
                <ThemedButton variant="outline">Outline</ThemedButton>
                <ThemedButton variant="ghost">Ghost</ThemedButton>
                <ThemedButton variant="destructive">Destructive</ThemedButton>
            </div>
        </ThemeSwitcher>
    ),
};

export const WithEffects: Story = {
    render: () => (
        <ThemeSwitcher>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <ThemedButton glassEffect>Glass Effect</ThemedButton>
                <ThemedButton gradientBorder>Gradient Border</ThemedButton>
                <ThemedButton variant="secondary" glassEffect gradientBorder>
                    Combined Effects
                </ThemedButton>
            </div>
        </ThemeSwitcher>
    ),
};

export const Sizes: Story = {
    render: () => (
        <ThemeSwitcher>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <ThemedButton size="sm">Small</ThemedButton>
                <ThemedButton size="md">Medium</ThemedButton>
                <ThemedButton size="lg">Large</ThemedButton>
            </div>
        </ThemeSwitcher>
    ),
};

export const States: Story = {
    render: () => (
        <ThemeSwitcher>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <ThemedButton>Normal</ThemedButton>
                <ThemedButton loading>Loading</ThemedButton>
                <ThemedButton disabled>Disabled</ThemedButton>
            </div>
        </ThemeSwitcher>
    ),
};

export const GradientText: Story = {
    render: () => (
        <ThemeSwitcher>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <ThemedButton variant="ghost">
                    <span className="sx-gradient-text" style={{ fontWeight: 'bold' }}>
                        Gradient Text
                    </span>
                </ThemedButton>
                <ThemedButton variant="outline" gradientBorder>
                    <span className="sx-gradient-text">
                        Fancy Button
                    </span>
                </ThemedButton>
            </div>
        </ThemeSwitcher>
    ),
};

// Comprehensive showcase
export const Showcase: Story = {
    render: () => (
        <ThemeSwitcher>
            <div style={{ maxWidth: '800px' }}>
                <h2 style={{ 
                    marginBottom: '32px',
                    fontSize: 'var(--sx-font-size-3xl)',
                    fontWeight: 'var(--sx-font-weight-bold)',
                }}>
                    <span className="sx-gradient-text">StellarIX UI</span> Button Showcase
                </h2>
                
                {/* Standard Variants */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ 
                        marginBottom: '16px',
                        fontSize: 'var(--sx-font-size-xl)',
                        color: 'var(--sx-muted-foreground)',
                    }}>
                        Standard Variants
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <ThemedButton>Primary</ThemedButton>
                        <ThemedButton variant="secondary">Secondary</ThemedButton>
                        <ThemedButton variant="outline">Outline</ThemedButton>
                        <ThemedButton variant="ghost">Ghost</ThemedButton>
                        <ThemedButton variant="destructive">Destructive</ThemedButton>
                    </div>
                </div>
                
                {/* Special Effects */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ 
                        marginBottom: '16px',
                        fontSize: 'var(--sx-font-size-xl)',
                        color: 'var(--sx-muted-foreground)',
                    }}>
                        Special Effects
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <ThemedButton glassEffect>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                ✨ Glass Morphism
                            </span>
                        </ThemedButton>
                        <ThemedButton gradientBorder>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                🌈 Gradient Border
                            </span>
                        </ThemedButton>
                        <ThemedButton variant="secondary" glassEffect gradientBorder>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                🎨 Combined
                            </span>
                        </ThemedButton>
                    </div>
                </div>
                
                {/* Size Variations */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ 
                        marginBottom: '16px',
                        fontSize: 'var(--sx-font-size-xl)',
                        color: 'var(--sx-muted-foreground)',
                    }}>
                        Size Variations
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <ThemedButton size="sm" gradientBorder>Small</ThemedButton>
                        <ThemedButton size="md" gradientBorder>Medium</ThemedButton>
                        <ThemedButton size="lg" gradientBorder>Large</ThemedButton>
                    </div>
                </div>
                
                {/* Interactive Demo */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ 
                        marginBottom: '16px',
                        fontSize: 'var(--sx-font-size-xl)',
                        color: 'var(--sx-muted-foreground)',
                    }}>
                        Interactive Demo
                    </h3>
                    <div style={{ 
                        padding: '24px',
                        borderRadius: 'var(--sx-radius-lg)',
                        backgroundColor: 'var(--sx-card)',
                        border: '1px solid var(--sx-border)',
                    }}>
                        <p style={{ marginBottom: '16px', color: 'var(--sx-muted-foreground)' }}>
                            Try switching themes with the dropdown above to see how the buttons adapt!
                        </p>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <ThemedButton 
                                onClick={() => alert('Primary clicked!')}
                                gradientBorder
                            >
                                Click Me
                            </ThemedButton>
                            <ThemedButton 
                                variant="secondary"
                                loading
                                glassEffect
                            >
                                Processing...
                            </ThemedButton>
                            <ThemedButton 
                                variant="outline"
                                disabled
                            >
                                Disabled
                            </ThemedButton>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeSwitcher>
    ),
};