/**
 * Stellar Theme
 * The default StellarIX UI theme with modern glass-morphism and gradient effects
 */

import type { Theme } from '../types';

export const stellarLight: Theme = {
    name: 'stellar-light',
    mode: 'light',
    colors: {
        // Base colors - Clean and sophisticated
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(222.2, 84%, 4.9%)',
        
        // Component colors - Subtle depth
        card: 'hsl(0, 0%, 100%)',
        cardForeground: 'hsl(222.2, 84%, 4.9%)',
        
        // Interactive colors - Modern vibrant palette with depth
        primary: 'hsl(237.7, 85.6%, 67.5%)',
        primaryForeground: 'hsl(0, 0%, 100%)',
        primaryHover: 'hsl(237.5, 77.8%, 59.6%)',
        primaryHoverForeground: 'hsl(0, 0%, 100%)',
        secondary: 'hsl(262.1, 83.3%, 57.8%)',
        secondaryForeground: 'hsl(0, 0%, 100%)',
        secondaryHover: 'hsl(262.8, 76.3%, 50.6%)',
        secondaryHoverForeground: 'hsl(0, 0%, 100%)',
        
        // Semantic colors
        destructive: '#ef4444',
        destructiveForeground: '#ffffff',
        destructiveHover: '#dc2626',
        destructiveHoverForeground: '#ffffff',
        success: '#10b981',
        successForeground: '#ffffff',
        successHover: '#059669',
        successHoverForeground: '#ffffff',
        warning: '#f59e0b',
        warningForeground: '#ffffff',
        warningHover: '#d97706',
        warningHoverForeground: '#ffffff',
        info: '#3b82f6',
        infoForeground: '#ffffff',
        infoHover: '#2563eb',
        infoHoverForeground: '#ffffff',
        
        // UI colors - Refined grays with blue undertones
        muted: 'hsl(210, 40%, 96.1%)',
        mutedForeground: 'hsl(215.4, 16.3%, 46.9%)',
        accent: 'hsl(210, 40%, 95.1%)',
        accentForeground: 'hsl(222.2, 47.4%, 11.2%)',
        
        // Borders and dividers - Subtle and refined
        border: 'hsl(214.3, 31.8%, 91.4%)',
        input: 'hsl(214.3, 31.8%, 91.4%)',
        ring: 'hsl(237.7, 85.6%, 67.5%)',
        
        // Special effects
        gradient: {
            from: '#6366f1',
            via: '#8b5cf6',
            to: '#ec4899',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.7)',
            border: 'rgba(255, 255, 255, 0.8)',
            blur: '12px',
        },
    },
    typography: {
        fontFamily: {
            sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            mono: '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
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
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        full: '9999px',
    },
    shadows: {
        none: 'none',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        // Special shadows - More sophisticated
        card: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        button: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        dropdown: '0 10px 20px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
        glow: '0 0 15px -3px rgba(99, 102, 241, 0.2)',
        glowSm: '0 0 10px -2px rgba(99, 102, 241, 0.15)',
        glowLg: '0 0 25px -5px rgba(99, 102, 241, 0.3)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
    },
    animations: {
        duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
        },
        easing: {
            linear: 'linear',
            in: 'cubic-bezier(0.4, 0, 1, 1)',
            out: 'cubic-bezier(0, 0, 0.2, 1)',
            inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
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
                '0%': { transform: 'translateY(10px)', opacity: 0 },
                '100%': { transform: 'translateY(0)', opacity: 1 },
            },
            slideOut: {
                '0%': { transform: 'translateY(0)', opacity: 1 },
                '100%': { transform: 'translateY(10px)', opacity: 0 },
            },
            scaleIn: {
                '0%': { transform: 'scale(0.95)', opacity: 0 },
                '100%': { transform: 'scale(1)', opacity: 1 },
            },
            scaleOut: {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '100%': { transform: 'scale(0.95)', opacity: 0 },
            },
            shimmer: {
                '0%': { backgroundPosition: '-200% 0' },
                '100%': { backgroundPosition: '200% 0' },
            },
            pulse: {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
            },
            bounce: {
                '0%, 100%': { 
                    transform: 'translateY(0)',
                    animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
                },
                '50%': {
                    transform: 'translateY(-25%)',
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

export const stellarDark: Theme = {
    ...stellarLight,
    name: 'stellar-dark',
    mode: 'dark',
    colors: {
        // Base colors - Deep sophisticated dark
        background: 'hsl(222.2, 84%, 4.9%)',
        foreground: 'hsl(210, 40%, 98%)',
        
        // Component colors - Layered depth
        card: 'hsl(222.2, 47.4%, 11.2%)',
        cardForeground: 'hsl(210, 40%, 98%)',
        
        // Interactive colors - Vibrant in dark mode
        primary: 'hsl(237.5, 86%, 73.7%)',
        primaryForeground: 'hsl(222.2, 84%, 4.9%)',
        primaryHover: 'hsl(237.7, 85.6%, 67.5%)',
        primaryHoverForeground: 'hsl(0, 0%, 100%)',
        secondary: 'hsl(261.2, 85.1%, 72.9%)',
        secondaryForeground: 'hsl(222.2, 84%, 4.9%)',
        secondaryHover: 'hsl(262.1, 83.3%, 57.8%)',
        secondaryHoverForeground: 'hsl(0, 0%, 100%)',
        
        // Semantic colors
        destructive: '#f87171',
        destructiveForeground: '#0f172a',
        destructiveHover: '#ef4444',
        destructiveHoverForeground: '#ffffff',
        success: '#34d399',
        successForeground: '#0f172a',
        successHover: '#10b981',
        successHoverForeground: '#ffffff',
        warning: '#fbbf24',
        warningForeground: '#0f172a',
        warningHover: '#f59e0b',
        warningHoverForeground: '#ffffff',
        info: '#60a5fa',
        infoForeground: '#0f172a',
        infoHover: '#3b82f6',
        infoHoverForeground: '#ffffff',
        
        // UI colors - Sophisticated dark palette
        muted: 'hsl(217.2, 32.6%, 17.5%)',
        mutedForeground: 'hsl(215, 20.2%, 65.1%)',
        accent: 'hsl(217.2, 32.6%, 17.5%)',
        accentForeground: 'hsl(210, 40%, 98%)',
        
        // Borders and dividers - Subtle in dark
        border: 'hsl(217.2, 32.6%, 17.5%)',
        input: 'hsl(217.2, 32.6%, 17.5%)',
        ring: 'hsl(237.5, 86%, 73.7%)',
        
        // Special effects
        gradient: {
            from: '#818cf8',
            via: '#a78bfa',
            to: '#f472b6',
        },
        glass: {
            background: 'rgba(30, 41, 59, 0.7)',
            border: 'rgba(51, 65, 85, 0.8)',
            blur: '16px',
        },
    },
    shadows: {
        ...stellarLight.shadows,
        // Sophisticated shadows for dark mode
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        DEFAULT: '0 2px 4px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
        md: '0 4px 8px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
        lg: '0 12px 20px -3px rgb(0 0 0 / 0.3), 0 4px 8px -4px rgb(0 0 0 / 0.2)',
        xl: '0 20px 30px -5px rgb(0 0 0 / 0.3), 0 8px 12px -6px rgb(0 0 0 / 0.2)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.5)',
        // Ambient lighting effects
        card: '0 2px 8px 0 rgb(0 0 0 / 0.4)',
        button: '0 1px 3px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
        dropdown: '0 10px 25px -3px rgb(0 0 0 / 0.5), 0 4px 10px -4px rgb(0 0 0 / 0.3)',
        glow: '0 0 15px -3px rgba(129, 140, 248, 0.4)',
        glowSm: '0 0 10px -2px rgba(129, 140, 248, 0.3)',
        glowLg: '0 0 25px -5px rgba(129, 140, 248, 0.5)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
    },
};