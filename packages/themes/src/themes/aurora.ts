/**
 * Aurora Theme
 * Nordic-inspired theme with soft pastels and gentle animations
 */

import type { Theme } from '../types';

export const auroraLight: Theme = {
    name: 'aurora-light',
    mode: 'light',
    colors: {
        // Base colors - Soft Nordic warmth
        background: 'hsl(300, 20%, 99.6%)',
        foreground: 'hsl(220, 16.4%, 21.6%)',
        
        // Component colors - Soft elevation
        card: 'hsl(0, 0%, 100%)',
        cardForeground: 'hsl(220, 16.4%, 21.6%)',
        
        // Interactive colors - Refined Nordic palette
        primary: 'hsl(210, 34%, 52.4%)',
        primaryForeground: 'hsl(0, 0%, 100%)',
        primaryHover: 'hsl(210, 34%, 44.3%)',
        primaryHoverForeground: 'hsl(0, 0%, 100%)',
        secondary: 'hsl(210, 34%, 63.1%)',
        secondaryForeground: 'hsl(0, 0%, 100%)',
        secondaryHover: 'hsl(210, 29.8%, 58%)',
        secondaryHoverForeground: 'hsl(0, 0%, 100%)',
        
        // Semantic colors - Soft variants
        destructive: '#bf616a',
        destructiveForeground: '#ffffff',
        destructiveHover: '#a54049',
        destructiveHoverForeground: '#ffffff',
        success: '#a3be8c',
        successForeground: '#ffffff',
        successHover: '#8fa876',
        successHoverForeground: '#ffffff',
        warning: '#ebcb8b',
        warningForeground: '#3b2f1a',
        warningHover: '#e0b772',
        warningHoverForeground: '#3b2f1a',
        info: '#88c0d0',
        infoForeground: '#ffffff',
        infoHover: '#6faabb',
        infoHoverForeground: '#ffffff',
        
        // UI colors - Soft Nordic grays
        muted: 'hsl(218.5, 26.8%, 92.5%)',
        mutedForeground: 'hsl(220, 13.4%, 36.1%)',
        accent: 'hsl(218.5, 26.8%, 92%)',
        accentForeground: 'hsl(220, 16.4%, 21.6%)',
        
        // Borders and dividers - Gentle definition
        border: 'hsl(218.5, 18.9%, 88%)',
        input: 'hsl(218.5, 18.9%, 88%)',
        ring: 'hsl(210, 34%, 52.4%)',
        
        // Special effects - Ethereal aurora gradient
        gradient: {
            from: 'hsl(193, 43.4%, 67.5%)',
            via: 'hsl(210, 34%, 63.1%)',
            to: 'hsl(311, 20.2%, 63.1%)',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'rgba(216, 222, 233, 0.5)',
            blur: '10px',
        },
    },
    typography: {
        fontFamily: {
            sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            mono: '"JetBrains Mono", "SF Mono", Monaco, Consolas, monospace',
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
        },
        fontWeight: {
            thin: 100,
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeight: {
            none: 1,
            tight: 1.25,
            snug: 1.375,
            normal: 1.5,
            relaxed: 1.625,
            loose: 2,
        },
    },
    spacing: {
        px: '1px',
        0: '0',
        0.5: '0.125rem',
        1: '0.25rem',
        1.5: '0.375rem',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        3.5: '0.875rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
    },
    radii: {
        none: '0',
        sm: '0.375rem',
        DEFAULT: '0.625rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2.25rem',
        full: '9999px',
    },
    shadows: {
        none: 'none',
        sm: '0 1px 3px 0 rgb(46 52 64 / 0.04), 0 1px 2px -1px rgb(46 52 64 / 0.03)',
        DEFAULT: '0 2px 6px -1px rgb(46 52 64 / 0.06), 0 2px 4px -2px rgb(46 52 64 / 0.03)',
        md: '0 4px 12px -2px rgb(46 52 64 / 0.08), 0 3px 6px -3px rgb(46 52 64 / 0.04)',
        lg: '0 8px 20px -4px rgb(46 52 64 / 0.1), 0 6px 10px -5px rgb(46 52 64 / 0.04)',
        xl: '0 16px 32px -6px rgb(46 52 64 / 0.12), 0 10px 16px -8px rgb(46 52 64 / 0.05)',
        '2xl': '0 24px 48px -12px rgb(46 52 64 / 0.18)',
        inner: 'inset 0 2px 4px 0 rgb(46 52 64 / 0.05)',
        // Ethereal Nordic shadows
        card: '0 2px 8px -2px rgb(46 52 64 / 0.05), 0 1px 2px -1px rgb(46 52 64 / 0.03)',
        button: '0 1px 3px 0 rgb(46 52 64 / 0.04), 0 1px 2px -1px rgb(46 52 64 / 0.03)',
        dropdown: '0 10px 25px -5px rgb(46 52 64 / 0.1), 0 8px 10px -6px rgb(46 52 64 / 0.04)',
        glow: '0 0 20px -5px rgba(136, 192, 208, 0.2)',
        glowSm: '0 0 12px -3px rgba(136, 192, 208, 0.15)',
        glowLg: '0 0 30px -8px rgba(136, 192, 208, 0.25)',
        glass: '0 8px 24px -4px rgba(46, 52, 64, 0.08)',
    },
    animations: {
        duration: {
            fast: '200ms',
            normal: '400ms',
            slow: '600ms',
        },
        easing: {
            linear: 'linear',
            in: 'cubic-bezier(0.4, 0, 1, 1)',
            out: 'cubic-bezier(0, 0, 0.2, 1)',
            inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            spring: 'cubic-bezier(0.25, 1.2, 0.35, 1)',
            bounce: 'cubic-bezier(0.6, -0.28, 0.4, 1.2)',
        },
        keyframes: {
            fadeIn: {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 },
            },
            fadeOut: {
                '0%': { opacity: 1 },
                '100%': { opacity: 0 },
            },
            slideIn: {
                '0%': { transform: 'translateY(8px)', opacity: 0 },
                '100%': { transform: 'translateY(0)', opacity: 1 },
            },
            slideOut: {
                '0%': { transform: 'translateY(0)', opacity: 1 },
                '100%': { transform: 'translateY(8px)', opacity: 0 },
            },
            scaleIn: {
                '0%': { transform: 'scale(0.97)', opacity: 0 },
                '100%': { transform: 'scale(1)', opacity: 1 },
            },
            scaleOut: {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '100%': { transform: 'scale(0.97)', opacity: 0 },
            },
            shimmer: {
                '0%': { backgroundPosition: '-200% 0' },
                '100%': { backgroundPosition: '200% 0' },
            },
            pulse: {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.6 },
            },
            bounce: {
                '0%, 100%': { 
                    transform: 'translateY(0)',
                    animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
                },
                '50%': {
                    transform: 'translateY(-20%)',
                    animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                },
            },
            gradientShift: {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
            },
        },
    },
    effects: {
        glassMorphism: true,
        gradientBorders: true,
        dynamicShadows: true,
        springAnimations: true,
    },
};

export const auroraDark: Theme = {
    ...auroraLight,
    name: 'aurora-dark',
    mode: 'dark',
    colors: {
        // Base colors - Deep Nord night
        background: 'hsl(220, 16.4%, 21.6%)',
        foreground: 'hsl(218.5, 26.8%, 92.5%)',
        
        // Component colors - Layered darkness
        card: 'hsl(220, 16.8%, 28%)',
        cardForeground: 'hsl(218.5, 26.8%, 92.5%)',
        
        // Interactive colors - Luminous in darkness
        primary: 'hsl(193, 43.4%, 67.5%)',
        primaryForeground: 'hsl(220, 16.4%, 21.6%)',
        primaryHover: 'hsl(193, 43.4%, 60%)',
        primaryHoverForeground: 'hsl(0, 0%, 100%)',
        secondary: 'hsl(210, 34%, 63.1%)',
        secondaryForeground: 'hsl(220, 16.4%, 21.6%)',
        secondaryHover: 'hsl(210, 29.8%, 58%)',
        secondaryHoverForeground: 'hsl(0, 0%, 100%)',
        
        // Semantic colors
        destructive: '#d08770',
        destructiveForeground: '#ffffff',
        destructiveHover: '#bf616a',
        destructiveHoverForeground: '#ffffff',
        success: '#a3be8c',
        successForeground: '#2e3440',
        successHover: '#8fa876',
        successHoverForeground: '#ffffff',
        warning: '#ebcb8b',
        warningForeground: '#2e3440',
        warningHover: '#e0b772',
        warningHoverForeground: '#2e3440',
        info: '#5e81ac',
        infoForeground: '#eceff4',
        infoHover: '#4c6b94',
        infoHoverForeground: '#ffffff',
        
        // UI colors - Refined dark palette
        muted: 'hsl(220, 16.8%, 28%)',
        mutedForeground: 'hsl(218.5, 18.9%, 88%)',
        accent: 'hsl(220.9, 16.4%, 33.3%)',
        accentForeground: 'hsl(218.5, 26.8%, 92.5%)',
        
        // Borders and dividers - Subtle definition
        border: 'hsl(220.9, 16.4%, 33.3%)',
        input: 'hsl(220.9, 16.4%, 33.3%)',
        ring: 'hsl(193, 43.4%, 67.5%)',
        
        // Special effects - Northern lights
        gradient: {
            from: 'hsl(193, 43.4%, 67.5%)',
            via: 'hsl(210, 34%, 52.4%)',
            to: 'hsl(311, 20.2%, 63.1%)',
        },
        glass: {
            background: 'rgba(59, 66, 82, 0.9)',
            border: 'rgba(67, 76, 94, 0.6)',
            blur: '14px',
        },
    },
    shadows: {
        ...auroraLight.shadows,
        // Deep Nordic shadows
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.25), 0 1px 2px -1px rgb(0 0 0 / 0.2)',
        DEFAULT: '0 2px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.25)',
        md: '0 4px 12px -2px rgb(0 0 0 / 0.35), 0 3px 6px -3px rgb(0 0 0 / 0.25)',
        lg: '0 8px 20px -4px rgb(0 0 0 / 0.4), 0 6px 10px -5px rgb(0 0 0 / 0.25)',
        xl: '0 16px 32px -6px rgb(0 0 0 / 0.45), 0 10px 16px -8px rgb(0 0 0 / 0.3)',
        '2xl': '0 24px 48px -12px rgb(0 0 0 / 0.5)',
        // Nordic aurora glow
        card: '0 2px 8px -2px rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.25)',
        button: '0 1px 3px 0 rgb(0 0 0 / 0.25), 0 1px 2px -1px rgb(0 0 0 / 0.2)',
        dropdown: '0 10px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.25)',
        glow: '0 0 25px -5px rgba(136, 192, 208, 0.3)',
        glowSm: '0 0 15px -3px rgba(136, 192, 208, 0.2)',
        glowLg: '0 0 35px -8px rgba(136, 192, 208, 0.4)',
        glass: '0 8px 24px -4px rgba(0, 0, 0, 0.4)',
    },
};