/**
 * Nebula Theme
 * Dark-first futuristic theme with neon accents
 */

import type { Theme } from '../types';

export const nebulaLight: Theme = {
    name: 'nebula-light',
    mode: 'light',
    colors: {
        // Base colors - Light mode with dark accents
        background: '#fafafa',
        foreground: '#1a1a2e',
        
        // Component colors
        card: '#ffffff',
        cardForeground: '#1a1a2e',
        
        // Interactive colors - Neon-inspired
        primary: '#0f4c75',
        primaryForeground: '#ffffff',
        secondary: '#3282b8',
        secondaryForeground: '#ffffff',
        
        // Semantic colors - Vibrant
        destructive: '#e63946',
        destructiveForeground: '#ffffff',
        success: '#06ffa5',
        successForeground: '#1a1a2e',
        warning: '#ffb700',
        warningForeground: '#1a1a2e',
        info: '#00d9ff',
        infoForeground: '#1a1a2e',
        
        // UI colors
        muted: '#f0f0f0',
        mutedForeground: '#4a4a4a',
        accent: '#e8e8e8',
        accentForeground: '#1a1a2e',
        
        // Borders and dividers
        border: '#d0d0d0',
        input: '#d0d0d0',
        ring: '#3282b8',
        
        // Special effects - Neon gradients
        gradient: {
            from: '#0f4c75',
            via: '#3282b8',
            to: '#00d9ff',
        },
        glass: {
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'rgba(50, 130, 184, 0.2)',
            blur: '10px',
        },
    },
    typography: {
        fontFamily: {
            sans: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            mono: '"JetBrains Mono", "Fira Code", Monaco, Consolas, monospace',
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
        sm: '0.125rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.625rem',
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        full: '9999px',
    },
    shadows: {
        none: 'none',
        sm: '0 1px 2px 0 rgba(26, 26, 46, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(26, 26, 46, 0.1), 0 1px 2px 0 rgba(26, 26, 46, 0.06)',
        md: '0 4px 6px -1px rgba(26, 26, 46, 0.1), 0 2px 4px -1px rgba(26, 26, 46, 0.06)',
        lg: '0 10px 15px -3px rgba(26, 26, 46, 0.1), 0 4px 6px -2px rgba(26, 26, 46, 0.05)',
        xl: '0 20px 25px -5px rgba(26, 26, 46, 0.1), 0 10px 10px -5px rgba(26, 26, 46, 0.04)',
        '2xl': '0 25px 50px -12px rgba(26, 26, 46, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(26, 26, 46, 0.06)',
        // Neon glow shadows
        glow: '0 0 20px rgba(0, 217, 255, 0.2)',
        glowSm: '0 0 10px rgba(0, 217, 255, 0.15)',
        glowLg: '0 0 30px rgba(0, 217, 255, 0.3)',
        glass: '0 8px 32px 0 rgba(26, 26, 46, 0.1)',
    },
    animations: {
        duration: {
            fast: '100ms',
            normal: '250ms',
            slow: '400ms',
        },
        easing: {
            linear: 'linear',
            in: 'cubic-bezier(0.4, 0, 1, 1)',
            out: 'cubic-bezier(0, 0, 0.2, 1)',
            inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            spring: 'cubic-bezier(0.3, 1.7, 0.3, 1)',
            bounce: 'cubic-bezier(0.7, -0.4, 0.3, 1.3)',
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
                '0%': { transform: 'translateY(12px)', opacity: 0 },
                '100%': { transform: 'translateY(0)', opacity: 1 },
            },
            slideOut: {
                '0%': { transform: 'translateY(0)', opacity: 1 },
                '100%': { transform: 'translateY(12px)', opacity: 0 },
            },
            scaleIn: {
                '0%': { transform: 'scale(0.9)', opacity: 0 },
                '100%': { transform: 'scale(1)', opacity: 1 },
            },
            scaleOut: {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '100%': { transform: 'scale(0.9)', opacity: 0 },
            },
            shimmer: {
                '0%': { backgroundPosition: '-200% 0' },
                '100%': { backgroundPosition: '200% 0' },
            },
            pulse: {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.4 },
            },
            bounce: {
                '0%, 100%': { 
                    transform: 'translateY(0)',
                    animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
                },
                '50%': {
                    transform: 'translateY(-30%)',
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

export const nebulaDark: Theme = {
    ...nebulaLight,
    name: 'nebula-dark',
    mode: 'dark',
    colors: {
        // Base colors - Deep space
        background: '#0f0f23',
        foreground: '#e0e0ff',
        
        // Component colors
        card: '#1a1a2e',
        cardForeground: '#e0e0ff',
        
        // Interactive colors - Neon
        primary: '#00d9ff',
        primaryForeground: '#0f0f23',
        secondary: '#ff006e',
        secondaryForeground: '#ffffff',
        
        // Semantic colors - Cyberpunk neon
        destructive: '#ff006e',
        destructiveForeground: '#ffffff',
        success: '#06ffa5',
        successForeground: '#0f0f23',
        warning: '#ffb700',
        warningForeground: '#0f0f23',
        info: '#00d9ff',
        infoForeground: '#0f0f23',
        
        // UI colors
        muted: '#16213e',
        mutedForeground: '#a0a0c0',
        accent: '#1f2b4d',
        accentForeground: '#e0e0ff',
        
        // Borders and dividers
        border: '#2a3350',
        input: '#2a3350',
        ring: '#00d9ff',
        
        // Special effects - Intense neon
        gradient: {
            from: '#00d9ff',
            via: '#ff006e',
            to: '#ffb700',
        },
        glass: {
            background: 'rgba(26, 26, 46, 0.6)',
            border: 'rgba(0, 217, 255, 0.3)',
            blur: '20px',
        },
    },
    shadows: {
        ...nebulaLight.shadows,
        // Dark mode with neon glows
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.6), 0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.5)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        // Intense neon glows
        glow: '0 0 30px rgba(0, 217, 255, 0.5), 0 0 60px rgba(0, 217, 255, 0.25)',
        glowSm: '0 0 15px rgba(0, 217, 255, 0.4)',
        glowLg: '0 0 45px rgba(0, 217, 255, 0.6), 0 0 90px rgba(0, 217, 255, 0.3)',
        glass: '0 8px 32px 0 rgba(0, 217, 255, 0.15)',
    },
};