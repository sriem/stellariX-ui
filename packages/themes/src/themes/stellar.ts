/**
 * Stellar Theme
 * The default StellarIX UI theme with modern glass-morphism and gradient effects
 */

import type { Theme } from '../types';

export const stellarLight: Theme = {
    name: 'stellar-light',
    mode: 'light',
    colors: {
        // Base colors
        background: '#ffffff',
        foreground: '#0f172a',
        
        // Component colors
        card: '#ffffff',
        cardForeground: '#0f172a',
        
        // Interactive colors - Modern vibrant palette
        primary: '#6366f1',
        primaryForeground: '#ffffff',
        secondary: '#8b5cf6',
        secondaryForeground: '#ffffff',
        
        // Semantic colors
        destructive: '#ef4444',
        destructiveForeground: '#ffffff',
        success: '#10b981',
        successForeground: '#ffffff',
        warning: '#f59e0b',
        warningForeground: '#ffffff',
        info: '#3b82f6',
        infoForeground: '#ffffff',
        
        // UI colors
        muted: '#f8fafc',
        mutedForeground: '#64748b',
        accent: '#f1f5f9',
        accentForeground: '#0f172a',
        
        // Borders and dividers
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#6366f1',
        
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
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        // Special shadows
        glow: '0 0 20px rgba(99, 102, 241, 0.15)',
        glowSm: '0 0 10px rgba(99, 102, 241, 0.1)',
        glowLg: '0 0 30px rgba(99, 102, 241, 0.2)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
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
        // Base colors
        background: '#0f172a',
        foreground: '#f8fafc',
        
        // Component colors
        card: '#1e293b',
        cardForeground: '#f8fafc',
        
        // Interactive colors - Vibrant in dark mode
        primary: '#818cf8',
        primaryForeground: '#0f172a',
        secondary: '#a78bfa',
        secondaryForeground: '#0f172a',
        
        // Semantic colors
        destructive: '#f87171',
        destructiveForeground: '#0f172a',
        success: '#34d399',
        successForeground: '#0f172a',
        warning: '#fbbf24',
        warningForeground: '#0f172a',
        info: '#60a5fa',
        infoForeground: '#0f172a',
        
        // UI colors
        muted: '#1e293b',
        mutedForeground: '#94a3b8',
        accent: '#334155',
        accentForeground: '#f8fafc',
        
        // Borders and dividers
        border: '#334155',
        input: '#334155',
        ring: '#818cf8',
        
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
        // Darker shadows for dark mode
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.26)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.26)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.25)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.24)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        // Glow shadows with theme colors
        glow: '0 0 20px rgba(129, 140, 248, 0.3)',
        glowSm: '0 0 10px rgba(129, 140, 248, 0.2)',
        glowLg: '0 0 30px rgba(129, 140, 248, 0.4)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    },
};