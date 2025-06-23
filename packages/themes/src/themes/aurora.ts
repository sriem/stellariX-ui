/**
 * Aurora Theme
 * Nordic-inspired theme with soft pastels and gentle animations
 */

import type { Theme } from '../types';

export const auroraLight: Theme = {
    name: 'aurora-light',
    mode: 'light',
    colors: {
        // Base colors - Soft, muted tones
        background: '#fefeff',
        foreground: '#2e3440',
        
        // Component colors
        card: '#ffffff',
        cardForeground: '#2e3440',
        
        // Interactive colors - Nordic palette
        primary: '#5e81ac',
        primaryForeground: '#ffffff',
        secondary: '#81a1c1',
        secondaryForeground: '#ffffff',
        
        // Semantic colors - Soft variants
        destructive: '#bf616a',
        destructiveForeground: '#ffffff',
        success: '#a3be8c',
        successForeground: '#2e3440',
        warning: '#ebcb8b',
        warningForeground: '#2e3440',
        info: '#88c0d0',
        infoForeground: '#2e3440',
        
        // UI colors
        muted: '#eceff4',
        mutedForeground: '#4c566a',
        accent: '#e5e9f0',
        accentForeground: '#2e3440',
        
        // Borders and dividers
        border: '#d8dee9',
        input: '#d8dee9',
        ring: '#5e81ac',
        
        // Special effects - Soft aurora gradient
        gradient: {
            from: '#88c0d0',
            via: '#81a1c1',
            to: '#b48ead',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.85)',
            border: 'rgba(216, 222, 233, 0.6)',
            blur: '8px',
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
        sm: '0 1px 3px 0 rgba(46, 52, 64, 0.04)',
        DEFAULT: '0 2px 6px 0 rgba(46, 52, 64, 0.06), 0 1px 3px 0 rgba(46, 52, 64, 0.04)',
        md: '0 4px 8px -1px rgba(46, 52, 64, 0.08), 0 2px 4px -1px rgba(46, 52, 64, 0.04)',
        lg: '0 8px 16px -3px rgba(46, 52, 64, 0.1), 0 4px 8px -2px rgba(46, 52, 64, 0.05)',
        xl: '0 16px 24px -5px rgba(46, 52, 64, 0.12), 0 8px 12px -5px rgba(46, 52, 64, 0.06)',
        '2xl': '0 24px 48px -12px rgba(46, 52, 64, 0.18)',
        inner: 'inset 0 2px 4px 0 rgba(46, 52, 64, 0.04)',
        // Soft glow shadows
        glow: '0 0 24px rgba(136, 192, 208, 0.12)',
        glowSm: '0 0 12px rgba(136, 192, 208, 0.08)',
        glowLg: '0 0 36px rgba(136, 192, 208, 0.16)',
        glass: '0 6px 24px 0 rgba(46, 52, 64, 0.08)',
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
        // Base colors - Nord night
        background: '#2e3440',
        foreground: '#eceff4',
        
        // Component colors
        card: '#3b4252',
        cardForeground: '#eceff4',
        
        // Interactive colors - Brighter for dark mode
        primary: '#88c0d0',
        primaryForeground: '#2e3440',
        secondary: '#81a1c1',
        secondaryForeground: '#2e3440',
        
        // Semantic colors
        destructive: '#d08770',
        destructiveForeground: '#2e3440',
        success: '#a3be8c',
        successForeground: '#2e3440',
        warning: '#ebcb8b',
        warningForeground: '#2e3440',
        info: '#5e81ac',
        infoForeground: '#eceff4',
        
        // UI colors
        muted: '#3b4252',
        mutedForeground: '#d8dee9',
        accent: '#434c5e',
        accentForeground: '#eceff4',
        
        // Borders and dividers
        border: '#434c5e',
        input: '#434c5e',
        ring: '#88c0d0',
        
        // Special effects
        gradient: {
            from: '#88c0d0',
            via: '#5e81ac',
            to: '#b48ead',
        },
        glass: {
            background: 'rgba(59, 66, 82, 0.85)',
            border: 'rgba(67, 76, 94, 0.8)',
            blur: '12px',
        },
    },
    shadows: {
        ...auroraLight.shadows,
        // Darker, softer shadows
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        DEFAULT: '0 2px 6px 0 rgba(0, 0, 0, 0.25), 0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        md: '0 4px 8px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        lg: '0 8px 16px -3px rgba(0, 0, 0, 0.35), 0 4px 8px -2px rgba(0, 0, 0, 0.25)',
        xl: '0 16px 24px -5px rgba(0, 0, 0, 0.4), 0 8px 12px -5px rgba(0, 0, 0, 0.3)',
        '2xl': '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
        // Aurora glow
        glow: '0 0 24px rgba(136, 192, 208, 0.25)',
        glowSm: '0 0 12px rgba(136, 192, 208, 0.15)',
        glowLg: '0 0 36px rgba(136, 192, 208, 0.35)',
        glass: '0 6px 24px 0 rgba(0, 0, 0, 0.35)',
    },
};